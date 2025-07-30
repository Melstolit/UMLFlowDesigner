// This is an AI-powered code optimizer that allows users to refine code generation with custom prompts.
// It takes UML diagram code and optimization prompts as input, and outputs optimized code.
// - optimizeCode - A function that refines generated code based on user prompts.
// - OptimizeCodeInput - The input type for the optimizeCode function.
// - OptimizeCodeOutput - The return type for the optimizeCode function.
'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeCodeInputSchema = z.object({
  umlCode: z.string().describe('The generated code from the UML diagram.'),
  optimizationPrompt: z
    .string()
    .describe(
      'Additional instructions or configurations to optimize the generated code.'
    ),
});
export type OptimizeCodeInput = z.infer<typeof OptimizeCodeInputSchema>;

const OptimizeCodeOutputSchema = z.object({
  optimizedCode: z.string().describe('The optimized code based on user prompts.'),
});
export type OptimizeCodeOutput = z.infer<typeof OptimizeCodeOutputSchema>;

export async function optimizeCode(input: OptimizeCodeInput): Promise<OptimizeCodeOutput> {
  return optimizeCodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizeCodePrompt',
  input: {schema: OptimizeCodeInputSchema},
  output: {schema: OptimizeCodeOutputSchema},
  prompt: `You are an expert code optimizer. A user has generated code from a UML diagram, and wants to optimize it using additional prompts.

Original Code:
{{{umlCode}}}

Optimization Prompt:
{{{optimizationPrompt}}}

Based on the optimization prompt, please refine the original code to meet the specific requirements. Return only the optimized code.`,
});

const optimizeCodeFlow = ai.defineFlow(
  {
    name: 'optimizeCodeFlow',
    inputSchema: OptimizeCodeInputSchema,
    outputSchema: OptimizeCodeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
