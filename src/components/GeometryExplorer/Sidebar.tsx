import React from 'react'
import type { GeometryItem } from './geometries'

interface SidebarProps {
  geometries: GeometryItem[]
  selected: GeometryItem
  onSelect: (geom: GeometryItem) => void
}

export default function Sidebar({ geometries, selected, onSelect }: SidebarProps) {
  return (
    <div style={{ width: 200, background: '#222', color: '#fff', padding: 10 }}>
      <h3>Geometrías</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {geometries.map(g => (
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
