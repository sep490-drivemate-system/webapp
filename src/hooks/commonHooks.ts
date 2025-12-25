"use client";
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FormSchema, validateField, validateForm } from "@/schemas/schema";

// useLocalStorage
type SetValue<T> = Dispatch<SetStateAction<T>>;
export function useLocalStorage<T>(key: string, initialValue: T) {
    const readValue = useCallback((): T => {
        if (typeof window === "undefined") return initialValue;
        try {
            const item = window.localStorage.getItem(key);
            return item ? (JSON.parse(item) as T) : initialValue;
        } catch {
            return initialValue;
        }
    }, [initialValue, key]);

    const [value, setValue] = useState<T>(readValue);

    useEffect(() => {
        setValue(readValue());
    }, [key, readValue]);

    const setStoredValue: SetValue<T> = useCallback(
        (val) => {
            const newValue = val instanceof Function ? (val as (prev: T) => T)(value) : (val as T);
            setValue(newValue);
            if (typeof window !== "undefined") {
                window.localStorage.setItem(key, JSON.stringify(newValue));
            }
        },
        [key, value]
    );

    const remove = useCallback(() => {
        if (typeof window !== "undefined") {
            window.localStorage.removeItem(key);
        }
        setValue(initialValue);
    }, [initialValue, key]);

    return [value, setStoredValue, remove] as const;
}

// usePrevious
export function usePrevious<T>(value: T) {
    const ref = useRef<T>(value);
    useEffect(() => {
        ref.current = value;
    }, [value]);
    return ref.current;
}

// useDebouncedValue
export function useDebouncedValue<T>(value: T, delay = 300) {
    const [debounced, setDebounced] = useState<T>(value);
    useEffect(() => {
        const id = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(id);
    }, [value, delay]);
    return debounced;
}

// useAsync
export interface UseAsyncState<T> {
    data: T | null;
    loading: boolean;
    error: unknown;
}

export function useAsync<T>(fn: () => Promise<T>, deps: unknown[] = []) {
    const [state, setState] = useState<UseAsyncState<T>>({ data: null, loading: true, error: null });
    const mountedRef = useRef(true);

    const run = useCallback(async () => {
        setState((s) => ({ ...s, loading: true, error: null }));
        try {
            const result = await fn();
            if (mountedRef.current) setState({ data: result, loading: false, error: null });
        } catch (err) {
            if (mountedRef.current) setState({ data: null, loading: false, error: err });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);

    useEffect(() => {
        mountedRef.current = true;
        run();
        return () => {
            mountedRef.current = false;
        };
    }, [run]);

    return { ...state, reload: run } as const;
}

// useValidation hook
export function useValidation() {
    const [errors, setErrors] = useState<Record<string, string>>({});

    // validate 1 field
    const validateInput = useCallback(
        async <T extends keyof FormSchema>(field: T, value: FormSchema[T]) => {
            const result = await validateField(field, value);
            if (!result.isValid) {
                setErrors((prev) => ({ ...prev, [field]: result.error || "" }));
                return false;
            }
            setErrors((prev) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { [field]: _, ...rest } = prev;
                return rest;
            });
            return true;
        },
        []
    );

    // validate toàn form
    const validateAll = useCallback(async (values: FormSchema) => {
        const result = await validateForm(values);
        setErrors(result.errors);
        return result.isValid;
    }, []);

    // clear error
    const clearError = useCallback((field?: keyof FormSchema) => {
        setErrors((prev) => {
            if (!field) return {};
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { [field]: _, ...rest } = prev;
            return rest;
        });
    }, []);

    return { errors, validateInput, validateAll, clearError } as const;
}

// usePagination
export function usePagination<T>(items: T[], pageSize = 10, initialPage = 1) {
    const [page, setPage] = useState(initialPage);

    useEffect(() => {
        setPage(initialPage);
    }, [initialPage]);

    const total = items.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    const currentItems = useMemo(() => {
        const start = (page - 1) * pageSize;
        return items.slice(start, start + pageSize);
    }, [items, page, pageSize]);

    const next = () => setPage((p) => Math.min(totalPages, p + 1));
    const prev = () => setPage((p) => Math.max(1, p - 1));
    const reset = () => setPage(1);

    return { page, pageSize, total, totalPages, currentItems, setPage, next, prev, reset } as const;
}

// selector for specific slice
export function useSliceSelector<Slice, T>(selector: (state: Slice) => T, sliceSelector: (state: RootState) => Slice): T {
    return useSelector((state: RootState) => selector(sliceSelector(state)));
}