import React from "react";

type MonthlyDataItem = {
    Month: number;
    Ed: number;
    Em: number;
    Hid: number;
    Sdm: number;
};

type TotalDataItem = {
    Ed: number;
    Em: number;
    Ey: number;
    Hid: number;
    Him: number;
    Hiy: number;
    Sdm: number;
    Sdy: number;
    laoi: number;
    lspec: number;
    ltg: number;
    ltotal: number;
};

type PanelResultItem = {
    panelIndex: number;
    monthlyData: MonthlyDataItem[];
    totalData: TotalDataItem;
};

type Props = {
    data: PanelResultItem[];
};

const ResultsTable: React.FC<Props> = ({ data }) => {
    if (!data || data.length === 0) return null;

    return (
        <div className="mt-8 px-4">
            <h2 className="text-xl font-bold mb-4">Podsumowanie paneli</h2>
            {data.map((panel) => (
                <div key={panel.panelIndex} className="mb-8 border border-gray-300 p-4 rounded bg-white shadow">
                    <h3 className="text-lg font-semibold mb-2">Panel #{panel.panelIndex}</h3>

                    <table className="table-auto border-collapse w-full mb-4 text-sm">
                        <thead>
                        <tr className="bg-gray-100">
                            <th className="border px-2 py-1">Month</th>
                            <th className="border px-2 py-1">Ed</th>
                            <th className="border px-2 py-1">Em</th>
                            <th className="border px-2 py-1">Hid</th>
                            <th className="border px-2 py-1">Sdm</th>
                        </tr>
                        </thead>
                        <tbody>
                        {panel.monthlyData.map((item, idx) => (
                            <tr key={idx}>
                                <td className="border px-2 py-1">{item.Month}</td>
                                <td className="border px-2 py-1">{item.Ed}</td>
                                <td className="border px-2 py-1">{item.Em}</td>
                                <td className="border px-2 py-1">{item.Hid}</td>
                                <td className="border px-2 py-1">{item.Sdm}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    <h4 className="font-semibold mb-1">Total data:</h4>
                    <table className="table-auto border-collapse w-full text-sm">
                        <tbody>
                        {Object.entries(panel.totalData).map(([key, value]) => (
                            <tr key={key}>
                                <td className="border px-2 py-1 font-medium">{key}</td>
                                <td className="border px-2 py-1">{value}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );
};

export default ResultsTable;
