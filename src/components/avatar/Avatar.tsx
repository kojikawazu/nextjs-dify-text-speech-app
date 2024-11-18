'use client';

interface AvatarProps {
    isAnimating?: boolean;
}

const Avatar = ({ isAnimating }: AvatarProps) => {
    return (
        <div className="relative w-64 h-64">
            <div
                className={`absolute inset-0 bg-gradient-to-br from-primary to-primary/50 rounded-full 
              ${isAnimating ? 'animate-pulse' : ''}`}
            />
            <div className="absolute inset-4 bg-background rounded-full flex items-center justify-center">
                <div className="text-6xl">🤖</div>
            </div>
        </div>
    );
};

export default Avatar;
