import React, { useState, useEffect } from "react";
import type { Rectangle } from "../common/types/Rectangle.ts";
import LeftPanel from "./LeftPanel.tsx";
import SendButton from "./SendButton";

import Panel from './Panel';
import {useApiRequest} from "../common/requester/useApiRequest.ts";
import type {ProfileQueryParams} from "../common/types/QueryParams.ts";
import {action_get_profile_data} from "../common/actions.ts";
const RectangleFittingVisualizer = () => {
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [rectangles, setRectangles] = useState<Rectangle[]>([]);
  const [containerSize, setContainerSize] = useState({ w: 0, h: 0 });
    const [peakPower, setPeakPower] = useState<number>(0);
    const [systemLoss, setSystemLoss] = useState<number>(0);
    const [panelResults, setPanelResults] = useState<Record<number, any>>({});
  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    text: "",
  });


    const smallRect = { width: 1, height: 2 };
    const edgeMargin = 0.3;
    const spacing = 0.15;
    const scaleFactor = 100; // 1m = 100px
    const directions = ['north','NE', 'east','SE', 'south','SW', 'west', 'NW'] as const;
    type Direction = typeof directions[number];

    const [direction, setDirection] = useState<Direction>('north');
    // const cycleDirection = () => {
    //     const currentIndex = directions.indexOf(direction);
    //     const nextIndex = (currentIndex + 1) % directions.length;
    //     setDirection(directions[nextIndex]);
    // };
    const { data, error, execute } = useApiRequest((params?: ProfileQueryParams) => {
        if (!params) return Promise.reject('No params');

        return action_get_profile_data(params);
    });

    const calculate = (w: number, h: number, direction: Direction,centerLat: number, centerLon: number) => {
        // const centerLat = 50.02424640940002;
        // const centerLon = 19.91677561148512;

        const directionAngles: Record<Direction, number> = {
            north: 0,
            NE: 45,
            east: 90,
            SE: 135,
            south: 180,
            SW: 225,
            west: 270,
            NW: 315,
        };

        const W = w;
        const H = h;

    if (isNaN(W) || isNaN(H) || W <= 0 || H <= 0) {
      setRectangles([]);
      return;
    }

    const usableWidth = W - 2 * edgeMargin;
    const usableHeight = H - 2 * edgeMargin;

    const countX = Math.floor(
      (usableWidth + spacing) / (smallRect.width + spacing)
    );
    const countY = Math.floor(
      (usableHeight + spacing) / (smallRect.height + spacing)
    );

        const totalWidth = countX * smallRect.width + (countX - 1) * spacing;
        const totalHeight = countY * smallRect.height + (countY - 1) * spacing;

        const offsetX = (W - totalWidth) / 2;
        const offsetY = (H - totalHeight) / 2;

        const newRectangles = [];
        const mainCenterX = W / 2;
        const mainCenterY = H / 2;
        const angleDeg = directionAngles[direction];
        const angleRad = angleDeg * Math.PI / 180;
        const earthRadius = 6378137;

        for (let y = 0; y < countY; y++) {
            for (let x = 0; x < countX; x++) {
                const xPos = offsetX + x * (smallRect.width + spacing);
                const yPos = offsetY + y * (smallRect.height + spacing);

                const centerX = xPos + smallRect.width / 2;
                const centerY = yPos + smallRect.height / 2;

                const deltaX = centerX - mainCenterX;
                const deltaY = centerY - mainCenterY;

                // Obrót względem kierunku
                const rotatedX = deltaX * Math.cos(angleRad) - deltaY * Math.sin(angleRad);
                const rotatedY = deltaX * Math.sin(angleRad) + deltaY * Math.cos(angleRad);

                // GPS z obrotem
                const latOffset = rotatedY / earthRadius * (180 / Math.PI);
                const lonOffset = rotatedX / (earthRadius * Math.cos(centerLat * Math.PI / 180)) * (180 / Math.PI);

                const gpsLat = centerLat + latOffset;
                const gpsLon = centerLon + lonOffset;

                newRectangles.push({
                    x: xPos,
                    y: yPos,
                    selected: false,
                    center: {
                        x: centerX,
                        y: centerY,
                    },
                    relativeToCenter: {
                        x: parseFloat(deltaX.toFixed(3)),
                        y: parseFloat(deltaY.toFixed(3)),
                    },
                    gps: {
                        lat: parseFloat(gpsLat.toFixed(8)),
                        lon: parseFloat(gpsLon.toFixed(8)),
                    },
                });
            }
        }

    setRectangles(newRectangles);
    setContainerSize({ w: W, h: H });
  };



    const toggleSelection = (index: number) => {
        const updated = [...rectangles];
        updated[index].selected = !updated[index].selected;
        setRectangles(updated);
        const panel = updated[index];

        if (panel.selected) {
            console.log(peakPower)
            // panel został zaznaczony – fetchujemy dane
            execute({
                latitude: panel.gps.lat,
                longitude: panel.gps.lon,
                peakPower,
                systemLoss,
            }).then((res) => {
                setPanelResults(prev => ({
                    ...prev,
                    [index]: res,
                }));
            }).catch((err) => {
                console.error("Błąd przy pobieraniu danych dla panelu:", err);
            });
        } else {
            // panel odznaczony – usuwamy dane
            setPanelResults(prev => {
                const newResults = { ...prev };
                delete newResults[index];
                return newResults;
            });
        }
    };



    const handleContextMenu = (e, i:number) => {
        e.preventDefault();

        const panel = rectangles[i];
        if (panel?.gps) {
            execute({
                latitude: panel.gps.lat,
                longitude: panel.gps.lon,
                peakPower,
                systemLoss,
            })
                .then((res) => {
                    if(data?.success){
                        console.log("Response:", res);
                        showTooltip(e.clientX, e.clientY, `Energia: ${res.data.outputs.totals.fixed.E_d} kWh`);
                    }

                })
                .catch((err) => {
                    console.error("❌ Błąd z API:", err);
                    showTooltip(e.clientX, e.clientY, "Błąd zapytania");
                });
        }


        showTooltip(e.clientX, e.clientY, `Prawy klik na prostokąt #${i + 1}`);
    };


    const showTooltip = (clientX: number, clientY: number, text: string) => {
        setTooltip({
            visible: true,
            x: clientX + 10,
            y: clientY + 10,
            text,
        });
    };

  const hideTooltip = () => {
    setTooltip({ ...tooltip, visible: false });
  };

  const selectedCount = rectangles.filter((r) => r.selected).length;

  useEffect(() => {
    const handleClickOutside = () => hideTooltip();
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);
    const handleFormSubmit = (
        width: number,
        height: number,
        direction: Direction,
        latitude: number,
        longitude: number,
        peakPower: number,
        systemLoss: number
    ) => {
        console.log("🔧 Przyszły dane:", { peakPower, systemLoss });
        setWidth(width.toString());
        setHeight(height.toString());
        setDirection(direction);
        setPeakPower(peakPower);
        setSystemLoss(systemLoss);
        calculate(width, height, direction, latitude, longitude);
    };



    return (
        <>
        <div className="flex flex-row w-screen h-screen">
            <LeftPanel onSubmit={handleFormSubmit} />
            <div className="mt-5 relative flex-grow overflow-auto pb-32">
                {rectangles.length > 0 && (
                    <div
                        className="relative border-2 border-black bg-gray-100 mx-auto"
                        style={{
                            width: containerSize.w * scaleFactor,
                            height: containerSize.h * scaleFactor,
                        }}
                        onContextMenu={(e) => e.preventDefault()}
                    >
                        {rectangles.map((rect, i) => (
                            <Panel
                                key={i}
                                rect={rect}
                                index={i}
                                scaleFactor={scaleFactor}
                                toggleSelection={toggleSelection}
                                onContextMenu={handleContextMenu}
                                onMouseMove={(e, i) => {
                                    const r = rectangles[i];
                                    showTooltip(
                                        e.clientX,
                                        e.clientY,
                                        `Δx: ${r.relativeToCenter?.x} m, Δy: ${r.relativeToCenter?.y} m\nLat: ${r.gps?.lat}, Lon: ${r.gps?.lon}`
                                    );
                                }}
                                onMouseLeave={hideTooltip}
                            />

                        ))}
                        <SendButton panelResults={panelResults} />

                        {tooltip.visible && (
                            <div
                                className="fixed text-xs bg-white border border-gray-300 shadow px-2 py-1 pointer-events-none z-50"
                                style={{
                                    left: tooltip.x,
                                    top: tooltip.y,
                                }}
                            >
                                {tooltip.text}
                            </div>
                        )}
                    </div>

                )}
            </div>

        </div>

    </>
  );
};

export default RectangleFittingVisualizer;
