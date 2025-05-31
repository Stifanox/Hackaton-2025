import { useState } from 'react';



const CoordinateForm = (/* { onSubmit }: Props */) => {
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [peakPower, setPeakPower] = useState(''); // Nowy stan dla "peak power"
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null); // Wyczyść poprzednie błędy
        setSuccess(null); // Wyczyść poprzednie komunikaty sukcesu

        try {
            // Walidacja inputów
            if (!latitude || !longitude || !peakPower) {
                throw new Error('Please enter latitude, longitude, and peak power.');
            }

            const response = await fetch('YOUR_SERVER_ENDPOINT_HERE', { // Zastąp to swoim rzeczywistym endpointem API
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ latitude, longitude, peakPower }), // Dodaj peakPower do wysyłanych danych
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Success:', result);
            setSuccess('Coordinates and peak power sent successfully!');
            // Opcjonalnie, wyczyść pola formularza po udanym przesłaniu
            setLatitude('');
            setLongitude('');
            setPeakPower(''); // Wyczyść pole peak power
            // Jeśli nadal chcesz powiadomić komponent rodzicielski, odkomentuj poniższą linię
            // onSubmit?.(latitude, longitude, peakPower);
        } catch (err: any) {
            console.error('Error sending data:', err);
            setError(err.message || 'Failed to send data.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md space-y-4"
        >
            <h2 className="text-center text-xl font-semibold text-gray-800">Podaj współrzędne i moc szczytową</h2>

            <input
                type="text"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="Szerokość"
                className="w-full px-3 py-2 border rounded"
                required
                disabled={loading}
            />
            <input
                type="text"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="Długość"
                className="w-full px-3 py-2 border rounded"
                required
                disabled={loading}
            />
            <input // Nowy input dla "peak power"
                type="text"
                value={peakPower}
                onChange={(e) => setPeakPower(e.target.value)}
                placeholder="Moc szczytowa (np. kW)"
                className="w-full px-3 py-2 border rounded"
                required
                disabled={loading}
            />

            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                disabled={loading}
            >
                {loading ? 'Wysyłanie...' : 'Zatwierdź'}
            </button>

            {error && <p className="text-red-500 text-center">{error}</p>}
            {success && <p className="text-green-500 text-center">{success}</p>}
        </form>
    );
};

export default CoordinateForm;