import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

function Robot3DScene({ angles }) {
  const rad = (deg) => (deg * Math.PI) / 180;

  // Angulos en radianes
  const J1 = rad(angles.J1);
  const J2 = rad(angles.J2);
  const J3 = rad(angles.J3);

  // Longitudes ficticias, ajusta según tu robot real
  const L1 = 50; 
  const L2 = 50; 
  const L3 = 30;

  // Calculo posiciones intermedias (plano XY)
  const x1 = L1 * Math.cos(J1);
  const y1 = L1 * Math.sin(J1);

  const x2 = x1 + L2 * Math.cos(J1 + J2);
  const y2 = y1 + L2 * Math.sin(J1 + J2);

  const x3 = x2 + L3 * Math.cos(J1 + J2 + J3);
  const y3 = y2 + L3 * Math.sin(J1 + J2 + J3);

  return (
    <Canvas
      camera={{ position: [200, 200, 300], fov: 45 }} // Posición inicial de la cámara
      style={{ width: 300, height: 300, border: '1px solid #ddd', borderRadius: '8px' }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[100, 100, 100]} intensity={0.8} />
      <OrbitControls enableZoom={true} maxPolarAngle={Math.PI} />

      <group position={[0, 0, 0]}>
        {/* Base */}
        <mesh position={[0, 0, -5]}>
          <boxGeometry args={[50, 50, 10]} />
          <meshStandardMaterial color="#888" />
        </mesh>

        {/* Eslabón 1 */}
        <group rotation={[0, 0, J1]}>
          <mesh position={[L1 / 2, 0, 0]}>
            <cylinderGeometry args={[5, 5, L1, 16]} />
            <meshStandardMaterial color="#555" />
          </mesh>
        </group>

        {/* Eslabón 2 */}
        <group position={[x1, y1, 0]} rotation={[0, 0, J1 + J2]}>
          <mesh position={[L2 / 2, 0, 0]}>
            <cylinderGeometry args={[5, 5, L2, 16]} />
            <meshStandardMaterial color="#1890ff" />
          </mesh>
        </group>

        {/* Eslabón 3 */}
        <group position={[x2, y2, 0]} rotation={[0, 0, J1 + J2 + J3]}>
          <mesh position={[L3 / 2, 0, 0]}>
            <cylinderGeometry args={[5, 5, L3, 16]} />
            <meshStandardMaterial color="#1890ff" />
          </mesh>
        </group>

        {/* Efector Final */}
        <mesh position={[x3, y3, 0]}>
          <sphereGeometry args={[8, 16, 16]} />
          <meshStandardMaterial color="red" />
        </mesh>
      </group>
    </Canvas>
  );
}

export default Robot3DScene;
