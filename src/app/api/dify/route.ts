import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const DIFY_API_KEY = process.env.DIFY_API_KEY as string;
const DIFY_API_URL = process.env.DIFY_API_URL as string;
const DIFY_USER_ID = process.env.DIFY_USER_ID as string;

/**
 * セッション取得
 * @returns セッション
 */
export async function POST(request: Request) {
    console.log('POST /api/dify');
    try {
        const { message } = await request.json();
        console.log('POST /api/dify message: ', message);

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
        console.log('POST /api/dify response: ', response);
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
        console.log('Dify API Response: ', responseData);

        // 必要なデータが存在するか確認
        const outputData = responseData.data?.outputs?.output_data;
        if (!outputData) {
            console.error('No output_data found in response:', responseData);
            return NextResponse.json({ error: 'No output_data received' }, { status: 400 });
        }

        // 成功したレスポンスを返す
        return NextResponse.json({ text: outputData });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
