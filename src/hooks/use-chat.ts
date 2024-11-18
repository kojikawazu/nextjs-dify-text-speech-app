'use client';

import { User } from '@supabase/supabase-js';
// lib
import { COMMON_CONSTANTS } from '@/lib/constants';

/**
 * ダミーデータ
 */
const FIXED_RESPONSES = [
    'はい、承知しました。',
    'なるほど、興味深いですね。',
    'それについて、もう少し詳しく教えていただけますか？',
    'ご質問ありがとうございます。',
    'そうですね、その通りだと思います。',
];

/**
 * チャットフック
 * @param {string} message
 * @param {User} user
 * @returns {sendMessage: (message: string) => Promise<string>}
 */
export const useChat = () => {
    /**
     * 送信
     */
    const sendMessage = async (message: string, user: User | null) => {
        if (!user) {
            return COMMON_CONSTANTS.MESSAGE.LOGIN_REQUIRED;
        }
        // API(TODO)
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // レスポンス(TODO)
        const randomIndex = Math.floor(Math.random() * FIXED_RESPONSES.length);
        return FIXED_RESPONSES[randomIndex];
    };

    return { sendMessage };
};
