import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const url = `${baseUrl}/auth/form`;
const testEmail = process.env.NEXT_PUBLIC_E2E_TEST_EMAIL || '';
const testPassword = process.env.NEXT_PUBLIC_E2E_TEST_PASSWORD || '';

test.describe('Sign In Form', () => {
    test('Must be able to sign in successfully.', async ({ page }) => {
        // テストのタイムアウトを60秒に設定
        test.setTimeout(60000);

        // テスト対象のページに移動
        await page.goto(url);

        // メールアドレスの入力フィールドが表示されるまで待機
        await page.waitForSelector('input#email');

        // メールアドレスを入力
        await page.fill('input#email', testEmail);
        // パスワードを入力
        await page.fill('input#password', testPassword);
        // ログインボタンをクリック
        await page.click('button[type="submit"]');

        // リダイレクトを待機
        await page.waitForURL(`${baseUrl}/`);

        // ログインに成功したことを確認
        await expect(page).toHaveURL(`${baseUrl}/`);
        await expect(page.locator('text=Login Successed')).toBeVisible();
    });

    test('Must be able to show error message when invalid credentials.', async ({ page }) => {
        // テスト対象のページに移動
        await page.goto(url);

        // メールアドレスを入力
        await page.fill('input#email', 'invalid@example.com');
        // パスワードを入力
        await page.fill('input#password', 'wrongpassword');

        // ログインボタンをクリック
        await page.click('button[type="submit"]');

        // エラーメッセージが表示されていることを確認
        await expect(page.locator('text=Login Failed')).toBeVisible();
    });
});
