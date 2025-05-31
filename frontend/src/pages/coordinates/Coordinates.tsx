import CoordinateForm from '../form/CoordinateForm';
import { useNavigate } from 'react-router-dom';

const Coordinates = () => {
    const navigate = useNavigate();

    const handleSubmit = (lat: string, lng: string) => {
        console.log('Współrzędne:', lat, lng);
        navigate('/'); // przekieruj do Home
    };

    return (
        <div className="w-screen h-screen flex items-center justify-center bg-white">
            <CoordinateForm onSubmit={handleSubmit} />
        </div>
    );
};

export default Coordinates;
