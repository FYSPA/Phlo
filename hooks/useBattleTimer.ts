import { useCallback, useEffect, useRef, useState } from 'react';

export function useBattleTimer(initialSeconds: number) {
    const [timeLeft, setTimeLeft] = useState(initialSeconds);
    const [isRunning, setIsRunning] = useState(false);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const onTimeoutRef = useRef<(() => void) | null>(null);

    const clearTimer = useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    const stop = useCallback(() => {
        clearTimer();
        setIsRunning(false);
    }, [clearTimer]);

    const start = useCallback((onTimeout: () => void) => {
        clearTimer();
        onTimeoutRef.current = onTimeout;
        setTimeLeft(initialSeconds);
        setIsRunning(true);

        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearTimer();
                    setIsRunning(false);
                    onTimeoutRef.current?.();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }, [initialSeconds, clearTimer]);

    useEffect(() => () => clearTimer(), [clearTimer]);

    return { timeLeft, isRunning, start, stop };
}
