import { useState, useCallback } from 'react';
import { getBotDifficulty, getBotTiming } from '../src/utils/pvpUtils';
import { BotResponse } from '../src/types/pvp';

export function useAIBot(userLeaguePoints: number) {
    const [isThinking, setIsThinking] = useState(false);

    const generateResponse = useCallback((): Promise<BotResponse> => {
        console.log('[DEBUG] useAIBot: generateResponse llamado');
        console.log('[DEBUG] userLeaguePoints:', userLeaguePoints);
        
        return new Promise((resolve) => {
            const difficulty = getBotDifficulty(userLeaguePoints);
            const timing = getBotTiming(userLeaguePoints);
            const responseTime = Math.floor(Math.random() * (timing.max - timing.min) + timing.min);
            const isCorrect = Math.random() < difficulty;

            console.log('[DEBUG] useAIBot: difficulty:', difficulty, 'responseTime:', responseTime, 'isCorrect:', isCorrect);

            setIsThinking(true);

            setTimeout(() => {
                console.log('[DEBUG] useAIBot: Timer completado');
                setIsThinking(false);
                resolve({
                    isCorrect,
                    responseTime,
                    code: isCorrect ? '' : 'invalid_code',
                });
            }, responseTime);
        });
    }, [userLeaguePoints]);

    const reset = useCallback(() => {
        setIsThinking(false);
    }, []);

    return {
        generateResponse,
        reset,
        isThinking,
    };
}