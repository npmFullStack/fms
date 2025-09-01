import { useFieldArray, useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { zodResolver } from "@hookform/resolvers/zod";
import { shipSchema } from "../../schemas/shipSchema";
import useModal from "../../utils/hooks/useModal";
import FormModal from "./FormModal";
import {
    InformationCircleIcon,
    CubeIcon,
    PlusCircleIcon,
    TrashIcon,
    QuestionMarkCircleIcon
} from "@heroicons/react/24/outline";
import { PH_PORTS } from "../../utils/helpers/shipRoutes";

const AddShip = ({ isOpen, onClose, onSubmit, shippingLineId }) => {
    const {
        message,
        isLoading,
        setIsLoading,
        setSuccessMessage,
        setErrorMessage,
        handleClose: modalClose
    } = useModal(() => reset());

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: zodResolver(shipSchema),
        mode: "onChange",
        defaultValues: {
            shippingLineId,
            name: "",
            vesselNumber: "",
            routes: []
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "routes"
    });

    const handleAddRoute = () => {
        append({
            origin: null,
            destination: null,
            pricing: [
                { type: "LCL", price: "" },
                { type: "20FT", price: "" },
                { type: "40FT", price: "" }
            ]
        });
    };

    const onFormSubmit = async data => {
        try {
            setIsLoading(true);
            setSuccessMessage("Adding ship...");

            const result = await onSubmit(data);

            if (result.success) {
                setSuccessMessage("Ship added successfully");
                setTimeout(() => {
                    handleClose();
                }, 1500);
            } else {
                setErrorMessage(
                    result.error || "Failed to add ship. Please try again."
                );
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            setErrorMessage(
                error.message || "Failed to add ship. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        modalClose();
        onClose();
    };

    // Define fields for FormModal
    const fieldsConfig = [
        // Ship Name Field
        {
            name: "name",
            label: "Ship Name",
            type: "text",
            register: register("name"),
            error: errors.name?.message,
            placeholder: "Enter ship name"
        },
        // Vessel Number Field
        {
            name: "vesselNumber",
            label: "Vessel Number",
            type: "text",
            register: register("vesselNumber"),
            error: errors.vesselNumber?.message,
            placeholder: "Enter vessel number"
        },
        // Routes Section (custom render)
        {
            name: "routes",
            label: "Routes & Pricing",
            type: "custom",
            withTooltip: true,
            tooltipText:
                "Add shipping routes with origin, destination, and pricing for different container types",
            customRender: () => (
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <button
                            type="button"
                            onClick={handleAddRoute}
                            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <PlusCircleIcon className="w-5 h-5" /> Add Route
                        </button>
                    </div>

                    {fields.length === 0 && (
                        <p className="text-sm text-slate-500 mb-4">
                            No routes added yet. Click "Add Route" to create
                            your first route.
                        </p>
                    )}

                    {fields.map((field, index) => (
                        <div
                            key={field.id}
                            className="border rounded-lg p-4 mb-4 bg-slate-50"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="font-medium text-slate-700">
                                    Route {index + 1}
                                </h4>
                                <button
                                    type="button"
                                    onClick={() => remove(index)}
                                    className="flex items-center gap-1 text-red-500 hover:text-red-700"
                                >
                                    <TrashIcon className="w-4 h-4" />
                                    Remove
                                </button>
                            </div>

                            {/* Origin and Destination - Vertical layout */}
                            <div className="space-y-4 mb-4">
                                <div>
                                    <label className="input-label-modern">
                                        Origin Port
                                    </label>
                                    <Controller
                                        name={`routes.${index}.origin`}
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                options={PH_PORTS}
                                                placeholder="Select origin port"
                                                className="react-select-modern"
                                            />
                                        )}
                                    />
                                </div>
                                <div>
                                    <label className="input-label-modern">
                                        Destination Port
                                    </label>
                                    <Controller
                                        name={`routes.${index}.destination`}
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                options={PH_PORTS}
                                                placeholder="Select destination port"
                                                className="react-select-modern"
                                            />
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Pricing Section */}
                            <div className="space-y-3">
                                <h5 className="font-medium text-slate-700 text-sm">
                                    Pricing
                                </h5>
                                {["LCL", "20FT", "40FT"].map(
                                    (type, priceIndex) => (
                                        <div
                                            key={type}
                                            className="grid grid-cols-1 md:grid-cols-2 gap-3"
                                        >
                                            <label className="input-label-modern md:col-span-2">
                                                {type} Container Price
                                            </label>
                                            <div className="md:col-span-2">
                                                <input
                                                    type="number"
                                                    {...register(
                                                        `routes.${index}.pricing.${priceIndex}.price`
                                                    )}
                                                    className="input-field-modern"
                                                    placeholder={`Enter ${type} price`}
                                                />
                                                <input
                                                    type="hidden"
                                                    value={type}
                                                    {...register(
                                                        `routes.${index}.pricing.${priceIndex}.type`
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )
        }
    ];

    // Info box for additional information
    const infoBox = {
        title: "Route Information",
        items: [
            {
                icon: (
                    <QuestionMarkCircleIcon className="h-3 w-3 text-blue-600" />
                ),
                text: "Add at least one route with origin, destination, and pricing"
            },
            {
                icon: (
                    <QuestionMarkCircleIcon className="h-3 w-3 text-blue-600" />
                ),
                text: "Pricing should include LCL, 20FT, and 40FT container types"
            }
        ]
    };

    return (
        <FormModal
            isOpen={isOpen}
            onClose={handleClose}
            title="Add Ship"
            message={
                message.text
                    ? {
                          type: message.type,
                          text: message.text
                      }
                    : null
            }
            isLoading={isLoading}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit(onFormSubmit)}
            fields={fieldsConfig}
            infoBox={infoBox}
            buttonText="Add Ship"
        />
    );
};

export default AddShip;
