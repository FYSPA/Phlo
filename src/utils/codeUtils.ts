// src/utils/codeUtils.ts

/**
 * Limpia el código de ruidos como espacios, puntos y coma y 
 * diferencias de declaración de variables de Blockly.
 */
export const normalizeCode = (code: string): string => {
    if (!code) return "";

    return code
        .replace(/var\s+(\w+);/g, 'var ') // Convierte "var puntos; puntos =" en "var puntos ="
        .replace(/\s+/g, '')             // Elimina todos los espacios y saltos de línea
        .replace(/;/g, '')               // Elimina los puntos y coma
        .replace(/"/g, "'")              // Estandariza comillas
        .trim();
};

/**
 * Limpia el código de Blockly: remueve saltos de línea repetidos, espacios extra.
 * "var i;\n\n\ni = 20;" => "var i; i = 20"
 */
export const cleanBlocklyCode = (code: string): string => {
    if (!code) return "";
    return code
        .replace(/\n+/g, ' ')       // Saltos de línea a espacios
        .replace(/\s+/g, ' ')       // Espacios múltiples a uno solo
        .replace(/;\s*$/, '')       // Punto y coma final
        .trim();
};

/**
 * Extrae información de variable y valor usando un Regex robusto.
 * Soporta:
 * - "var nombre = valor"
 * - "var nombre; nombre = valor"
 * - "nombre = valor"
 */
export const extractVariableInfo = (cleanedCode: string) => {
    const regex = /^(?:(?:var|let|const)\s+[a-zA-Z_$]\w*\s*;\s*)?(?:var|let|const)?\s*([a-zA-Z_$]\w*)\s*=\s*(.+)$/;
    const match = cleanedCode.match(regex);
    if (match) {
        return { name: match[1], value: match[2].trim() };
    }
    return null;
};

/**
 * Extrae los tokens significativos de una expresión para comparación flexible.
 * Ejemplo: "var puntos = 10" → ["var", "puntos", "=", "10"]
 */
const extractTokens = (code: string): string[] => {
    if (!code) return [];
    return code
        .replace(/;/g, '')
        .replace(/"/g, "'")
        .trim()
        .split(/\s+/)
        .filter(t => t.length > 0);
};

/**
 * Operadores conmutativos donde el orden de los operandos no importa.
 * Ejemplo: 10 + x === x + 10, 10 == x === x == 10
 */
const COMMUTATIVE_OPS = ['+', '*', '==', '===', '!=', '!=='];

/**
 * Verifica si dos expresiones son equivalentes considerando conmutatividad.
 * Ejemplo: "10 + x" y "x + 10" son equivalentes.
 */
const areExpressionsEquivalent = (userCode: string, expectedCode: string): boolean => {
    const userTokens = extractTokens(userCode);
    const expectedTokens = extractTokens(expectedCode);

    // Si tienen diferente cantidad de tokens, no pueden ser iguales
    if (userTokens.length !== expectedTokens.length) return false;

    // Comparación directa primero
    if (userTokens.join(' ') === expectedTokens.join(' ')) return true;

    // Buscar operadores conmutativos y probar intercambiando operandos
    for (const op of COMMUTATIVE_OPS) {
        const userOpIdx = userTokens.indexOf(op);
        const expectedOpIdx = expectedTokens.indexOf(op);

        if (userOpIdx !== -1 && expectedOpIdx !== -1 && userOpIdx === expectedOpIdx) {
            // Verificar si los lados izquierdo y derecho están intercambiados
            const userLeft = userTokens.slice(0, userOpIdx).join(' ');
            const userRight = userTokens.slice(userOpIdx + 1).join(' ');
            const expectedLeft = expectedTokens.slice(0, expectedOpIdx).join(' ');
            const expectedRight = expectedTokens.slice(expectedOpIdx + 1).join(' ');

            if (userLeft === expectedRight && userRight === expectedLeft) {
                return true;
            }
        }
    }

    // Para asignaciones con "var": "var x = 10" vs "var 10 = x" → NO es válido
    // Pero "var x = 10 + 5" vs "var x = 5 + 10" → SÍ es válido
    if (userTokens[0] === 'var' && expectedTokens[0] === 'var') {
        // El nombre de variable y "=" deben coincidir
        if (userTokens[1] === expectedTokens[1] && userTokens[2] === '=' && expectedTokens[2] === '=') {
            // Comparar la parte derecha de la asignación con conmutatividad
            const userRhs = userTokens.slice(3).join(' ');
            const expectedRhs = expectedTokens.slice(3).join(' ');

            if (userRhs === expectedRhs) return true;

            // Verificar conmutatividad en la parte derecha
            for (const op of COMMUTATIVE_OPS) {
                const userParts = userRhs.split(` ${op} `);
                const expectedParts = expectedRhs.split(` ${op} `);
                if (userParts.length === 2 && expectedParts.length === 2) {
                    if (userParts[0] === expectedParts[1] && userParts[1] === expectedParts[0]) {
                        return true;
                    }
                }
            }
        }
    }

    return false;
};

/**
 * Detecta si el código del usuario es una asignación inválida
 * (cuando un literal aparece en el lado izquierdo del =).
 * Ejemplo: "10 = puntos" es inválido.
 */
export const detectInvalidAssignment = (userCode: string): string | null => {
    if (!userCode) return null;

    const lines = userCode.trim().split('\n');
    for (const line of lines) {
        const trimmed = line.trim().replace(/;$/, '');
        // Buscar patrón: <número> = <algo> (asignación con literal a la izquierda)
        const invalidAssignMatch = trimmed.match(/^(\d+(?:\.\d+)?)\s*=\s*(.+)$/);
        if (invalidAssignMatch) {
            return `El orden es incorrecto. La variable debe ir primero: "${invalidAssignMatch[2]} = ${invalidAssignMatch[1]}"`;
        }
        // Buscar patrón: var <número> (declaración de variable con número como nombre)
        const invalidVarMatch = trimmed.match(/^var\s+(\d+)/);
        if (invalidVarMatch) {
            return 'El orden es incorrecto. La variable debe ir antes del valor numérico.';
        }
    }
    return null;
};

/**
 * Versión extendida que retorna un mensaje de error descriptivo.
 * Usar cuando necesites mostrar feedback al usuario.
 */
export const validateSolutionWithFeedback = (userCode: string, expectedCode: string): { isCorrect: boolean; errorMessage: string | null } => {
    try {
        // Verificar asignación inválida primero
        const invalidMsg = detectInvalidAssignment(userCode);
        if (invalidMsg) {
            return { isCorrect: false, errorMessage: invalidMsg };
        }

        const cleanedUser = cleanBlocklyCode(userCode);
        const cleanedExpected = cleanBlocklyCode(expectedCode);

        const expectedInfo = extractVariableInfo(cleanedExpected);
        const userInfo = extractVariableInfo(cleanedUser);

        // Si la solución esperada es una asignación
        if (expectedInfo) {
            if (!userInfo) {
                return { isCorrect: false, errorMessage: "Los bloques no están en el orden correcto." };
            }

            // Validar Nombre de Variable (Estricto)
            if (expectedInfo.name !== userInfo.name) {
                return { 
                    isCorrect: false, 
                    errorMessage: `El nombre de la variable debe ser '${expectedInfo.name}'.` 
                };
            }

            // Validar Valor (Soporta conmutatividad y normalización)
            const isValueCorrect = 
                normalizeCode(userInfo.value) === normalizeCode(expectedInfo.value) || 
                areExpressionsEquivalent(userInfo.value, expectedInfo.value);

            if (!isValueCorrect) {
                return { isCorrect: false, errorMessage: "El valor asignado no es correcto." };
            }

            return { isCorrect: true, errorMessage: null };
        }

        // Si no es una asignación, hacer validación general (exacta o flexible)
        const isGeneralCorrect = 
            normalizeCode(cleanedUser) === normalizeCode(cleanedExpected) || 
            areExpressionsEquivalent(cleanedUser, cleanedExpected);

        if (isGeneralCorrect) {
            return { isCorrect: true, errorMessage: null };
        }

        return {
            isCorrect: false,
            errorMessage: 'Los bloques no están en el orden correcto.',
        };
    } catch (error) {
        console.error('Error en validateSolutionWithFeedback:', error);
        return {
            isCorrect: false,
            errorMessage: 'Ocurrió un error al validar. Intenta reorganizar los bloques.',
        };
    }
};

/**
 * Compara el código del usuario contra la solución esperada.
 */
export const validateSolution = (userCode: string, expectedCode: string): boolean => {
    return validateSolutionWithFeedback(userCode, expectedCode).isCorrect;
};