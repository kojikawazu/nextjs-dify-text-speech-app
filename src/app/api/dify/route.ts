import { NextResponse } from 'next/server';
// lib
import { COMMON_CONSTANTS } from '@/lib/constants';

export const dynamic = 'force-dynamic';

const DIFY_API_KEY = process.env.DIFY_API_KEY as string;
const DIFY_API_URL = process.env.DIFY_API_URL as string;
const DIFY_USER_ID = process.env.DIFY_USER_ID as string;

/**
 * セッション取得
 * @returns セッション
 */
export async function POST(request: Request) {
    console.log('POST ', COMMON_CONSTANTS.URL.API_DIFY);

    try {
        const { message } = await request.json();
        console.log('POST ', COMMON_CONSTANTS.URL.API_DIFY, 'message: ', message);
        if (!message) {
            console.error('POST ', COMMON_CONSTANTS.URL.API_DIFY, 'No message received');
            return NextResponse.json({ error: 'No message received' }, { status: 400 });
        }

        const response = await fetch(DIFY_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${DIFY_API_KEY}`,
            },
            body: JSON.stringify({
                inputs: {
                    input_data: message,
                },
                response_mode: 'blocking',
                user: DIFY_USER_ID,
            }),
        });

        // レスポンスが失敗した場合のエラーハンドリング
        console.log('POST ', COMMON_CONSTANTS.URL.API_DIFY, 'response: ', response);
        if (!response.ok) {
            const errorBody = await response.text();
            console.error('Dify API Error:', errorBody);
            return NextResponse.json(
                { error: `Failed to fetch from Dify: ${response.statusText}` },
                { status: response.status },
            );
        }

        // JSONレスポンスを直接処理
        const responseData = await response.json();
        console.log('POST ', COMMON_CONSTANTS.URL.API_DIFY, 'Dify API Response: ', responseData);

        // 必要なデータが存在するか確認
        const outputData = responseData.data?.outputs?.output_data;
        if (!outputData) {
            console.error('POST ', COMMON_CONSTANTS.URL.API_DIFY, 'No output_data found in response:', responseData);
            return NextResponse.json({ error: 'No output_data received' }, { status: 400 });
        }

        // 成功したレスポンスを返す
        return NextResponse.json({ text: outputData });
    } catch (error) {
        console.error('POST ', COMMON_CONSTANTS.URL.API_DIFY, 'error', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
