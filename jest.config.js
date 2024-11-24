module.exports = {
    // プリセットをts-jestに設定
    preset: 'ts-jest',
    // テスト環境をjsdomに設定
    testEnvironment: 'jsdom',
    // モジュール名のマッピング
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    // テスト前のファイルを設定 
    setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
    // トランスパイルの設定
    transform: {
      '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.jest.json' }],
    },
    // node_modulesをトランスパイルしない
    transformIgnorePatterns: ['/node_modules/'],
    // E2Eテストを除外
    testPathIgnorePatterns: ['/src/__tests__/e2e/'],
};
