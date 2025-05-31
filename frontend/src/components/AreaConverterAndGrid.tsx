// src/components/AreaConverterAndGrid.tsx
import React, { useState, useMemo, useEffect } from 'react';

// Stałe do przeliczeń
const SMALL_RECT_AREA_SQM = 1.7; // Powierzchnia małego prostokąta w m²
const SMALL_RECT_ORIGINAL_BASE_M = 1.7;  // Oryginalna podstawa małego prostokąta w metrach
const SMALL_RECT_ORIGINAL_HEIGHT_M = 1.0; // Oryginalna wysokość małego prostokąta w metrach

const SMALL_RECT_ROTATED_BASE_M = SMALL_RECT_ORIGINAL_HEIGHT_M; // Nowa podstawa = 1.0m
const SMALL_RECT_ROTATED_HEIGHT_M = SMALL_RECT_ORIGINAL_BASE_M; // Nowa wysokość = 1.7m

const AreaConverterAndGrid: React.FC = () => { // Usunięto propsy maxScreenWidthPx, maxScreenHeightPx

    const [inputAreaSqm, setInputAreaSqm] = useState<string>('');
    const areaSqm = parseFloat(inputAreaSqm);

    // Stan przechowujący aktualne wymiary okna przeglądarki
    const [windowDimensions, setWindowDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    // Effect do aktualizacji wymiarów okna przy zmianie rozmiaru
    useEffect(() => {
        const handleResize = () => {
            setWindowDimensions({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Definiujemy maksymalne wymiary dla naszego głównego prostokąta
    // Odejmujemy pewien margines, aby zostawić miejsce na paddingi, nagłówki itp.
    const effectiveMaxScreenWidthPx = windowDimensions.width * 0.9; // np. 90% szerokości okna
    const effectiveMaxScreenHeightPx = windowDimensions.height * 0.7; // np. 70% wysokości okna (żeby zostawić miejsce na input i tekst)


    const metersToPixelsRatio = useMemo(() => {
        if (isNaN(areaSqm) || areaSqm <= 0) return 0;

        const screenAspectRatio = effectiveMaxScreenWidthPx / effectiveMaxScreenHeightPx;
        let mainRectWidthM = Math.sqrt(areaSqm * screenAspectRatio);
        let mainRectHeightM = areaSqm / mainRectWidthM;

        let scaleX = effectiveMaxScreenWidthPx / mainRectWidthM;
        let scaleY = effectiveMaxScreenHeightPx / mainRectHeightM;

        const scale = Math.min(scaleX, scaleY);
        return scale;
    }, [areaSqm, effectiveMaxScreenWidthPx, effectiveMaxScreenHeightPx]);

    const mainRectWidthPx = useMemo(() => {
        if (isNaN(areaSqm) || areaSqm <= 0 || metersToPixelsRatio === 0) return 0;
        const screenAspectRatio = effectiveMaxScreenWidthPx / effectiveMaxScreenHeightPx;
        const mainRectWidthM = Math.sqrt(areaSqm * screenAspectRatio);
        return mainRectWidthM * metersToPixelsRatio;
    }, [areaSqm, metersToPixelsRatio, effectiveMaxScreenWidthPx, effectiveMaxScreenHeightPx]);

    const mainRectHeightPx = useMemo(() => {
        if (isNaN(areaSqm) || areaSqm <= 0 || metersToPixelsRatio === 0) return 0;
        const mainRectHeightM = areaSqm / (mainRectWidthPx / metersToPixelsRatio);
        return mainRectHeightM * metersToPixelsRatio;
    }, [areaSqm, metersToPixelsRatio, mainRectWidthPx]);

    const smallRectBasePx = SMALL_RECT_ROTATED_BASE_M * metersToPixelsRatio;
    const smallRectHeightPx = SMALL_RECT_ROTATED_HEIGHT_M * metersToPixelsRatio;

    const numSmallRects = useMemo(() => {
        if (isNaN(areaSqm) || areaSqm <= 0) return 0;
        return Math.floor(areaSqm / SMALL_RECT_AREA_SQM);
    }, [areaSqm]);

    const renderGrid = () => {
        if (numSmallRects === 0 || mainRectWidthPx === 0 || mainRectHeightPx === 0) {
            return <p className="text-gray-600">Wprowadź poprawną powierzchnię, aby zobaczyć siatkę.</p>;
        }

        const gridCols = Math.floor(mainRectWidthPx / smallRectBasePx);
        const gridRows = Math.floor(mainRectHeightPx / smallRectHeightPx);

        // Upewnij się, że nie generujemy więcej prostokątów niż jest w 'numSmallRects'
        // i nie więcej niż faktycznie zmieści się w obliczonej siatce
        const actualGeneratedRects = Math.min(numSmallRects, gridCols * gridRows);

        const items = Array.from({ length: actualGeneratedRects }).map((_, index) => (
            <div
                key={index}
                className="bg-blue-400 flex items-center justify-center text-white font-bold text-sm rounded-sm"
                style={{
                    width: `${smallRectBasePx}px`,
                    height: `${smallRectHeightPx}px`,
                    flexShrink: 0,
                }}
            >
                {index + 1}
            </div>
        ));

        const mainContainerStyle: React.CSSProperties = {
            width: `${mainRectWidthPx}px`,
            height: `${mainRectHeightPx}px`,
            border: '2px solid #333',
            backgroundColor: '#f0f0f0',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '2px',
            // Usunięto overflow: 'auto' z głównego kontenera, aby nie było scrolla,
            // bo chcemy, aby zawsze się mieścił
            padding: '2px',
            boxSizing: 'border-box',
            justifyContent: 'center',
            alignItems: 'center',
            alignContent: 'center',
        };

        return (
            <div className="flex flex-col items-center mt-8">
                <p className="mb-2">Główny prostokąt (na ekranie): {mainRectWidthPx.toFixed(2)}px x {mainRectHeightPx.toFixed(2)}px</p>
                <p className="mb-4">
                    Mały prostokąt (na ekranie, obr.): {smallRectBasePx.toFixed(2)}px (szer.) x {smallRectHeightPx.toFixed(2)}px (wys.)
                </p>
                <p className="mb-4">Szacowana liczba małych prostokątów: {numSmallRects}</p>
                {numSmallRects > actualGeneratedRects && (
                    <p className="text-orange-600 mb-4">
                        Uwaga: Wygenerowano {actualGeneratedRects} prostokątów, ponieważ więcej nie zmieściło się w siatce o zadanych proporcjach kontenera.
                    </p>
                )}
                <div style={mainContainerStyle}>
                    {items}
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-lg max-w-xl mx-auto my-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Przelicznik Powierzchni na Siatkę Obróconych Prostokątów</h2>
            <div className="w-full flex flex-col gap-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="areaInput">
                    Podaj powierzchnię w metrach kwadratowych (m²):
                </label>
                <input
                    id="areaInput"
                    type="number"
                    value={inputAreaSqm}
                    onChange={(e) => setInputAreaSqm(e.target.value)}
                    placeholder="np. 50"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    min="0"
                    step="0.1"
                />
            </div>

            {renderGrid()}
        </div>
    );
};

export default AreaConverterAndGrid;