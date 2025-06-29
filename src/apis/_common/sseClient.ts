import { BASE_URL } from '../../constants/api';

export interface SseCallbacks<T = any> {
    onMessage: (data: T) => void;
    onError?: (error: Event) => void;
    onComplete?: () => void;
}

export interface SseResponse {
    message: string;
    complete: boolean;
}

export interface BaseResponse<T> {
    data: T;
}

// 전역 변수로 활성 연결 추적
const activeConnections = new Map<string, boolean>();

const createSseClient = (baseUrl: string) => {
    return async <T>(
        path: string,
        callbacks: SseCallbacks<T>,
        instanceId?: string
    ): Promise<() => void> => {
        const url = `${baseUrl}${path}`;
        const connectionKey = instanceId ? `${url}-${instanceId}` : url;
        
        // 이미 활성 연결이 있는지 확인
        if (activeConnections.has(connectionKey)) {
            // 빈 함수 반환
            return () => {};
        }
        
        activeConnections.set(connectionKey, true);
        const eventSource = new EventSource(url);

        eventSource.onopen = () => {
        };
        
        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);

                callbacks.onMessage(data.data);
                
                if (data.data.complete === true) {
                    if (callbacks.onComplete) {
                        callbacks.onComplete();
                    }
                    eventSource.close();
                    activeConnections.delete(connectionKey);
                }
            } catch (error) {
            }
        };

        eventSource.onerror = (error) => {
            activeConnections.delete(connectionKey);
            if (callbacks.onError) {
                callbacks.onError(error);
            }
            eventSource.close();
        };

        eventSource.addEventListener('complete', () => {
            activeConnections.delete(connectionKey);
            eventSource.close();
        });

        // 연결 해제 함수 반환
        return () => {
            activeConnections.delete(connectionKey);
            eventSource.close();
        };
    };
};

export const sseClient = createSseClient(BASE_URL); 