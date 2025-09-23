// components/modals/booking/BookingStep4PL.jsx
import SharedLocationStep from './SharedLocationStep';

const BookingStep4PL = ({ control, errors, setValue }) => {
  return (
    <SharedLocationStep
      control={control}
      errors={errors}
      setValue={setValue}
      locationType="pickup"
      title="Pickup Location"
      isDeliveryStep={false}
    />
  );
};

export default BookingStep4PL;