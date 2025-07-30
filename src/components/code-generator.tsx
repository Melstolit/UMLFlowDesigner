'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Clipboard, Bot, Sparkles, Loader2 } from 'lucide-react';
import type { UmlElement, Relationship } from '@/types';
import { generateCodeAction, optimizeCodeAction } from '@/app/actions';

interface CodeGeneratorProps {
  elements: UmlElement[];
  relationships: Relationship[];
}

function serializeDiagram(elements: UmlElement[], relationships: Relationship[]): string {
  let umlString = 'Here is a UML diagram description:\n\n';

  elements.forEach((el) => {
    umlString += `Element Type: ${el.type}\n`;
    umlString += `Name: ${el.name}\n`;
    if (el.content) {
      umlString += `Content:\n${el.content}\n`;
    }
    umlString += '---\n';
  });

  if (relationships.length > 0) {
    umlString += 'Relationships:\n';
    relationships.forEach((rel) => {
      const fromEl = elements.find((e) => e.id === rel.from);
      const toEl = elements.find((e) => e.id === rel.to);
      if (fromEl && toEl) {
        umlString += `- ${fromEl.name} --(${rel.type})--> ${toEl.name}\n`;
      }
    });
    umlString += '---\n';
  }

  return umlString;
}

export default function CodeGenerator({ elements, relationships }: CodeGeneratorProps) {
  const [language, setLanguage] = useState('typescript');
  const [additionalPrompt, setAdditionalPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateCode = async () => {
    if (elements.length === 0) {
      toast({
        title: 'Empty Diagram',
        description: 'Please add elements to your UML diagram first.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setGeneratedCode('// Generating code...');
    const umlDiagram = serializeDiagram(elements, relationships);
    const result = await generateCodeAction(umlDiagram, language);
    setGeneratedCode(result.code);
    setIsLoading(false);
  };

  const handleOptimizeCode = async () => {
    if (!generatedCode) {
      toast({
        title: 'No Code to Optimize',
        description: 'Please generate some code first.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setGeneratedCode('// Optimizing code...');
    const result = await optimizeCodeAction(generatedCode, additionalPrompt);
    setGeneratedCode(result.optimizedCode);
    setAdditionalPrompt('');
    setIsLoading(false);
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
    toast({
      title: 'Copied to clipboard!',
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card className="h-full">
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>Generated Code</CardTitle>
            {generatedCode && (
              <Button variant="ghost" size="icon" onClick={handleCopy}>
                <Clipboard className="h-4 w-4" />
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm h-[60vh]">
              <code className="font-code">{generatedCode}</code>
              {isLoading && (
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}
            </pre>
          </CardContent>
        </Card>
      </div>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Language</label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="typescript">TypeScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                  <SelectItem value="csharp">C#</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleGenerateCode} className="w-full" disabled={isLoading}>
              <Bot className="mr-2 h-4 w-4" />
              {isLoading ? 'Generating...' : 'Generate Code'}
            </Button>
            <div className="space-y-2">
              <label className="text-sm font-medium">Optimization Prompt</label>
              <Textarea
                placeholder="e.g., 'Add constructors' or 'Implement the builder pattern for all classes'"
                value={additionalPrompt}
                onChange={(e) => setAdditionalPrompt(e.target.value)}
                rows={4}
              />
               <Button onClick={handleOptimizeCode} variant="secondary" className="w-full" disabled={isLoading || !generatedCode}>
                  <Sparkles className="mr-2 h-4 w-4" />
                  {isLoading ? 'Optimizing...' : 'Optimize'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
