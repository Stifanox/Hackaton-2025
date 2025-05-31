import { useState } from 'react';

interface Props {
    // We can remove onSubmit from props if the form handles the submission itself
    // However, if we still want to notify a parent component, we can keep it.
    // For now, let's assume the form handles the submission to the server directly.
    // onSubmit?: (lat: string, lng: string) => void; // Make it optional or remove if not needed by parent
}

const CoordinateForm = (/* { onSubmit }: Props */) => { // Destructure onSubmit if you keep it
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [loading, setLoading] = useState(false); // State for loading indicator
    const [error, setError] = useState<string | null>(null); // State for error messages
    const [success, setSuccess] = useState<string | null>(null); // State for success messages


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null); // Clear previous errors
        setSuccess(null); // Clear previous success messages

        try {
            // Validate input (optional, but good practice for client-side)
            if (!latitude || !longitude) {
                throw new Error('Please enter both latitude and longitude.');
            }

            // You might want to add more robust validation here, e.g., regex for valid coordinates

            const response = await fetch('http://localhost:9001/api', { //
                method: 'POST', //
                headers: { //
                    'Content-Type': 'application/json', //
                },
                body: JSON.stringify({ latitude, longitude }), //
            });

            if (!response.ok) { //
                const errorData = await response.json(); // Try to parse error response
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`); //
            }

            const result = await response.json(); // Parse the successful response
            console.log('Success:', result);
            setSuccess('Coordinates sent successfully!');
            // Optionally, clear the form fields after successful submission
            setLatitude('');
            setLongitude('');
            // If you still want to notify a parent, uncomment the line below
            // onSubmit?.(latitude, longitude);
        } catch (err: any) {
            console.error('Error sending coordinates:', err);
            setError(err.message || 'Failed to send coordinates.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md space-y-4"
        >
            <h2 className="text-center text-xl font-semibold text-gray-800">Podaj współrzędne</h2>

            <input
                type="text"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="Szerokość"
                className="w-full px-3 py-2 border rounded"
                required
                disabled={loading} // Disable input during loading
            />
            <input
                type="text"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="Długość"
                className="w-full px-3 py-2 border rounded"
                required
                disabled={loading} // Disable input during loading
            />

            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                disabled={loading} // Disable button during loading
            >
                {loading ? 'Wysyłanie...' : 'Zatwierdź'}
            </button>

            {error && <p className="text-red-500 text-center">{error}</p>}
            {success && <p className="text-green-500 text-center">{success}</p>}
        </form>
    );
};

export default CoordinateForm;