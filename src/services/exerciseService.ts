import { supabase } from './supabase';

export const exerciseService = {
    async getExerciseByLesson(lessonId: string) {
        const { data, error } = await supabase
            .from('exercises')
            .select('*')
            .eq('lesson_id', lessonId)
            .single(); // Traemos el primer ejercicio de esa lección

        if (error) throw error;
        return data;
    }
};