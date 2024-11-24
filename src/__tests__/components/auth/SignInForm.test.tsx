import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { signIn } from '@/lib/supabase/supabase-server';
import { useSupabase } from '@/components/provider/supabase-provider';
import SignInForm from '@/components/auth/SignInForm';

// ===============================
// モック
// ===============================
jest.mock('sonner', () => ({ toast: { error: jest.fn(), success: jest.fn() } }));
jest.mock('@/lib/supabase/supabase-server', () => ({ signIn: jest.fn() }));
jest.mock('next/navigation', () => ({ useRouter: jest.fn() }));

jest.mock('@/components/provider/supabase-provider', () => ({
    useSupabase: jest.fn(),
}));

// signIn関数のモック
const mockedSignIn = signIn as jest.Mock;
// useSupabase関数のモック
const mockedUseSupabase = useSupabase as jest.Mock;
// useRouter関数のモック
const mockedUseRouter = useRouter as jest.Mock;
// syncSession関数のモック
const mockSyncSession = jest.fn();
// push関数のモック
const mockPush = jest.fn();

// useSupabase関数のモック
mockedUseSupabase.mockReturnValue({ syncSession: mockSyncSession });
// useRouter関数のモック
mockedUseRouter.mockReturnValue({ push: mockPush });

describe('SignInForm', () => {
    beforeEach(() => {
        // モックの初期化
        jest.clearAllMocks();
    });

    test('should render the form fields and submit button', () => {
        // テストの実行
        render(<SignInForm />);

        // テストの検証
        expect(screen.getByLabelText('メールアドレス')).toBeInTheDocument();
        expect(screen.getByLabelText('パスワード')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /ログイン/i })).toBeInTheDocument();
    });

    test('should display error toast on login failure', async () => {
        // ログイン失敗のモック
        mockedSignIn.mockResolvedValue({ error: true });
        // テストの実行
        render(<SignInForm />);

        // テールアドレスの入力
        fireEvent.input(screen.getByLabelText('メールアドレス'), {
            target: { value: 'test@example.com' },
        });
        // パスワードの入力
        fireEvent.input(screen.getByLabelText('パスワード'), {
            target: { value: 'password123' },
        });
        // ログインボタンのクリック
        fireEvent.click(screen.getByRole('button', { name: /ログイン/i }));

        // テストの検証
        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Login Failed');
        });
    });

    test('should redirect on successful login', async () => {
        // ログイン成功のモック
        mockedSignIn.mockResolvedValue({ error: false });
        // テストの実行
        render(<SignInForm />);

        // メールアドレスの入力
        fireEvent.input(screen.getByLabelText('メールアドレス'), {
            target: { value: 'test@example.com' },
        });
        // パスワードの入力
        fireEvent.input(screen.getByLabelText('パスワード'), {
            target: { value: 'password123' },
        });
        // ログインボタンのクリック
        fireEvent.click(screen.getByRole('button', { name: /ログイン/i }));

        // テストの検証
        await waitFor(() => {
            expect(mockSyncSession).toHaveBeenCalled();
            expect(toast.success).toHaveBeenCalledWith('Login Successed');
            expect(mockPush).toHaveBeenCalledWith('/');
        });
    });
});
