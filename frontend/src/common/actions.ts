import {requester} from "./requester/requester.ts";
import type {ProfileQueryParams} from "./types/QueryParams.ts";
import {mapObjectToQueryParams} from "./helpers.ts";
import type {ApiResponse, PVResponse} from "./requester/ApiResponse.ts";

const action_get_profile_data = async (queryParams:ProfileQueryParams) => {
    const query = mapObjectToQueryParams(queryParams);
    let data = await requester(`/pv/getInfo${query}`, "GET")
    data = await data.json()
    return data as unknown as ApiResponse<PVResponse>;
}

export {
    action_get_profile_data
}