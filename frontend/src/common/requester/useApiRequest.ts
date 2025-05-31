import {useState, useCallback, useMemo} from "react";
import type {ApiResponse, ErrorResponse, SuccessResponse} from "./ApiResponse.ts";

type RequestStatus = "idle" | "pending" | "success" | "error";

interface ApiState<T> {
    status: RequestStatus;
    data: SuccessResponse<T> | null;
    error: ErrorResponse | null;
}

export function useApiRequest<T>(
    requestFn: () => ApiResponse<T>,
) {
    const [state, setState] = useState<ApiState<T>>({
        status: "idle",
        data: null,
        error: null,
    });

    const execute = useCallback(async () => {
        setState({ status: "pending", data: null, error: null });

        try {
            const data = await requestFn();
            if(data.success) {
                setState({ status: "success", data, error: null });
            }else {
                setState({ status: "error", data: null, error:data || "Error" });
            }
            return data;
        } catch (err: any) {
            setState({ status: "error", data: null, error: err.message || "Error" });
            throw err;
        }
    }, [requestFn]);

    const isPending = useMemo(() => state.status === "pending", [state.status]);
    const isSuccess = useMemo(() => state.status === "success", [state.status]);
    const isError = useMemo(() => state.status === "error", [state.status]);


    return { ...state, isError,isSuccess, isPending ,execute };
}
