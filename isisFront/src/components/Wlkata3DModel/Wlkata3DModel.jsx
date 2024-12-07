import React from 'react';
import { useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';

const Wlkata3DModel = ({ angles }) => {
  // Cargar los modelos STL desde la carpeta `public/models/`
  const base = useLoader(STLLoader, '/models/base_link.STL');
  const arm1 = useLoader(STLLoader, '/models/Link1.STL');
  const arm2 = useLoader(STLLoader, '/models/Link2.STL');
  const arm3 = useLoader(STLLoader, '/models/Link3.STL');
  const arm4 = useLoader(STLLoader, '/models/Link4.STL');
  const endEffector = useLoader(STLLoader, '/models/Link5.STL');

  // Convertir ángulos a radianes
  const rad = (deg) => (deg * Math.PI) / 180;
  const J1 = rad(angles.J1 || 0);
  const J2 = rad(angles.J2 || 0);
  const J3 = rad(angles.J3 || 0);
  const J4 = rad(angles.J4 || 0);

  return (
    <>
      {/* Iluminación */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={1} />

      {/* Controles interactivos */}
      <OrbitControls enableZoom={true} />

      {/* Base */}
      <mesh geometry={base} position={[0, 0, 0]}>
        <meshStandardMaterial color="#888" />
      </mesh>

      {/* Brazo 1 */}
      <group rotation={[0, J1, 0]}>
        <mesh geometry={arm1} position={[0, 10, 0]}>
          <meshStandardMaterial color="#555" />
        </mesh>

        {/* Brazo 2 */}
        <group position={[0, 50, 0]} rotation={[0, 0, J2]}>
          <mesh geometry={arm2}>
            <meshStandardMaterial color="#555" />
          </mesh>

          {/* Brazo 3 */}
          <group position={[0, 50, 0]} rotation={[0, 0, J3]}>
            <mesh geometry={arm3}>
              <meshStandardMaterial color="#555" />
            </mesh>

            {/* Brazo 4 */}
            <group position={[0, 30, 0]} rotation={[0, 0, J4]}>
              <mesh geometry={arm4}>
                <meshStandardMaterial color="#555" />
              </mesh>

              {/* End Effector */}
              <mesh geometry={endEffector} position={[0, 20, 0]}>
                <meshStandardMaterial color="red" />
              </mesh>
            </group>
          </group>
        </group>
      </group>
    </>
  );
};

export default Wlkata3DModel;
