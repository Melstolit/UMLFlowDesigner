'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating code from a UML diagram.
 *
 * generateCode - A function that takes a UML diagram as input and generates code.
 * GenerateCodeInput - The input type for the generateCode function.
 * GenerateCodeOutput - The return type for the generateCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCodeInputSchema = z.object({
  umlDiagram: z
    .string()
    .describe('A textual representation of a UML diagram.'),
  language: z.string().describe('The target programming language for code generation.'),
  additionalPrompt: z.string().optional().describe('Additional instructions or context for code generation.'),
});
export type GenerateCodeInput = z.infer<typeof GenerateCodeInputSchema>;

const GenerateCodeOutputSchema = z.object({
  code: z.string().describe('The generated code snippet.'),
});
export type GenerateCodeOutput = z.infer<typeof GenerateCodeOutputSchema>;

export async function generateCode(input: GenerateCodeInput): Promise<GenerateCodeOutput> {
  return generateCodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCodePrompt',
  input: {schema: GenerateCodeInputSchema},
  output: {schema: GenerateCodeOutputSchema},
  prompt: `You are a code generation expert.  Given the following UML diagram and the desired programming language, generate the corresponding code.

UML Diagram:
{{umlDiagram}}

Language:
{{language}}

{% if additionalPrompt %}Additional Instructions:
{{additionalPrompt}}{% endif %}

Code:`, // Handlebars
});

const generateCodeFlow = ai.defineFlow(
  {
    name: 'generateCodeFlow',
    inputSchema: GenerateCodeInputSchema,
    outputSchema: GenerateCodeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
