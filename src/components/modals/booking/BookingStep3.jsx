import { useEffect, useState } from "react";
import { Controller, useWatch } from "react-hook-form";
import Select from "react-select";
import useTruckStore from "../../../utils/store/useTruckStore";

const BookingStep3 = ({ control, errors, partners }) => {
  const skipTrucking = useWatch({ control, name: "skipTrucking" });
  const pickupTruckerId = useWatch({ control, name: "pickup_trucker_id" });
  const deliveryTruckerId = useWatch({ control, name: "delivery_trucker_id" });

  const { trucks, fetchTrucks } = useTruckStore();
  const [filteredPickupTrucks, setFilteredPickupTrucks] = useState([]);
  const [filteredDeliveryTrucks, setFilteredDeliveryTrucks] = useState([]);

  // Trucking companies
  const truckingCompanies = partners.filter((partner) => partner.type === "trucking");

  useEffect(() => {
    fetchTrucks();
  }, [fetchTrucks]);

  // Filter trucks for pickup
  useEffect(() => {
    if (pickupTruckerId) {
      setFilteredPickupTrucks(
        trucks.filter((t) => String(t.trucking_company_id) === String(pickupTruckerId))
      );
    } else {
      setFilteredPickupTrucks([]);
    }
  }, [pickupTruckerId, trucks]);

  // Filter trucks for delivery
  useEffect(() => {
    if (deliveryTruckerId) {
      setFilteredDeliveryTrucks(
        trucks.filter((t) => String(t.trucking_company_id) === String(deliveryTruckerId))
      );
    } else {
      setFilteredDeliveryTrucks([]);
    }
  }, [deliveryTruckerId, trucks]);

  // Skip trucking if mode is Port-to-Port
  if (skipTrucking) {
    return (
      <div className="p-4 text-gray-500 italic">
        Trucking is not required for Port-to-Port bookings.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Pickup Trucking Company */}
      <div>
        <label className="input-label-modern">Pickup Trucking Company</label>
        <Controller
          name="pickup_trucker_id"
          control={control}
          render={({ field }) => (
            <Select
              value={
                field.value
                  ? truckingCompanies
                      .map((t) => ({ value: t.id, label: t.name }))
                      .find((opt) => opt.value === field.value) || null
                  : null
              }
              onChange={(option) => field.onChange(option ? option.value : "")}
              options={truckingCompanies.map((t) => ({
                value: t.id,
                label: t.name,
              }))}
              placeholder="Select pickup trucking company"
              isClearable
            />
          )}
        />
      </div>

      {/* Pickup Truck */}
      {pickupTruckerId && (
        <div>
          <label className="input-label-modern">Pickup Truck</label>
          <Controller
            name="pickup_truck_id"
            control={control}
            render={({ field }) => (
              <Select
                value={
                  field.value
                    ? filteredPickupTrucks
                        .map((truck) => ({
                          value: truck.id,
                          label: `${truck.plate_number} (${truck.model})`,
                        }))
                        .find((opt) => opt.value === field.value) || null
                    : null
                }
                onChange={(option) => field.onChange(option ? option.value : "")}
                options={filteredPickupTrucks.map((truck) => ({
                  value: truck.id,
                  label: `${truck.plate_number} (${truck.model})`,
                }))}
                placeholder={
                  filteredPickupTrucks.length > 0
                    ? "Select pickup truck"
                    : "No trucks available"
                }
                isClearable
              />
            )}
          />
          {errors.pickup_truck_id && (
            <p className="error-message">{errors.pickup_truck_id.message}</p>
          )}
        </div>
      )}

      {/* Delivery Trucking Company */}
      <div>
        <label className="input-label-modern">Delivery Trucking Company</label>
        <Controller
          name="delivery_trucker_id"
          control={control}
          render={({ field }) => (
            <Select
              value={
                field.value
                  ? truckingCompanies
                      .map((t) => ({ value: t.id, label: t.name }))
                      .find((opt) => opt.value === field.value) || null
                  : null
              }
              onChange={(option) => field.onChange(option ? option.value : "")}
              options={truckingCompanies.map((t) => ({
                value: t.id,
                label: t.name,
              }))}
              placeholder="Select delivery trucking company"
              isClearable
            />
          )}
        />
      </div>

      {/* Delivery Truck */}
      {deliveryTruckerId && (
        <div>
          <label className="input-label-modern">Delivery Truck</label>
          <Controller
            name="delivery_truck_id"
            control={control}
            render={({ field }) => (
              <Select
                value={
                  field.value
                    ? filteredDeliveryTrucks
                        .map((truck) => ({
                          value: truck.id,
                          label: `${truck.plate_number} (${truck.model})`,
                        }))
                        .find((opt) => opt.value === field.value) || null
                    : null
                }
                onChange={(option) => field.onChange(option ? option.value : "")}
                options={filteredDeliveryTrucks.map((truck) => ({
                  value: truck.id,
                  label: `${truck.plate_number} (${truck.model})`,
                }))}
                placeholder={
                  filteredDeliveryTrucks.length > 0
                    ? "Select delivery truck"
                    : "No trucks available"
                }
                isClearable
              />
            )}
          />
          {errors.delivery_truck_id && (
            <p className="error-message">{errors.delivery_truck_id.message}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default BookingStep3;
