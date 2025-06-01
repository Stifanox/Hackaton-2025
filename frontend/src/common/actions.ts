import {requester} from "./requester/requester.ts";
import type {ProfileQueryParams} from "./types/QueryParams.ts";
import {mapObjectToQueryParams} from "./helpers.ts";
import type { PVResponse, StatisticsResponse} from "./requester/ApiResponse.ts";
import type {StatisticsPayload} from "./requester/Payload.ts";

const action_get_profile_data = async (queryParams:ProfileQueryParams) => {
    const query = mapObjectToQueryParams(queryParams);
    let data = await requester(`/pv/getInfo${query}`, "GET")
    data = await data.json()
    return data as unknown as PVResponse;
}

const action_get_statistics_data = async (payload:StatisticsPayload) => {
    let data = await requester(`/pv/statistics`, "POST", payload)
    data = await data.json()
    return data as unknown as StatisticsResponse;
}

export {
    action_get_profile_data,
    action_get_statistics_data,
}