import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChatInterface from '@/components/chat/ChatInterface';
import { useChat } from '@/hooks/use-chat';
import { User } from '@supabase/supabase-js';

// モックの設定
jest.mock('@/hooks/use-chat');
// useChatのモック
const mockUseChat = useChat as jest.MockedFunction<typeof useChat>;

// モックユーザー
const mockUser: User = {
    id: '1',
    app_metadata: {},
    user_metadata: {},
    aud: 'authenticated',
    created_at: '2024-01-01T00:00:00.000Z',
    email: 'test@example.com',
    phone: undefined,
    confirmation_sent_at: undefined,
    recovery_sent_at: undefined,
    email_change_sent_at: undefined,
    new_email: undefined,
    new_phone: undefined,
    invited_at: undefined,
    action_link: undefined,
    confirmed_at: undefined,
    email_confirmed_at: undefined,
    phone_confirmed_at: undefined,
    last_sign_in_at: undefined,
    role: undefined,
    updated_at: undefined,
    identities: [],
    is_anonymous: false,
    factors: [],
};

// コンポーネントのモック
jest.mock('@/components/avatar/Avatar', () => ({
    __esModule: true,
    default: () => <div data-testid="mock-avatar">Avatar</div>,
}));

// 3Dモードのモック
jest.mock('@/components/avatar/avatar3D/MyCanvas3D', () => ({
    __esModule: true,
    default: () => <div data-testid="mock-3d-avatar">3D Avatar</div>,
}));

// SpeechSynthesisのモック
const mockSpeak = jest.fn();
// SpeechSynthesisUtteranceのモック
const mockUtterance = jest.fn().mockImplementation(() => ({
    text: '',
    lang: '',
    onstart: null,
    onend: null,
}));

// SpeechSynthesisのモック
Object.defineProperty(window, 'speechSynthesis', {
    value: { speak: mockSpeak },
    writable: true,
});
// SpeechSynthesisUtteranceのモック
global.SpeechSynthesisUtterance = mockUtterance;

describe('ChatInterface', () => {
    // sendMessageのモック
    const mockSendMessage = jest.fn();

    beforeEach(() => {
        // モックの初期化
        jest.clearAllMocks();
        // sendMessageのモック
        mockSendMessage.mockResolvedValue('AI response');
        // useChatのモック
        mockUseChat.mockReturnValue({ sendMessage: mockSendMessage });
    });

    it('should render initial state correctly', () => {
        render(<ChatInterface user={mockUser} />);

        // 初期状態の確認
        expect(screen.getByPlaceholderText('メッセージを入力...')).toBeInTheDocument();
        expect(screen.getByTestId('send-button')).toBeInTheDocument();
        expect(screen.getByText('3Dモード: OFF')).toBeInTheDocument();
    });

    it('should handle message sending and loading state', async () => {
        // userEventの設定
        const user = userEvent.setup();
        // sendMessageのモック
        mockSendMessage.mockImplementation(
            () => new Promise((resolve) => setTimeout(() => resolve('AI response'), 100)),
        );

        render(<ChatInterface user={mockUser} />);

        // 入力フィールドと送信ボタンの取得
        const input = screen.getByPlaceholderText('メッセージを入力...');
        const sendButton = screen.getByTestId('send-button');

        // 入力フィールドにテキストを入力
        await user.type(input, 'Hello AI');
        // 送信ボタンをクリック
        await user.click(sendButton);

        // ローディング状態の確認
        await waitFor(() => {
            expect(input).toHaveAttribute('disabled');
            expect(sendButton).toHaveAttribute('disabled');
        });

        // メッセージ送信完了の確認
        await waitFor(() => {
            expect(screen.getByText('Hello AI')).toBeInTheDocument();
            expect(screen.getByText('AI response')).toBeInTheDocument();
            expect(input).not.toHaveAttribute('disabled');
            expect(sendButton).not.toHaveAttribute('disabled');
        });
    });

    it('should handle speech synthesis', async () => {
        // userEventの設定
        const user = userEvent.setup();
        render(<ChatInterface user={mockUser} />);

        // 入力フィールドの取得
        const input = screen.getByPlaceholderText('メッセージを入力...');
        // 入力フィールドにテキストを入力
        await user.type(input, 'Hello AI{enter}');

        // 音声合成の確認
        await waitFor(() => {
            expect(mockSpeak).toHaveBeenCalled();
            const utterance = mockUtterance.mock.calls[0][0];
            expect(utterance).toBe('AI response');
        });
    });

    it('should handle error during message sending', async () => {
        // console.errorのモック
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
        // sendMessageのモック
        mockSendMessage.mockRejectedValue(new Error('API Error'));

        // userEventの設定
        const user = userEvent.setup();
        render(<ChatInterface user={mockUser} />);

        // 入力フィールドの取得
        const input = screen.getByPlaceholderText('メッセージを入力...');
        // 入力フィールドにテキストを入力
        await user.type(input, 'Hello AI{enter}');

        // エラーの確認
        await waitFor(() => {
            expect(consoleErrorSpy).toHaveBeenCalled();
        });

        // console.errorのモックを元に戻す
        consoleErrorSpy.mockRestore();
    });

    it('should toggle 3D mode', async () => {
        // userEventの設定
        const user = userEvent.setup();
        render(<ChatInterface user={mockUser} />);

        // 3Dモードのトグルボタンの取得
        const toggleButton = screen.getByRole('button', { name: /3Dモード/i });
        // 3Dモードのトグルボタンをクリック
        await user.click(toggleButton);
        // 3Dモードの確認
        expect(screen.getByText(/3Dモード: ON/i)).toBeInTheDocument();
        expect(screen.getByTestId('mock-3d-avatar')).toBeInTheDocument();

        // 3Dモードのトグルボタンをクリック
        await user.click(toggleButton);
        // 2Dモードの確認
        expect(screen.getByText(/3Dモード: OFF/i)).toBeInTheDocument();
        expect(screen.getByTestId('mock-avatar')).toBeInTheDocument();
    });
});
