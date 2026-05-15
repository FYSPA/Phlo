import { Session } from '@supabase/supabase-js';
import * as Linking from 'expo-linking';
import { Stack, useRootNavigationState, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import LoadingScreen from '../components/common/LoadingScreen';
import { courseService } from '../src/services/courseService';
import { supabase } from '../src/services/supabase';

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [dataReady, setDataReady] = useState(false);
  const segments = useSegments();
  const rootNavigationState = useRootNavigationState();
  const url = Linking.useURL();
  const router = useRouter();

  useEffect(() => {
    // 1. Obtener sesión inicial con un retraso artificial para mejorar la UX
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      
      if (session) {
        // Pre-fetch de los niveles mientras el robot está en pantalla
        try {
          await courseService.getLevels();
        } catch (e) {
          console.error("Error pre-fetching:", e);
        }
      }
      setDataReady(true);

      // Mínimo 2 segundos de animación para que se sienta fluido
      setTimeout(() => {
        setInitialized(true);
      }, 2000);
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!initialized) return;
    if (!rootNavigationState?.key) return;

    const currentSegments = segments as string[];

    const isInsideTabs = currentSegments[0] === '(tabs)';

const publicScreens = ['LoginScreen', 'RegisterScreen', 'ForgotPasswordScreen', 'UpdatePasswordScreen'];
    const isPublicScreen = currentSegments.length > 2 && currentSegments[0] === 'screens' && currentSegments[1] === 'auth' && publicScreens.includes(currentSegments[2] as string);
    const isInsideScreens = currentSegments[0] === 'screens';
    const inAuthGroup = isInsideTabs || (isInsideScreens && !isPublicScreen);

    if (!session && inAuthGroup) {
      router.replace('/');
    }
    else if (session && (!inAuthGroup || isPublicScreen || currentSegments.length === 0)) {
      router.replace('/(tabs)/home');
    }
  }, [session, initialized, segments, rootNavigationState?.key]);


  // 1. Calculamos la posición actual para decidir qué renderizar
  const currentSegments = segments as string[];
  const isInsideTabs = currentSegments[0] === '(tabs)';
const publicScreens = ['LoginScreen', 'RegisterScreen', 'ForgotPasswordScreen', 'UpdatePasswordScreen'];
    const isPublicScreen = currentSegments.length > 1 && currentSegments[0] === 'screens' && currentSegments[1] === 'auth' && publicScreens.includes(currentSegments[2] as string);
    const isInsideScreens = currentSegments[0] === 'screens';
  const inAuthGroup = isInsideTabs || (isInsideScreens && !isPublicScreen);

  // 2. Decidimos si mostrar la carga (esperamos a la sesión Y a los datos del mapa)
  const showLoading = !initialized || !dataReady || (session && !inAuthGroup);


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
        router.push('/screens/auth/UpdatePasswordScreen');
      }
    };

    handleDeepLink();
  }, [url]);

  if (showLoading) {
    return <LoadingScreen />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="screens/auth/LoginScreen" options={{ headerShown: true, title: 'Iniciar Sesión' }} />
      <Stack.Screen name="screens/auth/RegisterScreen" options={{ headerShown: true, title: 'Crear Cuenta' }} />
      <Stack.Screen name="screens/auth/ForgotPasswordScreen" options={{ headerShown: true, title: 'Recuperar Contraseña' }} />
      <Stack.Screen name="screens/auth/UpdatePasswordScreen" options={{ headerShown: true, title: 'Actualizar Contraseña' }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}