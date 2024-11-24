import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { signIn } from '@/lib/supabase/supabase-server';
import { useSupabase } from '@/components/provider/supabase-provider';
import SignInForm from '@/components/auth/SignInForm';

// Mocking necessary modules
jest.mock('sonner', () => ({ toast: { error: jest.fn(), success: jest.fn() } }));
jest.mock('@/lib/supabase/supabase-server', () => ({ signIn: jest.fn() }));
jest.mock('next/navigation', () => ({ useRouter: jest.fn() }));

jest.mock('@/components/provider/supabase-provider', () => ({
    useSupabase: jest.fn(),
}));

// Mocking the signIn function
const mockedSignIn = signIn as jest.Mock;
// Mocking the useSupabase hook
const mockedUseSupabase = useSupabase as jest.Mock;
// Mocking the useRouter hook
const mockedUseRouter = useRouter as jest.Mock;
// Mocking the syncSession function
const mockSyncSession = jest.fn();
// Mocking the push function
const mockPush = jest.fn();

// Mocking the useSupabase hook
mockedUseSupabase.mockReturnValue({ syncSession: mockSyncSession });
// Mocking the useRouter hook
mockedUseRouter.mockReturnValue({ push: mockPush });

describe('SignInForm', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should render the form fields and submit button', () => {
        render(<SignInForm />);

        expect(screen.getByLabelText('メールアドレス')).toBeInTheDocument();
        expect(screen.getByLabelText('パスワード')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /ログイン/i })).toBeInTheDocument();
    });

    test('should display error toast on login failure', async () => {
        mockedSignIn.mockResolvedValue({ error: true });
        render(<SignInForm />);

        fireEvent.input(screen.getByLabelText('メールアドレス'), {
            target: { value: 'test@example.com' },
        });
        fireEvent.input(screen.getByLabelText('パスワード'), {
            target: { value: 'password123' },
        });
        fireEvent.click(screen.getByRole('button', { name: /ログイン/i }));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Login Failed');
        });
    });

    test('should redirect on successful login', async () => {
        mockedSignIn.mockResolvedValue({ error: false });
        render(<SignInForm />);

        fireEvent.input(screen.getByLabelText('メールアドレス'), {
            target: { value: 'test@example.com' },
        });
        fireEvent.input(screen.getByLabelText('パスワード'), {
            target: { value: 'password123' },
        });
        fireEvent.click(screen.getByRole('button', { name: /ログイン/i }));

        await waitFor(() => {
            expect(mockSyncSession).toHaveBeenCalled();
            expect(toast.success).toHaveBeenCalledWith('Login Successed');
            expect(mockPush).toHaveBeenCalledWith('/');
        });
    });
});
