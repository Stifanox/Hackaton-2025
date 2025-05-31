import React, { useState, useEffect } from "react";
import type { Rectangle } from "../common/types/Rectangle.ts";
import LeftPanel from "./LeftPanel.tsx";
import Panel from './Panel';

const RectangleFittingVisualizer = () => {
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [rectangles, setRectangles] = useState<Rectangle[]>([]);
  const [containerSize, setContainerSize] = useState({ w: 0, h: 0 });
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
    const cycleDirection = () => {
        const currentIndex = directions.indexOf(direction);
        const nextIndex = (currentIndex + 1) % directions.length;
        setDirection(directions[nextIndex]);
    };

    const calculate = () => {
        const centerLat = 50.02424640940002;
        const centerLon = 19.91677561148512;

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

        const W = parseFloat(width);
        const H = parseFloat(height);

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
    };

    const handleContextMenu = (e, i:number) => {
        e.preventDefault();

        const panel = rectangles[i];
        if (panel?.gps) {
            console.log(`🛰️ Panel #${i + 1} - GPS: ${panel.gps.lat}, ${panel.gps.lon}`);
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

    return (
        <>
        <div className="flex flex-row w-screen h-screen">
            <LeftPanel />
            <div style={{ fontFamily: "Arial", maxWidth: "600px", margin: "auto" }}>
            <h2>Kalkulator i wizualizacja</h2>
            <div>
                <label>Szerokość (m): </label>
                <input type="number" value={width} onChange={(e) => setWidth(e.target.value)} step="0.01" />
            </div>
            <div>
                <label>Wysokość (m): </label>
                <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} step="0.01" />
            </div>
            <div style={{ marginTop: '10px' }}>
                <button onClick={cycleDirection}>Kierunek: {direction.toUpperCase()}</button>
            </div>

            <button onClick={calculate} style={{ marginTop: '10px' }}>Oblicz i pokaż</button>

          {rectangles.length > 0 && (
            <div style={{ marginTop: "15px", fontWeight: "bold" }}>
              Zaznaczone prostokąty: {selectedCount}
            </div>
          )}

            <div style={{ marginTop: '20px', position: 'relative' }}>
                {rectangles.length > 0 && (
                    <div
                        style={{
                            position: 'relative',
                            width: containerSize.w * scaleFactor,
                            height: containerSize.h * scaleFactor,
                            border: '2px solid black',
                            backgroundColor: '#f9f9f9',
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
                                        `Δx: ${r.relativeToCenter?.x} m, Δy: ${r.relativeToCenter?.y} m
Lat: ${r.gps?.lat}, Lon: ${r.gps?.lon}`
                                    );
                                }}
                                onMouseLeave={hideTooltip}
                            />
                        ))}


                {tooltip.visible && (
                  <div
                    style={{
                      position: "fixed",
                      left: tooltip.x,
                      top: tooltip.y,
                      background: "white",
                      border: "1px solid #ccc",
                      padding: "4px 8px",
                      fontSize: "12px",
                      boxShadow: "0px 0px 5px rgba(0,0,0,0.2)",
                      pointerEvents: "none",
                      zIndex: 1000,
                    }}
                  >
                    {tooltip.text}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        </div>
    </>
  );
};

export default RectangleFittingVisualizer;
