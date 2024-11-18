'use server';

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

/**
 * サーバー用のSupabaseクライアントの作成
 * @returns サーバー用のSupabaseクライアント
 */
export const createServerSupabase = () => {
    return createServerComponentClient({ cookies });
};

/**
 * ログイン
 * @param email メールアドレス
 * @param password パスワード
 */
export async function signIn(email: string, password: string) {
    // サーバー用のSupabaseクライアントの作成
    const supabase = createServerActionClient({ cookies });
    // ログイン
    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return { error: error.message };
    }

    // キャッシュの再検証
    revalidatePath('/');
    return { message: 'Logged in successfully' };
}

/**
 * ログアウト
 */
export async function signOut() {
    // サーバー用のSupabaseクライアントの作成
    const supabase = createServerActionClient({ cookies });
    // ログアウト
    await supabase.auth.signOut();

    // キャッシュの再検証
    revalidatePath('/');
    return { message: 'Logged out successfully' };
}
