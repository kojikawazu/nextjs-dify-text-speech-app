import { z } from 'zod';

/**
 * サインインスキーマ
 */
export const signInSchema = z.object({
    email: z.string().email({ message: '正しいメールアドレスを入力してください' }),
    password: z.string().min(6, { message: 'パスワードは6文字以上で入力してください' }),
});
