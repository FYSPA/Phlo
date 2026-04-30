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
 * Normaliza nombres de variables para que 'puntos' o 'i' sean equivalentes.
 * Busca declaraciones de variables y asignaciones.
 */
export const anonymizeVariables = (code: string): string => {
    if (!code) return "";

    const variables = new Map<string, string>(); // name -> __VAR_X__
    let varIndex = 1;

    const keywords = [
        'var', 'let', 'const', 'if', 'else', 'for', 'while', 'function', 'return',
        'true', 'false', 'null', 'undefined', 'console', 'log', 'Math', 'window', 'document'
    ];

    const contextRegex = /(?:var|let|const)\s+([a-zA-Z_$][0-9a-zA-Z_$]*)|([a-zA-Z_$][0-9a-zA-Z_$]*)\s*[-+*/]?=/g;
    
    let match;
    while ((match = contextRegex.exec(code)) !== null) {
        const varName = match[1] || match[2];
        if (varName && !keywords.includes(varName) && !variables.has(varName)) {
            variables.set(varName, `__VAR_${varIndex}__`);
            varIndex++;
        }
    }

    let result = code;
    for (const [name, token] of variables.entries()) {
        const regex = new RegExp(`\\b${name}\\b`, 'g');
        result = result.replace(regex, token);
    }

    return result;
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
 * Compara el código del usuario contra la solución esperada.
 * 
 * Retorna un objeto con:
 * - isCorrect: si la respuesta es válida
 * - errorMessage: mensaje amigable si hay un error (null si es correcto)
 */
export const validateSolution = (userCode: string, expectedCode: string): boolean => {
    try {
        // 1. Verificar si hay una asignación inválida (esto no crashea, solo detecta)
        const invalidMsg = detectInvalidAssignment(userCode);
        if (invalidMsg) {
            // Es un error de orden, pero no un crash. Retornamos false.
            return false;
        }

        // Anonymize variables
        const anonUserCode = anonymizeVariables(userCode);
        const anonExpectedCode = anonymizeVariables(expectedCode);

        // 2. Comparación normalizada exacta (funciona para la mayoría de casos)
        if (normalizeCode(anonUserCode) === normalizeCode(anonExpectedCode)) {
            return true;
        }

        // 3. Comparación flexible con conmutatividad
        if (areExpressionsEquivalent(anonUserCode, anonExpectedCode)) {
            return true;
        }

        // 4. Comparación línea por línea para código multilínea
        const userLines = anonUserCode.trim().split('\n').map(l => normalizeCode(l)).filter(l => l.length > 0);
        const expectedLines = anonExpectedCode.trim().split('\n').map(l => normalizeCode(l)).filter(l => l.length > 0);

        if (userLines.length === expectedLines.length) {
            const allMatch = userLines.every((line, i) => {
                if (line === expectedLines[i]) return true;
                // Intentar comparación flexible por línea
                const userRawLine = anonUserCode.trim().split('\n')[i] || '';
                const expectedRawLine = anonExpectedCode.trim().split('\n')[i] || '';
                return areExpressionsEquivalent(userRawLine, expectedRawLine);
            });
            if (allMatch) return true;
        }

        return false;
    } catch (error) {
        // Nunca crashear, simplemente retornar false
        console.error('Error en validateSolution:', error);
        return false;
    }
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

        const isCorrect = validateSolution(userCode, expectedCode);
        return {
            isCorrect,
            errorMessage: isCorrect ? null : 'Los bloques no están en el orden correcto.',
        };
    } catch (error) {
        console.error('Error en validateSolutionWithFeedback:', error);
        return {
            isCorrect: false,
            errorMessage: 'Ocurrió un error al validar. Intenta reorganizar los bloques.',
        };
    }
};