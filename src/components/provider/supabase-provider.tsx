'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
// lib
import { COMMON_CONSTANTS } from '@/lib/constants';

/**
 * Supabaseコンテキストの型
 */
type SupabaseContextType = {
    user: User | null;
    isLoading: boolean;
    syncSession: () => Promise<void>;
};

/**
 * Supabaseコンテキスト
 */
const SupabaseContext = createContext<SupabaseContextType>({
    user: null,
    isLoading: true,
    syncSession: async () => {},
});

/**
 * Supabaseプロバイダー
 * @param children 子要素
 * @returns JSX.Element
 */
export default function SupabaseProvider({ children }: { children: React.ReactNode }) {
    // ユーザー情報
    const [user, setUser] = useState<User | null>(null);
    // ローディング状態
    const [isLoading, setIsLoading] = useState(true);

    // セッション同期のための関数
    const syncSession = async () => {
        try {
            // サーバーサイドのセッションを取得
            const response = await fetch(COMMON_CONSTANTS.URL.API_AUTH_SESSION as string);
            const session = await response.json();

            // ユーザー情報を更新
            setUser(session?.user ?? null);
            // ローディング状態を更新
            setIsLoading(false);
        } catch (error) {
            console.error('Session sync error:', error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        syncSession();
    }, []);

    return (
        <SupabaseContext.Provider value={{ user, isLoading, syncSession }}>
            {children}
        </SupabaseContext.Provider>
    );
}

export const useSupabase = () => {
    return useContext(SupabaseContext);
};
