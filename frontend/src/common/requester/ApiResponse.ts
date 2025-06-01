import type {MonthlyData as MonthlyDataStats} from "./Payload.ts";
import type {TotalData as TotalDataStats} from "./Payload.ts";

type ErrorResponse = {
    success: false,
    status: number,
    data: string,
}


type SuccessResponse<T> = {
    success: true,
    status: number,
    data: T,
}

type MonthlyItemData = {
    month: number,
    E_d: number,
    E_m: number,
    "H(i)_d": number,
    "H(i)_m": number,
    "SD_m": number,
}

type TotalsItemData = {
    "E_d": number,
    "E_m": number,
    "E_y": number,
    "H(i)_d": number,
    "H(i)_m": number,
    "H(i)_y": number,
    "SD_m": number,
    "SD_y": number,
    "l_aoi": number,
    "l_spec": number,
    "l_tg": number,
    "l_total": number,
}

type MonthlyData = {
    fixed: MonthlyItemData[]
}

type TotalsData = {
    fixed: TotalsItemData
}

type PVData = {
    monthly: MonthlyData
    totals: TotalsData
}

type StatisticsData = {
    monthlyAverage: MonthlyDataStats[]
    totalAverage: TotalDataStats
}

type ApiResponse<T> = Promise<SuccessResponse<T> | ErrorResponse>
type PVResponse = ApiResponse<PVData>
type StatisticsResponse = ApiResponse<StatisticsData>

export type {
    ApiResponse,
    SuccessResponse,
    ErrorResponse,
    PVResponse,
    StatisticsResponse,
}