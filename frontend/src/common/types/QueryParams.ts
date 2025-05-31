type ProfileQueryParams = {
    latitude: number
    longitude: number
    peakPower:number
    systemLoss: number
    useHorizon?:boolean
    mountingPlace?: "free" | "building"
    fixed?: boolean
    angle?: number
    optimalAngles?: boolean
}

export type {ProfileQueryParams}