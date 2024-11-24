import { render, screen, waitFor, act } from '@testing-library/react';
import SupabaseProvider, { useSupabase } from '@/components/provider/supabase-provider';
import { COMMON_CONSTANTS } from '@/lib/constants';
import { User } from '@supabase/supabase-js';

// グローバルfetchのモック
const mockFetch = jest.fn();
global.fetch = mockFetch;

// テスト用のコンポーネント
function TestComponent() {
    const { user, isLoading } = useSupabase();
    return (
        <div>
            <div data-testid="loading-state">{isLoading.toString()}</div>
            <div data-testid="user-state">{user ? 'authenticated' : 'unauthenticated'}</div>
        </div>
    );
}

describe('SupabaseProvider', () => {
    beforeEach(() => {
        // モックのクリア
        jest.clearAllMocks();
    });

    it('should start with initial loading state', () => {
        // フェッチを遅延させて初期状態をテスト
        mockFetch.mockImplementationOnce(
            () =>
                new Promise((resolve) =>
                    setTimeout(
                        () =>
                            resolve({
                                ok: true,
                                json: () => Promise.resolve({ user: null }),
                            }),
                        100,
                    ),
                ),
        );

        render(
            <SupabaseProvider>
                <TestComponent />
            </SupabaseProvider>,
        );

        // 初期状態の確認
        expect(screen.getByTestId('loading-state')).toHaveTextContent('true');
        expect(screen.getByTestId('user-state')).toHaveTextContent('unauthenticated');
    });

    it('should update state after session sync', async () => {
        // フェッチのモック
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ user: null }),
        });

        // 非同期処理の実行
        await act(async () => {
            render(
                <SupabaseProvider>
                    <TestComponent />
                </SupabaseProvider>,
            );
        });

        // 非同期処理完了後の状態を確認
        await waitFor(() => {
            expect(screen.getByTestId('loading-state')).toHaveTextContent('false');
            expect(screen.getByTestId('user-state')).toHaveTextContent('unauthenticated');
        });

        // フェッチの確認
        expect(mockFetch).toHaveBeenCalledWith(COMMON_CONSTANTS.URL.API_AUTH_SESSION);
    });

    it('should handle authenticated user state', async () => {
        // ユーザー情報のモック
        const mockUser: User = {
            id: '1',
            app_metadata: {},
            user_metadata: {},
            aud: '',
            created_at: '',
        };

        // フェッチのモック
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ user: mockUser }),
        });

        // 非同期処理の実行
        await act(async () => {
            render(
                <SupabaseProvider>
                    <TestComponent />
                </SupabaseProvider>,
            );
        });

        // 非同期処理完了後の状態を確認
        await waitFor(() => {
            expect(screen.getByTestId('loading-state')).toHaveTextContent('false');
            expect(screen.getByTestId('user-state')).toHaveTextContent('authenticated');
        });
    });

    it('should handle session sync error', async () => {
        // console.errorのモック
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
        // フェッチのモック
        mockFetch.mockRejectedValueOnce(new Error('Network error'));

        // 非同期処理の実行
        await act(async () => {
            render(
                <SupabaseProvider>
                    <TestComponent />
                </SupabaseProvider>,
            );
        });

        await waitFor(() => {
            expect(screen.getByTestId('loading-state')).toHaveTextContent('false');
            expect(screen.getByTestId('user-state')).toHaveTextContent('unauthenticated');
            expect(consoleErrorSpy).toHaveBeenCalled();
        });

        // console.errorのモックを元に戻す
        consoleErrorSpy.mockRestore();
    });

    it('should handle manual session sync', async () => {
        // ユーザー情報のモック
        const mockUser: User = {
            id: '1',
            app_metadata: {},
            user_metadata: {},
            aud: '',
            created_at: '',
        };

        // フェッチのモック
        mockFetch
            .mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({ user: null }),
            })
            .mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({ user: mockUser }),
            });

        // テスト用のコンポーネント
        function TestComponentWithSync() {
            const { syncSession, user } = useSupabase();
            return (
                <div>
                    <button onClick={() => syncSession()}>Sync</button>
                    <div data-testid="user-state">{user ? 'authenticated' : 'unauthenticated'}</div>
                </div>
            );
        }

        // 非同期処理の実行
        await act(async () => {
            render(
                <SupabaseProvider>
                    <TestComponentWithSync />
                </SupabaseProvider>,
            );
        });

        // 非同期処理完了後の状態を確認
        await waitFor(() => {
            expect(screen.getByTestId('user-state')).toHaveTextContent('unauthenticated');
        });

        // 同期ボタンのクリック
        await act(async () => {
            screen.getByText('Sync').click();
        });

        // 非同期処理完了後の状態を確認
        await waitFor(() => {
            expect(screen.getByTestId('user-state')).toHaveTextContent('authenticated');
        });
    });
});
