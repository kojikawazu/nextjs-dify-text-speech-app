# チャットAIを使ったWebアプリケーション

## Summary

Difyを使ってチャットAIを実装したWebアプリケーションです。
2Dモードと3Dモードがあります。3Dモードでは、ReadyPlayerMeのアバターを使用しています。

# Tech

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![RedyPlayMe](https://img.shields.io/badge/RedyPlayMe-000000?style=for-the-badge&logo=redyplayme&logoColor=white)](https://readyplayer.me/)
[![Mixamo](https://img.shields.io/badge/Mixamo-000000?style=for-the-badge&logo=mixamo&logoColor=white)](https://mixamo.com/)
[![Dify](https://img.shields.io/badge/Dify-000000?style=for-the-badge&logo=dify&logoColor=white)](https://dify.ai/)
[![Supabase](https://img.shields.io/badge/Supabase-000000?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![ReactHookForm](https://img.shields.io/badge/ReactHookForm-000000?style=for-the-badge&logo=reacthookform&logoColor=white)](https://react-hook-form.com/)
[![Prettier](https://img.shields.io/badge/Prettier-000000?style=for-the-badge&logo=prettier&logoColor=white)](https://prettier.io/)
[![Playwright](https://img.shields.io/badge/Playwright-000000?style=for-the-badge&logo=playwright&logoColor=white)](https://playwright.dev/)
[![Jest](https://img.shields.io/badge/Jest-000000?style=for-the-badge&logo=jest&logoColor=white)](https://jestjs.io/)

## Architecture

![Architecture](./design/architecture.drawio.png)

## 開発環境のセットアップ

-   リポジトリのクローン

```bash
git clone https://github.com/yourusername/nextjs-echo-text-speech-app.git
```

-   依存関係のインストール

```bash
cd frontend
npm install
```

-   環境変数の設定

```bash
cp .env.example .env
```

-   開発サーバーの起動

```bash
npm run dev
```

### 環境変数

```
.env.exampleを参照してください
```

## テスト

-   ユニットテスト

```bash
npm run test
```

-   E2Eテスト

```bash
npm run test:e2e
```

-   テストカバレッジの確認

```bash
npm run test:coverage
```

## デプロイメント

-   プロダクションビルド

```bash
npm run build
```

-   ビルドの確認

```bash
npm run start
```

### コーディング規約

-   ESLintとPrettierの設定に従ってください
-   コンポーネントにはJSDocコメントを付けてください
