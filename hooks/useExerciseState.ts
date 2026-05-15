import { useState, useCallback } from 'react';
import { supabase } from '../src/services/supabase';

interface Exercise {
    id: number;
    lesson_id: string;
    instruction: string;
    solution_js: string;
    toolbox_config: any;
    order_index: number;
}

export function useExerciseState(lessonId: string) {
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentCode, setCurrentCode] = useState('');

    const loadExercises = useCallback(async () => {
        setExercises([]);
        setCurrentIndex(0);
        setCurrentCode('');

        const { data } = await supabase
            .from('exercises')
            .select('*')
            .eq('lesson_id', lessonId)
            .order('order_index', { ascending: true });

        if (data && data.length > 0) {
            setExercises(data);
        }
    }, [lessonId]);

    const advanceToNext = useCallback(() => {
        setCurrentIndex(prev => prev + 1);
        setCurrentCode('');
    }, []);

    const reset = useCallback(() => {
        setCurrentIndex(0);
        setCurrentCode('');
        loadExercises();
    }, [loadExercises]);

    return {
        exercises,
        currentIndex,
        currentCode,
        setCurrentCode,
        loadExercises,
        advanceToNext,
        reset,
    };
}