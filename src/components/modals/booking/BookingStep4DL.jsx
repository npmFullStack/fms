import { useEffect, useState, useMemo } from "react";
import { useWatch } from "react-hook-form";
import { useDebounce } from "use-debounce";
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

// Custom colored markers
const markerIcon = (color) =>
  new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

// Auto-fit map to markers
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

const BookingStep4DL = ({ control, errors, setValue, getValues }) => {
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [barangays, setBarangays] = useState([]);
  const [streets, setStreets] = useState([]);
  
  const [provinceSuggestions, setProvinceSuggestions] = useState([]);
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [barangaySuggestions, setBarangaySuggestions] = useState([]);
  
  const selectedProvince = useWatch({ control, name: "delivery_province" });
  const selectedCity = useWatch({ control, name: "delivery_city" });
  const selectedBarangay = useWatch({ control, name: "delivery_barangay" });
  const selectedStreet = useWatch({ control, name: "delivery_street" });
  const deliveryLat = useWatch({ control, name: "delivery_lat" });
  const deliveryLng = useWatch({ control, name: "delivery_lng" });
  const originPortValue = useWatch({ control, name: "origin_port" });
  const destinationPortValue = useWatch({ control, name: "destination_port" });
  const skipTrucking = useWatch({ control, name: "skipTrucking" });
  
  const [debouncedProvince] = useDebounce(selectedProvince, 500);
  const [debouncedCity] = useDebounce(selectedCity, 500);
  const [debouncedBarangay] = useDebounce(selectedBarangay, 500);
  const [debouncedStreet] = useDebounce(selectedStreet, 500);
  
  const [deliveryCoords, setDeliveryCoords] = useState(null);
  const [mapSuggestions, setMapSuggestions] = useState([]);

  // Get port objects from values
  const originPortObj = originPortValue ? getPortByValue(originPortValue) : null;
  const destinationPortObj = destinationPortValue ? getPortByValue(destinationPortValue) : null;

  // Geocode function for map integration
  const geocode = async (place) => {
    if (!place) return null;
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          place
        )}&countrycodes=ph&limit=5`
      );
      return await res.json();
    } catch (err) {
      console.error("Geocoding error:", err);
      return [];
    }
  };

  // Fetch provinces
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch("https://psgc.gitlab.io/api/provinces/");
        const data = await response.json();
        setProvinces(data);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };
    
    fetchProvinces();
  }, []);
  
  // Filter province suggestions - FIXED
  useEffect(() => {
    if (debouncedProvince) {
      const filtered = provinces.filter(province => 
        province.name.toLowerCase().includes(debouncedProvince.toLowerCase())
      );
      setProvinceSuggestions(filtered.slice(0, 5));
    } else {
      setProvinceSuggestions([]);
    }
  }, [debouncedProvince, provinces]);
  
  // Fetch cities when province is selected
  useEffect(() => {
    const fetchCities = async () => {
      if (selectedProvince) {
        try {
          const province = provinces.find(p => 
            p.name.toLowerCase() === selectedProvince.toLowerCase()
          );
          
          if (province) {
            const response = await fetch(`https://psgc.gitlab.io/api/provinces/${province.code}/cities-municipalities`);
            const data = await response.json();
            setCities(data);
          }
        } catch (error) {
          console.error("Error fetching cities:", error);
        }
      } else {
        setCities([]);
        setBarangays([]);
        setStreets([]);
      }
    };
    
    fetchCities();
  }, [selectedProvince, provinces]);
  
  // Filter city suggestions - FIXED
  useEffect(() => {
    if (debouncedCity && selectedProvince) {
      const filtered = cities.filter(city => 
        city.name.toLowerCase().includes(debouncedCity.toLowerCase())
      );
      setCitySuggestions(filtered.slice(0, 5));
    } else {
      setCitySuggestions([]);
    }
  }, [debouncedCity, cities, selectedProvince]);
  
  // Fetch barangays when city is selected
  useEffect(() => {
    const fetchBarangays = async () => {
      if (selectedCity) {
        try {
          const city = cities.find(c => 
            c.name.toLowerCase() === selectedCity.toLowerCase()
          );
          
          if (city) {
            const response = await fetch(`https://psgc.gitlab.io/api/cities-municipalities/${city.code}/barangays`);
            const data = await response.json();
            setBarangays(data);
          }
        } catch (error) {
          console.error("Error fetching barangays:", error);
        }
      } else {
        setBarangays([]);
        setStreets([]);
      }
    };
    
    fetchBarangays();
  }, [selectedCity, cities]);
  
  // Filter barangay suggestions - FIXED
  useEffect(() => {
    if (debouncedBarangay && selectedCity) {
      const filtered = barangays.filter(barangay => 
        barangay.name.toLowerCase().includes(debouncedBarangay.toLowerCase())
      );
      setBarangaySuggestions(filtered.slice(0, 5));
    } else {
      setBarangaySuggestions([]);
    }
  }, [debouncedBarangay, barangays, selectedCity]);

  // Get map suggestions when street is entered
  useEffect(() => {
    const fetchMapSuggestions = async () => {
      if (debouncedStreet && selectedBarangay && selectedCity && selectedProvince) {
        const fullAddress = `${debouncedStreet}, ${selectedBarangay}, ${selectedCity}, ${selectedProvince}, Philippines`;
        const results = await geocode(fullAddress);
        setMapSuggestions(results);
        
        // Auto-select the first result if available
        if (results.length > 0) {
          selectMapSuggestion(results[0]);
        }
      } else {
        setMapSuggestions([]);
      }
    };
    
    fetchMapSuggestions();
  }, [debouncedStreet, selectedBarangay, selectedCity, selectedProvince]);

  // Update coordinates when lat/lng changes
  useEffect(() => {
    if (deliveryLat && deliveryLng) {
      setDeliveryCoords({ lat: parseFloat(deliveryLat), lng: parseFloat(deliveryLng) });
    }
  }, [deliveryLat, deliveryLng]);

  const selectProvince = (province) => {
    setValue("delivery_province", province.name);
    setValue("delivery_city", "");
    setValue("delivery_barangay", "");
    setValue("delivery_street", "");
    setValue("delivery_lat", null);
    setValue("delivery_lng", null);
    setProvinceSuggestions([]);
  };
  
  const selectCity = (city) => {
    setValue("delivery_city", city.name);
    setValue("delivery_barangay", "");
    setValue("delivery_street", "");
    setValue("delivery_lat", null);
    setValue("delivery_lng", null);
    setCitySuggestions([]);
  };
  
  const selectBarangay = (barangay) => {
    setValue("delivery_barangay", barangay.name);
    setValue("delivery_street", "");
    setValue("delivery_lat", null);
    setValue("delivery_lng", null);
    setBarangaySuggestions([]);
  };

  const selectMapSuggestion = (suggestion) => {
    setValue("delivery_lat", parseFloat(suggestion.lat));
    setValue("delivery_lng", parseFloat(suggestion.lon));
    setDeliveryCoords({ lat: parseFloat(suggestion.lat), lng: parseFloat(suggestion.lon) });
    setMapSuggestions([]);
  };

  // Marker positions for map
  const positions = useMemo(() => {
    const pts = [];
    if (deliveryCoords) pts.push([deliveryCoords.lat, deliveryCoords.lng]);
    if (originPortObj) pts.push([originPortObj.lat, originPortObj.lng]);
    if (destinationPortObj) pts.push([destinationPortObj.lat, destinationPortObj.lng]);
    return pts;
  }, [deliveryCoords, originPortObj, destinationPortObj]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Delivery Location</h3>
      
      {/* Province Input */}
      <div className="relative">
        <label className="input-label-modern">Province</label>
        <input
          type="text"
          value={selectedProvince || ""}
          onChange={(e) => setValue("delivery_province", e.target.value)}
          className="input-field-modern"
          placeholder="Type province"
        />
        {provinceSuggestions.length > 0 && (
          <ul className="absolute bg-white border rounded-md shadow-lg mt-1 w-full max-h-40 overflow-y-auto z-[9999]">
            {provinceSuggestions.map((province, i) => (
              <li
                key={i}
                className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm"
                onClick={() => selectProvince(province)}
              >
                {province.name}
              </li>
            ))}
          </ul>
        )}
        {errors.delivery_province && (
          <p className="error-message">{errors.delivery_province.message}</p>
        )}
      </div>
      
      {/* City Input */}
      <div className="relative">
        <label className="input-label-modern">City/Municipality</label>
        <input
          type="text"
          value={selectedCity || ""}
          onChange={(e) => setValue("delivery_city", e.target.value)}
          className="input-field-modern"
          placeholder="Type city/municipality"
          disabled={!selectedProvince}
        />
        {citySuggestions.length > 0 && (
          <ul className="absolute bg-white border rounded-md shadow-lg mt-1 w-full max-h-40 overflow-y-auto z-[9999]">
            {citySuggestions.map((city, i) => (
              <li
                key={i}
                className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm"
                onClick={() => selectCity(city)}
              >
                {city.name}
              </li>
            ))}
          </ul>
        )}
        {errors.delivery_city && (
          <p className="error-message">{errors.delivery_city.message}</p>
        )}
      </div>
      
      {/* Barangay Input */}
      <div className="relative">
        <label className="input-label-modern">Barangay</label>
        <input
          type="text"
          value={selectedBarangay || ""}
          onChange={(e) => setValue("delivery_barangay", e.target.value)}
          className="input-field-modern"
          placeholder="Type barangay"
          disabled={!selectedCity}
        />
        {barangaySuggestions.length > 0 && (
          <ul className="absolute bg-white border rounded-md shadow-lg mt-1 w-full max-h-40 overflow-y-auto z-[9999]">
            {barangaySuggestions.map((barangay, i) => (
              <li
                key={i}
                className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm"
                onClick={() => selectBarangay(barangay)}
              >
                {barangay.name}
              </li>
            ))}
          </ul>
        )}
        {errors.delivery_barangay && (
          <p className="error-message">{errors.delivery_barangay.message}</p>
        )}
      </div>
      
      {/* Street Input */}
      <div className="relative">
        <label className="input-label-modern">House/Building Number and Street Name</label>
        <input
          type="text"
          value={selectedStreet || ""}
          onChange={(e) => setValue("delivery_street", e.target.value)}
          className="input-field-modern"
          placeholder="e.g., 10 Sampaguita Street"
          disabled={!selectedBarangay}
        />
        {mapSuggestions.length > 0 && (
          <ul className="absolute bg-white border rounded-md shadow-lg mt-1 w-full max-h-40 overflow-y-auto z-[9999]">
            {mapSuggestions.map((suggestion, i) => (
              <li
                key={i}
                className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm"
                onClick={() => selectMapSuggestion(suggestion)}
              >
                {suggestion.display_name}
              </li>
            ))}
          </ul>
        )}
        {errors.delivery_street && (
          <p className="error-message">{errors.delivery_street.message}</p>
        )}
      </div>

      {/* Map */}
      <div className="h-96 w-full rounded-lg overflow-hidden border relative z-0">
        <MapContainer
          center={positions[0] || { lat: 12.8797, lng: 121.774 }}
          zoom={positions.length > 0 ? 6 : 5}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://osm.org">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <FitBounds positions={positions} />

          {/* Delivery Marker */}
          {deliveryCoords && (
            <Marker position={deliveryCoords} icon={markerIcon("red")}>
              <Popup>
                Delivery Location: {selectedStreet && `${selectedStreet}, `}
                {selectedBarangay && `${selectedBarangay}, `}
                {selectedCity && `${selectedCity}, `}
                {selectedProvince}
              </Popup>
            </Marker>
          )}

          {/* Origin Port Marker */}
          {originPortObj && (
            <Marker
              position={{ lat: originPortObj.lat, lng: originPortObj.lng }}
              icon={markerIcon("yellow")}
            >
              <Popup>Origin Port: {originPortObj.label}</Popup>
            </Marker>
          )}

          {/* Destination Port Marker */}
          {destinationPortObj && (
            <Marker
              position={{ lat: destinationPortObj.lat, lng: destinationPortObj.lng }}
              icon={markerIcon("blue")}
            >
              <Popup>Destination Port: {destinationPortObj.label}</Popup>
            </Marker>
          )}

          {/* Routes */}
          {destinationPortObj && deliveryCoords && (
            <Polyline
              positions={[
                [destinationPortObj.lat, destinationPortObj.lng],
                [deliveryCoords.lat, deliveryCoords.lng],
              ]}
              pathOptions={{ color: "red", weight: 4 }}
            />
          )}
          
          {originPortObj && destinationPortObj && (
            <Polyline
              positions={[
                [originPortObj.lat, originPortObj.lng],
                [destinationPortObj.lat, destinationPortObj.lng],
              ]}
              pathOptions={{ color: "blue", weight: 4, dashArray: "10, 10" }}
            />
          )}
        </MapContainer>
      </div>

      {/* Coordinates Display */}
      {deliveryLat && deliveryLng && (
        <div className="text-sm text-gray-600">
          Coordinates: {parseFloat(deliveryLat).toFixed(6)}, {parseFloat(deliveryLng).toFixed(6)}
        </div>
      )}

            {/* Legend */}
            <div className="flex flex-wrap gap-6 text-sm mt-2">
                {deliveryCoords && (
                    <div className="flex items-center gap-1">
                        <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                        Delivery Location
                    </div>
                )}
                {originPortObj && (
                    <div className="flex items-center gap-1">
                        <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
                        Origin Port
                    </div>
                )}
                {destinationPortObj && (
                    <div className="flex items-center gap-1">
                        <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                        Destination Port
                    </div>
                )}
                {deliveryCoords && originPortObj && (
                    <div className="flex items-center gap-1">
                        <span className="w-6 h-0.5 bg-green-500"></span>
                        Truck Route (Pickup → Origin Port)
                    </div>
                )}
                {originPortObj && destinationPortObj && (
                    <div className="flex items-center gap-1">
                        <span className="w-6 h-0.5 border-t-2 border-blue-500 border-dashed"></span>
                        Sea Route (Origin → Destination Port)
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingStep4DL;
