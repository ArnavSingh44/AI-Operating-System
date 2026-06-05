import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Line } from '@react-three/drei';
import * as THREE from 'three';
import { useOSStore } from '../store/useOSStore';

// Coordinates translation helper: Lat/Lng to Cartesian coordinates on a sphere
const latLngToVector3 = (lat: number, lng: number, radius: number): THREE.Vector3 => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.sin(theta));
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.cos(theta);

  return new THREE.Vector3(x, y, z);
};



// 1. Pulsing City Marker Component with Click & Hover Handlers
interface CityMarkerProps {
  name: string;
  position: THREE.Vector3;
  color: string;
  active: boolean;
  onClick: () => void;
}

const CityMarker: React.FC<CityMarkerProps> = ({ position, color, active, onClick }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const pulseRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Alter cursor style on hover
  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [hovered]);

  useFrame(({ clock }) => {
    if (pulseRef.current) {
      // Dynamic pulsing shell
      const t = clock.getElapsedTime() * 2;
      const scale = (active ? 1.4 : 1) * (1 + (t % 1) * 1.5);
      const opacity = 1 - (t % 1);
      pulseRef.current.scale.set(scale, scale, scale);
      if (pulseRef.current.material && !Array.isArray(pulseRef.current.material)) {
        (pulseRef.current.material as THREE.Material).opacity = opacity * 0.65;
      }
    }
  });

  return (
    <group position={position}>
      {/* City Hub Core */}
      <mesh 
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
        }}
        scale={hovered ? 1.5 : active ? 1.25 : 1}
      >
        <sphereGeometry args={[0.055, 16, 16]} />
        <meshBasicMaterial color={active ? '#ffffff' : color} />
      </mesh>
      
      {/* Pulsing Energy Shield */}
      <mesh ref={pulseRef}>
        <sphereGeometry args={[0.065, 16, 16]} />
        <meshBasicMaterial color={color} transparent depthWrite={false} />
      </mesh>
    </group>
  );
};

// 2. Bezier Curved Data Link Component
interface DataLinkProps {
  start: THREE.Vector3;
  end: THREE.Vector3;
  color: string;
}

const DataLink: React.FC<DataLinkProps> = ({ start, end, color }) => {
  const particleRef = useRef<THREE.Mesh>(null);

  // Compute a beautiful high arc curve between coordinates
  const points = useMemo(() => {
    const midPoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    const distance = start.distanceTo(end);
    const normal = midPoint.clone().normalize();
    midPoint.addScaledVector(normal, distance * 0.45);
    
    const curve = new THREE.QuadraticBezierCurve3(start, midPoint, end);
    return {
      curve,
      linePoints: curve.getPoints(30),
    };
  }, [start, end]);

  useFrame(({ clock }) => {
    if (particleRef.current) {
      const t = (clock.getElapsedTime() * 0.4) % 1;
      const position = points.curve.getPointAt(t);
      particleRef.current.position.copy(position);
    }
  });

  return (
    <group>
      <Line
        points={points.linePoints}
        color={color}
        lineWidth={1}
        transparent
        opacity={0.3}
      />
      <mesh ref={particleRef}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
};

// 3. Smooth Camera Focus Controller on Active City change
interface CameraControllerProps {
  cityVectors: { name: string; vector: THREE.Vector3 }[];
  globeGroupRef: React.RefObject<THREE.Group | null>;
}

const GlobeCameraController: React.FC<CameraControllerProps> = ({ cityVectors, globeGroupRef }) => {
  const activeCity = useOSStore((state) => state.activeCity);
  const { camera, gl } = useThree();
  const isAnimating = useRef(false);

  useEffect(() => {
    const active = cityVectors.find(
      (c) => c.name.toLowerCase() === activeCity.toLowerCase()
    );
    if (active) {
      isAnimating.current = true;
    } else {
      isAnimating.current = false;
    }
  }, [activeCity, cityVectors]);

  // Interrupt camera lock animation on manual user rotation/zoom
  useEffect(() => {
    const handleInteraction = () => {
      isAnimating.current = false;
    };

    const dom = gl.domElement;
    dom.addEventListener('pointerdown', handleInteraction);
    dom.addEventListener('wheel', handleInteraction, { passive: true });

    return () => {
      dom.removeEventListener('pointerdown', handleInteraction);
      dom.removeEventListener('wheel', handleInteraction);
    };
  }, [gl]);

  useFrame(() => {
    if (isAnimating.current && globeGroupRef.current) {
      const active = cityVectors.find(
        (c) => c.name.toLowerCase() === activeCity.toLowerCase()
      );
      if (active) {
        // Calculate the city's current world coordinates dynamically (accounting for globe rotation)
        const worldPos = active.vector.clone().applyMatrix4(globeGroupRef.current.matrixWorld);
        const target = worldPos.normalize().multiplyScalar(4.5);
        camera.position.lerp(target, 0.06);

        if (camera.position.distanceTo(target) < 0.02) {
          isAnimating.current = false;
        }
      }
    }
  });

  return null;
};

// 4. Globe Construction Group
interface HolographicGlobeProps {
  globeGroupRef: React.RefObject<THREE.Group | null>;
  cityVectors: { name: string; vector: THREE.Vector3; color: string }[];
  cityLinks: { id: string; start: THREE.Vector3; end: THREE.Vector3; color: string }[];
  changeCity: (city: string) => void;
  activeCity: string;
}

const HolographicGlobe: React.FC<HolographicGlobeProps> = ({ 
  globeGroupRef,
  cityVectors, 
  cityLinks, 
  changeCity, 
  activeCity 
}) => {
  const R = 2; // Globe Radius
  const rotationSpeed = useRef(0.0012);

  // Generate dots to map out earth contours
  const dotPoints = useMemo(() => {
    const tempPoints = [];
    const count = 1500;
    
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      
      const x = R * Math.sin(phi) * Math.sin(theta);
      const y = R * Math.cos(phi);
      const z = R * Math.sin(phi) * Math.cos(theta);
      
      tempPoints.push(new THREE.Vector3(x, y, z));
    }
    return tempPoints;
  }, []);

  // Slow default rotation (smoothly decelerates when locked onto a target, accelerates on release)
  useFrame(() => {
    if (globeGroupRef.current) {
      const targetSpeed = (activeCity === 'None' || activeCity === '') ? 0.0012 : 0;
      rotationSpeed.current = THREE.MathUtils.lerp(rotationSpeed.current, targetSpeed, 0.05);
      globeGroupRef.current.rotation.y += rotationSpeed.current;
    }
  });

  return (
    <group ref={globeGroupRef}>
      {/* Wireframe Core Globe */}
      <mesh onClick={(e) => {
        e.stopPropagation();
        changeCity('None');
      }}>
        <sphereGeometry args={[R, 24, 24]} />
        <meshBasicMaterial
          color="#00f0ff"
          wireframe
          transparent
          opacity={0.06}
          depthWrite={false}
        />
      </mesh>

      {/* Dotted Holographic Layer */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[
              new Float32Array(dotPoints.flatMap(p => [p.x, p.y, p.z])),
              3,
            ]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#3b82f6"
          size={0.025}
          sizeAttenuation={true}
          transparent
          opacity={0.35}
          depthWrite={false}
        />
      </points>

      {/* Orbit Rings */}
      <mesh rotation={[Math.PI / 3, 0, 0.2]}>
        <torusGeometry args={[R * 1.25, 0.008, 8, 100]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={0.22} depthWrite={false} />
      </mesh>

      <mesh rotation={[-Math.PI / 4, 0.5, 0]}>
        <torusGeometry args={[R * 1.35, 0.005, 8, 100]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.18} depthWrite={false} />
      </mesh>

      {/* City Markers */}
      {cityVectors.map((city, idx) => (
        <CityMarker 
          key={`city-${idx}`} 
          name={city.name}
          position={city.vector} 
          color={city.color} 
          active={city.name.toLowerCase() === activeCity.toLowerCase()}
          onClick={() => {
            if (activeCity.toLowerCase() === city.name.toLowerCase()) {
              changeCity('None');
            } else {
              changeCity(city.name);
            }
          }}
        />
      ))}

      {/* Curved Data Links */}
      {cityLinks.map((link) => (
        <DataLink key={link.id} start={link.start} end={link.end} color={link.color} />
      ))}
    </group>
  );
};

export const CenterPanel: React.FC = () => {
  const { activeCity, changeCity, globeNodes } = useOSStore();
  const globeGroupRef = useRef<THREE.Group>(null);

  // Compute 3D vectors for cities
  const cityVectors = useMemo(() => {
    const R = 2;
    return globeNodes.map(c => ({
      ...c,
      vector: latLngToVector3(c.lat, c.lng, R),
    }));
  }, [globeNodes]);

  // Create links between consecutive cities to close a ring
  const cityLinks = useMemo(() => {
    const links = [];
    for (let i = 0; i < cityVectors.length; i++) {
      const startCity = cityVectors[i];
      const endCity = cityVectors[(i + 1) % cityVectors.length];
      links.push({
        id: `link-${i}`,
        start: startCity.vector,
        end: endCity.vector,
        color: startCity.color,
      });
    }
    return links;
  }, [cityVectors]);

  return (
    <div className="relative w-full h-[32rem] lg:h-full flex items-center justify-center overflow-hidden">
      {/* Background HUD graphics */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="absolute w-[360px] h-[360px] border border-cyber-cyan/10 rounded-full animate-pulse-slow" />
        <div className="absolute w-[440px] h-[440px] border border-cyber-purple/5 border-dashed rounded-full" />
        <div className="absolute w-[500px] h-[500px] border border-cyber-cyan/5 rounded-full" />
        
        <div className="absolute w-[540px] h-[1px] bg-gradient-to-r from-transparent via-cyber-cyan/25 to-transparent" />
        <div className="absolute h-[540px] w-[1px] bg-gradient-to-b from-transparent via-cyber-cyan/25 to-transparent" />
        
        <div className="absolute top-[15%] left-[15%] w-4 h-4 border-t border-l border-cyber-cyan/30" />
        <div className="absolute top-[15%] right-[15%] w-4 h-4 border-t border-r border-cyber-cyan/30" />
        <div className="absolute bottom-[15%] left-[15%] w-4 h-4 border-b border-l border-cyber-cyan/30" />
        <div className="absolute bottom-[15%] right-[15%] w-4 h-4 border-b border-r border-cyber-cyan/30" />
      </div>

      {/* Canvas */}
      <div className="canvas-container cursor-grab active:cursor-grabbing z-10">
        <Canvas 
          camera={{ position: [0, 0, 4.5], fov: 45 }}
          onPointerMissed={() => changeCity('None')}
        >
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1.5} />
          
          <HolographicGlobe 
            globeGroupRef={globeGroupRef}
            cityVectors={cityVectors}
            cityLinks={cityLinks}
            activeCity={activeCity}
            changeCity={changeCity}
          />
          
          <GlobeCameraController cityVectors={cityVectors} globeGroupRef={globeGroupRef} />
          
          <OrbitControls
            enableZoom={true}
            minDistance={3.5}
            maxDistance={8}
            enablePan={false}
            autoRotate={false}
          />
        </Canvas>
      </div>

      {/* Info Stats Floating Badges */}
      <div className="absolute bottom-4 left-6 z-20 flex flex-col gap-1 select-none font-orbitron">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-cyber-cyan animate-ping" />
          <span className="text-[10px] text-cyber-cyan tracking-widest uppercase">Orbital Node Linked</span>
        </div>
        <span className="text-[9px] text-white/45">LATENCY: 3ms // LOSS: 0.00%</span>
      </div>

      <div className="absolute bottom-4 right-6 z-20 flex flex-col gap-1.5 items-end select-none font-orbitron">
        <div className="flex items-center gap-2">
          {activeCity !== 'None' && activeCity !== '' && (
            <button 
              onClick={() => changeCity('None')}
              className="text-[8px] font-semibold border border-cyber-pink/40 bg-cyber-pink/5 hover:bg-cyber-pink/20 hover:border-cyber-pink hover:shadow-glow-pink px-1.5 py-0.5 rounded text-cyber-pink transition-all duration-200 cursor-pointer"
            >
              RELEASE FOCUS
            </button>
          )}
          <span className="text-[10px] text-cyber-purple tracking-widest uppercase">TARGET: {activeCity.toUpperCase()}</span>
        </div>
        <span className="text-[9px] text-white/45">GEOMETRY: VERTICES [1.5K] // FPS: 60</span>
      </div>
      
      <div className="absolute top-4 left-6 z-20 select-none font-orbitron">
        <span className="text-xxs text-white/30 tracking-widest block">RADAR GRID</span>
        <span className="text-xs text-white/70">GRID_SECTOR: L-5</span>
      </div>
    </div>
  );
};
