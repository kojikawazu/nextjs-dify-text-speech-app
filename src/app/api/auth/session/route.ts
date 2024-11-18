import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
// lib
import { COMMON_CONSTANTS } from '@/lib/constants';

export const dynamic = 'force-dynamic';

/**
 * セッション取得
 * @returns セッション
 */
export async function GET() {
    console.log('GET ', COMMON_CONSTANTS.URL.API_AUTH_SESSION);

    // ルートハンドラー用のSupabaseクライアントの作成
    const supabase = createRouteHandlerClient({ cookies });

    // セッションの取得
    const {
        data: { session },
    } = await supabase.auth.getSession();

    // セッションをJSONで返す
    console.log('GET ', COMMON_CONSTANTS.URL.API_AUTH_SESSION, 'response', session);
    return NextResponse.json(session);
}
