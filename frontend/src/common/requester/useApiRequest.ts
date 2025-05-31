import {useState, useCallback, useMemo} from "react";
import type {ApiResponse, ErrorResponse, SuccessResponse} from "./ApiResponse.ts";

type RequestStatus = "idle" | "pending" | "success" | "error";

interface ApiState<T> {
    status: RequestStatus;
    data: SuccessResponse<T> | null;
    error: ErrorResponse | null;
}

interface UseApiRequestOptions<T> {
    onPending?: () => void;
    onSuccess?: (data: SuccessResponse<T>) => void;
    onError?: (error: ErrorResponse | string) => void;
}

export function useApiRequest<T,K>(
    requestFn: (data?:K) => ApiResponse<T>,
    options?: UseApiRequestOptions<T>,
) {
    const [state, setState] = useState<ApiState<T>>({
        status: "idle",
        data: null,
        error: null,
    });

    const execute = useCallback(async (payload?:K) => {
        setState({ status: "pending", data: null, error: null });
        options?.onPending?.();

        try {
            const data = await requestFn(payload);

            if (data.success) {
                setState({ status: "success", data, error: null });
                options?.onSuccess?.(data);
            } else {
                setState({ status: "error", data: null, error: data });
                options?.onError?.(data);
            }
            return data;
        } catch (err: any) {
            const message = err.message || "Error";
            setState({ status: "error", data: null, error: message });
            options?.onError?.(message);
            throw err;
        }
    }, [requestFn, options]);

    const isPending = useMemo(() => state.status === "pending", [state.status]);
    const isSuccess = useMemo(() => state.status === "success", [state.status]);
    const isError = useMemo(() => state.status === "error", [state.status]);


    return { ...state, isError, isSuccess, isPending ,execute };
}
