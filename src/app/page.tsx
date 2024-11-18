import { Suspense } from 'react';
// lib
import { createServerSupabase } from '@/lib/supabase/supabase-server';
// components
import LoadingIcon from '@/components/common/LoadingIcon';
import ChatInterface from '@/components/chat/ChatInterface';

/**
 * ホームページ
 * @returns JSX.Element
 */
const Home = async () => {
    // サーバー用のSupabaseクライアントの作成
    const supabase = await createServerSupabase();

    if (!supabase?.auth) {
        console.error('Supabase client not properly initialized');
        return <div>Error loading user data</div>;
    }

    // ユーザー情報の取得
    const { data } = await supabase.auth.getUser();

    return (
        <Suspense fallback={<LoadingIcon />}>
            <div className="container mx-auto px-4 py-8">
                <ChatInterface user={data.user} />
            </div>
        </Suspense>
    );
};

export default Home;
