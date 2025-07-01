import { getSupabaseClient } from './supabaseClient';
import { logger } from '../utils/logger';
import { DatabaseError } from '../utils/error';
import { Contact, IdentifyResponse } from '../types/model';

export async function getConsolidatedContact(email?: string, phoneNumber?: string): Promise<IdentifyResponse> {
    const supabase = getSupabaseClient();

    try {
        // Query contacts with matching email or phoneNumber
        const { data: contacts, error } = await supabase
            .from('Contact')
            .select('id, phoneNumber, email, linkedId, linkPrecedence, createdAt')
            .or(`email.eq.${email || ''},phoneNumber.eq.${phoneNumber || ''}`)
            .is('deletedAt', null)
            .order('createdAt', { ascending: true });

        if (error) {
            logger.error('Supabase query error', { error });
            throw new DatabaseError('Failed to query contacts');
        }

        // No matches: create new primary contact
        if (!contacts || contacts.length === 0) {
            const { data: newContact, error: createError } = await supabase
                .from('Contact')
                .insert({
                    email,
                    phoneNumber,
                    linkPrecedence: 'primary',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                })
                .select()
                .single();

            if (createError) {
                logger.error('Supabase insert error', { error: createError });
                throw new DatabaseError('Failed to create new contact');
            }

            logger.info('Created new primary contact', { id: newContact.id });
            return {
                contact: {
                    primaryContatctId: newContact.id,
                    emails: newContact.email ? [newContact.email] : [],
                    phoneNumbers: newContact.phoneNumber ? [newContact.phoneNumber] : [],
                    secondaryContactIds: [],
                },
            };
        }

        // Find primary contact (oldest)
        let primaryContact = contacts[0];

        // Check for new information
        const hasNewEmail = email && !contacts.some((c) => c.email === email);
        const hasNewPhone = phoneNumber && !contacts.some((c) => c.phoneNumber === phoneNumber);

        // Create secondary contact if new info
        let newContact: Contact | null = null;
        if (hasNewEmail || hasNewPhone) {
            const { data, error: createError } = await supabase
                .from('Contact')
                .insert({
                    email,
                    phoneNumber,
                    linkedId: primaryContact.id,
                    linkPrecedence: 'secondary',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                })
                .select()
                .single();

            if (createError) {
                logger.error('Supabase insert secondary error', { error: createError });
                throw new DatabaseError('Failed to create secondary contact');
            }

            newContact = data;
            if (newContact) {
                logger.info('Created secondary contact', { id: newContact.id });
            }
        }

        // Reconcile multiple primaries
        if (contacts.length > 1) {
            const secondaryIds = contacts.slice(1).map((c) => c.id);
            const { error: updateError } = await supabase
                .from('Contact')
                .update({
                    linkPrecedence: 'secondary',
                    linkedId: primaryContact.id,
                    updatedAt: new Date(),
                })
                .in('id', secondaryIds)
                .eq('linkPrecedence', 'primary');

            if (updateError) {
                logger.error('Supabase update primaries error', { error: updateError });
                throw new DatabaseError('Failed to reconcile primaries');
            }
            logger.info('Reconciled multiple primaries', { primaryId: primaryContact.id, secondaryIds });
        }

        // Fetch all related contacts
        const { data: relatedContacts, error: fetchError } = await supabase
            .from('Contact')
            .select('id, email, phoneNumber, linkPrecedence')
            .or(`id.eq.${primaryContact.id},linkedId.eq.${primaryContact.id}`)
            .is('deletedAt', null)
            .order('createdAt', { ascending: true });

        if (fetchError) {
            logger.error('Supabase fetch related contacts error', { error: fetchError });
            throw new DatabaseError('Failed to fetch related contacts');
        }

        // Build response
        const emails = Array.from(new Set(relatedContacts.map((c) => c.email).filter(Boolean)));
        const phoneNumbers = Array.from(new Set(relatedContacts.map((c) => c.phoneNumber).filter(Boolean)));
        const secondaryContactIds = relatedContacts.filter((c) => c.linkPrecedence === 'secondary').map((c) => c.id);

        return {
            contact: {
                primaryContatctId: primaryContact.id,
                emails: [primaryContact.email, ...emails.filter((e) => e !== primaryContact.email)].filter(Boolean),
                phoneNumbers: [
                    primaryContact.phoneNumber,
                    ...phoneNumbers.filter((p) => p !== primaryContact.phoneNumber),
                ].filter(Boolean),
                secondaryContactIds,
            },
        };
    } catch (error) {
        logger.error('Error in getConsolidatedContact', { error });
        throw error;
    }
}
