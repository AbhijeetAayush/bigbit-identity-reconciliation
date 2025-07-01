import { ValidationError } from './error';
import { IdentifyRequest } from '../types/model';

export function validateIdentifyRequest(body: IdentifyRequest): void {
  if (!body.email && !body.phoneNumber) {
    throw new ValidationError('Either email or phoneNumber is required');
  }
}