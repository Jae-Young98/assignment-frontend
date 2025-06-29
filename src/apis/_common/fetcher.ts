import type { FetchOption } from './fetchClient';
import { fetchClient } from './fetchClient';

type FetcherArgs = Omit<FetchOption, 'method'>;

export const fetcher = {
    get: async <T>({ path }: FetcherArgs): Promise<T> => {
        const response = await fetchClient({
            path,
            method: 'GET',
        });

        const data = await response.json();

        return data.data as T;
    }
};