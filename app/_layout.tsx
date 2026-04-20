import { Session } from '@supabase/supabase-js';
import * as Linking from 'expo-linking';
import { Stack, useRouter, useSegments, useRootNavigationState } from 'expo-router';
import { useEffect, useState } from 'react';
import { supabase } from '../src/services/supabase';

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [initialized, setInitialized] = useState(false);
  const segments = useSegments();
  const rootNavigationState = useRootNavigationState();
  const url = Linking.useURL();
  const router = useRouter();

  useEffect(() => {
    // Escuchar cambios en la sesión
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setInitialized(true);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  useEffect(() => {
    if (!initialized) return;
    if (!rootNavigationState?.key) return; // Esperar a que la navegación esté montada

    // Bypass strict Expo Router types for segments
    const currentSegments = segments as string[];

    // 1. Revisamos si el usuario está intentando entrar a una zona protegida
    const isInsideTabs = currentSegments[0] === '(tabs)';
    
    // Pantallas públicas dentro de la carpeta screens
    const publicScreens = ['LoginScreen', 'RegisterScreen', 'ForgotPasswordScreen', 'UpdatePasswordScreen'];
    const isPublicScreen = currentSegments.length > 1 && currentSegments[0] === 'screens' && publicScreens.includes(currentSegments[1]);
    
    // Solo requerimos auth si es una pestaña o si es una pantalla privada (ej: ExerciseScreen)
    const isInsideScreens = currentSegments[0] === 'screens';
    const inAuthGroup = isInsideTabs || (isInsideScreens && !isPublicScreen);

    // LOGS DE DEPURACIÓN
    console.log('Segmentos actuales:', currentSegments);
    console.log('¿Hay sesión?:', !!session);
    console.log('¿Requiere Auth?:', inAuthGroup);

    if (!session && inAuthGroup) {
      // Caso A: No hay sesión y quiere entrar al juego -> Lo mandamos al inicio (Landing)
      console.log('Redirigiendo a Landing por falta de sesión');
      router.replace('/');
    }
    else if (session && (!inAuthGroup || isPublicScreen || currentSegments.length === 0)) {
      // Caso B: Hay sesión pero está en el Landing o Login -> Lo mandamos al Mapa
      console.log('Redirigiendo al Mapa porque ya inició sesión');

      // IMPORTANTE: Asegúrate de que esta ruta sea válida. 
      // Si tu archivo es app/(tabs)/index.tsx, la ruta es '/(tabs)'
      router.replace('/(tabs)/home');
    }
  }, [session, initialized, segments, rootNavigationState?.key]);


  // useEffect(() => {
  //   const handleDeepLink = (url: string) => {
  //     const { path, queryParams } = Linking.parse(url);
  //     if (path === 'update-password') {
  //       router.push('/screens/UpdatePasswordScreen');
  //     }
  //   };

  //   // Escuchar si la app se abre con un link
  //   const subscription = Linking.addEventListener('url', (event) => {
  //     handleDeepLink(event.url);
  //   });

  //   return () => subscription.remove();
  // }, []);

  useEffect(() => {
    const handleDeepLink = async () => {
      if (!url) return;

      // Extraemos tokens manualmente de la URL sin importar si vienen como query (?) o hash (#)
      const access_token = url.match(/access_token=([^&]+)/)?.[1];
      const refresh_token = url.match(/refresh_token=([^&]+)/)?.[1];

      // Si llegaron los tokens en el link temporal, iniciamos sesión "invisible"
      if (access_token && refresh_token) {
        await supabase.auth.setSession({
          access_token: access_token,
          refresh_token: refresh_token
        });
      }

      const { hostname, path } = Linking.parse(url);

      // Chequeamos si es la ruta de recuperación manual o si la URL indica 'type=recovery' de Supabase
      if (path === 'update-password' || hostname === 'update-password' || url.includes('type=recovery') || access_token) {
        // Redirigimos a la pantalla una vez la sesión ya está establecida
        router.push('/screens/UpdatePasswordScreen');
      }
    };

    handleDeepLink();
  }, [url]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="screens/LoginScreen" options={{ headerShown: true, title: 'Iniciar Sesión' }} />
      <Stack.Screen name="screens/RegisterScreen" options={{ headerShown: true, title: 'Crear Cuenta' }} />
      <Stack.Screen name="screens/ForgotPasswordScreen" options={{ headerShown: true, title: 'Recuperar Contraseña' }} />
      <Stack.Screen name="screens/UpdatePasswordScreen" options={{ headerShown: true, title: 'Actualizar Contraseña' }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}