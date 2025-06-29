import { sseClient } from './_common/sseClient';
import type { SseCallbacks, SseResponse } from './_common/sseClient';

export class ResponsiveApiService {
    async connectToGreeting(
        callbacks: SseCallbacks<SseResponse>,
        instanceId?: string
    ): Promise<() => void> {
        return sseClient<SseResponse>('/messages/greeting', callbacks, instanceId);
    }
}

export const responsiveApiService = new ResponsiveApiService(); 