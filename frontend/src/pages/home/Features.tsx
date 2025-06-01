import FeatureCard from "./FeatureCard";
import {FaChartLine, FaEdit, FaFileExport, FaSolarPanel} from "react-icons/fa";

const Features = () => {
  return (
    <div className="py-48 px-4 w-screen text-center flex flex-col items-center">
      <h1 className="font-semibold text-4xl">Dlaczego My?</h1>
      <p className="mt-2 max-w-[500px] text-zinc-500">
        Nasze rozwiązanie zapewnia innowacyjność w zakresie planowania
        instalacji fotowoltaicznych dla każdego rodzaju budynku.
      </p>
      <div className="mt-16 grid grid-cols-2 grid-rows-2 gap-8">
        <FeatureCard
          icon={<FaEdit size={28} />}
          title="Łatwość konfiguracji"
          desc="Oferujemy kompleksowy zestaw funkcjonalności ułatwiających rozmieszczenie paneli na budynku"
        />
        <FeatureCard
          icon={<FaSolarPanel size={28} />}
          title="Inteligentne rozmieszczanie paneli"
          desc="Automatyczne rozmieszczenie paneli fotowoltaicznych na dachu budynku z uwzględnieniem kształtu oraz kierunku"
        />
        <FeatureCard
          icon={<FaChartLine size={28} />}
          title="Statystyki uzysków energii"
          desc="Generowanie przejrzystych wykresów miesięcznych i rocznych na podstawie symulacji działania instalacji PV."
        />
        <FeatureCard
          icon={<FaFileExport size={28} />}
          title="Eksport wyników"
          desc="Eksportuj konfigurację i statystyki do formatu PDF, aby łatwo współdzielić projekty z klientami lub zespołem."
        />
      </div>
    </div>
  );
};

export default Features;
