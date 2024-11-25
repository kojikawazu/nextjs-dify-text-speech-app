import Link from 'next/link';

/**
 * 404ページ
 * @returns JSX.Element
 */
const NotFound = () => {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">404</h1>
                <h2 className="text-2xl mb-4">ページが見つかりません</h2>
                <p className="text-gray-600 mb-8">
                    お探しのページは存在しないか、移動した可能性があります。
                </p>
                <Link href="/" className="text-primary hover:text-primary-dark underline">
                    ホームに戻る
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
