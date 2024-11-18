'use client';

import { User } from '@supabase/supabase-js';
// lib
import { COMMON_CONSTANTS } from '@/lib/constants';

/**
 * ダミーデータ
 */
// const FIXED_RESPONSES = [
//     'はい、承知しました。',
//     'なるほど、興味深いですね。',
//     'それについて、もう少し詳しく教えていただけますか？',
//     'ご質問ありがとうございます。',
//     'そうですね、その通りだと思います。',
// ];

/**
 * チャットフック
 * @returns {sendMessage: (message: string) => Promise<string>}
 */
export const useChat = () => {
    /**
     * 送信
     * @param message メッセージ
     * @param user ユーザー
     * @returns レスポンス
     */
    const sendMessage = async (message: string, user: User | null) => {
        if (!user) {
            return COMMON_CONSTANTS.MESSAGE.LOGIN_REQUIRED;
        }

        try {
            const response = await fetch(COMMON_CONSTANTS.URL.API_DIFY, {
                method: 'POST',
                body: JSON.stringify({ message }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const data = await response.json();
            return data.text;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    return { sendMessage };
};
