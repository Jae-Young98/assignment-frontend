import { fetcher } from "./_common/fetcher";

export interface NicknameCheckResponse {
    nickname: string;
    message: string;
    available: boolean;
}

export const checkNickname = async (nickname: string): Promise<NicknameCheckResponse> => {
    const response = await fetcher.get<NicknameCheckResponse>({
        path: `/nicknames/${nickname}/availability`
    });

    return response;
}