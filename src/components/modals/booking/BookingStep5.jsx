// src/components/modals/booking/BookingStep5.jsx
import { useWatch } from "react-hook-form";

const BookingStep5 = ({ control }) => {
  const data = useWatch({ control });

  return (
    <div className="space-y-6 text-sm">
      <h3 className="text-lg font-semibold">Review Booking Details</h3>

      {/* Shipper Info */}
      <div>
        <h4 className="font-medium mb-2">Shipper Info</h4>
        <ul className="list-disc list-inside space-y-1">
          <li>
            Name: {data.first_name} {data.last_name}
          </li>
          <li>Phone: {data.phone}</li>
        </ul>
      </div>

      {/* Shipment Info */}
      <div>
        <h4 className="font-medium mb-2">Shipment</h4>
        <ul className="list-disc list-inside space-y-1">
          <li>Booking #: {data.booking_number}</li>
          <li>HWB #: {data.hwb_number}</li>
          <li>
            Container: {data.quantity} × {data.container_type}
          </li>
          <li>Mode: {data.booking_mode}</li>
          <li>
            Route: {data.origin} → {data.destination}
          </li>
        </ul>
      </div>

      {/* Charges */}
      <div>
        <h4 className="font-medium mb-2">Charges</h4>
        <ul className="list-disc list-inside space-y-1">
          <li>Freight: ₱{data.freight_charge}</li>
          <li>Trucking: ₱{data.trucking_charge}</li>
          <li className="font-semibold">
            Total: ₱{data.total_amount?.toLocaleString()}
          </li>
        </ul>
      </div>

      <p className="text-gray-600 text-xs">
        Please review all details carefully before clicking{" "}
        <strong>Create Booking</strong>.
      </p>
    </div>
  );
};

export default BookingStep5;
