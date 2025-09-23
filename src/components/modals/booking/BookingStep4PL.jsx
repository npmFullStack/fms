// components/modals/booking/BookingStep4PL

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

// Custom marker
const markerIcon = color =>
    new L.Icon({
        iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
        shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34]
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

// Helper function to truncate long text with ellipsis
const truncateText = (text, maxLength = 15) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "…";
};

const BookingStep4PL = ({ control, errors, setValue }) => {
    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);
    const [, setBarangays] = useState([]); // removed unused variable

    const [provinceOptions, setProvinceOptions] = useState([]);
    const [cityOptions, setCityOptions] = useState([]);
    const [barangayOptions, setBarangayOptions] = useState([]);

    // Street/Address search state
    const [streetInputValue, setStreetInputValue] = useState("");
    const [debouncedStreetInput] = useDebounce(streetInputValue, 300);
    const [streetOptions, setStreetOptions] = useState([]);
    const [isLoadingStreet, setIsLoadingStreet] = useState(false);

    const [pickupCoords, setPickupCoords] = useState(null);

    // Watch values
    const selectedProvince = useWatch({ control, name: "pickup_province" });
    const selectedCity = useWatch({ control, name: "pickup_city" });
    const selectedBarangay = useWatch({ control, name: "pickup_barangay" });
    const selectedStreet = useWatch({ control, name: "pickup_street" });

    const originPortValue = useWatch({ control, name: "origin_port" });
    const destinationPortValue = useWatch({
        control,
        name: "destination_port"
    });

    const originPortObj = originPortValue
        ? getPortByValue(originPortValue)
        : null;
    const destinationPortObj = destinationPortValue
        ? getPortByValue(destinationPortValue)
        : null;

    // Enhanced geocode helper with better error handling
    const geocode = async (place, limit = 8) => {
        if (!place || place.trim().length < 1) return [];
        try {
            const encodedPlace = encodeURIComponent(place.trim());
            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodedPlace}&countrycodes=ph&limit=${limit}&addressdetails=1&extratags=1&namedetails=1`,
                {
                    headers: {
                        "User-Agent": "BookingApp/1.0"
                    }
                }
            );

            if (!res.ok) throw new Error("Network response was not ok");
            const data = await res.json();
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error("Geocoding error:", error);
            return [];
        }
    };

    // --- Fetch provinces ---
    useEffect(() => {
        fetch("https://psgc.gitlab.io/api/provinces/")
            .then(res => res.json())
            .then(data => {
                const sorted = [...data].sort((a, b) =>
                    a.name.localeCompare(b.name)
                );
                setProvinces(sorted);
                setProvinceOptions(
                    sorted.map(p => ({
                        value: p.name,
                        label: truncateText(p.name),
                        fullLabel: p.name,
                        code: p.code
                    }))
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
            p => p.name.toLowerCase() === selectedProvince.toLowerCase()
        );
        if (province) {
            fetch(
                `https://psgc.gitlab.io/api/provinces/${province.code}/cities-municipalities`
            )
                .then(res => res.json())
                .then(data => {
                    const sorted = [...data].sort((a, b) =>
                        a.name.localeCompare(b.name)
                    );
                    setCities(sorted);
                    setCityOptions(
                        sorted.map(c => ({
                            value: c.name,
                            label: truncateText(c.name),
                            fullLabel: c.name,
                            code: c.code
                        }))
                    );
                });

            geocode(`${selectedProvince}, Philippines`, 1).then(results => {
                if (results[0]) {
                    setPickupCoords({
                        lat: +results[0].lat,
                        lng: +results[0].lon
                    });
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
            c => c.name.toLowerCase() === selectedCity.toLowerCase()
        );
        if (city) {
            fetch(
                `https://psgc.gitlab.io/api/cities-municipalities/${city.code}/barangays`
            )
                .then(res => res.json())
                .then(data => {
                    const sorted = [...data].sort((a, b) =>
                        a.name.localeCompare(b.name)
                    );
                    setBarangays(sorted);
                    setBarangayOptions(
                        sorted.map(b => ({
                            value: b.name,
                            label: truncateText(b.name),
                            fullLabel: b.name,
                            code: b.code
                        }))
                    );
                });

            geocode(
                `${selectedCity}, ${selectedProvince}, Philippines`,
                1
            ).then(results => {
                if (results[0]) {
                    setPickupCoords({
                        lat: +results[0].lat,
                        lng: +results[0].lon
                    });
                }
            });
        }
    }, [selectedCity, selectedProvince, cities]);

    // --- Geocode barangay ---
    useEffect(() => {
        if (selectedBarangay) {
            geocode(
                `${selectedBarangay}, ${selectedCity}, ${selectedProvince}, Philippines`,
                1
            ).then(results => {
                if (results[0]) {
                    setPickupCoords({
                        lat: +results[0].lat,
                        lng: +results[0].lon
                    });
                }
            });
        }
    }, [selectedBarangay, selectedCity, selectedProvince]);

    // --- Enhanced Street/Address search ---
    useEffect(() => {
        const searchStreetAddresses = async () => {
            if (
                !debouncedStreetInput ||
                debouncedStreetInput.trim().length < 1
            ) {
                setStreetOptions([]);
                setIsLoadingStreet(false);
                return;
            }
            if (!selectedCity || !selectedProvince) {
                setStreetOptions([]);
                setIsLoadingStreet(false);
                return;
            }
            setIsLoadingStreet(true);

            try {
                const searchQueries = [];
                const baseLocation = selectedBarangay
                    ? `${selectedBarangay}, ${selectedCity}, ${selectedProvince}, Philippines`
                    : `${selectedCity}, ${selectedProvince}, Philippines`;

                searchQueries.push(`${debouncedStreetInput}, ${baseLocation}`);
                if (debouncedStreetInput.length >= 3) {
                    searchQueries.push(
                        `${debouncedStreetInput} Street, ${baseLocation}`
                    );
                    searchQueries.push(
                        `${debouncedStreetInput} Road, ${baseLocation}`
                    );
                    searchQueries.push(
                        `${debouncedStreetInput} Avenue, ${baseLocation}`
                    );
                }

                const searchPromises = searchQueries.map(query =>
                    geocode(query, 5)
                );
                const searchResults = await Promise.all(searchPromises);

                const allResults = searchResults.flat();
                const uniqueResults = [];
                const seenDisplayNames = new Set();

                for (const result of allResults) {
                    if (
                        result &&
                        result.display_name &&
                        !seenDisplayNames.has(result.display_name)
                    ) {
                        seenDisplayNames.add(result.display_name);

                        const displayNameLower =
                            result.display_name.toLowerCase();
                        const searchTermLower =
                            debouncedStreetInput.toLowerCase();

                        if (
                            displayNameLower.includes(searchTermLower) ||
                            searchTermLower
                                .split(" ")
                                .some(term => displayNameLower.includes(term))
                        ) {
                            uniqueResults.push(result);
                        }
                    }
                }

                const options = uniqueResults.slice(0, 10).map(result => {
                    let cleanLabel = result.display_name;
                    const parts = result.display_name.split(",");
                    if (parts.length > 0) {
                        cleanLabel = parts[0].trim();
                        if (parts.length > 1 && cleanLabel.length < 10) {
                            cleanLabel = `${parts[0].trim()}, ${parts[1].trim()}`;
                        }
                    }
                    return {
                        value: result.display_name,
                        label: truncateText(cleanLabel, 50),
                        fullLabel: result.display_name,
                        lat: parseFloat(result.lat),
                        lon: parseFloat(result.lon),
                        type: result.type || "address",
                        importance: parseFloat(result.importance) || 0
                    };
                });

                // sort alphabetically instead of importance
                options.sort((a, b) => a.label.localeCompare(b.label));

                setStreetOptions(options);

                if (options.length > 0 && options[0].lat && options[0].lon) {
                    setPickupCoords({
                        lat: options[0].lat,
                        lng: options[0].lon
                    });
                }
            } catch (error) {
                console.error("Street search error:", error);
                setStreetOptions([]);
            } finally {
                setIsLoadingStreet(false);
            }
        };

        searchStreetAddresses();
    }, [
        debouncedStreetInput,
        selectedBarangay,
        selectedCity,
        selectedProvince
    ]);

    useEffect(() => {
        setStreetOptions([]);
        setStreetInputValue("");
    }, [selectedProvince, selectedCity, selectedBarangay]);

    // --- Marker positions ---
    const positions = useMemo(() => {
        const pts = [];
        if (pickupCoords) pts.push([pickupCoords.lat, pickupCoords.lng]);
        if (originPortObj) pts.push([originPortObj.lat, originPortObj.lng]);
        if (destinationPortObj)
            pts.push([destinationPortObj.lat, destinationPortObj.lng]);
        return pts;
    }, [pickupCoords, originPortObj, destinationPortObj]);

    const initialCenter = (() => {
        if (positions.length > 0) return positions[0];
        if (pickupCoords) return [pickupCoords.lat, pickupCoords.lng];
        return [12.8797, 121.774];
    })();
    const initialZoom = positions.length > 0 ? 10 : pickupCoords ? 10 : 6;

    const selectStyles = {
        control: (base, state) => ({
            ...base,
            borderColor: state.isFocused ? "#3b82f6" : "#d1d5db",
            boxShadow: state.isFocused
                ? "0 0 0 2px rgba(59,130,246,.3)"
                : "none"
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isFocused ? "#f3f4f6" : "white",
            color: "#374151",
            fontSize: "14px"
        })
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Pickup Location</h3>

            <div className="grid grid-cols-2 gap-4">
                {/* Province */}
                <div>
                    <label className="input-label-modern">Province</label>
                    <Select
                        value={
                            provinceOptions.find(
                                o => o.value === selectedProvince
                            ) || null
                        }
                        onChange={o => {
                            setValue("pickup_province", o ? o.value : "");
                            setValue("pickup_city", "");
                            setValue("pickup_barangay", "");
                            setValue("pickup_street", "");
                            setStreetInputValue("");
                            setStreetOptions([]);
                        }}
                        options={provinceOptions}
                        isClearable
                        isSearchable
                        placeholder="Select Province…"
                        styles={selectStyles}
                    />
                    {errors.pickup_province && (
                        <p className="error-message">
                            {errors.pickup_province.message}
                        </p>
                    )}
                </div>

                {/* City */}
                <div>
                    <label className="input-label-modern">
                        City/Municipality
                    </label>
                    <Select
                        value={
                            cityOptions.find(o => o.value === selectedCity) ||
                            null
                        }
                        onChange={o => {
                            setValue("pickup_city", o ? o.value : "");
                            setValue("pickup_barangay", "");
                            setValue("pickup_street", "");
                            setStreetInputValue("");
                            setStreetOptions([]);
                        }}
                        options={cityOptions}
                        isClearable
                        isSearchable
                        isDisabled={!selectedProvince}
                        placeholder="Select City…"
                        styles={selectStyles}
                    />
                    {errors.pickup_city && (
                        <p className="error-message">
                            {errors.pickup_city.message}
                        </p>
                    )}
                </div>

                {/* Barangay */}
                <div>
                    <label className="input-label-modern">Barangay</label>
                    <Select
                        value={
                            barangayOptions.find(
                                o => o.value === selectedBarangay
                            ) || null
                        }
                        onChange={o => {
                            setValue("pickup_barangay", o ? o.value : "");
                            setValue("pickup_street", "");
                            setStreetInputValue("");
                            setStreetOptions([]);
                        }}
                        options={barangayOptions}
                        isClearable
                        isSearchable
                        isDisabled={!selectedCity}
                        placeholder="Select Barangay…"
                        styles={selectStyles}
                    />
                    {errors.pickup_barangay && (
                        <p className="error-message">
                            {errors.pickup_barangay.message}
                        </p>
                    )}
                </div>

                {/* Street/Address */}
                <div>
                    <label className="input-label-modern">
                        House/Building & Street
                    </label>
                    <Select
                        value={
                            streetOptions.find(
                                o =>
                                    o.value === selectedStreet ||
                                    o.fullLabel === selectedStreet ||
                                    o.label === selectedStreet
                            ) ||
                            (selectedStreet
                                ? {
                                      value: selectedStreet,
                                      label: selectedStreet
                                  }
                                : null)
                        }
                        onChange={o => {
                            if (o) {
                                const val = o.fullLabel || o.value || o.label;
                                setValue("pickup_street", val);
                                setStreetInputValue(val);
                                if (o.lat && o.lon) {
                                    setPickupCoords({ lat: o.lat, lng: o.lon });
                                }
                            } else {
                                setValue("pickup_street", "");
                                setStreetInputValue("");
                            }
                        }}
                        onInputChange={(inputValue, actionMeta) => {
                            if (actionMeta.action === "input-change") {
                                setStreetInputValue(inputValue);
                                setValue("pickup_street", inputValue);
                            }
                        }}
                        inputValue={streetInputValue}
                        options={streetOptions}
                        isClearable
                        isSearchable
                        isLoading={isLoadingStreet}
                        isDisabled={!selectedCity}
                        styles={selectStyles}
                        placeholder={
                            !selectedCity
                                ? "Select city first"
                                : "Type to search…"
                        }
                        noOptionsMessage={({ inputValue }) => {
                            if (!inputValue || inputValue.trim().length < 1) {
                                return "Type to search";
                            }
                            return isLoadingStreet
                                ? "Searching..."
                                : "No addresses found";
                        }}
                        loadingMessage={() => "Searching addresses..."}
                        filterOption={() => true}
                        formatOptionLabel={option => (
                            <div>
                                <div className="font-medium text-sm">
                                    {option.label}
                                </div>
                                {option.fullLabel !== option.label && (
                                    <div className="text-xs text-gray-500 truncate max-w-xs">
                                        {truncateText(option.fullLabel, 60)}
                                    </div>
                                )}
                            </div>
                        )}
                    />
                    {errors.pickup_street && (
                        <p className="error-message">
                            {errors.pickup_street.message}
                        </p>
                    )}
                </div>
            </div>

            {/* Map Legend */}
            <div className="bg-gray-50 p-2 rounded-lg border">
                <h4 className="text-xs font-medium mb-1 text-center">
                    Map Legend
                </h4>
                <div className="flex justify-center items-center gap-3 text-xs">
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span>Pickup</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span>Origin Port</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span>Destination</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-4 h-0.5 bg-green-500"></div>
                        <span>Land Route</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div
                            className="w-4 h-0.5 bg-blue-500"
                            style={{
                                backgroundImage:
                                    "repeating-linear-gradient(to right, #3b82f6, #3b82f6 2px, transparent 2px, transparent 4px)"
                            }}
                        ></div>
                        <span>Sea Route</span>
                    </div>
                </div>
            </div>

            {/* Map */}
            <div className="h-96 w-full rounded-lg overflow-hidden border relative z-0">
                <MapContainer
                    center={initialCenter}
                    zoom={initialZoom}
                    style={{ height: "100%", width: "100%" }}
                    scrollWheelZoom={false}
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <FitBounds positions={positions} />

                    {pickupCoords && (
                        <Marker
                            position={[pickupCoords.lat, pickupCoords.lng]}
                            icon={markerIcon("green")}
                        >
                            <Popup>
                                <div className="text-sm">
                                    <strong>Pickup Location:</strong>
                                    <br />
                                    {selectedStreet && `${selectedStreet}`}
                                    <br />
                                    {selectedBarangay &&
                                        `${selectedBarangay}, `}
                                    {selectedCity && `${selectedCity}, `}
                                    {selectedProvince}
                                </div>
                            </Popup>
                        </Marker>
                    )}

                    {originPortObj && (
                        <Marker
                            position={[originPortObj.lat, originPortObj.lng]}
                            icon={markerIcon("yellow")}
                        >
                            <Popup>Origin Port: {originPortObj.label}</Popup>
                        </Marker>
                    )}

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

                    {pickupCoords && originPortObj && (
                        <Polyline
                            positions={[
                                [pickupCoords.lat, pickupCoords.lng],
                                [originPortObj.lat, originPortObj.lng]
                            ]}
                            pathOptions={{ color: "green", weight: 3 }}
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
                                dashArray: "10,10",
                                weight: 3
                            }}
                        />
                    )}
                </MapContainer>
            </div>
        </div>
    );
};

export default BookingStep4PL;
