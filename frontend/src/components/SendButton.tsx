import React from "react";
import type {PVResponse, SuccessResponse, PVData} from "../common/requester/ApiResponse.ts";
import {useApiRequest} from "../common/requester/useApiRequest";
import {action_get_statistics_data} from "../common/actions";
import type {StatisticsPayload} from "../common/requester/Payload.ts";

type SendButtonProps = {
    panelResults: SuccessResponse<PVData>[];
};

const SendButton: React.FC<SendButtonProps> = ({panelResults}) => {
    const {data, error, execute} = useApiRequest((data: StatisticsPayload) => {
        return action_get_statistics_data(data)
    }, {
        onSuccess: (data) => {
            console.log(data)
        }
    });

    const handleSend = () => {
        const payload = Object.entries(panelResults).map(([panelIndex, panel]) => {
            const monthlyItems = panel.data.outputs.monthly.fixed.map((monthData) => ({
                month: monthData.month,
                ed: monthData["E_d"] ,
                em: monthData["E_m"],
                hid: monthData["H(i)_d"],
                sdm: monthData["H(i)_m"],
            }));

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
                // panelIndex: Number(panelIndex),
                monthlyData: monthlyItems,
                totalData: totalItem,
            };

        })
        const payloadFixed:StatisticsPayload = {
            monthlyData: payload.flatMap(item => item.monthlyData),
            totalData: payload.map(item => item.totalData)
        }

        execute(payloadFixed);


        console.log("📤 Gotowy payload do wysłania:", payloadFixed);

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
