import React from 'react';
import type { UmlElement, Relationship } from '@/types';

interface RelationshipLineProps {
  fromElement: UmlElement;
  toElement: UmlElement;
  relationshipType: Relationship['type'];
}

const RelationshipLine: React.FC<RelationshipLineProps> = ({ fromElement, toElement, relationshipType }) => {
  if (!fromElement || !toElement) {
    return null;
  }

  const fromX = fromElement.position.x + 128; // approx center of the card
  const fromY = fromElement.position.y + 88; // approx center of the card
  const toX = toElement.position.x + 128;
  const toY = toElement.position.y + 88;

  const getLineStyle = () => {
    switch (relationshipType) {
      case 'inheritance':
        return { stroke: 'hsl(var(--foreground))', strokeWidth: 2, markerEnd: 'url(#arrow-inheritance)' };
      case 'implementation':
        return { stroke: 'hsl(var(--foreground))', strokeWidth: 2, strokeDasharray: '8, 8', markerEnd: 'url(#arrow-inheritance)' };
      case 'aggregation':
        return { stroke: 'hsl(var(--foreground))', strokeWidth: 2, markerStart: 'url(#diamond-aggregation)' };
      case 'composition':
        return { stroke: 'hsl(var(--foreground))', strokeWidth: 2, markerStart: 'url(#diamond-composition)' };
      case 'association':
        return { stroke: 'hsl(var(--muted-foreground))', strokeWidth: 2, markerEnd: 'url(#arrow-association)' };
      default:
        return { stroke: 'hsl(var(--muted-foreground))', strokeWidth: 2 };
    }
  };

  return (
    <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
      <defs>
        {/* Arrow for inheritance and implementation */}
        <marker id="arrow-inheritance" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="hsl(var(--foreground))" />
        </marker>
        {/* Arrow for association */}
        <marker id="arrow-association" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
          <path d="M 0 5 L 10 5" stroke="hsl(var(--muted-foreground))" strokeWidth="2" fill="none" />
           <path d="M 10 0 L 0 5 L 10 10" stroke="hsl(var(--muted-foreground))" strokeWidth="2" fill="none" />
        </marker>
        {/* Diamond for aggregation */}
        <marker id="diamond-aggregation" viewBox="0 0 20 20" refX="5" refY="10" markerWidth="10" markerHeight="10" orient="auto-start-reverse">
          <path d="M 10 0 L 20 10 L 10 20 L 0 10 z" stroke="hsl(var(--foreground))" strokeWidth="2" fill="hsl(var(--background))" />
        </marker>
        {/* Diamond for composition */}
        <marker id="diamond-composition" viewBox="0 0 20 20" refX="5" refY="10" markerWidth="10" markerHeight="10" orient="auto-start-reverse">
          <path d="M 10 0 L 20 10 L 10 20 L 0 10 z" fill="hsl(var(--foreground))" />
        </marker>
      </defs>
      <line x1={fromX} y1={fromY} x2={toX} y2={toY} style={getLineStyle()} />
    </svg>
  );
};

export default RelationshipLine;
