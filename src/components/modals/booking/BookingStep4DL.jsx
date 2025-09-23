// components/modals/booking/BookingStep4DL.jsx
import SharedLocationStep from './SharedLocationStep';

const BookingStep4DL = ({ control, errors, setValue }) => {
  return (
    <SharedLocationStep
      control={control}
      errors={errors}
      setValue={setValue}
      locationType="delivery"
      title="Delivery Location"
      isDeliveryStep={true}
    />
  );
};

export default BookingStep4DL;