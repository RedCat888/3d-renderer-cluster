import { useRef, useMemo, Suspense, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF, TransformControls } from '@react-three/drei'
import type { Mesh, Group } from 'three'
import type { SceneObject as SceneObjectType } from '../types'
import { useStore } from '../store'

interface Props {
  obj: SceneObjectType
}

function GeometryFromType({ type, args }: { type: string; args?: number[] }) {
  switch (type) {
    case 'torusKnot':
      return <torusKnotGeometry args={(args as [number, number, number, number]) ?? [0.8, 0.3, 128, 32]} />
    case 'sphere':
      return <sphereGeometry args={(args as [number, number, number]) ?? [0.7, 64, 64]} />
    case 'box':
      return <boxGeometry args={(args as [number, number, number]) ?? [1, 1, 1]} />
    case 'icosahedron':
      return <icosahedronGeometry args={(args as [number, number]) ?? [0.7, 0]} />
    case 'dodecahedron':
      return <dodecahedronGeometry args={(args as [number, number]) ?? [0.6, 0]} />
    case 'cylinder':
      return <cylinderGeometry args={(args as [number, number, number, number]) ?? [0.5, 0.5, 1.5, 32]} />
    case 'cone':
      return <coneGeometry args={(args as [number, number, number]) ?? [0.5, 1, 32]} />
    case 'torus':
      return <torusGeometry args={(args as [number, number, number, number]) ?? [0.6, 0.2, 32, 64]} />
    case 'octahedron':
      return <octahedronGeometry args={(args as [number, number]) ?? [0.6, 0]} />
    case 'capsule':
      return <capsuleGeometry args={(args as [number, number, number, number]) ?? [0.4, 0.8, 16, 32]} />
    case 'ring':
      return <ringGeometry args={(args as [number, number, number]) ?? [0.3, 0.7, 32]} />
    default:
      return <boxGeometry args={[1, 1, 1]} />
  }
}

function ObjectGizmo({ meshRef, objId }: { meshRef: React.RefObject<Mesh | Group | null>; objId: string }) {
  const transformMode = useStore((s) => s.transformMode)
  const updateObject = useStore((s) => s.updateObject)
  const controlsRef = useRef<any>(null)

  useEffect(() => {
    if (!controlsRef.current) return
    const ctrl = controlsRef.current

    const onDrag = () => {
      const target = ctrl.object
      if (!target) return
      updateObject(objId, {
        position: [target.position.x, target.position.y, target.position.z],
        rotation: [target.rotation.x, target.rotation.y, target.rotation.z],
        scale: [target.scale.x, target.scale.y, target.scale.z],
      })
    }

    ctrl.addEventListener('objectChange', onDrag)
    return () => ctrl.removeEventListener('objectChange', onDrag)
  }, [objId, updateObject])

  if (!meshRef.current) return null

  return (
    <TransformControls
      ref={controlsRef}
      object={meshRef.current}
      mode={transformMode}
      size={0.6}
    />
  )
}

function GLBModel({ url, obj }: { url: string; obj: SceneObjectType }) {
  const groupRef = useRef<Group>(null)
  const { scene } = useGLTF(url)
  const selectedId = useStore((s) => s.selectedObjectId)
  const selectObject = useStore((s) => s.selectObject)
  const animationPlaying = useStore((s) => s.animationPlaying)
  const globalSpeed = useStore((s) => s.animationSpeed)
  const isSelected = selectedId === obj.id
  const initialY = useMemo(() => obj.position[1], [obj.id])

  const clonedScene = useMemo(() => {
    const clone = scene.clone(true)
    clone.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = obj.castShadow
        child.receiveShadow = obj.receiveShadow
      }
    })
    return clone
  }, [scene, obj.castShadow, obj.receiveShadow])

  useFrame((_, delta) => {
    if (!groupRef.current || !animationPlaying) return
    const speed = obj.animationSpeed * globalSpeed
    switch (obj.animationType) {
      case 'rotate':
        groupRef.current.rotation.y += delta * speed
        break
      case 'float':
        groupRef.current.position.y = initialY + Math.sin(Date.now() * 0.001 * speed) * 0.3
        break
      case 'pulse': {
        const s = 1 + Math.sin(Date.now() * 0.002 * speed) * 0.08
        groupRef.current.scale.setScalar(s)
        break
      }
    }
  })

  return (
    <>
      <group
        ref={groupRef}
        position={obj.position}
        rotation={obj.rotation}
        scale={obj.scale}
        onClick={(e) => {
          e.stopPropagation()
          selectObject(obj.id)
        }}
      >
        <primitive object={clonedScene} />
      </group>
      {isSelected && groupRef.current && (
        <ObjectGizmo meshRef={groupRef} objId={obj.id} />
      )}
    </>
  )
}

function GLBModelFallback() {
  return (
    <mesh>
      <boxGeometry args={[0.3, 0.3, 0.3]} />
      <meshStandardMaterial color="#6366f1" wireframe />
    </mesh>
  )
}

export function SceneObjectMesh({ obj }: Props) {
  const meshRef = useRef<Mesh>(null)
  const selectedId = useStore((s) => s.selectedObjectId)
  const selectObject = useStore((s) => s.selectObject)
  const animationPlaying = useStore((s) => s.animationPlaying)
  const globalSpeed = useStore((s) => s.animationSpeed)
  const isSelected = selectedId === obj.id

  const initialY = useMemo(() => obj.position[1], [obj.id])

  useFrame((_, delta) => {
    if (!meshRef.current || !animationPlaying || obj.type === 'model') return
    const speed = obj.animationSpeed * globalSpeed

    switch (obj.animationType) {
      case 'rotate':
        meshRef.current.rotation.y += delta * speed
        break
      case 'float':
        meshRef.current.position.y =
          initialY + Math.sin(Date.now() * 0.001 * speed) * 0.3
        break
      case 'pulse': {
        const s = 1 + Math.sin(Date.now() * 0.002 * speed) * 0.08
        meshRef.current.scale.setScalar(s)
        break
      }
    }
  })

  if (!obj.visible) return null

  if (obj.type === 'model' && obj.modelUrl) {
    return (
      <Suspense fallback={<GLBModelFallback />}>
        <GLBModel url={obj.modelUrl} obj={obj} />
      </Suspense>
    )
  }

  const mat = obj.material

  return (
    <>
      <mesh
        ref={meshRef}
        position={obj.position}
        rotation={obj.rotation}
        scale={obj.scale}
        castShadow={obj.castShadow}
        receiveShadow={obj.receiveShadow}
        onClick={(e) => {
          e.stopPropagation()
          selectObject(obj.id)
        }}
      >
        <GeometryFromType type={obj.type} args={obj.geometryArgs} />
        {mat.transmission > 0 ? (
          <meshPhysicalMaterial
            color={mat.color}
            metalness={mat.metalness}
            roughness={mat.roughness}
            emissive={mat.emissive}
            emissiveIntensity={mat.emissiveIntensity}
            opacity={mat.opacity}
            transparent={mat.transparent || mat.opacity < 1 || mat.transmission > 0}
            wireframe={mat.wireframe}
            transmission={mat.transmission}
            ior={mat.ior}
            thickness={mat.thickness}
            clearcoat={mat.clearcoat}
            clearcoatRoughness={mat.clearcoatRoughness}
            envMapIntensity={mat.envMapIntensity}
            toneMapped={mat.emissiveIntensity <= 1}
          />
        ) : (
          <meshPhysicalMaterial
            color={mat.color}
            metalness={mat.metalness}
            roughness={mat.roughness}
            emissive={mat.emissive}
            emissiveIntensity={mat.emissiveIntensity}
            opacity={mat.opacity}
            transparent={mat.transparent || mat.opacity < 1}
            wireframe={mat.wireframe}
            clearcoat={mat.clearcoat}
            clearcoatRoughness={mat.clearcoatRoughness}
            envMapIntensity={mat.envMapIntensity}
            toneMapped={mat.emissiveIntensity <= 1}
          />
        )}

        {isSelected && (
          <mesh scale={[1.04, 1.04, 1.04]}>
            <GeometryFromType type={obj.type} args={obj.geometryArgs} />
            <meshBasicMaterial color="#6366f1" wireframe transparent opacity={0.3} />
          </mesh>
        )}
      </mesh>

      {isSelected && meshRef.current && (
        <ObjectGizmo meshRef={meshRef} objId={obj.id} />
      )}
    </>
  )
}
