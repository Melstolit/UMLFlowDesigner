'use client';

import type { Dispatch, SetStateAction } from 'react';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { FileText, Puzzle, Package, Trash2, Link2 } from 'lucide-react';
import type { UmlElement, Relationship } from '@/types';
import RelationshipLine from './RelationshipLine';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from './ui/label';


interface UmlDesignerProps {
  elements: UmlElement[];
  setElements: Dispatch<SetStateAction<UmlElement[]>>;
  relationships: Relationship[];
  setRelationships: Dispatch<SetStateAction<Relationship[]>>;
}

export default function UmlDesigner({
  elements,
  setElements,
  relationships,
  setRelationships,
}: UmlDesignerProps) {
    const [draggingElement, setDraggingElement] = React.useState<{ id: string; offsetX: number; offsetY: number } | null>(null);

    const addElement = (type: UmlElement['type']) => {
        const newElement: UmlElement = {
        id: `${type}-${Date.now()}`,
        type,
        name: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
        content: '',
        position: { x: 50, y: 50 },
        };
        setElements([...elements, newElement]);
    };

    const updateElement = (id: string, newName: string, newContent: string) => {
        setElements(
        elements.map((el) =>
            el.id === id ? { ...el, name: newName, content: newContent } : el
        )
        );
    };

    const deleteElement = (id: string) => {
        setElements(elements.filter((el) => el.id !== id));
        setRelationships(relationships.filter(rel => rel.from !== id && rel.to !== id));
    };

    const addRelationship = (from: string, to: string, type: Relationship['type']) => {
        if (!from || !to || !type) return;
        const newRelationship: Relationship = {
        id: `rel-${Date.now()}`,
        from,
        to,
        type,
        };
        setRelationships([...relationships, newRelationship]);
    };

    const deleteRelationship = (id: string) => {
        setRelationships(relationships.filter((rel) => rel.id !== id));
    };
  
    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>, id: string) => {
        const element = elements.find(el => el.id === id);
        const card = e.currentTarget;
        if (element && card) {
            const rect = card.getBoundingClientRect();
            const offsetX = e.clientX - rect.left;
            const offsetY = e.clientY - rect.top;
            setDraggingElement({ id, offsetX, offsetY });
        }
        e.stopPropagation();
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (draggingElement) {
            const canvasRect = e.currentTarget.getBoundingClientRect();
            const newX = e.clientX - canvasRect.left - draggingElement.offsetX;
            const newY = e.clientY - canvasRect.top - draggingElement.offsetY;

            setElements(prevElements =>
                prevElements.map(el =>
                    el.id === draggingElement.id
                    ? { ...el, position: { x: newX, y: newY } }
                    : el
                )
            );
        }
    };

    const handleMouseUp = () => {
        setDraggingElement(null);
    };

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>, id: string) => {
        const element = elements.find(el => el.id === id);
        const card = e.currentTarget;
        if (element && card) {
            const touch = e.touches[0];
            const rect = card.getBoundingClientRect();
            const offsetX = touch.clientX - rect.left;
            const offsetY = touch.clientY - rect.top;
            setDraggingElement({ id, offsetX, offsetY });
        }
        e.stopPropagation();
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (draggingElement) {
            const touch = e.touches[0];
            const canvasRect = e.currentTarget.getBoundingClientRect();
            const newX = touch.clientX - canvasRect.left - draggingElement.offsetX;
            const newY = touch.clientY - canvasRect.top - draggingElement.offsetY;

            setElements(prevElements =>
                prevElements.map(el =>
                    el.id === draggingElement.id
                    ? { ...el, position: { x: newX, y: newY } }
                    : el
                )
            );
        }
    };

    const handleTouchEnd = () => {
        setDraggingElement(null);
    };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
      <Card className="lg:col-span-3 h-[75vh] flex flex-col">
        <CardHeader>
          <CardTitle>UML Diagram</CardTitle>
        </CardHeader>
        <CardContent 
          className="flex-grow relative design-canvas rounded-b-lg"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {relationships.map((rel) => {
            const fromElement = elements.find((el) => el.id === rel.from);
            const toElement = elements.find((el) => el.id === rel.to);
            if (!fromElement || !toElement) return null;
            return (
              <RelationshipLine
                key={rel.id}
                fromElement={fromElement}
                toElement={toElement}
                relationshipType={rel.type}
              />
            );
          })}
          {elements.map((el) => (
            <Card
              key={el.id}
              className={`absolute w-64 cursor-grab ${el.type === 'namespace' ? 'border-dotted border-2 shadow-none bg-transparent' : 'shadow-lg'}`}
              style={{ left: `${el.position.x}px`, top: `${el.position.y}px` }}
              onMouseDown={(e) => handleMouseDown(e, el.id)}
              onTouchStart={(e) => handleTouchStart(e, el.id)}
            >
              <CardHeader className={`flex flex-row items-center justify-between ${el.type === 'namespace' ? 'p-2' : 'p-4 bg-muted/50 rounded-t-lg'}`}>
                <Input
                  value={el.name}
                  onChange={(e) => updateElement(el.id, e.target.value, el.content)}
                  className={`text-md font-bold border-none focus-visible:ring-1 ${el.type === 'namespace' ? 'w-auto p-0' : ''}`}
                  onMouseDown={(e) => e.stopPropagation()} 
                />
                <Button variant="ghost" size="icon" onClick={() => deleteElement(el.id)} onMouseDown={(e) => e.stopPropagation()}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              {el.type !== 'namespace' && (
                <CardContent className="p-4" onMouseDown={(e) => e.stopPropagation()}>
                  <Textarea
                    placeholder={el.type === 'interface' 
                      ? `+ method(): returnType\n+ anotherMethod(): void`
                      : `- property: type\n+ method(): returnType`}
                    value={el.content}
                    onChange={(e) => updateElement(el.id, el.name, e.target.value)}
                    className="font-code text-xs h-32 resize-none"
                  />
              </CardContent>
            )}
            </Card>
          ))}
        </CardContent>
      </Card>
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tools</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button onClick={() => addElement('class')}>
              <FileText className="mr-2 h-4 w-4" /> Add Class
            </Button>
            <Button onClick={() => addElement('interface')}>
              <Puzzle className="mr-2 h-4 w-4" /> Add Interface
            </Button>
            <Button onClick={() => addElement('namespace')}>
              <Package className="mr-2 h-4 w-4" /> Add Namespace
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Relationships</CardTitle>
          </CardHeader>
          <CardContent>
            <RelationshipDialog elements={elements} onAddRelationship={addRelationship} />
            <div className="mt-4 space-y-2">
              {relationships.map(rel => (
                <div key={rel.id} className="flex items-center justify-between text-sm p-2 bg-muted rounded-md">
                   <span>
                    <b>{elements.find(e => e.id === rel.from)?.name}</b> &rarr; <b>{elements.find(e => e.id === rel.to)?.name}</b>
                  </span>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => deleteRelationship(rel.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function RelationshipDialog({ elements, onAddRelationship }: { elements: UmlElement[], onAddRelationship: (from: string, to: string, type: Relationship['type']) => void }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [from, setFrom] = React.useState('');
  const [to, setTo] = React.useState('');
  const [type, setType] = React.useState<Relationship['type']>('association');

  const handleAdd = () => {
    onAddRelationship(from, to, type);
    setIsOpen(false);
    setFrom('');
    setTo('');
  }

  return (
     <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Link2 className="mr-2 h-4 w-4" />
          Add Relationship
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new relationship</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="from" className="text-right">From</Label>
            <Select onValueChange={setFrom} value={from}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select element" />
              </SelectTrigger>
              <SelectContent>
                {elements.map(el => <SelectItem key={el.id} value={el.id}>{el.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="to" className="text-right">To</Label>
            <Select onValueChange={setTo} value={to}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select element" />
              </SelectTrigger>
              <SelectContent>
                {elements.map(el => <SelectItem key={el.id} value={el.id}>{el.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">Type</Label>
            <Select onValueChange={(v) => setType(v as Relationship['type'])} value={type}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="association">Association</SelectItem>
                <SelectItem value="inheritance">Inheritance</SelectItem>
                <SelectItem value="implementation">Implementation</SelectItem>
                <SelectItem value="aggregation">Aggregation</SelectItem>
                <SelectItem value="composition">Composition</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleAdd}>Add Relationship</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
