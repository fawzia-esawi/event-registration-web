import { useEffect, useRef, useState } from "react";

export function useCountUp(target: number, duration = 900): number {
    const [value, setValue] = useState(0);
    const fromRef = useRef(0);

    useEffect(() => {
        const from = fromRef.current;
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const total = reduceMotion ? 0 : duration;
        const startedAt = performance.now();
        let frame = 0;

        const tick = (now: number) => {
            const progress = total === 0 ? 1 : Math.max(0, Math.min((now - startedAt) / total, 1));
            const eased = 1 - (1 - progress) ** 3;
            setValue(Math.round(from + (target - from) * eased));

            if (progress < 1) {
                frame = requestAnimationFrame(tick);
            } else {
                fromRef.current = target;
            }
        };

        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, [target, duration]);

    return value;
}