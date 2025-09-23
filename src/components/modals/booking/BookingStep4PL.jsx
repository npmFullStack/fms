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

  // Street: use a Select with options that update as user types (debounced)
  const [streetQuery, setStreetQuery] = useState("");
  const [debouncedStreet] = useDebounce(streetQuery, 250); // faster debounce for snappy typing
  const [streetOptions, setStreetOptions] = useState([]);

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
  const geocode = async (place, limit = 8) => {
    if (!place) return [];
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          place
        )}&countrycodes=ph&limit=${limit}`
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

      // geocode province (so map centers to it immediately)
      geocode(`${selectedProvince}, Philippines`, 1).then((results) => {
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

      // geocode city (so map centers to it)
      geocode(`${selectedCity}, ${selectedProvince}, Philippines`, 1).then((results) => {
        if (results[0]) {
          setPickupCoords({ lat: +results[0].lat, lng: +results[0].lon });
        }
      });
    }
  }, [selectedCity, selectedProvince, cities]);

  // --- Geocode barangay ---
  useEffect(() => {
    if (selectedBarangay) {
      geocode(`${selectedBarangay}, ${selectedCity}, ${selectedProvince}, Philippines`, 1).then(
        (results) => {
          if (results[0]) {
            setPickupCoords({ lat: +results[0].lat, lng: +results[0].lon });
          }
        }
      );
    }
  }, [selectedBarangay, selectedCity, selectedProvince]);

  // --- Street suggestions (debounced for snappy typing) ---
  useEffect(() => {
    // Only try to search streets when we have at least barangay & a query
    if (debouncedStreet && selectedBarangay && selectedCity && selectedProvince) {
      const full = `${debouncedStreet}, ${selectedBarangay}, ${selectedCity}, ${selectedProvince}, Philippines`;
      geocode(full, 10).then((results) => {
        // convert geocode results into react-select options
        const opts = results.map((r) => ({
          value: r.display_name,
          label: r.display_name,
          lat: +r.lat,
          lon: +r.lon,
        }));
        setStreetOptions(opts);

        // if there is a clear top result, also set pickup coords so map recenters immediately
        if (results[0]) {
          setPickupCoords({ lat: +results[0].lat, lng: +results[0].lon });
        }
      });
    } else {
      setStreetOptions([]);
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

  // compute map initial center & zoom to avoid whole-country display
  const initialCenter = (() => {
    if (positions.length > 0) return positions[0];
    if (pickupCoords) return [pickupCoords.lat, pickupCoords.lng];
    // fallback: center Philippines but with closer zoom
    return [12.8797, 121.774];
  })();
  const initialZoom = positions.length > 0 ? 10 : pickupCoords ? 10 : 6;

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

      {/* Grid: 2 fields per row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Province */}
        <div>
          <label className="input-label-modern">Province</label>
          <Select
            value={provinceOptions.find((o) => o.value === selectedProvince) || null}
            onChange={(o) => {
              setValue("pickup_province", o ? o.value : "");
              // clear downstream
              setValue("pickup_city", "");
              setValue("pickup_barangay", "");
              setValue("pickup_street", "");
              setStreetQuery("");
              setStreetOptions([]);
            }}
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
            onChange={(o) => {
              setValue("pickup_city", o ? o.value : "");
              setValue("pickup_barangay", "");
              setValue("pickup_street", "");
              setStreetQuery("");
              setStreetOptions([]);
            }}
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
            onChange={(o) => {
              setValue("pickup_barangay", o ? o.value : "");
              setValue("pickup_street", "");
              setStreetQuery("");
              setStreetOptions([]);
            }}
            options={barangayOptions}
            isClearable
            isSearchable
            isDisabled={!selectedCity}
            styles={selectStyles}
          />
          {errors.pickup_barangay && <p className="error-message">{errors.pickup_barangay.message}</p>}
        </div>

        {/* Street: select (searchable) */}
        <div>
          <label className="input-label-modern">House/Building & Street</label>
          <Select
            value={streetOptions.find((o) => o.value === selectedStreet) || null}
            onChange={(o) => {
              setValue("pickup_street", o ? o.value : "");
              // if option has coords, also set pickup coords immediately
              if (o && o.lat && o.lon) {
                setPickupCoords({ lat: o.lat, lng: o.lon });
              }
            }}
            onInputChange={(input) => {
              setStreetQuery(input);
              // keep the form value in sync for typed but not-selected values
              // (so user can type an address and still submit as plain text)
              setValue("pickup_street", input);
            }}
            options={streetOptions}
            isClearable
            isSearchable
            isDisabled={!selectedBarangay}
            styles={selectStyles}
            placeholder={selectedBarangay ? "Type to search streets (suggestions limited to barangay)" : "Select barangay first"}
            noOptionsMessage={() => (debouncedStreet ? "No suggestions" : "Type to see suggestions")}
          />
          {errors.pickup_street && <p className="error-message">{errors.pickup_street.message}</p>}
        </div>
      </div>

      {/* Small single-row box above the map (spans full width) */}
      <div>
        <label className="input-label-modern">Note / Landmark</label>
        <input
          type="text"
          placeholder="Small note / landmark (optional)"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          onChange={(e) => setValue("pickup_note", e.target.value)}
        />
      </div>

      {/* Map */}
      <div className="h-96 w-full rounded-lg overflow-hidden border relative z-0">
        <MapContainer
          center={initialCenter}
          zoom={initialZoom}
          style={{ height: "100%", width: "100%" }}
          // when there are no meaningful positions we don't allow zoom out to full-country by FitBounds
          scrollWheelZoom={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {/* Fit to markers if any positions exist */}
          <FitBounds positions={positions} />

          {pickupCoords && (
            <Marker position={[pickupCoords.lat, pickupCoords.lng]} icon={markerIcon("green")}>
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
