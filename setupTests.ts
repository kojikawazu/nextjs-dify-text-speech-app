import '@testing-library/jest-dom';

declare global {
    // fetchの型を拡張
    var fetchMock: jest.Mock;
    interface Window {
        fetchOriginal: typeof fetch;
    }
}

// オリジナルのfetchを保存
window.fetchOriginal = window.fetch;

// fetchをモックに置き換え
global.fetch = jest.fn() as jest.Mock;

export {};
