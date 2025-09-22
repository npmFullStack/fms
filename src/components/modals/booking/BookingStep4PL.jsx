import { useEffect, useState, useMemo } from "react";
import { useWatch } from "react-hook-form";
import { useDebounce } from "use-debounce";
import Select from "react-select";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { getPortByValue } from "../../../utils/helpers/shipRoutes";

import "leaflet/dist/leaflet.css";
delete L.Icon.Default.prototype._getIconUrl;

// Custom marker
const markerIcon = (color) =>
  new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

// Auto-fit map bounds
const FitBounds = ({ positions }) => {
  const map = useMap();
  useEffect(() => {
    if (positions.length > 0) {
      const bounds = L.latLngBounds(positions);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [positions, map]);
  return null;
};

const BookingStep4PL = ({ control, errors, setValue }) => {
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [barangays, setBarangays] = useState([]);

  const [provinceOptions, setProvinceOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [barangayOptions, setBarangayOptions] = useState([]);

  const [streetQuery, setStreetQuery] = useState("");
  const [streetSuggestions, setStreetSuggestions] = useState([]);

  const [debouncedStreet] = useDebounce(streetQuery, 500);
  const [pickupCoords, setPickupCoords] = useState(null);

  // Watch values
  const selectedProvince = useWatch({ control, name: "pickup_province" });
  const selectedCity = useWatch({ control, name: "pickup_city" });
  const selectedBarangay = useWatch({ control, name: "pickup_barangay" });
  const selectedStreet = useWatch({ control, name: "pickup_street" });

  const originPortValue = useWatch({ control, name: "origin_port" });
  const destinationPortValue = useWatch({ control, name: "destination_port" });

  const originPortObj = originPortValue ? getPortByValue(originPortValue) : null;
  const destinationPortObj = destinationPortValue ? getPortByValue(destinationPortValue) : null;

  // Geocode helper
  const geocode = async (place) => {
    if (!place) return [];
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          place
        )}&countrycodes=ph&limit=5`
      );
      return await res.json();
    } catch {
      return [];
    }
  };

  // --- Fetch provinces ---
  useEffect(() => {
    fetch("https://psgc.gitlab.io/api/provinces/")
      .then((res) => res.json())
      .then((data) => {
        setProvinces(data);
        setProvinceOptions(
          data.map((p) => ({ value: p.name, label: p.name, code: p.code }))
        );
      })
      .catch(() => {});
  }, []);

  // --- Fetch cities when province changes ---
  useEffect(() => {
    if (!selectedProvince) {
      setCities([]);
      setCityOptions([]);
      setBarangays([]);
      setBarangayOptions([]);
      setPickupCoords(null);
      return;
    }
    const province = provinces.find(
      (p) => p.name.toLowerCase() === selectedProvince.toLowerCase()
    );
    if (province) {
      fetch(`https://psgc.gitlab.io/api/provinces/${province.code}/cities-municipalities`)
        .then((res) => res.json())
        .then((data) => {
          setCities(data);
          setCityOptions(
            data.map((c) => ({ value: c.name, label: c.name, code: c.code }))
          );
        });
      // geocode province
      geocode(`${selectedProvince}, Philippines`).then((results) => {
        if (results[0]) {
          setPickupCoords({ lat: +results[0].lat, lng: +results[0].lon });
        }
      });
    }
  }, [selectedProvince, provinces]);

  // --- Fetch barangays when city changes ---
  useEffect(() => {
    if (!selectedCity) {
      setBarangays([]);
      setBarangayOptions([]);
      return;
    }
    const city = cities.find(
      (c) => c.name.toLowerCase() === selectedCity.toLowerCase()
    );
    if (city) {
      fetch(`https://psgc.gitlab.io/api/cities-municipalities/${city.code}/barangays`)
        .then((res) => res.json())
        .then((data) => {
          setBarangays(data);
          setBarangayOptions(
            data.map((b) => ({ value: b.name, label: b.name, code: b.code }))
          );
        });
      // geocode city
      geocode(`${selectedCity}, ${selectedProvince}, Philippines`).then((results) => {
        if (results[0]) {
          setPickupCoords({ lat: +results[0].lat, lng: +results[0].lon });
        }
      });
    }
  }, [selectedCity, selectedProvince, cities]);

  // --- Geocode barangay ---
  useEffect(() => {
    if (selectedBarangay) {
      geocode(`${selectedBarangay}, ${selectedCity}, ${selectedProvince}, Philippines`).then(
        (results) => {
          if (results[0]) {
            setPickupCoords({ lat: +results[0].lat, lng: +results[0].lon });
          }
        }
      );
    }
  }, [selectedBarangay, selectedCity, selectedProvince]);

  // --- Street autocomplete ---
  useEffect(() => {
    if (debouncedStreet && selectedBarangay && selectedCity && selectedProvince) {
      const full = `${debouncedStreet}, ${selectedBarangay}, ${selectedCity}, ${selectedProvince}, Philippines`;
      geocode(full).then((results) => {
        setStreetSuggestions(results.map((r) => r.display_name));
        if (results[0]) {
          setPickupCoords({ lat: +results[0].lat, lng: +results[0].lon });
        }
      });
    } else {
      setStreetSuggestions([]);
    }
  }, [debouncedStreet, selectedBarangay, selectedCity, selectedProvince]);

  // --- Marker positions ---
  const positions = useMemo(() => {
    const pts = [];
    if (pickupCoords) pts.push([pickupCoords.lat, pickupCoords.lng]);
    if (originPortObj) pts.push([originPortObj.lat, originPortObj.lng]);
    if (destinationPortObj) pts.push([destinationPortObj.lat, destinationPortObj.lng]);
    return pts;
  }, [pickupCoords, originPortObj, destinationPortObj]);

  const selectStyles = {
    control: (base, state) => ({
      ...base,
      borderColor: state.isFocused ? "#3b82f6" : "#d1d5db",
      boxShadow: state.isFocused ? "0 0 0 2px rgba(59,130,246,.3)" : "none",
    }),
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Pickup Location</h3>

      {/* Province */}
      <div>
        <label className="input-label-modern">Province</label>
        <Select
          value={provinceOptions.find((o) => o.value === selectedProvince) || null}
          onChange={(o) => setValue("pickup_province", o ? o.value : "")}
          options={provinceOptions}
          isClearable
          isSearchable
          styles={selectStyles}
        />
        {errors.pickup_province && <p className="error-message">{errors.pickup_province.message}</p>}
      </div>

      {/* City */}
      <div>
        <label className="input-label-modern">City/Municipality</label>
        <Select
          value={cityOptions.find((o) => o.value === selectedCity) || null}
          onChange={(o) => setValue("pickup_city", o ? o.value : "")}
          options={cityOptions}
          isClearable
          isSearchable
          isDisabled={!selectedProvince}
          styles={selectStyles}
        />
        {errors.pickup_city && <p className="error-message">{errors.pickup_city.message}</p>}
      </div>

      {/* Barangay */}
      <div>
        <label className="input-label-modern">Barangay</label>
        <Select
          value={barangayOptions.find((o) => o.value === selectedBarangay) || null}
          onChange={(o) => setValue("pickup_barangay", o ? o.value : "")}
          options={barangayOptions}
          isClearable
          isSearchable
          isDisabled={!selectedCity}
          styles={selectStyles}
        />
        {errors.pickup_barangay && <p className="error-message">{errors.pickup_barangay.message}</p>}
      </div>

      {/* Street input */}
      <div>
        <label className="input-label-modern">House/Building & Street</label>
        <input
          type="text"
          value={selectedStreet || ""}
          onChange={(e) => {
            setValue("pickup_street", e.target.value);
            setStreetQuery(e.target.value);
          }}
          list="street-suggestions"
          placeholder="e.g., 10 Sampaguita Street"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={!selectedBarangay}
        />
        <datalist id="street-suggestions">
          {streetSuggestions.map((s, i) => (
            <option key={i} value={s} />
          ))}
        </datalist>
        {errors.pickup_street && <p className="error-message">{errors.pickup_street.message}</p>}
      </div>

      {/* Map */}
      <div className="h-96 w-full rounded-lg overflow-hidden border relative z-0">
        <MapContainer
          center={positions[0] || [12.8797, 121.774]}
          zoom={6}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          <FitBounds positions={positions} />

          {pickupCoords && (
            <Marker position={pickupCoords} icon={markerIcon("green")}>
              <Popup>
                Pickup: {selectedStreet && `${selectedStreet}, `}
                {selectedBarangay && `${selectedBarangay}, `}
                {selectedCity && `${selectedCity}, `}
                {selectedProvince}
              </Popup>
            </Marker>
          )}

          {originPortObj && (
            <Marker position={[originPortObj.lat, originPortObj.lng]} icon={markerIcon("yellow")}>
              <Popup>Origin Port: {originPortObj.label}</Popup>
            </Marker>
          )}

          {destinationPortObj && (
            <Marker position={[destinationPortObj.lat, destinationPortObj.lng]} icon={markerIcon("blue")}>
              <Popup>Destination Port: {destinationPortObj.label}</Popup>
            </Marker>
          )}

          {pickupCoords && originPortObj && (
            <Polyline positions={[[pickupCoords.lat, pickupCoords.lng], [originPortObj.lat, originPortObj.lng]]} pathOptions={{ color: "green" }} />
          )}
          {originPortObj && destinationPortObj && (
            <Polyline positions={[[originPortObj.lat, originPortObj.lng], [destinationPortObj.lat, destinationPortObj.lng]]} pathOptions={{ color: "blue", dashArray: "10,10" }} />
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default BookingStep4PL;
