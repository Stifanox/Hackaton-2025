import React from "react";
import type { SuccessResponse, PVData } from "../common/requester/ApiResponse";
import type { StatisticsPayload } from "../common/requester/Payload";

type SendButtonProps = {
  panelResults: Record<number, SuccessResponse<PVData>>;
  onSend: (payload: StatisticsPayload) => void;
};

const SendButton: React.FC<SendButtonProps> = ({ panelResults, onSend }) => {
  const handleSend = () => {
    // Budujemy payload tak jak wcześniej, ale nie odpalamy execute() tutaj.
    const payloadItems = Object.entries(panelResults).map(
      ([panelIndex, panel]) => {
        const monthlyItems = panel.data.outputs.monthly.fixed.map(
          (monthData) => ({
            month: monthData.month,
            ed: monthData["E_d"],
            em: monthData["E_m"],
            hid: monthData["H(i)_d"],
            sdm: monthData["H(i)_m"],
          })
        );

        const total = panel.data.outputs.totals.fixed;
        const totalItem = {
          ed: total["E_d"],
          em: total["E_m"],
          ey: total["E_y"],
          hid: total["H(i)_d"],
          him: total["H(i)_m"],
          hiy: total["H(i)_y"],
          sdm: total["SD_m"],
          sdy: total["SD_y"],
          laoi: total["l_aoi"],
          lspec: total["l_spec"],
          ltg: total["l_tg"],
          ltotal: total["l_total"],
        };

        return {
          // miesięczne dane tego panelu
          monthlyData: monthlyItems,
          // dane roczne/całościowe
          totalData: totalItem,
        };
      }
    );

    // Łączymy wszystkie miesięczne dane w jedną tablicę
    const payloadFixed: StatisticsPayload = {
      monthlyData: payloadItems.flatMap((item) => item.monthlyData),
      totalData: payloadItems.map((item) => item.totalData),
    };

    // Wywołujemy callback onSend z gotowym payloadem
    onSend(payloadFixed);
  };

  return (
    <button
      onClick={handleSend}
      className="bg-lime-600 hover:bg-lime-500 text-white px-4 py-2 rounded my-4"
      disabled={Object.keys(panelResults).length === 0}
    >
      Wyślij {Object.keys(panelResults).length} paneli
    </button>
  );
};

export default SendButton;
