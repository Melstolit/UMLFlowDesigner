export type UmlElement = {
  id: string;
  type: 'class' | 'interface' | 'namespace';
  name: string;
  content: string;
  position: { x: number; y: number };
};

export type Relationship = {
  id: string;
  from: string;
  to: string;
  type: 'inheritance' | 'implementation' | 'aggregation' | 'composition' | 'association';
};
