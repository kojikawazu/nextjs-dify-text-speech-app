import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export const dynamic = 'force-dynamic';

/**
 * セッション取得
 * @returns セッション
 */
export async function GET() {
    // ルートハンドラー用のSupabaseクライアントの作成
    const supabase = createRouteHandlerClient({ cookies });

    // セッションの取得
    const {
        data: { session },
    } = await supabase.auth.getSession();

    // セッションをJSONで返す
    return NextResponse.json(session);
}
