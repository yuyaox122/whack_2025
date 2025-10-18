"use client";
import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Sphere } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";

const GlobeMesh = ({ globeConfig }) => {
  const pointsRef = useRef();
  const globeRef = useRef();

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.x -= delta / 10;
      pointsRef.current.rotation.y -= delta / 15;
    }
    if (globeRef.current) {
      globeRef.current.rotation.y += delta / 100;
    }
  });

  return (
    <>
      <directionalLight position={[1, 1, 1]} intensity={0.8} color={globeConfig.directionalTopLight} />
      <directionalLight position={[-1, -1, -1]} intensity={0.5} color={globeConfig.directionalLeftLight} />
      <ambientLight intensity={0.6} color={globeConfig.ambientLight} />
      <Sphere ref={globeRef} args={[1, 64, 64]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color={globeConfig.globeColor}
          emissive={globeConfig.emissive}
          emissiveIntensity={globeConfig.emissiveIntensity}
          shininess={globeConfig.shininess}
        />
      </Sphere>
      <Points ref={pointsRef} positions={random.inSphere(new Float32Array(5000), { radius: 1.2 })} stride={3}>
        <PointMaterial transparent color={globeConfig.globeColor} size={0.005} sizeAttenuation={true} depthWrite={false} />
      </Points>
    </>
  );
};

const World = ({ globeConfig, data }) => {
  return (
    <Canvas camera={{ position: [0, 0, 1] }}>
      <GlobeMesh globeConfig={globeConfig} />
    </Canvas>
  );
};

export { World };
