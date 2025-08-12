"use client";
import { useAppDispatch } from "@/lib/redux/useAppDispatch";
import type { AsyncThunk } from "@reduxjs/toolkit";
import { useCallback, useState } from "react";

type Handlers<TData> = {
    onSuccess?: (data: TData) => void;
    onError?: (err: unknown) => void;
    onFinally?: () => void;
};

export function useThunkAction<TArg, TData, TConfig extends {} = any>(
    thunk: AsyncThunk<TData, TArg, TConfig>
) {
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<unknown>(null);

    const run = useCallback(
        async (arg: TArg, handlers?: Handlers<TData>) => {
            setLoading(true);
            setError(null);
            try {
                const actionPromise = (dispatch as any)((thunk as any)(arg));
                const result = (await actionPromise.unwrap()) as TData;
                handlers?.onSuccess?.(result);
                return result;
            } catch (err) {
                setError(err);
                handlers?.onError?.(err);
                throw err;
            } finally {
                setLoading(false);
                handlers?.onFinally?.();
            }
        },
        [dispatch, thunk]
    );

    const runSafe = useCallback(
        async (arg: TArg, handlers?: Handlers<TData>) => {
            try {
                const data = await run(arg, handlers);
                return { ok: true as const, data };
            } catch (err) {
                return { ok: false as const, error: err };
            }
        },
        [run]
    );

    return { run, runSafe, loading, error } as const;
}


