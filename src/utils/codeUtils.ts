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
 * Compara el código del usuario contra la solución esperada.
 */
export const validateSolution = (userCode: string, expectedCode: string): boolean => {
    return normalizeCode(userCode) === normalizeCode(expectedCode);
};