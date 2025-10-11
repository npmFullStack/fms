// components/modals/UpdateCargo.jsx
import { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import { toast } from "react-hot-toast";
import FormModal from "./FormModal";
import useBookingStore from "../../utils/store/useBookingStore";
import useContainerStore from "../../utils/store/useContainerStore";
import { toCaps, getStatusBadge } from "../../utils/helpers/tableDataFormatters";

const UpdateCargo = ({ isOpen, onClose, booking, dateType, containerId }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { updateBookingStatusHistory } = useBookingStore();
  const { updateContainer } = useContainerStore();

  // 🧠 Load initial date safely (runs always, avoids hook order issue)
  useEffect(() => {
    if (!booking || !dateType) return;

    if (dateType === "empty_return" && containerId) {
      const container = booking?.containers?.find(c => c.id === containerId);
      setSelectedDate(
        container?.returned_date
          ? new Date(container.returned_date).toISOString().split("T")[0]
          : ""
      );
    } else {
      const statusMap = {
        origin_pickup: "LOADED_TO_TRUCK",
        origin_port_arrival: "ARRIVED_ORIGIN_PORT",
        stuffing_date: "LOADED_TO_SHIP",
        atd: "IN_TRANSIT",
        ata: "ARRIVED_DESTINATION_PORT",
        dest_port_pickup: "OUT_FOR_DELIVERY",
        dest_delivery: "DELIVERED"
      };
      const status = statusMap[dateType];
      const entry = booking?.status_history?.find(h => h.status === status);
      setSelectedDate(
        entry ? new Date(entry.status_date).toISOString().split("T")[0] : ""
      );
    }
  }, [booking, dateType, containerId]);

  // 🧠 Compute status badge safely
  const { label: statusLabel, bg: statusBg, text: statusText } =
    booking?.status
      ? getStatusBadge(booking.status)
      : { label: "Unknown", bg: "", text: "" };

  // 🧠 Date label helper
  const getDateLabel = () => {
    const labels = {
      origin_pickup: "Origin Pickup Date",
      origin_port_arrival: "Origin Port Arrival Date",
      stuffing_date: "Stuffing Date",
      atd: "ATD (Actual Time of Departure)",
      ata: "ATA (Actual Time of Arrival)",
      dest_port_pickup: "Destination Port Pickup Date",
      dest_delivery: "Delivery Date",
      empty_return: "Empty Container Return Date"
    };
    return labels[dateType] || "Date";
  };

  // 🧩 If booking not yet available, don't render (after hooks)
  if (!isOpen || !booking) return null;

  const containerInfo =
    dateType === "empty_return"
      ? booking?.containers?.find(c => c.id === containerId)
      : null;

  // 🧩 Handle save
  const handleSubmit = async e => {
    e.preventDefault();
    if (!selectedDate) {
      toast.error("Please select a date");
      return;
    }

    setIsLoading(true);
    try {
      if (dateType === "empty_return") {
        const result = await updateContainer(containerId, {
          isReturned: true,
          returnedDate: new Date(selectedDate).toISOString(),
          shippingLineId: booking?.shipping_line_id
        });

        if (result.success) {
          toast.success("Container return date updated");
          onClose();
        } else {
          toast.error(result.error || "Failed to update return date");
        }
      } else {
        const statusMap = {
          origin_pickup: "LOADED_TO_TRUCK",
          origin_port_arrival: "ARRIVED_ORIGIN_PORT",
          stuffing_date: "LOADED_TO_SHIP",
          atd: "IN_TRANSIT",
          ata: "ARRIVED_DESTINATION_PORT",
          dest_port_pickup: "OUT_FOR_DELIVERY",
          dest_delivery: "DELIVERED"
        };
        const status = statusMap[dateType];
        const result = await updateBookingStatusHistory(
          booking?.id,
          status,
          selectedDate
        );

        if (result.success) {
          toast.success("Date updated successfully");
          onClose();
        } else {
          toast.error(result.error || "Failed to update date");
        }
      }
    } catch (error) {
      console.error("Failed to update date:", error);
      toast.error("Failed to update date");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title="Update Cargo Date"
      isLoading={isLoading}
      onSubmit={handleSubmit}
      infoBox={{
        title: "Cargo Information",
        items: [
          booking?.booking_number
            ? {
                text: `Booking ${toCaps(
                  booking.booking_number
                )} is currently marked as ${toCaps(statusLabel)}.`
              }
            : { text: "Booking details unavailable." },
          containerInfo
            ? {
                text: `Container ${toCaps(
                  containerInfo.van_number
                )} is linked to this booking and its return schedule can be updated here.`
              }
            : {
                text: `You can update the ${getDateLabel().toLowerCase()} for this cargo record.`
              }
        ]
      }}
      fields={[]}
      footer={
        <div className="flex justify-end gap-3 w-full">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="btn-secondary-modern"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary-modern"
          >
            {isLoading ? "Saving..." : "Save Date"}
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* 📅 Date Picker */}
        <div className="input-container">
          <label className="input-label-modern">{getDateLabel()}</label>
          <div className="relative">
            <Datetime
              timeFormat={false}
              dateFormat="YYYY-MM-DD"
              closeOnSelect={true}
              inputProps={{
                className: "input-field-modern pr-10 cursor-pointer",
                placeholder: "Select date"
              }}
              onChange={val =>
                setSelectedDate(
                  val && val.format ? val.format("YYYY-MM-DD") : ""
                )
              }
              value={selectedDate || ""}
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none w-5 h-5" />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Select the appropriate {getDateLabel().toLowerCase()} for this
            booking.
          </p>
        </div>
      </div>
    </FormModal>
  );
};

export default UpdateCargo;
