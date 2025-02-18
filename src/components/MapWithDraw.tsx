'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const FeatureGroup = dynamic(() => import('react-leaflet').then(mod => mod.FeatureGroup), { ssr: false });
const EditControl = dynamic(() => import('react-leaflet-draw').then(mod => mod.EditControl), { ssr: false });

const MapWithDraw = () => {
  const [polygonId, setPolygonId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const L = require('leaflet');
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
        iconUrl: require('leaflet/dist/images/marker-icon.png'),
        shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
      });
    }
  }, []);


  const handleCreated = async (e: any) => {
    const { layer } = e;
    const geoJson = layer.toGeoJSON();

    const body = {
      name: 'Farmer Field',
      geo_json: geoJson,
    };

    try {
      const response = await fetch('/api/create-polygon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (data.id) {
        setPolygonId(data.id);
        alert(`Polygon created with ID: ${data.id}`);
      } else {
        alert('Error creating polygon');
      }
    } catch (error) {
      console.error(error);
      alert('Error creating polygon');
    }
  };

  return (
    <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      <FeatureGroup>
        <EditControl
          position="topright"
          onCreated={handleCreated}
          draw={{
            rectangle: false,
            circle: false,
            polyline: false,
            circlemarker: false,
          }}
        />
      </FeatureGroup>
    </MapContainer>
  );
};

export default MapWithDraw;
