import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { geometries, type GeometryItem } from './geometries'

// Función Sidebar
function Sidebar({
  geometries,
  selected,
  onSelect,
}: {
  geometries: GeometryItem[]
  selected: GeometryItem
  onSelect: (geom: GeometryItem) => void
}) {
  return (
    <div style={{ width: 200, background: '#222', color: '#fff', padding: 10 }}>
      <h3>Geometrías</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {geometries.map((g) => (
          <li key={g.name} style={{ margin: '5px 0' }}>
            <button
              style={{
                width: '100%',
                padding: '5px',
                background: selected.name === g.name ? '#555' : '#333',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
              }}
              onClick={() => onSelect(g)}
            >
              {g.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function GeometryExplorer() {
  const mountRef = useRef<HTMLDivElement | null>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const currentMeshRef = useRef<THREE.Mesh | null>(null)
  const animRef = useRef<number | null>(null)

  // Estados persistentes
  const [wireframe, setWireframe] = useState<boolean>(() => localStorage.getItem('wireframe') === 'true')
  const [autoRotate, setAutoRotate] = useState<boolean>(() => localStorage.getItem('autoRotate') !== 'false')
  const [selectedGeometry, setSelectedGeometry] = useState<GeometryItem>(geometries[0])

  // Refs espejo
  const wireframeRef = useRef(wireframe)
  const autoRotateRef = useRef(autoRotate)

  // Sync React -> Ref + localStorage
  useEffect(() => {
    wireframeRef.current = wireframe
    localStorage.setItem('wireframe', String(wireframe))
  }, [wireframe])

  useEffect(() => {
    autoRotateRef.current = autoRotate
    localStorage.setItem('autoRotate', String(autoRotate))
  }, [autoRotate])

  // Inicializar escena
  useEffect(() => {
    if (!mountRef.current) return

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0a0a0a)
    sceneRef.current = scene

    const { width, height } = mountRef.current.getBoundingClientRect()
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    camera.position.set(3, 2, 4)
    cameraRef.current = camera

    if (rendererRef.current) {
      rendererRef.current.dispose()
      if (mountRef.current.contains(rendererRef.current.domElement)) {
        mountRef.current.removeChild(rendererRef.current.domElement)
      }
    }
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(window.devicePixelRatio)
    rendererRef.current = renderer
    mountRef.current.appendChild(renderer.domElement)

    const ambient = new THREE.AmbientLight(0xffffff, 0.35)
    const dir = new THREE.DirectionalLight(0xffffff, 0.9)
    dir.position.set(5, 5, 5)
    scene.add(ambient, dir)

    // Mesh inicial
    const material = new THREE.MeshPhongMaterial({ color: '#44aa88', wireframe: wireframeRef.current })
    const mesh = new THREE.Mesh(selectedGeometry.geometry, material)
    currentMeshRef.current = mesh
    scene.add(mesh)

    // Helpers
    scene.add(new THREE.AxesHelper(2), new THREE.GridHelper(10, 10, 0x444444, 0x222222))

    // Animación
    const animate = () => {
      animRef.current = requestAnimationFrame(animate)
      if (autoRotateRef.current && currentMeshRef.current) {
        currentMeshRef.current.rotation.x += 0.01
        currentMeshRef.current.rotation.y += 0.015
      }
      renderer.render(scene, camera)
    }
    animate()

    const handleResize = () => {
      if (!mountRef.current) return
      const rect = mountRef.current.getBoundingClientRect()
      const w = rect.width || 800
      const h = rect.height || 600
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (animRef.current) cancelAnimationFrame(animRef.current)
      renderer.dispose()
      scene.clear()
    }
  }, [])

  // Cambiar geometría
  useEffect(() => {
    if (!sceneRef.current || !currentMeshRef.current) return
    const scene = sceneRef.current
    const oldMesh = currentMeshRef.current

    scene.remove(oldMesh)
    oldMesh.geometry.dispose()
    const material = oldMesh.material as THREE.MeshPhongMaterial
    const mesh = new THREE.Mesh(selectedGeometry.geometry, material)
    currentMeshRef.current = mesh
    scene.add(mesh)
  }, [selectedGeometry])

  // Wireframe dinámico
  useEffect(() => {
    const mesh = currentMeshRef.current
    if (!mesh) return
    const mat = mesh.material as THREE.MeshPhongMaterial
    mat.wireframe = wireframe
    mat.needsUpdate = true
  }, [wireframe])

  return (
    <div style={{ display: 'flex', width: '100%', height: '100vh' }}>
      <Sidebar geometries={geometries} selected={selectedGeometry} onSelect={setSelectedGeometry} />
      <div style={{ flex: 1, position: 'relative' }}>
        <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
        <div style={{ position: 'absolute', right: 12, top: 12, display: 'grid', gap: 8 }}>
          <button onClick={() => setAutoRotate(!autoRotate)}>
            {autoRotate ? '⏸️ Pausar Rotación' : '▶️ Reanudar Rotación'}
          </button>
          <button onClick={() => setWireframe(!wireframe)}>
            {wireframe ? '🔲 Sólido' : '🔳 Wireframe'}
          </button>
        </div>
      </div>
    </div>
  )
}
