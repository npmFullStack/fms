// components/modals/AddBooking.jsx
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookingSchema } from "../../schemas/bookingSchema";
import { stepSchemas } from "../../schemas/bookingSchema";
import useBookingStore from "../../utils/store/useBookingStore";
import usePartnerStore from "../../utils/store/usePartnerStore";
import useShippingLineStore from "../../utils/store/useShippingLineStore";
import useTruckStore from "../../utils/store/useTruckStore";
import FormModal from "./FormModal";
import {
    MapPinIcon,
    TruckIcon,
    CubeIcon,
    CalendarIcon,
    CurrencyDollarIcon,
    UserIcon,
    PhoneIcon,
    EnvelopeIcon,
    ArrowRightIcon,
    ArrowLeftIcon,
    QuestionMarkCircleIcon,
    XMarkIcon,
    InformationCircleIcon,
    DocumentTextIcon,
    BuildingStorefrontIcon
} from "@heroicons/react/24/outline";
import Select from "react-select";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import useModal from "../../utils/hooks/useModal";
import { useEffect, useState, useRef } from "react";
import { Suspense, lazy } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default markers in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png"
});

// Dynamically import the map component to avoid SSR issues
const DynamicMap = lazy(() =>
    import("react-leaflet").then(mod => ({
        default: mod.MapContainer
    }))
);

// Map click handler component
function MapClickHandler({ onMapClick }) {
    useMapEvents({
        click(e) {
            onMapClick(e);
        }
    });
    return null;
}

const AddBooking = ({ isOpen, onClose }) => {
    const {
        message,
        isLoading,
        setIsLoading,
        setSuccessMessage,
        setErrorMessage,
        handleClose: modalClose
    } = useModal(() => {
        reset();
        setCurrentStep(1);
        setSelectedShippingLine(null);
        setSelectedShip(null);
        setSelectedTrucker(null);
        setOriginLocation(null);
        setDestinationLocation(null);
    });

    const createBooking = useBookingStore(state => state.createBooking);
    const { partners, fetchPartners } = usePartnerStore();
    const { ships, fetchShips } = useShippingLineStore();
    const { trucks, fetchTrucks } = useTruckStore();
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedShippingLine, setSelectedShippingLine] = useState(null);
    const [selectedShip, setSelectedShip] = useState(null);
    const [selectedTrucker, setSelectedTrucker] = useState(null);
    const [originLocation, setOriginLocation] = useState(null);
    const [destinationLocation, setDestinationLocation] = useState(null);
    const [addressSearch, setAddressSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const mapRef = useRef();

    const containerTypes = [
        { value: "LCL", label: "LCL" },
        { value: "20FT", label: "20FT" },
        { value: "40FT", label: "40FT" },
        { value: "40FT_HC", label: "40FT High Cube" }
    ];

    const bookingModes = [
        { value: "DOOR_TO_DOOR", label: "Door to Door" },
        { value: "PIER_TO_PIER", label: "Pier to Pier" },
        { value: "CY_TO_DOOR", label: "CY to Door" },
        { value: "DOOR_TO_CY", label: "Door to CY" },
        { value: "CY_TO_CY", label: "CY to CY" }
    ];

    const statusOptions = [
        { value: "PENDING", label: "Pending" },
        { value: "CONFIRMED", label: "Confirmed" },
        { value: "IN_TRANSIT", label: "In Transit" },
        { value: "ARRIVED", label: "Arrived" },
        { value: "DELIVERED", label: "Delivered" },
        { value: "COMPLETED", label: "Completed" }
    ];

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors, isValid, isSubmitting },
        watch,
        setValue,
        trigger,
        getValues,
        setError,
        clearErrors
    } = useForm({
        resolver: zodResolver(bookingSchema),
        mode: "onChange",
        defaultValues: {
            shipper: "",
            first_name: "",
            last_name: "",
            email: "",
            phone: "",
            shipping_line_id: "",
            ship_id: "",
            container_type: "20FT",
            booking_mode: "DOOR_TO_DOOR",
            origin: "",
            destination: "",
            origin_lat: "",
            origin_lng: "",
            destination_lat: "",
            destination_lng: "",
            preferred_departure: "",
            preferred_delivery: "",
            commodity: "",
            quantity: 1,
            freight_charge: 0,
            trucking_charge: 0,
            total_amount: 0,
            van_number: "",
            seal_number: "",
            status: "PENDING",
            trucker_id: ""
        }
    });

    useEffect(() => {
        if (isOpen) {
            fetchPartners();
            fetchTrucks();
        }
    }, [isOpen, fetchPartners, fetchTrucks]);

    useEffect(() => {
        const freight = watch("freight_charge") || 0;
        const trucking = watch("trucking_charge") || 0;
        const total = Number(freight) + Number(trucking);
        setValue("total_amount", total);
    }, [watch("freight_charge"), watch("trucking_charge"), setValue]);

    const shippingLines = partners.filter(p => p.type === "shipping");
    const truckers = trucks;

    const handleShippingLineChange = async selectedOption => {
        setSelectedShippingLine(selectedOption);
        setSelectedShip(null);
        setValue("shipping_line_id", selectedOption?.value || "", {
            shouldValidate: true
        });
        setValue("ship_id", "", { shouldValidate: true });
        if (selectedOption) {
            await fetchShips(selectedOption.value);
        }
    };

    const handleShipChange = selectedOption => {
        setSelectedShip(selectedOption);
        setValue("ship_id", selectedOption?.value || "", {
            shouldValidate: true
        });
    };

    const handleTruckerChange = selectedOption => {
        setSelectedTrucker(selectedOption);
        setValue("trucker_id", selectedOption?.value || "", {
            shouldValidate: true
        });
    };

    const handleMapClick = (e, type) => {
        const { lat, lng } = e.latlng;
        if (type === "origin") {
            setOriginLocation({ lat, lng });
            setValue("origin_lat", lat);
            setValue("origin_lng", lng);

            // Reverse geocode to get address (simplified)
            fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
            )
                .then(response => response.json())
                .then(data => {
                    if (data && data.display_name) {
                        setValue("origin", data.display_name);
                    }
                });
        } else {
            setDestinationLocation({ lat, lng });
            setValue("destination_lat", lat);
            setValue("destination_lng", lng);

            // Reverse geocode to get address (simplified)
            fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
            )
                .then(response => response.json())
                .then(data => {
                    if (data && data.display_name) {
                        setValue("destination", data.display_name);
                    }
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
            .then(response => response.json())
            .then(data => {
                setSearchResults(data);
            });
    };

    const selectSearchResult = (result, type) => {
        const { lat, lon, display_name } = result;
        if (type === "origin") {
            setOriginLocation({ lat: parseFloat(lat), lng: parseFloat(lon) });
            setValue("origin_lat", lat);
            setValue("origin_lng", lon);
            setValue("origin", display_name);
        } else {
            setDestinationLocation({
                lat: parseFloat(lat),
                lng: parseFloat(lon)
            });
            setValue("destination_lat", lat);
            setValue("destination_lng", lon);
            setValue("destination", display_name);
        }
        setAddressSearch("");
        setSearchResults([]);
    };

    const onSubmit = async data => {
        try {
            setIsLoading(true);

            const bookingData = {
                ...data,
                preferred_departure: new Date(
                    data.preferred_departure
                ).toISOString(),
                preferred_delivery: data.preferred_delivery
                    ? new Date(data.preferred_delivery).toISOString()
                    : null
            };

            const result = await createBooking(bookingData);
            if (result.success) {
                setSuccessMessage("Booking created successfully");
                setTimeout(() => {
                    handleClose();
                }, 1500);
            } else {
                setErrorMessage(
                    result.error ||
                        "Failed to create booking. Please try again."
                );
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            setErrorMessage(
                error.message || "Failed to create booking. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        modalClose();
        onClose();
    };

    const nextStep = async e => {
        e?.preventDefault();
        e?.stopPropagation();

        console.log("Next step clicked, current step:", currentStep);

        clearErrors();

        const stepFields = getStepFields(currentStep);
        console.log("Step fields:", stepFields);

        const isStepValid = await trigger(stepFields);
        console.log("Is step valid:", isStepValid);
        console.log("Current errors:", errors);

        if (!isStepValid) {
            console.log("Validation failed, current errors:", errors);
            return;
        }

        const currentSchema = stepSchemas[currentStep - 1];
        const values = getValues();

        const stepValues = {};
        stepFields.forEach(field => {
            stepValues[field] = values[field];
        });

        console.log("Step values for validation:", stepValues);

        const result = currentSchema.safeParse(stepValues);
        console.log("Schema validation result:", result);

        if (!result.success) {
            console.log("Schema validation errors:", result.error.errors);
            result.error.errors.forEach(err => {
                setError(err.path[0], { message: err.message });
            });
            return;
        }

        console.log("Moving to next step");
        setCurrentStep(prev => prev + 1);
    };

    const prevStep = () => {
        setCurrentStep(prev => prev - 1);
    };

    const getStepFields = step => {
        switch (step) {
            case 1:
                return ["shipper", "first_name", "last_name", "email", "phone"];
            case 2:
                return [
                    "shipping_line_id",
                    "ship_id",
                    "container_type",
                    "booking_mode",
                    "trucker_id"
                ];
            case 3:
                return [
                    "origin",
                    "destination",
                    "origin_lat",
                    "origin_lng",
                    "destination_lat",
                    "destination_lng"
                ];
            case 4:
                return [
                    "preferred_departure",
                    "preferred_delivery",
                    "commodity",
                    "quantity",
                    "van_number",
                    "seal_number"
                ];
            case 5:
                return ["freight_charge", "trucking_charge", "status"];
            default:
                return [];
        }
    };

    // Tooltip component
    const TooltipIcon = ({ text }) => (
        <div className="relative group inline-block ml-2">
            <QuestionMarkCircleIcon className="h-4 w-4 text-gray-400 cursor-help" />
            <div
                className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden
          group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 z-50
          whitespace-nowrap"
            >
                {text}
                <div
                    className="absolute top-full left-1/2 transform -translate-x-1/2 border-4
            border-transparent border-t-gray-800"
                ></div>
            </div>
        </div>
    );

    const fields = [
        // Step 1: Customer Details
        {
            name: "shipper",
            label: "Shipper",
            type: "text",
            step: 1,
            register: register("shipper", {
                required: "Shipper is required"
            }),
            error: errors.shipper?.message,
            placeholder: "Enter shipper name",
            withTooltip: true,
            tooltipText: "Company or person sending the goods"
        },
        {
            name: "first_name",
            label: "First Name",
            type: "text",
            step: 1,
            register: register("first_name", {
                required: "First name is required"
            }),
            error: errors.first_name?.message,
            placeholder: "Enter customer's first name"
        },
        {
            name: "last_name",
            label: "Last Name",
            type: "text",
            step: 1,
            register: register("last_name", {
                required: "Last name is required"
            }),
            error: errors.last_name?.message,
            placeholder: "Enter customer's last name"
        },
        {
            name: "email",
            label: "Email",
            type: "email",
            step: 1,
            register: register("email"),
            error: errors.email?.message,
            placeholder: "Enter customer's email",
            withTooltip: true,
            tooltipText: "Optional - Customer's email for notifications"
        },
        {
            name: "phone",
            label: "Phone Number",
            type: "custom",
            step: 1,
            error: errors.phone?.message,
            withTooltip: true,
            tooltipText: "Customer's contact number for updates",
            customRender: () => (
                <div>
                    <div className="flex items-center mb-1">
                        <label className="block text-sm font-medium text-gray-700">
                            Phone Number
                        </label>
                        <TooltipIcon text="Customer's contact number for updates" />
                    </div>
                    <Controller
                        name="phone"
                        control={control}
                        rules={{
                            required: "Phone number is required",
                            validate: value => {
                                if (
                                    value &&
                                    !value.startsWith("+63") &&
                                    !value.startsWith("63")
                                ) {
                                    return "Philippine numbers should start with +63 or 63";
                                }
                                return true;
                            }
                        }}
                        render={({ field: { onChange, value } }) => (
                            <PhoneInput
                                value={value}
                                onChange={onChange}
                                defaultCountry="PH"
                                className="input-field-modern"
                                placeholder="Enter phone number (e.g., +639123456789)"
                                international
                                withCountryCallingCode
                            />
                        )}
                    />
                    {errors.phone && (
                        <p className="error-message">{errors.phone.message}</p>
                    )}
                </div>
            )
        },
        // Step 2: Shipping Details
        {
            name: "shipping_line_id",
            label: "Shipping Line",
            type: "custom",
            step: 2,
            error: errors.shipping_line_id?.message,
            withTooltip: true,
            tooltipText: "Select the shipping line that will handle the cargo",
            customRender: () => (
                <div>
                    <div className="flex items-center mb-1">
                        <label className="block text-sm font-medium text-gray-700">
                            Shipping Line
                        </label>
                        <TooltipIcon text="Select the shipping line that will handle the cargo" />
                    </div>
                    <Controller
                        name="shipping_line_id"
                        control={control}
                        rules={{ required: "Shipping line is required" }}
                        render={({ field }) => (
                            <Select
                                {...field}
                                options={shippingLines.map(sl => ({
                                    value: sl.id,
                                    label: sl.name,
                                    logo: sl.logo_url
                                }))}
                                value={selectedShippingLine}
                                onChange={handleShippingLineChange}
                                getOptionLabel={option => (
                                    <div className="flex items-center gap-2">
                                        {option.logo && (
                                            <img
                                                src={option.logo}
                                                alt=""
                                                className="w-6 h-6 rounded"
                                            />
                                        )}
                                        <span>{option.label}</span>
                                    </div>
                                )}
                                className="react-select-container"
                                classNamePrefix="react-select"
                                placeholder="Select shipping line"
                            />
                        )}
                    />
                    {errors.shipping_line_id && (
                        <p className="error-message">
                            {errors.shipping_line_id.message}
                        </p>
                    )}
                </div>
            )
        },
        {
            name: "ship_id",
            label: "Ship",
            type: "custom",
            step: 2,
            error: errors.ship_id?.message,
            withTooltip: true,
            tooltipText: "Select the specific vessel for this booking",
            customRender: () => (
                <div>
                    <div className="flex items-center mb-1">
                        <label className="block text-sm font-medium text-gray-700">
                            Ship
                        </label>
                        <TooltipIcon text="Select the specific vessel for this booking" />
                    </div>
                    <Controller
                        name="ship_id"
                        control={control}
                        rules={{ required: "Ship is required" }}
                        render={({ field }) => (
                            <Select
                                {...field}
                                options={ships.map(ship => ({
                                    value: ship.id,
                                    label: ship.name,
                                    vessel: ship.vessel_number
                                }))}
                                value={selectedShip}
                                onChange={handleShipChange}
                                getOptionLabel={option => (
                                    <div>
                                        <div className="font-medium">
                                            {option.label}
                                        </div>
                                        {option.vessel && (
                                            <div className="text-sm text-gray-500">
                                                Vessel: {option.vessel}
                                            </div>
                                        )}
                                    </div>
                                )}
                                className="react-select-container"
                                classNamePrefix="react-select"
                                placeholder="Select ship"
                                isDisabled={!selectedShippingLine}
                            />
                        )}
                    />
                    {errors.ship_id && (
                        <p className="error-message">{errors.ship_id.message}</p>
                    )}
                </div>
            )
        },
        {
            name: "container_type",
            label: "Container Type",
            type: "custom",
            step: 2,
            error: errors.container_type?.message,
            withTooltip: true,
            tooltipText: "Choose the appropriate container size for your cargo",
            customRender: () => (
                <div>
                    <div className="flex items-center mb-1">
                        <label className="block text-sm font-medium text-gray-700">
                            Container Type
                        </label>
                        <TooltipIcon text="Choose the appropriate container size for your cargo" />
                    </div>
                    <Controller
                        name="container_type"
                        control={control}
                        rules={{ required: "Container type is required" }}
                        render={({ field }) => (
                            <Select
                                {...field}
                                options={containerTypes}
                                value={containerTypes.find(
                                    ct => ct.value === field.value
                                )}
                                onChange={opt => field.onChange(opt.value)}
                                className="react-select-container"
                                classNamePrefix="react-select"
                            />
                        )}
                    />
                    {errors.container_type && (
                        <p className="error-message">
                            {errors.container_type.message}
                        </p>
                    )}
                </div>
            )
        },
        {
            name: "booking_mode",
            label: "Booking Mode",
            type: "custom",
            step: 2,
            error: errors.booking_mode?.message,
            withTooltip: true,
            tooltipText: "Select the service type for your shipment",
            customRender: () => (
                <div>
                    <div className="flex items-center mb-1">
                        <label className="block text-sm font-medium text-gray-700">
                            Booking Mode
                        </label>
                        <TooltipIcon text="Select the service type for your shipment" />
                    </div>
                    <Controller
                        name="booking_mode"
                        control={control}
                        rules={{ required: "Booking mode is required" }}
                        render={({ field }) => (
                            <Select
                                {...field}
                                options={bookingModes}
                                value={bookingModes.find(
                                    bm => bm.value === field.value
                                )}
                                onChange={opt => field.onChange(opt.value)}
                                className="react-select-container"
                                classNamePrefix="react-select"
                            />
                        )}
                    />
                    {errors.booking_mode && (
                        <p className="error-message">
                            {errors.booking_mode.message}
                        </p>
                    )}
                </div>
            )
        },
        {
            name: "trucker_id",
            label: "Trucking Company",
            type: "custom",
            step: 2,
            error: errors.trucker_id?.message,
            withTooltip: true,
            tooltipText:
                "Optional - Select trucking company for land transportation",
            customRender: () => (
                <div>
                    <div className="flex items-center mb-1">
                        <label className="block text-sm font-medium text-gray-700">
                            Trucking Company
                        </label>
                        <TooltipIcon text="Optional - Select trucking company for land transportation" />
                    </div>
                    <Controller
                        name="trucker_id"
                        control={control}
                        render={({ field }) => (
                            <Select
                                {...field}
                                options={truckers.map(trucker => ({
                                    value: trucker.id,
                                    label: trucker.name
                                }))}
                                value={selectedTrucker}
                                onChange={handleTruckerChange}
                                className="react-select-container"
                                classNamePrefix="react-select"
                                placeholder="Select trucking company (Optional)"
                                isClearable
                            />
                        )}
                    />
                    {errors.trucker_id && (
                        <p className="error-message">
                            {errors.trucker_id.message}
                        </p>
                    )}
                </div>
            )
        },
        // Step 3: Route & Locations
        {
            name: "origin",
            label: "Origin Location",
            type: "custom",
            step: 3,
            error: errors.origin?.message,
            withTooltip: true,
            tooltipText: "Starting point of the shipment",
            customRender: () => (
                <div>
                    <div className="flex items-center mb-1">
                        <label className="block text-sm font-medium text-gray-700">
                            Origin Location
                        </label>
                        <TooltipIcon text="Starting point of the shipment" />
                    </div>
                    <div className="mb-2">
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={addressSearch}
                                onChange={e => setAddressSearch(e.target.value)}
                                placeholder="Search for address..."
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                            />
                            <button
                                type="button"
                                onClick={searchAddress}
                                className="px-3 py-2 bg-blue-600 text-white rounded-lg"
                            >
                                Search
                            </button>
                        </div>
                        {searchResults.length > 0 && (
                            <div className="border border-gray-200 rounded-lg max-h-40 overflow-y-auto">
                                {searchResults.map((result, index) => (
                                    <div
                                        key={index}
                                        className="p-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() =>
                                            selectSearchResult(result, "origin")
                                        }
                                    >
                                        {result.display_name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="h-64 border border-gray-300 rounded-lg overflow-hidden">
                        <Suspense
                            fallback={
                                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                                    Loading map...
                                </div>
                            }
                        >
                            <DynamicMap
                                center={[14.5995, 120.9842]} // Manila center
                                zoom={13}
                                style={{ height: "100%", width: "100%" }}
                                ref={mapRef}
                            >
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                />
                                <MapClickHandler
                                    onMapClick={e =>
                                        handleMapClick(e, "origin")
                                    }
                                />
                                {originLocation && (
                                    <Marker
                                        position={[
                                            originLocation.lat,
                                            originLocation.lng
                                        ]}
                                    />
                                )}
                            </DynamicMap>
                        </Suspense>
                    </div>
                    <input
                        type="text"
                        {...register("origin", {
                            required: "Origin is required"
                        })}
                        className="hidden"
                    />
                    <input
                        type="hidden"
                        {...register("origin_lat", {
                            required: "Origin latitude is required"
                        })}
                    />
                    <input
                        type="hidden"
                        {...register("origin_lng", {
                            required: "Origin longitude is required"
                        })}
                    />
                    {errors.origin && (
                        <p className="error-message">{errors.origin.message}</p>
                    )}
                    {originLocation && (
                        <p className="text-sm text-gray-600 mt-1">
                            Selected: {getValues("origin")}
                        </p>
                    )}
                </div>
            )
        },
        {
            name: "destination",
            label: "Destination Location",
            type: "custom",
            step: 3,
            error: errors.destination?.message,
            withTooltip: true,
            tooltipText: "Final destination of the shipment",
            customRender: () => (
                <div>
                    <div className="flex items-center mb-1">
                        <label className="block text-sm font-medium text-gray-700">
                            Destination Location
                        </label>
                        <TooltipIcon text="Final destination of the shipment" />
                    </div>
                    <div className="mb-2">
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={addressSearch}
                                onChange={e => setAddressSearch(e.target.value)}
                                placeholder="Search for address..."
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                            />
                            <button
                                type="button"
                                onClick={searchAddress}
                                className="px-3 py-2 bg-blue-600 text-white rounded-lg"
                            >
                                Search
                            </button>
                        </div>
                        {searchResults.length > 0 && (
                            <div className="border border-gray-200 rounded-lg max-h-40 overflow-y-auto">
                                {searchResults.map((result, index) => (
                                    <div
                                        key={index}
                                        className="p-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() =>
                                            selectSearchResult(
                                                result,
                                                "destination"
                                            )
                                        }
                                    >
                                        {result.display_name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="h-64 border border-gray-300 rounded-lg overflow-hidden">
                        <DynamicMap
                            center={[14.5995, 120.9842]} // Manila center
                            zoom={13}
                            style={{ height: "100%", width: "100%" }}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            <MapClickHandler
                                onMapClick={e =>
                                    handleMapClick(e, "destination")
                                }
                            />
                            {destinationLocation && (
                                <Marker
                                    position={[
                                        destinationLocation.lat,
                                        destinationLocation.lng
                                    ]}
                                />
                            )}
                        </DynamicMap>
                    </div>
                    <input
                        type="text"
                        {...register("destination", {
                            required: "Destination is required"
                        })}
                        className="hidden"
                    />
                    <input
                        type="hidden"
                        {...register("destination_lat", {
                            required: "Destination latitude is required"
                        })}
                    />
                    <input
                        type="hidden"
                        {...register("destination_lng", {
                            required: "Destination longitude is required"
                        })}
                    />
                    {errors.destination && (
                        <p className="error-message">
                            {errors.destination.message}
                        </p>
                    )}
                    {destinationLocation && (
                        <p className="text-sm text-gray-600 mt-1">
                            Selected: {getValues("destination")}
                        </p>
                    )}
                </div>
            )
        },
        // Step 4: Dates & Cargo Details
        {
            name: "preferred_departure",
            label: "Preferred Departure",
            type: "datetime-local",
            step: 4,
            register: register("preferred_departure", {
                required: "Departure date is required"
            }),
            error: errors.preferred_departure?.message,
            withTooltip: true,
            tooltipText: "Estimated date when cargo should depart"
        },
        {
            name: "preferred_delivery",
            label: "Preferred Delivery",
            type: "datetime-local",
            step: 4,
            register: register("preferred_delivery"),
            error: errors.preferred_delivery?.message,
            withTooltip: true,
            tooltipText: "Estimated date when cargo should be delivered"
        },
        {
            name: "commodity",
            label: "Commodity",
            type: "text",
            step: 4,
            register: register("commodity", {
                required: "Commodity is required"
            }),
            error: errors.commodity?.message,
            placeholder: "e.g., Electronics, Furniture, etc.",
            withTooltip: true,
            tooltipText: "Type of goods being shipped"
        },
        {
            name: "quantity",
            label: "Quantity",
            type: "number",
            step: 4,
            register: register("quantity", {
                required: "Quantity is required",
                valueAsNumber: true,
                min: { value: 1, message: "Quantity must be at least 1" }
            }),
            error: errors.quantity?.message,
            min: 1,
            withTooltip: true,
            tooltipText: "Number of containers or units"
        },
        {
            name: "van_number",
            label: "Van Number",
            type: "text",
            step: 4,
            register: register("van_number"),
            error: errors.van_number?.message,
            placeholder: "Enter van/container number",
            withTooltip: true,
            tooltipText: "Optional - Container identification number"
        },
        {
            name: "seal_number",
            label: "Seal Number",
            type: "text",
            step: 4,
            register: register("seal_number"),
            error: errors.seal_number?.message,
            placeholder: "Enter seal number",
            withTooltip: true,
            tooltipText: "Optional - Container seal identification number"
        },
        // Step 5: Pricing & Status
        {
            name: "freight_charge",
            label: "Freight Charge",
            type: "number",
            step: 5,
            register: register("freight_charge", {
                valueAsNumber: true,
                min: { value: 0, message: "Freight charge cannot be negative" }
            }),
            error: errors.freight_charge?.message,
            step: "0.01",
            withTooltip: true,
            tooltipText: "Cost for ocean freight shipping"
        },
        {
            name: "trucking_charge",
            label: "Trucking Charge",
            type: "number",
            step: 5,
            register: register("trucking_charge", {
                valueAsNumber: true,
                min: { value: 0, message: "Trucking charge cannot be negative" }
            }),
            error: errors.trucking_charge?.message,
            step: "0.01",
            withTooltip: true,
            tooltipText: "Cost for land transportation"
        },
        {
            name: "total_amount",
            label: "Total Amount",
            type: "number",
            step: 5,
            register: register("total_amount", { valueAsNumber: true }),
            error: errors.total_amount?.message,
            step: "0.01",
            disabled: true,
            withTooltip: true,
            tooltipText: "Automatically calculated total cost"
        },
        {
            name: "status",
            label: "Status",
            type: "custom",
            step: 5,
            error: errors.status?.message,
            withTooltip: true,
            tooltipText: "Current status of the booking",
            customRender: () => (
                <div>
                    <div className="flex items-center mb-1">
                        <label className="block text-sm font-medium text-gray-700">
                            Status
                        </label>
                        <TooltipIcon text="Current status of the booking" />
                    </div>
                    <Controller
                        name="status"
                        control={control}
                        rules={{ required: "Status is required" }}
                        render={({ field }) => (
                            <Select
                                {...field}
                                options={statusOptions}
                                value={statusOptions.find(
                                    so => so.value === field.value
                                )}
                                onChange={opt => field.onChange(opt.value)}
                                className="react-select-container"
                                classNamePrefix="react-select"
                            />
                        )}
                    />
                    {errors.status && (
                        <p className="error-message">{errors.status.message}</p>
                    )}
                </div>
            )
        }
    ];

    const currentStepFields = fields.filter(
        field => field.step === currentStep
    );

    const infoBox = {
        title: "Booking Information",
        items: [
            {
                icon: (
                    <TruckIcon className="h-4 w-4 mt-0.5 text-blue-500 flex-shrink-0" />
                ),
                text: "HWB Number will be generated automatically after booking creation"
            },
            {
                icon: (
                    <MapPinIcon className="h-4 w-4 mt-0.5 text-blue-500 flex-shrink-0" />
                ),
                text: "Click on the map to select pickup and delivery locations"
            },
            {
                icon: (
                    <CalendarIcon className="h-4 w-4 mt-0.5 text-blue-500 flex-shrink-0" />
                ),
                text: "Dates are estimates and subject to change based on availability"
            },
            {
                icon: (
                    <CurrencyDollarIcon className="h-4 w-4 mt-0.5 text-blue-500 flex-shrink-0" />
                ),
                text: "Total amount is calculated automatically from freight and trucking charges"
            }
        ]
    };

    const stepTitles = [
        "Customer Details",
        "Shipping Details",
        "Route & Locations",
        "Dates & Cargo",
        "Pricing & Status"
    ];

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                        onClick={handleClose}
                    ></div>

                    {/* Modal */}
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-xl">
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        Create New Booking
                                    </h2>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Step {currentStep} of 5:{" "}
                                        {stepTitles[currentStep - 1]}
                                    </p>
                                </div>
                                <button
                                    onClick={handleClose}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <XMarkIcon className="h-6 w-6" />
                                </button>
                            </div>

                            {/* Progress Bar */}
                            <div className="px-6 py-4 border-b">
                                <div className="flex items-center space-x-4">
                                    {[1, 2, 3, 4, 5].map(step => (
                                        <div
                                            key={step}
                                            className="flex items-center"
                                        >
                                            <div
                                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                                    step <= currentStep
                                                        ? "bg-blue-600 text-white"
                                                        : "bg-gray-200 text-gray-500"
                                                }`}
                                            >
                                                {step}
                                            </div>
                                            {step < 5 && (
                                                <div
                                                    className={`w-12 h-1 mx-2 ${
                                                        step < currentStep
                                                            ? "bg-blue-600"
                                                            : "bg-gray-200"
                                                    }`}
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Content */}
                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                className="p-6"
                            >
                                {/* Message Display */}
                                {message.text && (
                                    <div
                                        className={`mb-4 p-4 rounded-lg ${
                                            message.type === "success"
                                                ? "bg-green-50 text-green-800 border border-green-200"
                                                : "bg-red-50 text-red-800 border border-red-200"
                                        }`}
                                    >
                                        {message.text}
                                    </div>
                                )}

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* Form Fields */}
                                    <div className="lg:col-span-2 space-y-4">
                                        {currentStepFields.map(field => (
                                            <div key={field.name}>
                                                {field.type === "custom" ? (
                                                    field.customRender()
                                                ) : (
                                                    <div>
                                                        <div className="flex items-center mb-1">
                                                            <label className="block text-sm font-medium text-gray-700">
                                                                {field.label}
                                                            </label>
                                                            {field.withTooltip && (
                                                                <TooltipIcon
                                                                    text={
                                                                        field.tooltipText
                                                                    }
                                                                />
                                                            )}
                                                        </div>
                                                        <input
                                                            {...field.register}
                                                            type={field.type}
                                                            placeholder={
                                                                field.placeholder
                                                            }
                                                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                                field.error
                                                                    ? "border-red-300"
                                                                    : "border-gray-300"
                                                            } ${
                                                                field.disabled
                                                                    ? "bg-gray-100"
                                                                    : ""
                                                            }`}
                                                            disabled={
                                                                field.disabled
                                                            }
                                                            min={field.min}
                                                            step={field.step}
                                                        />
                                                        {field.error && (
                                                            <p className="error-message">
                                                                {field.error}
                                                            </p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Info Box */}
                                    <div className="lg:col-span-1">
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                            <div className="flex items-center gap-2 mb-3">
                                                <InformationCircleIcon className="h-5 w-5 text-blue-600" />
                                                <h3 className="font-medium text-blue-900">
                                                    {infoBox.title}
                                                </h3>
                                            </div>
                                            <div className="space-y-2">
                                                {infoBox.items.map(
                                                    (item, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex items-start gap-2"
                                                        >
                                                            {item.icon}
                                                            <span className="text-sm text-blue-800">
                                                                {item.text}
                                                            </span>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Navigation Buttons */}
                                <div className="flex justify-between mt-8 pt-6 border-t">
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        disabled={currentStep === 1}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
                                            currentStep === 1
                                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                        }`}
                                    >
                                        <ArrowLeftIcon className="h-4 w-4" />
                                        Previous
                                    </button>

                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={handleClose}
                                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>

                                        {currentStep < 5 ? (
                                            <button
                                                type="button"
                                                onClick={nextStep}
                                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                            >
                                                Next
                                                <ArrowRightIcon className="h-4 w-4" />
                                            </button>
                                        ) : (
                                            <button
                                                type="submit"
                                                disabled={
                                                    isLoading || isSubmitting
                                                }
                                                className={`px-4 py-2 rounded-lg font-medium ${
                                                    isLoading || isSubmitting
                                                        ? "bg-gray-400 text-white cursor-not-allowed"
                                                        : "bg-green-600 text-white hover:bg-green-700"
                                                }`}
                                            >
                                                {isLoading || isSubmitting
                                                    ? "Creating..."
                                                    : "Create Booking"}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AddBooking;
