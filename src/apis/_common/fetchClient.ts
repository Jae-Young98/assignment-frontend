// import { ResponseError } from '../../utils/responseError';

import { BASE_URL } from '../../constants/api';

export type HttpMethod = 'GET' | 'POST' | 'PATCH' |'DELETE';

export interface FetchOption {
    path: string;
    method: HttpMethod;
    body?: object;
    headers?: HeadersInit;
}

const createFetchClient = (baseUrl: string) => {
    return async ({ path, method, body, headers }: FetchOption) => {
        try {
            const url = `${baseUrl}${path}`;
            const response: Response = await fetch(url, {
            method,
            headers: {
                ...headers,
                'Content-Type': 'application/json',
            },
            body: body ? JSON.stringify(body) : null,
            });
    
            // response 객체는 에러가 발생하면 데이터는 응답 객체가 되고, 정상적인 응답이 오면 데이터 객체가 된다.
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData);
            }
    
            return response;
        } catch (error) {
            // catch network error
            if (error instanceof Error) {
            throw error;
            }
    
            throw error;
        }
    };
};

export const fetchClient = createFetchClient(BASE_URL);