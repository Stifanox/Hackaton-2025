import {requester} from "./requester/requester.ts";
import type {PVResponse} from "./requester/ApiResponse.ts";

const action_get_profile_data = async () => {
    return await requester<null, PVResponse>('/pv/getInfo', "GET")
}

export {
    action_get_profile_data
}