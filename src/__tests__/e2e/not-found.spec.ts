import { test, expect } from '@playwright/test';

test.describe('Not Found Page', () => {
    test('displays 404 page for non-existent routes', async ({ page }) => {
        // 存在しないページにアクセス
        await page.goto('/non-existent-page');

        // 404ページの要素が表示されることを確認
        await expect(page.locator('text=404')).toBeVisible();
        await expect(page.locator('text=ページが見つかりません')).toBeVisible();

        // ホームへのリンクが存在することを確認
        const homeLink = page.locator('a[href="/"]');
        await expect(homeLink).toBeVisible();

        // ホームへのリンクが機能することを確認
        await homeLink.click();
        await expect(page).toHaveURL('/');
    });
});
