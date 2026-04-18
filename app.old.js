import { useEffect, useState } from 'react';
import LoginScreen from './src/screens/LoginScreen'; // Pantalla que crearemos
import MainMapScreen from './src/screens/MainMapScreen'; // Tu mapa de niveles
import { supabase } from './src/services/supabase';

export default function App() {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Revisar si ya hay una sesión iniciada al abrir la app
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        // Escuchar cambios (cuando el usuario entra o sale)
        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    if (loading) return null; // O una pantalla de carga (Splash)

    return (
        <>
            {session ? (
                <MainMapScreen session={session} />
            ) : (
                <LoginScreen />
            )}
        </>
    );
}