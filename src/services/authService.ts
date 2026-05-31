import { supabase } from './supabase';

interface Profile {
    id: string;
    username?: string;
    avatar_url?: string;
    xp?: number;
    gems?: number;
    league_points?: number;
}

interface SignUpData {
    user: import('@supabase/supabase-js').User | null;
    session: import('@supabase/supabase-js').Session | null;
}

interface SignInData {
    user: import('@supabase/supabase-js').User | null;
    session: import('@supabase/supabase-js').Session | null;
}

export const authService = {
    async signUp(email: string, password: string, username: string): Promise<SignUpData> {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { username },
            },
        });
        if (error) throw error;
        return data;
    },

    async signIn(email: string, password: string): Promise<SignInData> {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;
        return data;
    },

    async signOut(): Promise<true> {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        return true;
    },

    async resendConfirmationEmail(email: string): Promise<void> {
        const { error } = await supabase.auth.resend({
            type: 'signup',
            email,
        });
        if (error) throw error;
    },

    async getUserProfile(): Promise<Profile | null> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error) throw error;
        return data as Profile;
    },
};
