import { Canvas } from '@react-three/fiber';
// components
import Avatar3D from '@/components/avatar/avatar3D/Avatar3D';

interface MyCanvas3DProps {
    isSpeaking: boolean;
}

/**
 * 3Dアバター
 * @returns JSX.Element
 */
const MyCanvas3D = ({ isSpeaking }: MyCanvas3DProps) => {
    return (
        <Canvas
            camera={{
                position: [0, 1, 4], // カメラ
                fov: 45, // 画角を
            }}
            style={{
                height: '70vh', // ビューポート
                width: '100%', // キャンバスのサイズ
                background: '#f0f0f0',
            }}
        >
            {/* 環境光 */}
            <ambientLight intensity={1.2} />
            {/* 平行光源 */}
            <directionalLight position={[5, 5, 5]} intensity={1.5} />
            {/* アバター */}
            <Avatar3D isSpeaking={isSpeaking} />
        </Canvas>
    );
};

export default MyCanvas3D;
