import React, { useState, useRef } from "react";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet"; // Add Leaflet type import

// If using draw controls:
import { FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";

const DEFAULT_CENTER: [number, number] = [37.6683, -121.1958]; // your preferred center
const DEFAULT_ZOOM = 10;

export default function FieldsMap() {
  const [polygons, setPolygons] = useState<any[]>([]);
  const mapRef = useRef<L.Map | null>(null); // Now using properly imported L namespace

  const onCreated = async (e: any) => {
    // 'e' is the event returned from react-leaflet-draw
    // it has the geometry under e.layer._latlngs
    const layer = e.layer;
    const geoJson = layer.toGeoJSON();

    // The geoJson structure is usually something like:
    // {
    //    type: "Feature",
    //    properties: {},
    //    geometry: {
    //       type: "Polygon",
    //       coordinates: [...]
    //    }
    // }

    // Convert them into the form { lon, lat } as required by the API (note the order!)
    // The standard Leaflet latlng is [lat, lng], but the Agro API expects [lon, lat].
    // If you are using a simple polygon (no holes), geoJson.geometry.coordinates[0]
    // is your main ring.

    const coordinates = geoJson.geometry.coordinates[0];

    // Prepare body for the Agromonitoring polygons API
    const body = {
      name: "My Field", // or get the name from a form
      geo_json: {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Polygon",
          coordinates: [coordinates], // ensure it's an array-of-arrays structure
        },
      },
    };

    // Call our Next.js API route to create the polygon on Agromonitoring
    try {
      const response = await fetch("/api/polygons/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("Failed to create polygon");
      }

      const data = await response.json();
      console.log("Polygon created on Agro API: ", data);
      alert(`Polygon created with ID: ${data.id}`);

      // Optionally store in React state or anywhere else
      setPolygons((prev) => [...prev, data]);
    } catch (err) {
      console.error(err);
      alert("Error creating polygon!");
    }
  };

  return (
    <MapContainer
      ref={(map) => {
        mapRef.current = map;
        if (map) {
          map.setView(DEFAULT_CENTER, DEFAULT_ZOOM);
        }
      }}
      style={{ height: "100%", width: "100%" }}
    >
      {/* Standard basemap (OpenStreetMap) */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* We wrap in a FeatureGroup so the draw controls know where to place new shapes */}
      <FeatureGroup>
        <EditControl
          position="topright"
          draw={{
            circle: false,
            marker: false,
            circlemarker: false,
            polyline: false,
            rectangle: false,
          }}
          onCreated={onCreated}
        />
      </FeatureGroup>
    </MapContainer>
  );
}
