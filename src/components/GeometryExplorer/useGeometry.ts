// src/components/GeometryExplorer/useGeometry.ts
import { useState, useMemo } from 'react'
import type { GeometryItem } from './geometries'
import  { geometries } from './geometries'


export function useGeometry() {
  const memoizedGeometries = useMemo(() => geometries, [])

  const [selectedGeometry, setSelectedGeometry] = useState<GeometryItem>(memoizedGeometries[0])

  const selectGeometry = (name: string) => {
    const geo = memoizedGeometries.find(g => g.name === name)
    if (geo) setSelectedGeometry(geo)
  }

  return { selectedGeometry, memoizedGeometries, selectGeometry }
}
