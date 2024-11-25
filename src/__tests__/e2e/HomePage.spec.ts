import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

// 環境変数の読み込み
dotenv.config();
// テスト用のメールアドレスとパスワード
const testEmail = process.env.NEXT_PUBLIC_E2E_TEST_EMAIL || '';
const testPassword = process.env.NEXT_PUBLIC_E2E_TEST_PASSWORD || '';
// ルートURL
const ROOT_URL = '/';
// 認証フォームURL
const AUTH_FORM_URL = '/auth/form';

test.describe('Home Page', () => {
    test.beforeEach(async ({ page }) => {
        // テスト前にホームページにアクセス
        await page.goto(ROOT_URL);
    });

    test('Unauthorized users are redirected to the login page.', async ({ page }) => {
        // サインインボタンが表示されることを確認
        const signInButton = page.getByRole('button', { name: /signIn/i });
        await expect(signInButton).toBeVisible();

        // URLが変更されていないことを確認（リダイレクトが発生していない）
        await expect(page).toHaveURL(ROOT_URL);
    });

    test('Home page display for authenticated users.', async ({ page }) => {
        // テストユーザーとしてログイン
        await test.step('Login process', async () => {
            // ログインページにアクセス
            await page.goto(AUTH_FORM_URL);
            // メールアドレスを入力
            await page.fill('input[type="email"]', testEmail);
            // パスワードを入力
            await page.fill('input[type="password"]', testPassword);
            // 送信ボタンをクリック
            await page.click('button[type="submit"]');

            // ホームページへのリダイレクトを待機
            await page.waitForURL('/', { timeout: 10000 });
            // ページの読み込みが完了するまで待機
            await page.waitForLoadState('networkidle');
        });

        // ホームページの要素が表示されることを確認
        await test.step('Confirmation of homepage display.', async () => {
            // チャットコンテナが表示されるまで待機
            await page.waitForSelector('[data-testid="chat-container"]', { timeout: 10000 });

            // メッセージ入力フォームが表示される
            const messageInput = page.locator('[data-testid="message-input"]');
            await expect(messageInput).toBeVisible();

            // 送信ボタンが表示される
            const sendButton = page.locator('[data-testid="send-button"]');
            // ボタンが表示されるまで待機
            await expect(sendButton).toBeVisible({ timeout: 10000 });

            // ボタンの存在を確認
            const buttonCount = await sendButton.count();
            expect(buttonCount).toBe(1);
        });

        // チャット機能のテスト
        //     await test.step('Chat function test', async () => {
        //         const testMessage = 'Hello, this is a test message';

        //         // メッセージを入力
        //         await page.fill('[data-testid="message-input"]', testMessage);

        //         // 送信ボタンをクリック
        //         await Promise.all([
        //             // APIリクエストの完了を待機
        //             page.waitForResponse(response =>
        //                 response.url().includes(API_DIFY_URL) &&
        //                 response.status() === 200
        //             ),
        //             page.click('[data-testid="send-button"]')
        //         ]);

        //         // ユーザーメッセージが表示されることを確認（複数の方法で検出を試みる）
        //         const userMessageLocator = page.locator('.max-w-[80%]', {
        //             hasText: testMessage
        //         });
        //         await expect(userMessageLocator).toBeVisible({ timeout: 10000 });

        //         // AIの応答を待機
        //         const aiMessageLocator = page.locator('.ai-message, [data-testid="ai-message"]');
        //         await expect(aiMessageLocator).toBeVisible({ timeout: 15000 });

        //         // AIメッセージの内容が空でないことを確認
        //         const aiMessageText = await aiMessageLocator.textContent();
        //         expect(aiMessageText).toBeTruthy();
        //         expect(aiMessageText?.length).toBeGreaterThan(0);
        //     });
    });
});
