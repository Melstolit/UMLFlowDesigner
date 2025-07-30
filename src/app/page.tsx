'use client';

import { useState } from 'react';
import Header from '@/components/header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UmlDesigner from '@/components/uml-designer';
import DataFlowDesigner from '@/components/data-flow-designer';
import CodeGenerator from '@/components/code-generator';
import type { UmlElement, Relationship } from '@/types';
import { LayoutGrid, Bot, Waypoints } from 'lucide-react';

export default function Home() {
  const [umlElements, setUmlElements] = useState<UmlElement[]>([]);
  const [relationships, setRelationships] = useState<Relationship[]>([]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow p-4 md:p-6">
        <Tabs defaultValue="uml-design" className="flex flex-col h-full">
          <TabsList className="mx-auto grid w-full max-w-lg grid-cols-3">
            <TabsTrigger value="uml-design">
              <LayoutGrid className="mr-2 h-4 w-4" />
              UML Design
            </TabsTrigger>
            <TabsTrigger value="data-flow">
              <Waypoints className="mr-2 h-4 w-4" />
              Data Flow
            </TabsTrigger>
            <TabsTrigger value="code-generation">
              <Bot className="mr-2 h-4 w-4" />
              Code Generation
            </TabsTrigger>
          </TabsList>
          <TabsContent value="uml-design" className="flex-grow mt-6">
            <UmlDesigner
              elements={umlElements}
              setElements={setUmlElements}
              relationships={relationships}
              setRelationships={setRelationships}
            />
          </TabsContent>
          <TabsContent value="data-flow" className="flex-grow mt-6">
            <DataFlowDesigner />
          </TabsContent>
          <TabsContent value="code-generation" className="flex-grow mt-6">
            <CodeGenerator elements={umlElements} relationships={relationships} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
