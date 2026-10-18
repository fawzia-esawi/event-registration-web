import { useEffect, useState } from "react";
import { ApiError } from "../api/client.ts";

interface UseApiResult<T> {
    data: T | null;
    isLoading: boolean;
    error: string | null;
    reload: () => void;
}

interface SettledResult<T> {
    fetcher: () => Promise<T>;
    reloadCount: number;
    data: T | null;
    error: string | null;
}

export function useApi<T>(fetcher: () => Promise<T>): UseApiResult<T> {
    const [settled, setSettled] = useState<SettledResult<T> | null>(null);
    const [reloadCount, setReloadCount] = useState(0);

    useEffect(() => {
        let ignore = false;

        fetcher()
            .then((data) => {
                if (!ignore) {
                    setSettled({ fetcher, reloadCount, data, error: null });
                }
            })
            .catch((err: unknown) => {
                if (ignore) return;
                const message = err instanceof ApiError ? err.message : "Something went wrong.";
                setSettled({ fetcher, reloadCount, data: null, error: message });
            });

        return () => {
            ignore = true;
        };
    }, [fetcher, reloadCount]);

    const current =
        settled !== null && settled.fetcher === fetcher && settled.reloadCount === reloadCount
            ? settled
            : null;

    const reload = () => setReloadCount((count) => count + 1);

    return {
        data: current?.data ?? null,
        isLoading: current === null,
        error: current?.error ?? null,
        reload,
    };
}