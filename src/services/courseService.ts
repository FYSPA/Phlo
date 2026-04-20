import { supabase } from './supabase';

export const courseService = {
    _levelsCache: null as any[] | null,

    async getLevels() {
        if (this._levelsCache) {
            return this._levelsCache;
        }

        // 1. Obtener el ID del usuario actual
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        // 2. Traer lecciones con su progreso relacionado
        const { data, error } = await supabase
            .from('lessons')
            .select(`
                id,
                title,
                order_index,
                user_progress (
                    completed_at
                )
            `)
            .order('order_index', { ascending: true });

        if (error) {
            console.error("Error en getLevels:", error);
            throw error;
        }

        this._levelsCache = data;
        return data;
    },

    async getNextLevelId(currentLessonId: string) {
        try {
            // 1. Obtener el order_index de la lección actual
            const { data: currentLesson, error: currentError } = await supabase
                .from('lessons')
                .select('order_index')
                .eq('id', currentLessonId)
                .single();

            if (currentError || !currentLesson) return null;

            // 2. Buscar la siguiente lección
            const { data: nextLesson, error: nextError } = await supabase
                .from('lessons')
                .select('id')
                .gt('order_index', currentLesson.order_index)
                .order('order_index', { ascending: true })
                .limit(1)
                .single();

            if (nextError || !nextLesson) return null;

            return nextLesson.id;
        } catch (e) {
            console.error("Error al obtener el siguiente nivel:", e);
            return null;
        }
    }
};