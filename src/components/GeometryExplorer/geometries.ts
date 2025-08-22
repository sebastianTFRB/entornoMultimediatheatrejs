// src/components/GeometryExplorer/geometries.ts
import * as THREE from 'three'

export interface GeometryItem {
  name: string
  geometry: THREE.BufferGeometry
}

export const geometries: GeometryItem[] = [
  { name: 'Box', geometry: new THREE.BoxGeometry(1, 1, 1) },
  { name: 'Sphere', geometry: new THREE.SphereGeometry(0.75, 32, 32) },
  { name: 'Cone', geometry: new THREE.ConeGeometry(0.5, 1, 32) },
  { name: 'Cylinder', geometry: new THREE.CylinderGeometry(0.5, 0.5, 1, 32) },
  { name: 'Torus', geometry: new THREE.TorusGeometry(0.5, 0.2, 16, 100) },
  { name: 'TorusKnot', geometry: new THREE.TorusKnotGeometry(0.4, 0.1, 100, 16) },
  { name: 'Dodecahedron', geometry: new THREE.DodecahedronGeometry(0.5) },
  { name: 'Icosahedron', geometry: new THREE.IcosahedronGeometry(0.5) },
]
