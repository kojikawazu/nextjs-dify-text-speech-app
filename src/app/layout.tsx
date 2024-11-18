import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
// context
import { ThemeProvider } from '@/context/ThemeContext';
// shadcn/ui
import { Toaster } from '@/components/ui/sonner';
// components
import SupabaseProvider from '@/components/provider/supabase-provider';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// グローバルスタイル
import './globals.css';

export const dynamic = 'force-dynamic';

// フォント
const inter = Inter({ subsets: ['latin'] });
// メタデータ
export const metadata: Metadata = {
    title: 'Echo Text Speech App',
    description: 'Echo Text Speech App',
};

/**
 * ルートレイアウト
 * @param {React.ReactNode} children
 * @returns JSX.Element
 */
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ja">
            <body className={inter.className}>
                <SupabaseProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <div className="flex flex-col h-screen">
                            <Header />
                            <main className="flex-grow">{children}</main>
                            <Footer />
                        </div>

                        <Toaster />
                    </ThemeProvider>
                </SupabaseProvider>
            </body>
        </html>
    );
}
