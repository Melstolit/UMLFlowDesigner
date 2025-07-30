'use server';

import { generateCode } from '@/ai/flows/generate-code-from-diagram';
import { optimizeCode } from '@/ai/flows/optimize-code-generation';

export async function generateCodeAction(umlDiagram: string, language: string) {
  try {
    const result = await generateCode({
      umlDiagram,
      language,
    });
    return result;
  } catch (error) {
    console.error(error);
    return { code: `// An error occurred: ${error instanceof Error ? error.message : 'Unknown error'}` };
  }
}

export async function optimizeCodeAction(umlCode: string, optimizationPrompt: string) {
    try {
        const result = await optimizeCode({
            umlCode,
            optimizationPrompt
        });
        return result;
    } catch (error) {
        console.error(error);
        return { optimizedCode: `// An error occurred during optimization: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
}
