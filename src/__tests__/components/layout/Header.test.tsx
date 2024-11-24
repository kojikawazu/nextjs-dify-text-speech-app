import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { User } from '@supabase/supabase-js';
import Header from '@/components/layout/Header';
import { COMMON_CONSTANTS } from '@/lib/constants';
import { signOut } from '@/lib/supabase/supabase-server';

// モックの変数を定義
const mockSetTheme = jest.fn();
const mockSyncSession = jest.fn();
let mockTheme = 'light';

// Supabaseコンテキストの型定義
type MockSupabaseContextType = {
    user: User | null;
    isLoading: boolean;
    syncSession: () => Promise<void>;
};

// Supabaseコンテキストのモック
const mockSupabaseContext: MockSupabaseContextType = {
    user: null,
    isLoading: false,
    syncSession: mockSyncSession,
};

// supabase-serverのモック
jest.mock('@/lib/supabase/supabase-server', () => ({
    signOut: jest.fn(() => Promise.resolve({ message: 'Logged out successfully' })),
}));

// next-themesのモック
jest.mock('next-themes', () => ({
    useTheme: () => ({
        theme: mockTheme,
        setTheme: mockSetTheme,
        themes: ['light', 'dark'],
    }),
}));

// supabase-providerのモック
jest.mock('@/components/provider/supabase-provider', () => ({
    useSupabase: () => mockSupabaseContext,
}));

// next/linkのモック
jest.mock(
    'next/link',
    () =>
        function Link({ children, href }: { children: React.ReactNode; href: string }) {
            return <a href={href}>{children}</a>;
        },
);

describe('Header', () => {
    // テストの前に実行
    beforeEach(() => {
        // モックのクリア
        jest.clearAllMocks();
        // ユーザーの初期化
        mockSupabaseContext.user = null;
        // ローディングの初期化
        mockSupabaseContext.isLoading = false;
        // setThemeのクリア
        mockSetTheme.mockClear();
        // テーマの初期化
        mockTheme = 'light';
    });

    it('should render title correctly', () => {
        render(<Header />);
        // テストの検証
        expect(screen.getByText(COMMON_CONSTANTS.HEADER.TITLE)).toBeInTheDocument();
    });

    it('should show loading spinner when isLoading is true', () => {
        // ローディングの設定
        mockSupabaseContext.isLoading = true;
        // テストの実行
        const { container } = render(<Header />);
        // テストの検証
        const spinnerContainer = container.querySelector('.flex.justify-center.items-center');
        expect(spinnerContainer).toBeInTheDocument();
        // スピナーの検証
        const spinner = container.querySelector('svg.animate-spin');
        expect(spinner).toBeInTheDocument();
        expect(spinner).toHaveClass('w-6', 'h-6', 'text-primary');
    });

    it('should show SignIn link when user is not authenticated', () => {
        // テストの実行
        render(<Header />);
        // テストの検証
        const signInLink = screen.getByRole('link');
        expect(signInLink).toHaveAttribute('href', COMMON_CONSTANTS.URL.PAGE_LOGIN_FORM);
        // ボタンの検証
        const signInButton = within(signInLink).getByRole('button');
        expect(signInButton).toHaveTextContent(/signin/i);
    });

    it('should show SignOut button when user is authenticated', () => {
        // ユーザーの設定
        mockSupabaseContext.user = {
            id: '1',
            app_metadata: {},
            user_metadata: {},
            aud: '',
            created_at: '',
        } as User;

        render(<Header />);
        // ボタンの検証
        const signOutButton = screen.getByRole('button', { name: /signout/i });
        expect(signOutButton).toBeInTheDocument();
    });

    it('should handle theme toggle', () => {
        render(<Header />);
        // ボタンの検証
        const themeButton = screen.getByRole('button', { name: /toggle theme/i });
        // クリック
        fireEvent.click(themeButton);
        // 検証
        expect(mockSetTheme).toHaveBeenCalledWith('dark');
    });

    it('should handle sign out', async () => {
        // ユーザーの設定
        mockSupabaseContext.user = {
            id: '1',
            app_metadata: {},
            user_metadata: {},
            aud: '',
            created_at: '',
        } as User;

        render(<Header />);
        // ボタンの検証
        const signOutButton = screen.getByRole('button', { name: /signout/i });
        // クリック
        await fireEvent.click(signOutButton);
        // 検証
        await waitFor(() => {
            expect(signOut).toHaveBeenCalled();
            expect(mockSyncSession).toHaveBeenCalled();
        });
    });
});
