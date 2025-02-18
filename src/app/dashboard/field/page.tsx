"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useRef } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  TrashIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "@heroicons/react/20/solid";
import { Suspense } from "react";

interface ImageryItem {
  id: string;
  date: number;
  stats: {
    ndvi: NDVIStats;
  };
  tileUrl: string;
}

interface PolygonData {
  id: string;
  name: string;
  area: number;
  center: [number, number];
  geo_json: {
    geometry: {
      coordinates: number[][][];
    };
  };
  ndvi?: NDVIStats;
}

interface NDVIStats {
  mean: number;
  min: number;
  max: number;
  median: number;
}

interface NDVIEntry {
  dt: number;
  source: string;
  data: {
    mean: number;
    min: number;
    max: number;
    std: number;
  };
}

// Map configuration
const LAT_LNG_BOUNDS = [
  [42.25, 69.5], // Shymkent coordinates
  [42.35, 69.7],
];
const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
const BASE_SATELLITE_URL = `https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.webp?sku=101ZkhblCYvTC&access_token=${MAPBOX_ACCESS_TOKEN}`;

// Dynamic imports
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  {
    ssr: false,
    loading: () => <div className="map-loading">Loading map...</div>,
  }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const FeatureGroup = dynamic(
  () => import("react-leaflet").then((mod) => mod.FeatureGroup),
  { ssr: false }
);
const EditControl = dynamic(
  () => import("react-leaflet-draw").then((mod) => mod.EditControl),
  { ssr: false }
);

// Add this new component before the FieldPage component
const ImageryCard = ({ imagery }: { imagery: ImageryItem }) => (
  <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-gray-200">
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-lg font-semibold">
        {new Date(imagery.date).toLocaleDateString()}
      </h3>
      <span className="text-sm text-gray-500">
        {imagery.tileUrl.includes("s2") ? "Sentinel-2" : "Landsat-8"}
      </span>
    </div>
    <div className="grid grid-cols-2 gap-2">
      <StatBox label="Mean" value={imagery.stats.ndvi?.mean} />
      <StatBox label="Min" value={imagery.stats.ndvi?.min} />
      <StatBox label="Max" value={imagery.stats.ndvi?.max} />
      <StatBox label="Median" value={imagery.stats.ndvi?.median} />
    </div>
  </div>
);

// Helper component for stats display
const StatBox = ({ label, value }: { label: string; value?: number }) => (
  <div className="bg-gray-50 p-2 rounded-lg">
    <p className="text-xs text-gray-600 mb-1">{label}</p>
    <p className="text-sm font-mono text-gray-800">
      {value?.toFixed(3) || "-"}
    </p>
  </div>
);

export default function FieldPage() {
  const mapRef = useRef<any>(null);
  const [polygons, setPolygons] = useState<PolygonData[]>([]);
  const [selectedPolygonId, setSelectedPolygonId] = useState<string | null>(
    null
  );
  const [polygonData, setPolygonData] = useState<PolygonData | null>(null);
  const [satelliteLayer, setSatelliteLayer] = useState<boolean>(false);
  const [imageryList, setImageryList] = useState<ImageryItem[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [currentTileUrl, setCurrentTileUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState({
    polygon: false,
    imagery: false,
  });
  const [viewMode, setViewMode] = useState<"NDVI" | "SATELLITE">("NDVI");
  const [drawnLayer, setDrawnLayer] = useState<any>(null);
  const [newPolygonName, setNewPolygonName] = useState("My Field");
  const [availableNDVIDates, setAvailableNDVIDates] = useState<Date[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [selectedNDVIData, setSelectedNDVIData] = useState<NDVIEntry | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  // Leaflet icon fix
  useEffect(() => {
    if (typeof window !== "undefined") {
      const L = require("leaflet");
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
        iconUrl: require("leaflet/dist/images/marker-icon.png"),
        shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
      });
    }
  }, []);

  useEffect(() => {
    setIsClient(true);
    // Initialize with current date in client's timezone
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    setSelectedDate(now.toISOString().split("T")[0]);
  }, []);

  // Add date navigation functionality
  const handleDateChange = (days: number) => {
    const newDate = new Date(selectedDate || "");
    newDate.setDate(newDate.getDate() + days);

    // Prevent dates in the future
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (newDate > today) return;

    setSelectedDate(newDate.toISOString().split("T")[0]);
  };

  // Fetch existing polygons on mount
  useEffect(() => {
    const fetchPolygons = async () => {
      try {
        const res = await fetch(
          `https://api.agromonitoring.com/agro/1.0/polygons?appid=${process.env.NEXT_PUBLIC_AGROMONITORING_API_KEY}`
        );
        const data = await res.json();
        setPolygons(data);

        // Auto-select first polygon if available
        if (data.length > 0 && mapRef.current) {
          handlePolygonSelect(data[0].id);
        }
      } catch (error) {
        console.error("Error fetching polygons:", error);
      }
    };
    fetchPolygons();
  }, []);

  // Fetch NDVI stats for selected imagery
  const fetchNDVIStats = async (statsUrl: string) => {
    try {
      const res = await fetch(statsUrl);
      return await res.json();
    } catch (error) {
      console.error("Error fetching NDVI stats:", error);
      return null;
    }
  };

  // Updated imagery search handler
  const handleSearchImagery = async () => {
    if (!polygonData?.id || !selectedDate) return;

    try {
      setLoading((prev) => ({ ...prev, imagery: true }));
      setImageryList([]);

      // Use UTC dates for API requests
      const startDate = new Date(selectedDate + "T00:00:00Z");
      let endDate = new Date(selectedDate + "T23:59:59.999Z");

      // Ensure end date doesn't exceed current time
      const now = new Date();
      if (endDate > now) endDate = now;

      const response = await fetch(
        `https://api.agromonitoring.com/agro/1.0/image/search?polyid=${
          polygonData.id
        }&start=${Math.floor(startDate.getTime() / 1000)}&end=${Math.floor(
          endDate.getTime() / 1000
        )}&appid=${
          process.env.NEXT_PUBLIC_AGROMONITORING_API_KEY
        }&clouds_max=20&resolution_min=10`
      );

      // Handle 400 errors more gracefully
      if (response.status === 400) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Invalid search parameters");
      }

      const data = await response.json();

      if (!data.length) {
        setImageryList([]);
        alert(
          "No satellite imagery found for the selected date. Try expanding the date range."
        );
        return;
      }

      // Fetch all vegetation indices stats
      const imageryWithStats = await Promise.all(
        data.map(async (item: any) => {
          const stats = await Promise.all(
            Object.entries(item.stats).map(async ([index, url]) => {
              const res = await fetch(url);
              return { [index]: await res.json() };
            })
          );

          return {
            ...item,
            stats: Object.assign({}, ...stats),
            tileUrl: item.tile.ndvi.replace(
              "{z}/{x}/{y}",
              "{z}/{x}/{y}?paletteid=1"
            ),
          };
        })
      );

      setImageryList(imageryWithStats);

      // Automatically show latest NDVI tile
      if (imageryWithStats.length > 0) {
        setCurrentTileUrl(imageryWithStats[0].tile.ndvi);
      }
    } catch (error) {
      console.error("Imagery search error:", error);
    } finally {
      setLoading((prev) => ({ ...prev, imagery: false }));
    }
  };

  // Update date handling
  useEffect(() => {
    if (polygonData?.id) {
      handleSearchImagery();
    }
  }, [selectedDate, polygonData?.id]);

  const handlePolygonCreated = (e: any) => {
    const { layer } = e;
    const geoJson = layer.toGeoJSON();
    const coordinates = geoJson.geometry.coordinates[0];

    // Validate polygon closure
    if (coordinates[0].join() !== coordinates[coordinates.length - 1].join()) {
      alert("Polygon must be closed properly");
      return;
    }

    // Store drawn layer and show name input
    setDrawnLayer(layer);
    setLoading((prev) => ({ ...prev, polygon: true }));
  };

  const confirmPolygonCreation = async () => {
    if (!drawnLayer) return;

    try {
      const geoJson = drawnLayer.toGeoJSON();
      // Ensure coordinates are in [lon, lat] order per API requirements
      const coordinates = geoJson.geometry.coordinates[0].map(
        ([lat, lng]: [number, number]) => [lng, lat]
      );

      const response = await fetch(
        `https://api.agromonitoring.com/agro/1.0/polygons?appid=${process.env.NEXT_PUBLIC_AGROMONITORING_API_KEY}&duplicated=true`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: newPolygonName,
            geo_json: {
              type: "Feature",
              properties: {},
              geometry: {
                type: "Polygon",
                coordinates: [coordinates], // Support polygons with holes
              },
            },
          }),
        }
      );

      const data = await response.json();
      setPolygonData({
        id: data.id,
        name: newPolygonName,
        area: data.area,
        center: data.center,
        geo_json: data.geo_json,
      });
      setPolygons((prev) => [...prev, data]);
    } catch (error) {
      console.error("Polygon creation error:", error);
      alert(error instanceof Error ? error.message : "Unknown error occurred");
    } finally {
      setDrawnLayer(null);
      setLoading((prev) => ({ ...prev, polygon: false }));
    }
  };

  // Updated visualization component
  const NDVISummary = ({ data }: { data: NDVIEntry }) => (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2">
        {new Date(data.dt * 1000).toLocaleDateString()}
      </h3>
      <div className="space-y-1">
        <p>Satellite: {data.source?.toUpperCase()}</p>
        <p>Mean NDVI: {data.data.mean.toFixed(3)}</p>
        <p>
          Range: {data.data.min.toFixed(3)} - {data.data.max.toFixed(3)}
        </p>
      </div>
    </div>
  );

  // Modified fetch function with loading states
  const fetchNDVIDates = async (polygonId: string) => {
    setIsLoading(true);
    try {
      // Add validation for polygon existence
      const polyCheck = await fetch(
        `https://api.agromonitoring.com/agro/1.0/polygons/${polygonId}?appid=${process.env.NEXT_PUBLIC_AGROMONITORING_API_KEY}`
      );

      if (!polyCheck.ok) {
        throw new Error("Polygon does not exist or was deleted");
      }

      console.log(
        "Using API Key:",
        process.env.NEXT_PUBLIC_AGROMONITORING_API_KEY?.slice(0, 6) + "..."
      );

      // Validate polygon ID format first
      if (!/^[0-9a-fA-F]{24}$/.test(polygonId)) {
        throw new Error("Invalid polygon ID format (24-character hex string)");
      }

      // Get current time in UTC with 1 second buffer
      const now = new Date();
      const endDate = new Date(
        Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate(),
          now.getUTCHours(),
          now.getUTCMinutes(),
          now.getUTCSeconds() - 1 // Ensure end is always in past
        )
      );

      // Set start date to 364 days ago (maintains 1 year window across timezones)
      const startDate = new Date(endDate);
      startDate.setUTCDate(startDate.getUTCDate() - 364);
      startDate.setUTCHours(0, 0, 0, 0);

      const apiUrl = new URL(
        "https://api.agromonitoring.com/agro/1.0/ndvi/history"
      );
      apiUrl.searchParams.append("polyid", polygonId);
      apiUrl.searchParams.append(
        "start",
        Math.floor(startDate.getTime() / 1000).toString()
      );
      apiUrl.searchParams.append(
        "end",
        Math.floor(endDate.getTime() / 1000).toString()
      );
      apiUrl.searchParams.append(
        "appid",
        process.env.NEXT_PUBLIC_AGROMONITORING_API_KEY!
      );
      apiUrl.searchParams.append("type", "s2");
      apiUrl.searchParams.append("zoom", "13");
      apiUrl.searchParams.append("coverage_min", "10"); // Require at least 10% coverage

      const response = await fetch(apiUrl.toString());

      // Handle API-specific error formats
      if (response.status === 404) {
        throw new Error(
          "NDVI history endpoint not found - check API permissions"
        );
      }

      if (response.status === 403) {
        throw new Error("API key does not have NDVI history access");
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Handle empty dataset with corporate account notice
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error(
          "No NDVI data found. Possible reasons:\n" +
            "- New polygon (takes 2-5 days to process)\n" +
            "- Corporate account required for archive data\n" +
            "- Cloud coverage exceeded threshold"
        );
      }

      // Filter valid entries and sort by date
      const validEntries = data.filter(
        (item: any) => item?.dt && item?.data?.mean !== undefined
      );

      if (validEntries.length === 0) {
        throw new Error("No valid NDVI entries found in response");
      }

      const uniqueDates = Array.from(
        new Set(validEntries.map((item: any) => item.dt * 1000))
      ).sort((a, b) => b - a) as number[];

      setAvailableNDVIDates(uniqueDates.map((ts) => new Date(ts)));

      // After setting availableNDVIDates
      if (uniqueDates.length > 0) {
        const latestTimestamp = Math.floor(uniqueDates[0] / 1000);
        const latestData = await fetchNDVIData(
          polygonId,
          new Date(latestTimestamp * 1000)
        );
        if (latestData) setSelectedNDVIData(latestData);
      }

      console.log("API Response:", {
        requestUrl: apiUrl.toString(),
        responseData: data,
        validEntriesCount: validEntries.length,
      });
    } catch (error) {
      console.error("NDVI fetch error:", error);
      alert(
        error.message ||
          `Failed to load NDVI history. Please verify:\n` +
            `1. Polygon exists and is valid\n` +
            `2. Date range is within last 5 years\n` +
            `3. API key has correct permissions`
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Update polygon selection handler to fetch NDVI dates
  const handlePolygonSelect = async (id: string) => {
    setSelectedPolygonId(id);
    try {
      const [polyRes, ndviDatesPromise] = await Promise.all([
        fetch(
          `https://api.agromonitoring.com/agro/1.0/polygons/${id}?appid=${process.env.NEXT_PUBLIC_AGROMONITORING_API_KEY}`
        ),
        fetchNDVIDates(id),
      ]);

      const polyData = await polyRes.json();
      const ndviData = await ndviDatesPromise;

      // Update map view with proper coordinate order
      if (mapRef.current && polyData.geo_json) {
        const L = await import("leaflet");
        const coords = polyData.geo_json.geometry.coordinates[0];
        const bounds = L.latLngBounds(
          coords.map(([lng, lat]: [number, number]) => L.latLng(lat, lng))
        );
        mapRef.current.flyToBounds(bounds, {
          padding: [50, 50],
          duration: 1,
        });
      }

      // Safely update polygon data with optional chaining
      setPolygonData({
        ...polyData,
        ndvi: ndviData?.[0]?.data?.mean, // Updated path to NDVI value
      });
    } catch (error) {
      console.error("Polygon fetch error:", error);
      alert("Failed to load polygon details. Please try again.");
    }
  };

  // Add polygon deletion functionality
  const deletePolygon = async (id: string) => {
    try {
      await fetch(
        `https://api.agromonitoring.com/agro/1.0/polygons/${id}?appid=${process.env.NEXT_PUBLIC_AGROMONITORING_API_KEY}`,
        { method: "DELETE" }
      );
      setPolygons(polygons.filter((p) => p.id !== id));
      if (selectedPolygonId === id) {
        setPolygonData(null);
        setSelectedPolygonId(null);
      }
    } catch (error) {
      console.error("Delete polygon error:", error);
      alert("Failed to delete polygon");
    }
  };

  const fetchNDVIData = async (polygonId: string, date: Date) => {
    try {
      // Use UTC dates consistently
      const startDate = new Date(
        Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
      );

      const endDate = new Date(
        Date.UTC(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate(),
          23,
          59,
          59,
          999
        )
      );

      const apiUrl = new URL(
        "https://api.agromonitoring.com/agro/1.0/ndvi/history"
      );
      apiUrl.searchParams.append("polyid", polygonId);
      apiUrl.searchParams.append(
        "start",
        Math.floor(startDate.getTime() / 1000).toString()
      );
      apiUrl.searchParams.append(
        "end",
        Math.floor(endDate.getTime() / 1000).toString()
      );
      apiUrl.searchParams.append(
        "appid",
        process.env.NEXT_PUBLIC_AGROMONITORING_API_KEY!
      );
      apiUrl.searchParams.append("type", "s2");
      apiUrl.searchParams.append("zoom", "13");
      apiUrl.searchParams.append("coverage_min", "10");

      const response = await fetch(apiUrl.toString());

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch NDVI details");
      }

      const data = await response.json();
      return data[0]; // Return first entry of the day
    } catch (error) {
      console.error("NDVI detail fetch error:", error);
      return null;
    }
  };

  // Update date selection handler
  const handleDateSelection = async (date: Date) => {
    const data = await fetchNDVIData(polygonData?.id || "", date);
    if (data) {
      setSelectedNDVIData(data);
    } else {
      alert("No NDVI data available for selected date");
    }
  };

  if (!isClient || !selectedDate) {
    return <div className="text-center p-8">Loading initial data...</div>;
  }

  return (
    <div className="h-screen w-full bg-white/90 text-gray-800 relative">
      <style jsx global>{`
        .leaflet-top.leaflet-right {
          z-index: 1003 !important;
        }
        .leaflet-draw-actions {
          background: white !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
          border-radius: 8px !important;
        }
      `}</style>
      {/* Top Bar */}
      <div className="absolute top-4 left-4 right-4 z-[1000] flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            Field: {polygonData?.name || "Select a field"}
          </h2>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center gap-2 shadow-lg border border-gray-200">
          <button
            className="p-1 text-gray-600 hover:text-gray-900"
            onClick={() => handleDateChange(-1)}
            disabled={!availableNDVIDates.length}
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border rounded px-3 py-2"
            disabled={!availableNDVIDates.length}
          >
            {availableNDVIDates.map((date) => {
              const dateString = date.toISOString().split("T")[0];
              return (
                <option key={dateString} value={dateString}>
                  {date.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </option>
              );
            })}
            {!availableNDVIDates.length && (
              <option disabled>No NDVI data available</option>
            )}
          </select>
          <button
            className="p-1 text-gray-600 hover:text-gray-900 disabled:opacity-50"
            onClick={() => handleDateChange(1)}
            disabled={!availableNDVIDates.length}
          >
            <ArrowRightIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Health Indicators */}
        <div className="grid grid-cols-3 gap-2 w-full md:w-auto">
          {[
            { label: "Vegetation", color: "bg-emerald-500" },
            { label: "Moisture", color: "bg-sky-500" },
            { label: "Soil", color: "bg-amber-500" },
          ].map((indicator, idx) => (
            <div
              key={idx}
              className="bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg border border-gray-200"
            >
              <p className="text-xs text-gray-600">{indicator.label}</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`${indicator.color} h-full w-${
                      (idx + 1) * 3
                    }/12 transition-all duration-300`}
                  />
                </div>
                <span className="text-xs font-mono text-gray-600">
                  {(idx + 1) * 25}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Left Sidebar */}
      <div className="absolute top-20 left-4 z-[1001] w-64 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-xl border border-gray-200">
        <div className="flex gap-2 mb-4">
          <button
            className={`flex-1 px-4 py-2 rounded ${
              viewMode === "NDVI" ? "bg-gray-100" : ""
            }`}
            onClick={() => setViewMode("NDVI")}
          >
            NDVI
          </button>
          <button
            className={`flex-1 px-4 py-2 rounded ${
              viewMode === "SATELLITE" ? "bg-gray-100" : ""
            }`}
            onClick={() => setViewMode("SATELLITE")}
          >
            SATELLITE
          </button>
        </div>

        <h3 className="text-lg mb-2">Fields</h3>
        <div className="space-y-2">
          {polygons.map((poly) => (
            <div key={poly.id} className="flex items-center gap-2">
              <button
                onClick={() => handlePolygonSelect(poly.id)}
                className={`flex-1 text-left px-3 py-2 rounded ${
                  selectedPolygonId === poly.id
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {poly.name}
              </button>
              <button
                onClick={() => deletePolygon(poly.id)}
                className="text-red-500 hover:text-red-700 p-1"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Right Sidebar - Vegetation Indices */}
      <div className="absolute top-20 right-4 z-[1002] w-80 space-y-2">
        {["NDVI", "EVI", "EVI2", "NRI", "DSWI", "NDWI"].map((index) => {
          const stats = imageryList[0]?.stats?.[index.toLowerCase()];
          return (
            <div
              key={index}
              className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-gray-200 transition-all hover:border-gray-300"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-800">{index}</h3>
                <span className="text-sm text-emerald-600">
                  {stats?.mean?.toFixed(3) || "-"}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-gray-50 p-2 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">MIN</p>
                  <p className="text-sm font-mono text-gray-800">
                    {stats?.min?.toFixed(3) || "-"}
                  </p>
                </div>
                <div className="bg-gray-50 p-2 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">MED</p>
                  <p className="text-sm font-mono text-gray-800">
                    {stats?.median?.toFixed(3) || "-"}
                  </p>
                </div>
                <div className="bg-gray-50 p-2 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">MAX</p>
                  <p className="text-sm font-mono text-gray-800">
                    {stats?.max?.toFixed(3) || "-"}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Map */}
      <div className="h-full w-full">
        <Suspense fallback={<div>Loading map...</div>}>
          <MapContainer
            center={[42.3, 69.6]}
            zoom={12}
            className="h-full w-full"
            ref={mapRef}
          >
            <TileLayer
              attribution='<a href="https://www.mapbox.com/about/maps/" target="_blank">Mapbox</a>'
              url={BASE_SATELLITE_URL}
              maxZoom={22}
              tileSize={512}
              zoomOffset={-1}
            />

            {viewMode === "NDVI" && currentTileUrl && (
              <TileLayer
                url={currentTileUrl}
                opacity={0.7}
                zIndexOffset={1000}
                tileSize={512}
                zoomOffset={-1}
              />
            )}

            <FeatureGroup>
              <EditControl
                position="topright"
                draw={{
                  polygon: {
                    allowIntersection: false,
                    drawError: { color: "#ff0000" },
                    shapeOptions: { color: "#00ff00", weight: 2 },
                  },
                  rectangle: false,
                  circle: false,
                  circlemarker: false,
                  marker: false,
                  polyline: false,
                }}
                edit={{ remove: true }}
                onCreated={handlePolygonCreated}
              />
            </FeatureGroup>
          </MapContainer>
        </Suspense>
      </div>

      {loading.polygon && (
        <div className="fixed inset-0 bg-black/50 z-[1004] flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Name Your Field</h3>
            <input
              type="text"
              value={newPolygonName}
              onChange={(e) => setNewPolygonName(e.target.value)}
              className="w-full p-2 border rounded mb-4"
              placeholder="Enter field name"
            />
            <button
              onClick={confirmPolygonCreation}
              className="w-full bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700"
            >
              Confirm Creation
            </button>
          </div>
        </div>
      )}

      {availableNDVIDates.length > 0 ? (
        <div className="flex items-center gap-4">
          {/* Date selector remains same */}
        </div>
      ) : (
        <div className="text-center py-4 text-gray-500">
          <p>No historical NDVI data available</p>
          <div className="text-sm mt-1">
            This could be due to:
            <ul className="list-disc list-inside">
              <li>Newly created polygon (data takes 2-5 days)</li>
              <li>Cloud coverage exceeding limits</li>
              <li>Corporate account required for archive data</li>
            </ul>
          </div>
        </div>
      )}

      {imageryList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {imageryList.map((imagery) => (
            <ImageryCard key={imagery.dt} imagery={imagery} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>No satellite imagery available for selected date</p>
          <p className="text-sm mt-2">
            Try different dates or check polygon coverage
          </p>
        </div>
      )}

      <div className="space-y-4">
        <button
          onClick={() => fetchNDVIDates(polygonData?.id || "")}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          {isLoading ? "Loading NDVI Data..." : "Refresh NDVI History"}
        </button>

        {selectedNDVIData ? (
          <NDVISummary data={selectedNDVIData} />
        ) : (
          <div className="p-4 bg-yellow-50 text-yellow-800 rounded-lg">
            No NDVI data available for selected date
          </div>
        )}

        {availableNDVIDates.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableNDVIDates.map((date) => (
              <div
                key={date.getTime()}
                className="p-3 border rounded hover:bg-gray-50 cursor-pointer"
                onClick={() => handleDateSelection(date)}
              >
                {date.toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  timeZone: "UTC",
                })}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
