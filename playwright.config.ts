import { defineConfig, devices } from '@playwright/test';

/**
 * Playwrightの設定
 * @returns
 */
export default defineConfig({
    // E2Eテスト用のディレクトリ
    testDir: './src/__tests__/e2e',
    // タイムアウト時間
    timeout: 60000,
    // 期待値のタイムアウト時間
    expect: {
        timeout: 10000,
    },
    // 並列実行
    fullyParallel: true,
    // テスト結果をHTMLレポートで出力
    reporter: 'html',
    // ヘッドレスモードで実行
    use: {
        headless: true,
        baseURL: 'http://localhost:3000',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
    },
    // テストプロジェクト
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
    // サーバー起動のタイムアウトを2分に設定
    webServer: {
        command: 'npm run dev',
        url: 'http://localhost:3000',
        reuseExistingServer: !process.env.CI,
        timeout: 120000,
    },
});
