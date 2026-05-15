import { useState, useCallback } from 'react';

export function useLives(initialLives: number = 5) {
    const [lives, setLives] = useState(initialLives);

    const loseLife = useCallback(() => {
        setLives(prev => prev - 1);
    }, []);

    const reset = useCallback(() => {
        setLives(initialLives);
    }, [initialLives]);

    return { lives, loseLife, reset };
}