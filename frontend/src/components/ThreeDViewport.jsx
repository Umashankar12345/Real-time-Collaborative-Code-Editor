import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, TransformControls, Environment, Grid, Html } from '@react-three/drei';
import { Maximize, RotateCcw, Box, Eye, Focus, MousePointer2, Move, Rotate3D, Scaling, Grid as GridIcon } from 'lucide-react';
import * as THREE from 'three';

const SceneStats = () => {
  const { scene, gl } = useThree();
  const [stats, setStats] = useState({ objects: 0, vertices: 0, triangles: 0, fps: 0 });
  const frames = useRef(0);
  const prevTime = useRef(performance.now());

  useFrame(() => {
    frames.current++;
    const time = performance.now();
    if (time >= prevTime.current + 1000) {
      let objects = 0;
      let vertices = 0;
      let triangles = 0;

      scene.traverse((object) => {
        if (object.isMesh) {
          objects++;
          if (object.geometry) {
            vertices += object.geometry.attributes.position.count;
            if (object.geometry.index) {
              triangles += object.geometry.index.count / 3;
            } else {
              triangles += object.geometry.attributes.position.count / 3;
            }
          }
        }
      });

      setStats({
        objects,
        vertices,
        triangles,
        fps: Math.round((frames.current * 1000) / (time - prevTime.current))
      });

      frames.current = 0;
      prevTime.current = time;
    }
  });

  return (
    <Html position={[-4, 3, 0]} className="select-none pointer-events-none">
      <div className="bg-[#1e1e1e]/90 text-[#cccccc] text-xs p-3 rounded-md border border-[#3b3b3b] shadow-lg whitespace-nowrap min-w-[120px] backdrop-blur-sm font-mono leading-relaxed">
        <div className="font-bold text-white mb-1 border-b border-[#3b3b3b] pb-1">Scene Info</div>
        <div>Objects: <span className="text-[#007acc]">{stats.objects}</span></div>
        <div>Vertices: <span className="text-[#007acc]">{stats.vertices}</span></div>
        <div>Triangles: <span className="text-[#007acc]">{stats.triangles}</span></div>
        <div>FPS: <span className="text-[#89d185]">{stats.fps}</span></div>
      </div>
    </Html>
  );
};

const InteractiveMesh = ({ position, geometry, color, name, isSelected, onClick, wireframe }) => {
  const meshRef = useRef();
  return (
    <mesh
      ref={meshRef}
      position={position}
      castShadow
      receiveShadow
      onClick={(e) => {
        e.stopPropagation();
        onClick(name);
      }}
    >
      <primitive object={geometry} attach="geometry" />
      <meshStandardMaterial 
        color={isSelected ? '#4fb1f7' : color} 
        wireframe={wireframe}
        roughness={0.2}
        metalness={0.8}
        emissive={isSelected ? '#1e3a5f' : '#000000'}
      />
    </mesh>
  );
};

const ThreeDViewport = () => {
  const [selectedObj, setSelectedObj] = useState(null);
  const [transformMode, setTransformMode] = useState('translate'); // translate, rotate, scale
  const [showWireframe, setShowWireframe] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const orbitControlsRef = useRef();
  
  const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
  const sphereGeometry = new THREE.SphereGeometry(0.7, 32, 32);
  const cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1.5, 32);

  const handleResetCamera = () => {
    if (orbitControlsRef.current) {
      orbitControlsRef.current.reset();
    }
  };

  const handleFullscreen = () => {
    const elem = document.getElementById('threed-container');
    if (elem) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        elem.requestFullscreen();
      }
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#1e1e1e]" id="threed-container">
      {/* 3D Viewport Toolbar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#252526] border-b border-[#3b3b3b] shadow-sm select-none shrink-0">
        <div className="flex items-center gap-1 bg-[#333333] p-0.5 rounded border border-[#3b3b3b]">
          <button 
            className={`p-1 rounded flex items-center justify-center transition-colors ${!selectedObj ? 'bg-[#007acc] text-white' : 'text-[#cccccc] hover:bg-[#454545]'}`}
            onClick={() => setSelectedObj(null)}
            title="Select Mode"
          >
            <MousePointer2 size={14} />
          </button>
          <div className="w-px h-4 bg-[#454545] mx-1"></div>
          <button 
            className={`p-1 rounded flex items-center justify-center transition-colors ${transformMode === 'translate' && selectedObj ? 'bg-[#007acc] text-white' : 'text-[#cccccc] hover:bg-[#454545]'}`}
            onClick={() => { if(selectedObj) setTransformMode('translate'); }}
            disabled={!selectedObj}
            title="Move (W)"
          >
            <Move size={14} />
          </button>
          <button 
            className={`p-1 rounded flex items-center justify-center transition-colors ${transformMode === 'rotate' && selectedObj ? 'bg-[#007acc] text-white' : 'text-[#cccccc] hover:bg-[#454545]'}`}
            onClick={() => { if(selectedObj) setTransformMode('rotate'); }}
            disabled={!selectedObj}
            title="Rotate (E)"
          >
            <Rotate3D size={14} />
          </button>
          <button 
            className={`p-1 rounded flex items-center justify-center transition-colors ${transformMode === 'scale' && selectedObj ? 'bg-[#007acc] text-white' : 'text-[#cccccc] hover:bg-[#454545]'}`}
            onClick={() => { if(selectedObj) setTransformMode('scale'); }}
            disabled={!selectedObj}
            title="Scale (R)"
          >
            <Scaling size={14} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-[#333333] p-0.5 rounded border border-[#3b3b3b]">
            <button 
              className={`p-1 rounded flex items-center justify-center transition-colors ${showGrid ? 'bg-[#454545] text-white' : 'text-[#cccccc] hover:bg-[#454545]'}`}
              onClick={() => setShowGrid(!showGrid)}
              title="Toggle Grid"
            >
              <GridIcon size={14} />
            </button>
            <button 
              className={`p-1 rounded flex items-center justify-center transition-colors ${showWireframe ? 'bg-[#454545] text-white' : 'text-[#cccccc] hover:bg-[#454545]'}`}
              onClick={() => setShowWireframe(!showWireframe)}
              title="Toggle Wireframe"
            >
              <Box size={14} />
            </button>
          </div>
          
          <button 
            onClick={handleResetCamera} 
            className="p-1 text-[#cccccc] hover:bg-[#333333] hover:text-white rounded transition-colors border border-transparent hover:border-[#454545]"
            title="Reset Camera"
          >
            <RotateCcw size={14} />
          </button>
          <button 
            onClick={handleFullscreen} 
            className="p-1 text-[#cccccc] hover:bg-[#333333] hover:text-white rounded transition-colors border border-transparent hover:border-[#454545]"
            title="Fullscreen"
          >
            <Maximize size={14} />
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 relative bg-[#1e1e1e]">
        <Canvas shadows camera={{ position: [5, 5, 5], fov: 50 }} onPointerMissed={() => setSelectedObj(null)}>
          <color attach="background" args={['#1e1e1e']} />
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[5, 10, 5]}
            intensity={1.5}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <Environment preset="city" />

          <SceneStats />

          {showGrid && (
            <Grid 
              infiniteGrid 
              fadeDistance={50} 
              cellColor="#444444" 
              sectionColor="#666666"
              sectionSize={1}
              cellSize={0.2}
            />
          )}

          <group position={[0, 0, 0]}>
            <InteractiveMesh 
              name="cube"
              position={[-2, 0.5, 0]} 
              geometry={cubeGeometry} 
              color="#e63946" 
              isSelected={selectedObj === 'cube'}
              onClick={setSelectedObj}
              wireframe={showWireframe}
            />
            {selectedObj === 'cube' && (
              <TransformControls object={scene => scene.getObjectByName('cube')} mode={transformMode} />
            )}

            <InteractiveMesh 
              name="sphere"
              position={[0, 0.7, 0]} 
              geometry={sphereGeometry} 
              color="#a8dadc" 
              isSelected={selectedObj === 'sphere'}
              onClick={setSelectedObj}
              wireframe={showWireframe}
            />
            {selectedObj === 'sphere' && (
              <TransformControls object={scene => scene.getObjectByName('sphere')} mode={transformMode} />
            )}

            <InteractiveMesh 
              name="cylinder"
              position={[2, 0.75, 0]} 
              geometry={cylinderGeometry} 
              color="#457b9d" 
              isSelected={selectedObj === 'cylinder'}
              onClick={setSelectedObj}
              wireframe={showWireframe}
            />
            {selectedObj === 'cylinder' && (
              <TransformControls object={scene => scene.getObjectByName('cylinder')} mode={transformMode} />
            )}
          </group>

          <OrbitControls 
            ref={orbitControlsRef} 
            makeDefault 
            enableDamping 
            dampingFactor={0.05} 
          />
        </Canvas>
      </div>
    </div>
  );
};

export default ThreeDViewport;
