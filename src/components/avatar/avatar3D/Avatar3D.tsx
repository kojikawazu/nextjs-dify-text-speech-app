import { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

interface Avatar3DProps {
    isSpeaking: boolean;
}

/**
 * 3Dアバター
 * @param isSpeaking 話すかどうか
 * @returns JSX.Element
 */
const Avatar3D = ({ isSpeaking }: Avatar3DProps) => {
    // グループ
    const groupRef = useRef<THREE.Group>(null);
    // モデル
    const { scene, nodes, animations } = useGLTF(
        process.env.NEXT_PUBLIC_AVATAR_MODEL_PATH as string,
    );
    // アニメーションミキサーの設定
    const mixer = useMemo(() => new THREE.AnimationMixer(scene), [scene]);

    // アニメーションの実行
    useFrame((_, delta) => {
        // アニメーションの更新
        mixer.update(delta);

        // 口のメッシュを取得
        const headMesh = nodes.Wolf3D_Head001 as THREE.SkinnedMesh;
        if (headMesh && headMesh.morphTargetInfluences) {
            // 口の動き（話すとき）
            if (isSpeaking) {
                // 口の開閉（mouthOpen）
                headMesh.morphTargetInfluences[0] = Math.sin(Date.now() * 0.01) * 0.5 + 0.5;
                // 少し笑顔に（mouthSmile）
                headMesh.morphTargetInfluences[1] = 0.3;
            } else {
                // 通常状態
                headMesh.morphTargetInfluences[0] = 0; // 口を閉じる
                headMesh.morphTargetInfluences[1] = 0; // 笑顔をリセット
            }
        }
    });

    // 初期実行
    useEffect(() => {
        if (animations.length > 0) {
            const action = mixer.clipAction(animations[0]);
            action.play();
        }
    }, [animations, mixer]);

    return (
        <primitive
            ref={groupRef}
            object={scene}
            scale={1.8} // スケールを調整
            position={[0, -2.3, 0]} // 位置を調整
            rotation={[0, 0.1, 0]} // 角度を調整
        />
    );
};

export default Avatar3D;
