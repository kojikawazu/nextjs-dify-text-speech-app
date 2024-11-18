import Spinner from '@/components/common/Spinner';

/**
 * ローディングアイコン
 * @returns JSX.Element
 */
const LoadingIcon = () => {
    return (
        <div className="flex justify-center items-center">
            <Spinner className="w-6 h-6 text-primary" />
        </div>
    );
};

export default LoadingIcon;
