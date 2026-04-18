import { supabase } from './supabase';

export const authService = {
    // 1. REGISTRO
    async signUp(email, password, username) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                // Pasamos el username en metadata para que el Trigger de SQL lo use
                data: { username: username },
            },
        });
        if (error) throw error;
        return data;
    },

    // 2. INICIO DE SESIÓN
    async signIn(email, password) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;
        return data;
    },

    // 3. CERRAR SESIÓN
    async signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        return true;
    },

    // 4. OBTENER PERFIL ACTUAL (XP, Gemas, etc.)
    async getUserProfile() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error) throw error;
        return data;
    }
};