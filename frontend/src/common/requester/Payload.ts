type MonthlyData = {
    month: number
    ed:number
    em:number
    hid:number
    sdm:number
}

type TotalData = {
    ed: number
    em: number
    ey: number
    hid: number
    him: number
    hiy: number
    sdm: number
    sdy: number
    laoi: number
    lspec: number
    ltg: number
    ltotal: number
}

type StatisticsPayload = {
    monthlyData: MonthlyData[]
    totalData: TotalData[]
}

export type {StatisticsPayload, MonthlyData,TotalData}