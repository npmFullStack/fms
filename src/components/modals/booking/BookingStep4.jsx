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

const BookingStep4 = ({ control, errors, setValue }) => {
  const bookingMode = useWatch({ control, name: "booking_mode" });
  const originPort = useWatch({ control, name: "origin_port" });
  const destinationPort = useWatch({ control, name: "destination_port" });
  const pickup = useWatch({ control, name: "pickup_location" });
  const delivery = useWatch({ control, name: "delivery_location" });

  const [pickupCoords, setPickupCoords] = useState(null);
  const [deliveryCoords, setDeliveryCoords] = useState(null);

  // Suggestions
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [deliverySuggestions, setDeliverySuggestions] = useState([]);

  const [debouncedPickup] = useDebounce(pickup, 600);
  const [debouncedDelivery] = useDebounce(delivery, 600);

  const geocode = async (place) => {
    if (!place) return null;
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          place
        )}`
      );
      return await res.json();
    } catch (err) {
      console.error("Geocoding error:", err);
      return [];
    }
  };

  // Pickup suggestions
  useEffect(() => {
    if (debouncedPickup && bookingMode === "DOOR_TO_DOOR") {
      geocode(debouncedPickup).then((results) =>
        setPickupSuggestions(results.slice(0, 5))
      );
    } else setPickupSuggestions([]);
  }, [debouncedPickup, bookingMode]);

  // Delivery suggestions
  useEffect(() => {
    if (debouncedDelivery && bookingMode === "DOOR_TO_DOOR") {
      geocode(debouncedDelivery).then((results) =>
        setDeliverySuggestions(results.slice(0, 5))
      );
    } else setDeliverySuggestions([]);
  }, [debouncedDelivery, bookingMode]);

  const selectPickup = (s) => {
    setValue("pickup_location", s.display_name);
    setPickupCoords({ lat: parseFloat(s.lat), lng: parseFloat(s.lon) });
    setValue("pickup_lat", parseFloat(s.lat));
    setValue("pickup_lng", parseFloat(s.lon));
    setPickupSuggestions([]);
  };

  const selectDelivery = (s) => {
    setValue("delivery_location", s.display_name);
    setDeliveryCoords({ lat: parseFloat(s.lat), lng: parseFloat(s.lon) });
    setValue("delivery_lat", parseFloat(s.lat));
    setValue("delivery_lng", parseFloat(s.lon));
    setDeliverySuggestions([]);
  };

  // Ports (now just strings, not objects)
  const originPortObj = originPort ? getPortByValue(originPort) : null;
  const destinationPortObj = destinationPort
    ? getPortByValue(destinationPort)
    : null;

  // Marker positions
  const positions = useMemo(() => {
    const pts = [];
    if (bookingMode === "DOOR_TO_DOOR" && pickupCoords)
      pts.push([pickupCoords.lat, pickupCoords.lng]);
    if (originPortObj) pts.push([originPortObj.lat, originPortObj.lng]);
    if (destinationPortObj)
      pts.push([destinationPortObj.lat, destinationPortObj.lng]);
    if (bookingMode === "DOOR_TO_DOOR" && deliveryCoords)
      pts.push([deliveryCoords.lat, deliveryCoords.lng]);
    return pts;
  }, [pickupCoords, originPortObj, destinationPortObj, deliveryCoords, bookingMode]);

  return (
    <div className="space-y-4">
      {bookingMode === "DOOR_TO_DOOR" ? (
        <>
          {/* Pickup Input */}
          <div className="relative">
            <label className="input-label-modern flex items-center gap-2">
              Pickup Location
              <span className="material-icons text-gray-400 text-sm">search</span>
            </label>
            <input
              type="text"
              value={pickup || ""}
              onChange={(e) => setValue("pickup_location", e.target.value)}
              className="input-field-modern"
              placeholder="Type pickup location"
            />
            {pickupSuggestions.length > 0 && (
              <ul className="absolute bg-white border rounded-md shadow-lg mt-1 w-full max-h-40 overflow-y-auto z-[9999]">
                {pickupSuggestions.map((s, i) => (
                  <li
                    key={i}
                    className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm"
                    onClick={() => selectPickup(s)}
                  >
                    {s.display_name}
                  </li>
                ))}
              </ul>
            )}
            {errors.pickup_location && (
              <p className="error-message">{errors.pickup_location.message}</p>
            )}
          </div>

          {/* Delivery Input */}
          <div className="relative">
            <label className="input-label-modern flex items-center gap-2">
              Delivery Location
              <span className="material-icons text-gray-400 text-sm">search</span>
            </label>
            <input
              type="text"
              value={delivery || ""}
              onChange={(e) => setValue("delivery_location", e.target.value)}
              className="input-field-modern"
              placeholder="Type delivery location"
            />
            {deliverySuggestions.length > 0 && (
              <ul className="absolute bg-white border rounded-md shadow-lg mt-1 w-full max-h-40 overflow-y-auto z-[9999]">
                {deliverySuggestions.map((s, i) => (
                  <li
                    key={i}
                    className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm"
                    onClick={() => selectDelivery(s)}
                  >
                    {s.display_name}
                  </li>
                ))}
              </ul>
            )}
            {errors.delivery_location && (
              <p className="error-message">{errors.delivery_location.message}</p>
            )}
          </div>
        </>
      ) : null}

      {/* Map */}
      <div className="h-96 w-full rounded-lg overflow-hidden border relative z-0">
        <MapContainer
          center={positions[0] || { lat: 12.8797, lng: 121.774 }}
          zoom={6}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://osm.org">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <FitBounds positions={positions} />

          {/* Markers */}
          {bookingMode === "DOOR_TO_DOOR" && pickupCoords && (
            <Marker position={pickupCoords} icon={markerIcon("green")}>
              <Popup>Pickup: {pickup}</Popup>
            </Marker>
          )}
          {originPortObj && (
            <Marker
              position={{ lat: originPortObj.lat, lng: originPortObj.lng }}
              icon={markerIcon("yellow")}
            >
              <Popup>Origin Port: {originPortObj.label}</Popup>
            </Marker>
          )}
          {destinationPortObj && (
            <Marker
              position={{
                lat: destinationPortObj.lat,
                lng: destinationPortObj.lng,
              }}
              icon={markerIcon("blue")}
            >
              <Popup>Destination Port: {destinationPortObj.label}</Popup>
            </Marker>
          )}
          {bookingMode === "DOOR_TO_DOOR" && deliveryCoords && (
            <Marker position={deliveryCoords} icon={markerIcon("red")}>
              <Popup>Delivery: {delivery}</Popup>
            </Marker>
          )}

          {/* Routes */}
          {bookingMode === "DOOR_TO_DOOR" && pickupCoords && originPortObj && (
            <Polyline
              positions={[
                [pickupCoords.lat, pickupCoords.lng],
                [originPortObj.lat, originPortObj.lng],
              ]}
              pathOptions={{ color: "green", weight: 4 }}
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
          {bookingMode === "DOOR_TO_DOOR" &&
            destinationPortObj &&
            deliveryCoords && (
              <Polyline
                positions={[
                  [destinationPortObj.lat, destinationPortObj.lng],
                  [deliveryCoords.lat, deliveryCoords.lng],
                ]}
                pathOptions={{ color: "red", weight: 4 }}
              />
            )}
        </MapContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-6 text-sm mt-2">
        {bookingMode === "DOOR_TO_DOOR" && (
          <>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              Pickup
            </div>
          </>
        )}
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
          Origin Port
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
          Destination Port
        </div>
        {bookingMode === "DOOR_TO_DOOR" && (
          <>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 bg-red-500 rounded-full"></span>
              Delivery
            </div>
            <div className="flex items-center gap-1">
              <span className="w-6 h-0.5 bg-green-500"></span>
              Truck In (Pickup → Origin Port)
            </div>
          </>
        )}
        <div className="flex items-center gap-1">
          <span className="w-6 h-0.5 border-t-2 border-blue-500 border-dashed"></span>
          Sea Route (Origin → Destination Port)
        </div>
        {bookingMode === "DOOR_TO_DOOR" && (
          <div className="flex items-center gap-1">
            <span className="w-6 h-0.5 bg-red-500"></span>
            Truck Out (Destination Port → Delivery)
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingStep4;
