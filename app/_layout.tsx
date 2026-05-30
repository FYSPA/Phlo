import { Session } from '@supabase/supabase-js';
import * as Linking from 'expo-linking';
import { Stack, useRootNavigationState, useRouter, useSegments } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
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
  const pendingRecoveryRef = useRef(false);
  const deepLinkHandledRef = useRef(false);

  useEffect(() => {
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      
      if (session) {
        try {
          await courseService.getLevels();
        } catch (e) {
          console.error("Error pre-fetching:", e);
        }
      }
      setDataReady(true);

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

  // Capturar URL inicial en frío (getInitialURL) y cualquier URL posterior (useURL)
  useEffect(() => {
    Linking.getInitialURL().then((initialUrl) => {
      if (initialUrl && !deepLinkHandledRef.current) {
        handleDeepLink(initialUrl);
      }
    });
  }, []);

  useEffect(() => {
    if (url && !deepLinkHandledRef.current) {
      handleDeepLink(url);
    }
  }, [url]);

  // Navegación diferida: esperar a que el layout esté listo
  useEffect(() => {
    if (!initialized || !rootNavigationState?.key) return;

    // Si hay una navegación de recovery pendiente, no redirigir automáticamente
    if (pendingRecoveryRef.current) return;

    const currentSegments = segments as string[];

    const isInsideTabs = currentSegments[0] === '(tabs)';

const publicScreens = ['LoginScreen', 'RegisterScreen', 'ForgotPasswordScreen', 'UpdatePasswordScreen'];
    const isPublicScreen = currentSegments.length > 2 && currentSegments[0] === 'screens' && currentSegments[1] === 'auth' && publicScreens.includes(currentSegments[2] as string);
    const isInsideScreens = currentSegments[0] === 'screens';
    const inAuthGroup = isInsideTabs || (isInsideScreens && !isPublicScreen);

    if (!session && inAuthGroup) {
      router.replace('/');
    }
    else if (session) {
      // No redirigir si está en UpdatePasswordScreen (viene del flujo de recovery)
      const isOnUpdatePassword =
        currentSegments.length >= 3 &&
        currentSegments[0] === 'screens' &&
        currentSegments[1] === 'auth' &&
        currentSegments[2] === 'UpdatePasswordScreen';

      if (!isOnUpdatePassword && (!inAuthGroup || isPublicScreen || currentSegments.length === 0)) {
        router.replace('/(tabs)/home');
      }
    }
  }, [session, initialized, segments, rootNavigationState?.key]);

  const handleDeepLink = async (deepLinkUrl: string) => {
    try {
      const access_token = deepLinkUrl.match(/access_token=([^&]+)/)?.[1];
      const refresh_token = deepLinkUrl.match(/refresh_token=([^&]+)/)?.[1];

      if (access_token && refresh_token) {
        await supabase.auth.setSession({
          access_token,
          refresh_token,
        });
      }

      const isRecovery = deepLinkUrl.includes('type=recovery') || !!access_token;

      if (isRecovery) {
        deepLinkHandledRef.current = true;
        pendingRecoveryRef.current = true;
      }
    } catch (e) {
      console.error('Error handling deep link:', e);
    }
  };

  // Navegación pendiente por recovery: se ejecuta cuando el layout está listo
  useEffect(() => {
    if (pendingRecoveryRef.current && initialized && rootNavigationState?.key) {
      pendingRecoveryRef.current = false;
      router.push('/screens/auth/UpdatePasswordScreen');
    }
  }, [initialized, rootNavigationState?.key]);

  // 1. Calculamos la posición actual para decidir qué renderizar
  const currentSegments = segments as string[];
  const isInsideTabs = currentSegments[0] === '(tabs)';
const publicScreens = ['LoginScreen', 'RegisterScreen', 'ForgotPasswordScreen', 'UpdatePasswordScreen'];
    const isPublicScreen = currentSegments.length > 1 && currentSegments[0] === 'screens' && currentSegments[1] === 'auth' && publicScreens.includes(currentSegments[2] as string);
    const isInsideScreens = currentSegments[0] === 'screens';
  const inAuthGroup = isInsideTabs || (isInsideScreens && !isPublicScreen);

  // 2. Decidimos si mostrar la carga (esperamos a la sesión Y a los datos del mapa)
  const isOnUpdatePassword =
    currentSegments.length >= 3 &&
    currentSegments[0] === 'screens' &&
    currentSegments[1] === 'auth' &&
    currentSegments[2] === 'UpdatePasswordScreen';
  const showLoading = !initialized || !dataReady || (session && !inAuthGroup && !isOnUpdatePassword);

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