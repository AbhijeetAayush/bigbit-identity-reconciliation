import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { validateIdentifyRequest } from '../utils/validator';
import { reconcileContacts } from '../reconciliation/app';
import { IdentifyRequest } from '../types/model';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        console.log('Processing /identify request:', event.body);

        const body: IdentifyRequest = JSON.parse(event.body ?? '{}');
        validateIdentifyRequest(body);

        const response = await reconcileContacts(body.email, body.phoneNumber);
        console.log('Request processed successfully:', { statusCode: 200 });

        return {
            statusCode: 200,
            body: JSON.stringify(response),
        };
    } catch (error) {
        console.error('Error processing /identify request:', error);
        return {
            statusCode: error instanceof Error && error.name === 'ValidationError' ? 400 : 500,
            body: JSON.stringify({ error: error instanceof Error ? error.message : 'Internal server error' }),
        };
    }
};
