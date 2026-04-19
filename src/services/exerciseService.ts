import { supabase } from './supabase';


export const exerciseService = {
    async getExerciseByLesson(lessonId: string) {
        const { data, error } = await supabase
            .from('exercises')
            .select('*')
            .eq('lesson_id', lessonId)
            .single();

        if (error) throw error;
        return data;
    },

    async completeLevel(lessonId: string, xpEarned: number, gemsEarned: number) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // 1. Registrar el progreso de la lección
        const { error: progressError } = await supabase
            .from('user_progress')
            .upsert({
                user_id: user.id,
                lesson_id: parseInt(lessonId),
                completed_at: new Date().toISOString()
            });

        if (progressError) throw progressError;

        // 2. Sumar XP y Gemas al perfil
        const { data: profile } = await supabase
            .from('profiles')
            .select('xp, gems')
            .eq('id', user.id)
            .single();

        const { error: profileError } = await supabase
            .from('profiles')
            .update({
                xp: (profile?.xp || 0) + xpEarned,
                gems: (profile?.gems || 0) + gemsEarned
            })
            .eq('id', user.id);

        if (profileError) throw profileError;
    }
};