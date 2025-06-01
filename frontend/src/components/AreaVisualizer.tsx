// src/components/RectangleFittingVisualizer.tsx

import React, { useState, useEffect } from "react";
import type { Rectangle } from "../common/types/Rectangle";
import LeftPanel from "./LeftPanel";
import SendButton from "./SendButton";
import Panel from "./Panel";
import Chat from "./Chat";
import MonthChart, { type MonthlyData } from "./ChartMonth";

import { useApiRequest } from "../common/requester/useApiRequest";
import {
  action_get_statistics_data,
  action_get_profile_data,
} from "../common/actions";
import type { ProfileQueryParams } from "../common/types/QueryParams";
import type { StatisticsPayload } from "../common/requester/Payload";
import type {
  ApiResponse,
  SuccessResponse,
  PVData,
} from "../common/requester/ApiResponse";
import ResultsTable from "./ResultsTable";

const RectangleFittingVisualizer: React.FC = () => {
  const [width, setWidth] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [rectangles, setRectangles] = useState<Rectangle[]>([]);
  const [containerSize, setContainerSize] = useState({ w: 0, h: 0 });
  const [peakPower, setPeakPower] = useState<number>(0);
  const [systemLoss, setSystemLoss] = useState<number>(0);

  const [panelResults, setPanelResults] = useState<
    Record<number, SuccessResponse<PVData>>
  >({});

  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    text: "",
  });

  const smallRect = { width: 1, height: 2 };
  const edgeMargin = 0.3;
  const spacing = 0.15;
  const scaleFactor = 100;

  const directions = [
    "north",
    "NE",
    "east",
    "SE",
    "south",
    "SW",
    "west",
    "NW",
  ] as const;
  type Direction = (typeof directions)[number];

  const [direction, setDirection] = useState<Direction>("north");

  const calculate = (
    W: number,
    H: number,
    direction: Direction,
    centerLat: number,
    centerLon: number
  ) => {
    if (isNaN(W) || isNaN(H) || W <= 0 || H <= 0) {
      setRectangles([]);
      return;
    }

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

    const newRectangles: Rectangle[] = [];
    const mainCenterX = W / 2;
    const mainCenterY = H / 2;
    const angleDeg = directionAngles[direction];
    const angleRad = (angleDeg * Math.PI) / 180;
    const earthRadius = 6378137;

    for (let y = 0; y < countY; y++) {
      for (let x = 0; x < countX; x++) {
        const xPos = offsetX + x * (smallRect.width + spacing);
        const yPos = offsetY + y * (smallRect.height + spacing);

        const centerX = xPos + smallRect.width / 2;
        const centerY = yPos + smallRect.height / 2;

        const deltaX = centerX - mainCenterX;
        const deltaY = centerY - mainCenterY;

        const rotatedX =
          deltaX * Math.cos(angleRad) - deltaY * Math.sin(angleRad);
        const rotatedY =
          deltaX * Math.sin(angleRad) + deltaY * Math.cos(angleRad);

        const latOffset = (rotatedY / earthRadius) * (180 / Math.PI);
        const lonOffset =
          (rotatedX / (earthRadius * Math.cos((centerLat * Math.PI) / 180))) *
          (180 / Math.PI);

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

  useEffect(() => {
    const handleClickOutside = () => hideTooltip();
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  const { execute: executeProfile } = useApiRequest(
    (params?: ProfileQueryParams) => {
      if (!params) return Promise.reject("No params");
      return action_get_profile_data(params);
    }
  );

  const toggleSelection = (index: number) => {
    const updated = [...rectangles];
    updated[index].selected = !updated[index].selected;
    setRectangles(updated);

    if (updated[index].selected) {
      const panel = updated[index];
      executeProfile({
        latitude: panel.gps.lat,
        longitude: panel.gps.lon,
        peakPower,
        systemLoss,
      })
        .then((res) => {
          setPanelResults((prev) => ({
            ...prev,
            [index]: res,
          }));
        })
        .catch((err) => {
          console.error("Błąd przy pobieraniu danych dla panelu:", err);
        });
    } else {
      setPanelResults((prev) => {
        const newResults = { ...prev };
        delete newResults[index];
        return newResults;
      });
    }
  };

  const handleContextMenu = (e: React.MouseEvent, i: number) => {
    e.preventDefault();
    const panel = rectangles[i];
    if (panel?.gps) {
      executeProfile({
        latitude: panel.gps.lat,
        longitude: panel.gps.lon,
        peakPower,
        systemLoss,
      })
        .then((res) => {
          if (res.success) {
            showTooltip(
              e.clientX,
              e.clientY,
              `Energia (E_d): ${res.data.outputs.totals.fixed["E_d"]} kWh`
            );
          }
        })
        .catch((err) => {
          console.error("❌ Błąd z API:", err);
          showTooltip(e.clientX, e.clientY, "Błąd zapytania");
        });
    }
    showTooltip(e.clientX, e.clientY, `Prawy klik na prostokąt #${i + 1}`);
  };

  const {
    data: statsApiData,
    error: statsError,
    execute: executeStats,
  } = useApiRequest((payload: StatisticsPayload) => {
    return action_get_statistics_data(payload);
  });

  const [statsResponse, setStatsResponse] = useState<SuccessResponse<{
    monthlyAverage: MonthlyData[];
  }> | null>(null);

  useEffect(() => {
    if (statsApiData && statsApiData.success) {
      setStatsResponse(statsApiData);
    }
  }, [statsApiData]);

  const handleSend = (payload: StatisticsPayload) => {
    setStatsResponse(null);
    executeStats(payload);
  };

  const handleFormSubmit = (
    w: number,
    h: number,
    dir: Direction,
    latitude: number,
    longitude: number,
    peak: number,
    loss: number
  ) => {
    setWidth(w.toString());
    setHeight(h.toString());
    setPeakPower(peak);
    setSystemLoss(loss);
    setDirection(dir);
    calculate(w, h, dir, latitude, longitude);
  };

  return (
    <div className="flex flex-row w-screen h-screen relative">
      <Chat />

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
                onMouseMove={(e, idx) => {
                  const r = rectangles[idx];
                  showTooltip(
                    e.clientX,
                    e.clientY,
                    `Δx: ${r.relativeToCenter?.x} m, Δy: ${r.relativeToCenter?.y} m\nLat: ${r.gps?.lat}, Lon: ${r.gps?.lon}`
                  );
                }}
                onMouseLeave={hideTooltip}
              />
            ))}

            <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
              <SendButton panelResults={panelResults} onSend={handleSend} />
            </div>

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

        {statsResponse && statsResponse.data.monthlyAverage && (
          <>
            <div className="mt-12 px-4">
              <MonthChart data={statsResponse.data.monthlyAverage} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RectangleFittingVisualizer;
