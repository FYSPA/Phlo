import { supabase } from './supabase';

export const courseService = {
    async getLevels() {
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

        return data;
    }
};