import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './src/__tests__/e2e', // E2Eテスト用のディレクトリ
    timeout: 30000,
    expect: {
        timeout: 5000,
    },
    reporter: 'html', // テスト結果をHTMLレポートで出力
    use: {
        headless: true,
        baseURL: 'http://localhost:3000', // 必要に応じて変更
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
    },
});
