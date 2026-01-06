import "./VerificationCard.css";

interface Props {
  onLocation: (lat: number, lng: number) => void;
}

const LocationCapture = ({ onLocation }: Props) => {
  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(pos => {
      onLocation(pos.coords.latitude, pos.coords.longitude);
    });
  };

  return (
    <button onClick={getLocation}>
      Allow Location Access
    </button>
  );
};

export default LocationCapture;
