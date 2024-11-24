import { renderHook } from '@testing-library/react';
import { useChat } from '@/hooks/use-chat';
import { COMMON_CONSTANTS } from '@/lib/constants';
import { User } from '@supabase/supabase-js';

describe('useChat', () => {
    const mockUser: User = {
        id: '1',
        email: 'test@example.com',
        created_at: '',
        app_metadata: {},
        user_metadata: {},
        aud: '',
    };

    // console.errorのモック
    const originalConsoleError = console.error;
    beforeAll(() => {
        console.error = jest.fn();
    });

    afterAll(() => {
        console.error = originalConsoleError;
    });

    beforeEach(() => {
        (global.fetch as jest.Mock).mockReset();
        (console.error as jest.Mock).mockClear();
    });

    it('should return login required message when user is null', async () => {
        const { result } = renderHook(() => useChat());
        const response = await result.current.sendMessage('Hello', null);
        expect(response).toBe(COMMON_CONSTANTS.MESSAGE.LOGIN_REQUIRED);
    });

    it('should send message and return response when user is logged in', async () => {
        const mockResponse = { text: 'Response from API' };
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockResponse),
        });

        const { result } = renderHook(() => useChat());
        const response = await result.current.sendMessage('Hello', mockUser);

        expect(global.fetch).toHaveBeenCalledWith(COMMON_CONSTANTS.URL.API_DIFY, {
            method: 'POST',
            body: JSON.stringify({ message: 'Hello' }),
        });
        expect(response).toBe(mockResponse.text);
    });

    it('should throw error when API request fails', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
        });

        const { result } = renderHook(() => useChat());
        await expect(result.current.sendMessage('Hello', mockUser)).rejects.toThrow(
            'Failed to fetch data',
        );
        expect(console.error).toHaveBeenCalled();
    });

    it('should throw error when fetch throws an error', async () => {
        const mockError = new Error('Network error');
        (global.fetch as jest.Mock).mockRejectedValueOnce(mockError);

        const { result } = renderHook(() => useChat());
        await expect(result.current.sendMessage('Hello', mockUser)).rejects.toThrow(
            'Network error',
        );
        expect(console.error).toHaveBeenCalledWith(mockError);
    });
});
