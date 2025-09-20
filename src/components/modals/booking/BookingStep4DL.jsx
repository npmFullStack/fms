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
    useMap
} from "react-leaflet";
import L from "leaflet";
import { getPortByValue } from "../../../utils/helpers/shipRoutes";

import "leaflet/dist/leaflet.css";
delete L.Icon.Default.prototype._getIconUrl;

// Custom colored markers
const markerIcon = color =>
    new L.Icon({
        iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
        shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34]
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

    const [provinceOptions, setProvinceOptions] = useState([]);
    const [cityOptions, setCityOptions] = useState([]);
    const [barangayOptions, setBarangayOptions] = useState([]);
    const [streetSuggestions, setStreetSuggestions] = useState([]);

    const selectedProvince = useWatch({ control, name: "delivery_province" });
    const selectedCity = useWatch({ control, name: "delivery_city" });
    const selectedBarangay = useWatch({ control, name: "delivery_barangay" });
    const selectedStreet = useWatch({ control, name: "delivery_street" });
    const deliveryLat = useWatch({ control, name: "delivery_lat" });
    const deliveryLng = useWatch({ control, name: "delivery_lng" });
    const originPortValue = useWatch({ control, name: "origin_port" });
    const destinationPortValue = useWatch({
        control,
        name: "destination_port"
    });

    const [debouncedStreet] = useDebounce(selectedStreet, 500);
    const [deliveryCoords, setDeliveryCoords] = useState(null);

    // Get port objects from values
    const originPortObj = originPortValue
        ? getPortByValue(originPortValue)
        : null;
    const destinationPortObj = destinationPortValue
        ? getPortByValue(destinationPortValue)
        : null;

    // Geocode function for map integration
    const geocode = async place => {
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
                const response = await fetch(
                    "https://psgc.gitlab.io/api/provinces/"
                );
                const data = await response.json();
                setProvinces(data);

                // Format for react-select
                const options = data.map(province => ({
                    value: province.name,
                    label: province.name,
                    code: province.code
                }));
                setProvinceOptions(options);
            } catch (error) {
                console.error("Error fetching provinces:", error);
            }
        };

        fetchProvinces();
    }, []);

    // Fetch cities when province is selected
    useEffect(() => {
        const fetchCities = async () => {
            if (selectedProvince) {
                try {
                    const province = provinces.find(
                        p =>
                            p.name.toLowerCase() ===
                            selectedProvince.toLowerCase()
                    );

                    if (province) {
                        const response = await fetch(
                            `https://psgc.gitlab.io/api/provinces/${province.code}/cities-municipalities`
                        );
                        const data = await response.json();
                        setCities(data);

                        // Format for react-select
                        const options = data.map(city => ({
                            value: city.name,
                            label: city.name,
                            code: city.code
                        }));
                        setCityOptions(options);
                    }
                } catch (error) {
                    console.error("Error fetching cities:", error);
                }
            } else {
                setCities([]);
                setCityOptions([]);
                setBarangayOptions([]);
                setStreetSuggestions([]);
            }
        };

        fetchCities();
    }, [selectedProvince, provinces]);

    // Fetch barangays when city is selected
    useEffect(() => {
        const fetchBarangays = async () => {
            if (selectedCity) {
                try {
                    const city = cities.find(
                        c => c.name.toLowerCase() === selectedCity.toLowerCase()
                    );

                    if (city) {
                        const response = await fetch(
                            `https://psgc.gitlab.io/api/cities-municipalities/${city.code}/barangays`
                        );
                        const data = await response.json();

                        // Format for react-select
                        const options = data.map(barangay => ({
                            value: barangay.name,
                            label: barangay.name,
                            code: barangay.code
                        }));
                        setBarangayOptions(options);
                    }
                } catch (error) {
                    console.error("Error fetching barangays:", error);
                }
            } else {
                setBarangayOptions([]);
                setStreetSuggestions([]);
            }
        };

        fetchBarangays();
    }, [selectedCity, cities]);

    // Get street suggestions from geocoding when street is entered
    useEffect(() => {
        const fetchStreetSuggestions = async () => {
            if (
                debouncedStreet &&
                selectedBarangay &&
                selectedCity &&
                selectedProvince
            ) {
                const fullAddress = `${debouncedStreet}, ${selectedBarangay}, ${selectedCity}, ${selectedProvince}, Philippines`;
                const results = await geocode(fullAddress);

                if (results && results.length > 0) {
                    setStreetSuggestions(results);

                    // Auto-select first result and set coordinates
                    const firstResult = results[0];
                    setValue("delivery_lat", parseFloat(firstResult.lat));
                    setValue("delivery_lng", parseFloat(firstResult.lon));
                    setDeliveryCoords({
                        lat: parseFloat(firstResult.lat),
                        lng: parseFloat(firstResult.lon)
                    });
                } else {
                    setStreetSuggestions([]);
                }
            } else {
                setStreetSuggestions([]);
            }
        };

        fetchStreetSuggestions();
    }, [
        debouncedStreet,
        selectedBarangay,
        selectedCity,
        selectedProvince,
        setValue
    ]);

    // Update coordinates when lat/lng changes
    useEffect(() => {
        if (deliveryLat && deliveryLng) {
            setDeliveryCoords({
                lat: parseFloat(deliveryLat),
                lng: parseFloat(deliveryLng)
            });
        }
    }, [deliveryLat, deliveryLng]);

    // Handle province selection
    const handleProvinceChange = selectedOption => {
        setValue(
            "delivery_province",
            selectedOption ? selectedOption.value : ""
        );
        setValue("delivery_city", "");
        setValue("delivery_barangay", "");
        setValue("delivery_street", "");
        setValue("delivery_lat", null);
        setValue("delivery_lng", null);
        setDeliveryCoords(null);
    };

    // Handle city selection
    const handleCityChange = selectedOption => {
        setValue("delivery_city", selectedOption ? selectedOption.value : "");
        setValue("delivery_barangay", "");
        setValue("delivery_street", "");
        setValue("delivery_lat", null);
        setValue("delivery_lng", null);
        setDeliveryCoords(null);
    };

    // Handle barangay selection
    const handleBarangayChange = selectedOption => {
        setValue(
            "delivery_barangay",
            selectedOption ? selectedOption.value : ""
        );
        setValue("delivery_street", "");
        setValue("delivery_lat", null);
        setValue("delivery_lng", null);
        setDeliveryCoords(null);
    };

    // Handle street selection from suggestions
    const selectStreetSuggestion = suggestion => {
        setValue("delivery_street", suggestion.display_name);
        setValue("delivery_lat", parseFloat(suggestion.lat));
        setValue("delivery_lng", parseFloat(suggestion.lon));
        setDeliveryCoords({
            lat: parseFloat(suggestion.lat),
            lng: parseFloat(suggestion.lon)
        });
        setStreetSuggestions([]);
    };

    // Marker positions for map
    const positions = useMemo(() => {
        const pts = [];
        if (deliveryCoords) pts.push([deliveryCoords.lat, deliveryCoords.lng]);
        if (originPortObj) pts.push([originPortObj.lat, originPortObj.lng]);
        if (destinationPortObj)
            pts.push([destinationPortObj.lat, destinationPortObj.lng]);
        return pts;
    }, [deliveryCoords, originPortObj, destinationPortObj]);

    // Custom styles for react-select
    const selectStyles = {
        control: (provided, state) => ({
            ...provided,
            borderColor: state.isFocused ? "#3b82f6" : "#d1d5db",
            boxShadow: state.isFocused
                ? "0 0 0 2px rgba(59, 130, 246, 0.3)"
                : "none",
            "&:hover": {
                borderColor: "#3b82f6"
            }
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected
                ? "#3b82f6"
                : state.isFocused
                ? "#dbeafe"
                : "white",
            color: state.isSelected ? "white" : "#374151"
        })
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Delivery Location</h3>

            {/* Province Select */}
            <div>
                <label className="input-label-modern">Province</label>
                <Select
                    value={
                        provinceOptions.find(
                            opt => opt.value === selectedProvince
                        ) || null
                    }
                    onChange={handleProvinceChange}
                    options={provinceOptions}
                    placeholder="Select or type province"
                    isSearchable
                    isClearable
                    styles={selectStyles}
                    noOptionsMessage={() => "No provinces found"}
                />
                {errors.delivery_province && (
                    <p className="error-message">
                        {errors.delivery_province.message}
                    </p>
                )}
            </div>

            {/* City Select */}
            <div>
                <label className="input-label-modern">City/Municipality</label>
                <Select
                    value={
                        cityOptions.find(opt => opt.value === selectedCity) ||
                        null
                    }
                    onChange={handleCityChange}
                    options={cityOptions}
                    placeholder="Select or type city/municipality"
                    isSearchable
                    isClearable
                    isDisabled={!selectedProvince}
                    styles={selectStyles}
                    noOptionsMessage={() =>
                        selectedProvince
                            ? "No cities found"
                            : "Please select a province first"
                    }
                />
                {errors.delivery_city && (
                    <p className="error-message">
                        {errors.delivery_city.message}
                    </p>
                )}
            </div>

            {/* Barangay Select */}
            <div>
                <label className="input-label-modern">Barangay</label>
                <Select
                    value={
                        barangayOptions.find(
                            opt => opt.value === selectedBarangay
                        ) || null
                    }
                    onChange={handleBarangayChange}
                    options={barangayOptions}
                    placeholder="Select or type barangay"
                    isSearchable
                    isClearable
                    isDisabled={!selectedCity}
                    styles={selectStyles}
                    noOptionsMessage={() =>
                        selectedCity
                            ? "No barangays found"
                            : "Please select a city first"
                    }
                />
                {errors.delivery_barangay && (
                    <p className="error-message">
                        {errors.delivery_barangay.message}
                    </p>
                )}
            </div>

            {/* Street Input */}
            <div className="relative">
                <label className="input-label-modern">
                    House/Building Number and Street Name
                </label>
                <input
                    type="text"
                    value={selectedStreet || ""}
                    onChange={e => setValue("delivery_street", e.target.value)}
                    className="input-field-modern"
                    placeholder="Type street address (e.g., 10 Sampaguita Street)"
                    disabled={!selectedBarangay}
                />
                {streetSuggestions.length > 0 && (
                    <ul className="absolute bg-white border rounded-md shadow-lg mt-1 w-full max-h-40 overflow-y-auto z-[9999]">
                        {streetSuggestions.map((suggestion, i) => (
                            <li
                                key={i}
                                className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm"
                                onClick={() =>
                                    selectStreetSuggestion(suggestion)
                                }
                            >
                                {suggestion.display_name}
                            </li>
                        ))}
                    </ul>
                )}
                {errors.delivery_street && (
                    <p className="error-message">
                        {errors.delivery_street.message}
                    </p>
                )}
            </div>

            {/* Map */}
            <div className="h-96 w-full rounded-lg overflow-hidden border relative z-0">
                <MapContainer
                    center={positions[0] || [12.8797, 121.774]}
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
                        <Marker
                            position={deliveryCoords}
                            icon={markerIcon("red")}
                        >
                            <Popup>
                                Delivery Location:{" "}
                                {selectedStreet && `${selectedStreet}, `}
                                {selectedBarangay && `${selectedBarangay}, `}
                                {selectedCity && `${selectedCity}, `}
                                {selectedProvince}
                            </Popup>
                        </Marker>
                    )}

                    {/* Origin Port Marker */}
                    {originPortObj && (
                        <Marker
                            position={[originPortObj.lat, originPortObj.lng]}
                            icon={markerIcon("yellow")}
                        >
                            <Popup>Origin Port: {originPortObj.label}</Popup>
                        </Marker>
                    )}

                    {/* Destination Port Marker */}
                    {destinationPortObj && (
                        <Marker
                            position={[
                                destinationPortObj.lat,
                                destinationPortObj.lng
                            ]}
                            icon={markerIcon("blue")}
                        >
                            <Popup>
                                Destination Port: {destinationPortObj.label}
                            </Popup>
                        </Marker>
                    )}

                    {/* Routes */}
                    {destinationPortObj && deliveryCoords && (
                        <Polyline
                            positions={[
                                [
                                    destinationPortObj.lat,
                                    destinationPortObj.lng
                                ],
                                [deliveryCoords.lat, deliveryCoords.lng]
                            ]}
                            pathOptions={{ color: "red", weight: 4 }}
                        />
                    )}

                    {originPortObj && destinationPortObj && (
                        <Polyline
                            positions={[
                                [originPortObj.lat, originPortObj.lng],
                                [destinationPortObj.lat, destinationPortObj.lng]
                            ]}
                            pathOptions={{
                                color: "blue",
                                weight: 4,
                                dashArray: "10, 10"
                            }}
                        />
                    )}
                </MapContainer>
            </div>

            {/* Coordinates Display */}
            {deliveryLat && deliveryLng && (
                <div className="text-sm text-gray-600">
                    Coordinates: {parseFloat(deliveryLat).toFixed(6)},{" "}
                    {parseFloat(deliveryLng).toFixed(6)}
                </div>
            )}

            {/* Legend */}
            <div className="flex flex-wrap gap-6 text-sm mt-2">
                {deliveryCoords && (
                    <div className="flex items-center gap-1">
                        <span className="w-3 h-3 bg-red-500 rounded-full"></span>
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
                {deliveryCoords && destinationPortObj && (
                    <div className="flex items-center gap-1">
                        <span className="w-6 h-0.5 bg-red-500"></span>
                        Truck Route (Destination Port → Delivery)
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
