'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
// lib
import { COMMON_CONSTANTS } from '@/lib/constants';
import { signIn } from '@/lib/supabase/supabase-server';
// schema
import { signInSchema } from '@/app/schema/user-shema';
// shadcn/ui
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
// components
import Spinner from '@/components/common/Spinner';
import { useSupabase } from '@/components/provider/supabase-provider';

/**
 * サインインフォーム
 * @returns JSX.Element
 */
const SignInForm = () => {
    // ルーター
    const router = useRouter();
    // ローディング
    const [isLoading, setIsLoading] = useState(false);
    // React Hook Form の設定
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
    });
    // Supabase(カスタム用)
    const { syncSession } = useSupabase();

    /**
     * フォーム送信処理
     */
    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        setIsLoading(true);

        try {
            // サインイン
            const result = await signIn(data.email, data.password);

            if (result.error) {
                toast.error('Login Failed');
                return;
            } else {
                // セッションの同期
                await syncSession();
            }

            // ログイン成功
            toast.success('Login Successed');
            // リダイレクト
            router.push(COMMON_CONSTANTS.URL.ROOT);
        } catch (error) {
            console.error('Login error:', error);
            toast.error('Login Failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="container max-w-md px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    <div className="space-y-2 text-center">
                        <h1 className="text-3xl font-bold">ログイン</h1>
                        <p className="text-gray-500">アカウントにログインしてください</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium">
                                メールアドレス
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    className="pl-10"
                                    {...register('email')}
                                    required
                                />
                            </div>
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium">
                                パスワード
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    className="pl-10"
                                    {...register('password')}
                                    required
                                />
                            </div>
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? <Spinner className="mr-2 h-4 w-4" /> : null}
                            ログイン
                        </Button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default SignInForm;
