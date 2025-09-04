import { useState, Suspense, lazy, useRef } from "react";
import { Controller } from "react-hook-form";
import { MapPinIcon } from "@heroicons/react/24/outline";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Dynamically import MapContainer
const MapContainer = lazy(() =>
  import("react-leaflet").then(mod => ({ default: mod.MapContainer }))
);
const { TileLayer, Marker, useMapEvents } = require("react-leaflet");

function MapClickHandler({ type, onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e, type);
    },
  });
  return null;
}

const BookingStep3 = ({ register, control, errors, setValue, getValues }) => {
  const [originLocation, setOriginLocation] = useState(null);
  const [destinationLocation, setDestinationLocation] = useState(null);
  const [addressSearch, setAddressSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const mapRef = useRef();

  const handleMapClick = (e, type) => {
    const { lat, lng } = e.latlng;

    if (type === "origin") {
      setOriginLocation({ lat, lng });
      setValue("origin_lat", lat);
      setValue("origin_lng", lng);

      fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      )
        .then(res => res.json())
        .then(data => {
          if (data?.display_name) setValue("origin", data.display_name);
        });
    } else {
      setDestinationLocation({ lat, lng });
      setValue("destination_lat", lat);
      setValue("destination_lng", lng);

      fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      )
        .then(res => res.json())
        .then(data => {
          if (data?.display_name) setValue("destination", data.display_name);
        });
    }
  };

  const searchAddress = () => {
    if (!addressSearch.trim()) return;
    fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        addressSearch
      )}`
    )
      .then(res => res.json())
      .then(data => setSearchResults(data));
  };

  const selectSearchResult = (result, type) => {
    const { lat, lon, display_name } = result;
    if (type === "origin") {
      setOriginLocation({ lat: parseFloat(lat), lng: parseFloat(lon) });
      setValue("origin_lat", lat);
      setValue("origin_lng", lon);
      setValue("origin", display_name);
    } else {
      setDestinationLocation({ lat: parseFloat(lat), lng: parseFloat(lon) });
      setValue("destination_lat", lat);
      setValue("destination_lng", lon);
      setValue("destination", display_name);
    }
    setAddressSearch("");
    setSearchResults([]);
  };

  return (
    <div className="space-y-6">
      {/* Origin */}
      <div>
        <label className="input-label-modern flex items-center gap-1">
          <MapPinIcon className="h-4 w-4 text-blue-600" /> Origin Location
        </label>

        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={addressSearch}
            onChange={(e) => setAddressSearch(e.target.value)}
            placeholder="Search for address..."
            className="flex-1 input-field-modern"
          />
          <button
            type="button"
            onClick={searchAddress}
            className="btn-primary-modern"
          >
            Search
          </button>
        </div>

        {searchResults.length > 0 && (
          <div className="border rounded-lg max-h-40 overflow-y-auto">
            {searchResults.map((res, i) => (
              <div
                key={i}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => selectSearchResult(res, "origin")}
              >
                {res.display_name}
              </div>
            ))}
          </div>
        )}

        <div className="h-64 border rounded-lg overflow-hidden mt-2">
          <Suspense fallback={<div className="h-64 bg-gray-100">Loading map...</div>}>
            <MapContainer
              center={[14.5995, 120.9842]} // Manila center
              zoom={13}
              style={{ height: "100%", width: "100%" }}
              ref={mapRef}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              <MapClickHandler type="origin" onMapClick={handleMapClick} />
              {originLocation && <Marker position={[originLocation.lat, originLocation.lng]} />}
            </MapContainer>
          </Suspense>
        </div>

        <input type="hidden" {...register("origin", { required: "Origin is required" })} />
        <input type="hidden" {...register("origin_lat", { required: true })} />
        <input type="hidden" {...register("origin_lng", { required: true })} />
        {errors.origin && <p className="error-message">{errors.origin.message}</p>}
      </div>

      {/* Destination */}
      <div>
        <label className="input-label-modern flex items-center gap-1">
          <MapPinIcon className="h-4 w-4 text-blue-600" /> Destination Location
        </label>

        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={addressSearch}
            onChange={(e) => setAddressSearch(e.target.value)}
            placeholder="Search for address..."
            className="flex-1 input-field-modern"
          />
          <button
            type="button"
            onClick={searchAddress}
            className="btn-primary-modern"
          >
            Search
          </button>
        </div>

        {searchResults.length > 0 && (
          <div className="border rounded-lg max-h-40 overflow-y-auto">
            {searchResults.map((res, i) => (
              <div
                key={i}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => selectSearchResult(res, "destination")}
              >
                {res.display_name}
              </div>
            ))}
          </div>
        )}

        <div className="h-64 border rounded-lg overflow-hidden mt-2">
          <Suspense fallback={<div className="h-64 bg-gray-100">Loading map...</div>}>
            <MapContainer
              center={[14.5995, 120.9842]}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              <MapClickHandler type="destination" onMapClick={handleMapClick} />
              {destinationLocation && (
                <Marker position={[destinationLocation.lat, destinationLocation.lng]} />
              )}
            </MapContainer>
          </Suspense>
        </div>

        <input type="hidden" {...register("destination", { required: "Destination is required" })} />
        <input type="hidden" {...register("destination_lat", { required: true })} />
        <input type="hidden" {...register("destination_lng", { required: true })} />
        {errors.destination && <p className="error-message">{errors.destination.message}</p>}
      </div>
    </div>
  );
};

export default BookingStep3;
