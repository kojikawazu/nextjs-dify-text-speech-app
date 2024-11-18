'use client';

import Link from 'next/link';
import { LogIn, LogOut, MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';
// lib
import { COMMON_CONSTANTS } from '@/lib/constants';
// shadcn/ui
import { Button } from '@/components/ui/button';
// components
import { useSupabase } from '@/components/provider/supabase-provider';
import Spinner from '@/components/common/Spinner';
import { signOut } from '@/lib/supabase/supabase-server';

/**
 * ヘッダー
 * @returns {JSX.Element}
 */
const Header = () => {
    // テーマ
    const { theme, setTheme } = useTheme();
    // Supabaseのユーザー情報を取得
    const { user, isLoading, syncSession } = useSupabase();

    /**
     * サインアウト
     */
    const handleSignOut = async () => {
        await signOut();
        await syncSession();
        toast.success('SignOut Successed');
    };

    return (
        <header className="border-b">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold">AI Chat Assistant</h1>

                <div className="flex justify-center items-center space-x-2">
                    {isLoading ? (
                        <div className="flex justify-center items-center">
                            <Spinner className="w-6 h-6 text-primary" />
                        </div>
                    ) : user ? (
                        <Button variant="outline" size="sm" onClick={handleSignOut}>
                            <LogOut className="mr-2 h-4 w-4" />
                            SignOut
                        </Button>
                    ) : (
                        <Link href={COMMON_CONSTANTS.URL.PAGE_LOGIN_FORM || '/'}>
                            <Button variant="outline" size="sm">
                                <LogIn className="mr-2 h-4 w-4" />
                                SignIn
                            </Button>
                        </Link>
                    )}

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    >
                        <SunIcon className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <MoonIcon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                </div>
            </div>
        </header>
    );
};

export default Header;
