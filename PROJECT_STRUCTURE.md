# Estructura del Proyecto: Phlo

## Descripción Breve
**Phlo** es una aplicación móvil educativa construida con React Native y Expo Router. Incorpora flujos de trabajo de ejercicios interactivos (integrando Blockly y previsualización de código en tiempo real), elementos competitivos (matchmaking PvP), y está respaldada por **Supabase** para la autenticación y la base de datos. Además, el entorno de desarrollo se encuentra dockerizado para facilitar despliegues y pruebas multiplataforma.

## 1. Diagrama Visual de la Estructura de Carpetas

```text
phlo/
├── app/                        # Enrutamiento de Expo Router (File-based routing) y pantallas
│   ├── (tabs)/                 # Pantallas de navegación por pestañas principales
│   ├── components/             # Componentes específicos de las pantallas rutables
│   ├── screens/                # Vistas y pantallas completas de la aplicación
│   ├── viewModels/             # Lógica de negocio y manejo de estado (Patrón MVVM)
│   ├── _layout.tsx             # Layout principal contenedor de la aplicación
│   └── index.tsx               # Punto de entrada inicial de la navegación
├── assets/                     # Recursos estáticos (imágenes, fuentes, íconos)
├── components/                 # Componentes de UI reutilizables y globales
│   ├── common/                 # Componentes genéricos (botones, entradas de texto, modales)
│   ├── exercise/               # Componentes específicos de ejercicios (Blockly, vista de código)
│   ├── map/                    # Componentes relacionados al mapa y navegación de niveles
│   ├── profile/                # Componentes de la interfaz de perfil de usuario
│   └── pvp/                    # Componentes del modo de jugador contra jugador
├── constants/                  # Constantes globales (configuraciones, paletas de colores, temas)
├── hooks/                      # Custom hooks globales de React (ej. useColorScheme)
├── scripts/                    # Scripts de utilidades para gestión y configuración del entorno
├── src/                        # Lógica central compartida, integraciones y servicios
│   ├── lib/                    # Configuración de librerías de terceros
│   ├── services/               # Integración con APIs y Backend (Supabase, Autenticación, Cursos)
│   ├── types/                  # Definiciones de tipos e interfaces estáticas de TypeScript
│   └── utils/                  # Funciones utilitarias agnósticas (ej. formateo de código)
├── .env                        # Variables de entorno secretas y configuraciones locales
├── app.json                    # Configuración integral de la aplicación en Expo
├── docker-compose.yml          # Orquestación de contenedores de Docker
├── Dockerfile                  # Definición de imagen del contenedor para el entorno de desarrollo
├── package.json                # Gestión de dependencias, metadatos y scripts de Node.js
└── tsconfig.json               # Configuración del compilador y reglas de TypeScript
```

## 2. Descripción Detallada de Archivos y Carpetas

### Carpetas Principales

*   **`app/`**: Constituye el núcleo de la navegación y la interfaz de usuario. Al basarse en Expo Router, la jerarquía de archivos dentro de esta carpeta dicta de forma directa las rutas (URLs) y el comportamiento de navegación de la aplicación.
    *   **`(tabs)/`**: Agrupa lógicamente las pantallas que conforman la barra de navegación inferior, ignorando los paréntesis en el sistema de enrutamiento web/profundo.
    *   **`screens/`**: Contiene las pantallas y módulos visuales extensos (ej. `ExerciseScreen.tsx`, `LoginScreen.tsx`). Facilita un encapsulamiento modular.
    *   **`viewModels/`**: Separa la lógica de estado e interacciones complejas de los componentes puramente visuales, adoptando el patrón de diseño Model-View-ViewModel a través de Custom Hooks.
*   **`components/`**: Aloja todos los bloques de construcción de la interfaz gráfica. Su categorización semántica (`exercise`, `pvp`, `common`) promueve el principio de Responsabilidad Única (SRP) y alta reutilización en todo el proyecto.
*   **`src/`**: Centraliza la capa de datos y lógica de dominio agnóstica a React.
    *   **`services/`**: Provee abstracciones para la comunicación de red, interactuando activamente con el ecosistema de Supabase (`authService.js`, `courseService.ts`, `supabase.ts`).
    *   **`utils/`**: Alberga funciones auxiliares y transformaciones de datos puras, como `codeUtils.ts`, optimizando la manipulación de código y validaciones sin depender de la UI.
*   **`assets/`**: Directorio para inyectar recursos estáticos empaquetables que son cargados localmente en las vistas, asegurando rendimiento y consistencia visual.

### Archivos Raíz Críticos

*   **`app.json`**: Archivo de configuración troncal de Expo. Define metadatos imprescindibles como el bundle identifier, permisos, orientaciones, esquema de color e íconos utilizados durante el empaquetado para iOS y Android.
*   **`package.json`**: El registro central de dependencias de terceros, así como el manifiesto para comandos de Node (scripts como `start`, `lint`).
*   **`Dockerfile` y `docker-compose.yml`**: Garantizan un entorno reproducible, permitiendo levantar y orquestar el servidor de desarrollo aislado, previniendo así las discrepancias de "funciona en mi máquina".
*   **`tsconfig.json` y `eslint.config.js`**: Administran la rigurosidad de TypeScript y las normativas de Linter, estandarizando la calidad, seguridad y el formateo del código fuente a nivel equipo.
*   **`.env`**: Archivo esencial de desarrollo que resguarda variables sensibles o inyectables por el entorno (como las credenciales de conexión públicas/privadas de Supabase).

## 3. Guía de Convenciones de Nombres

Con el fin de garantizar una alta legibilidad, estandarización y mantenimiento del repositorio, se deben cumplir estrictamente las siguientes directrices de nomenclatura:

1.  **Componentes y Pantallas (Interfaces React):**
    *   **Formato:** `PascalCase.tsx`
    *   **Uso:** Todo archivo que exporte como función principal un componente visual de React.
    *   **Ejemplo:** `ExerciseScreen.tsx`, `CustomButton.tsx`, `CodePreview.tsx`.
2.  **Lógica, Utilidades y Servicios (Non-UI):**
    *   **Formato:** `camelCase.ts` o `camelCase.js`
    *   **Uso:** Clases, funciones puras, utilidades, y servicios de conexión a datos.
    *   **Ejemplo:** `codeUtils.ts`, `authService.js`, `supabase.ts`.
3.  **Hooks (ViewModel y Custom Hooks):**
    *   **Formato:** `camelCase.ts` empezando obligatoriamente con la palabra reservada `use`.
    *   **Ejemplo:** `useLives.ts`, `useThemeColor.ts`.
4.  **Directorios y Carpetas:**
    *   **Formato:** `camelCase` o minúsculas (`lowercase`).
    *   **Excepciones controladas:** Las reglas de Expo Router donde se usan paréntesis `(tabs)` o layouts especiales con guion bajo `_layout.tsx`.
    *   **Ejemplo:** `screens`, `components`, `viewModels`.
5.  **Variables Internas, Constantes y Tipos:**
    *   **Variables locales y funciones:** `camelCase` (ej. `fetchUserData`, `isLoading`).
    *   **Constantes globales:** `UPPER_SNAKE_CASE` (ej. `MAX_RETRIES_ALLOWED`, `EXPO_PUBLIC_SUPABASE_URL`).
    *   **Interfaces/Tipos TypeScript:** `PascalCase` sin prefijos desactualizados (ej. `UserProfile`, en lugar de `IUserProfile`).
