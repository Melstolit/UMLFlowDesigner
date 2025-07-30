import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Cpu, ArrowRight, Server } from 'lucide-react';

export default function DataFlowDesigner() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Data Flow Design</CardTitle>
        <p className="text-muted-foreground">
          Visualize the flow of data through your system.
        </p>
      </CardHeader>
      <CardContent className="h-full design-canvas p-10 rounded-b-lg">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-4 text-center h-full">
          <FlowCard icon={<Database />} title="Data Source" description="e.g., PostgreSQL DB" />
          <ArrowRight className="h-12 w-12 text-muted-foreground shrink-0 rotate-90 md:rotate-0" />
          <FlowCard icon={<Cpu />} title="Processing Service" description="e.g., Node.js API" />
          <ArrowRight className="h-12 w-12 text-muted-foreground shrink-0 rotate-90 md:rotate-0" />
          <FlowCard icon={<Server />} title="Data Warehouse" description="e.g., BigQuery" />
        </div>
      </CardContent>
    </Card>
  );
}

function FlowCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="flex flex-col items-center p-6 rounded-lg bg-background border shadow-md w-52 h-48 justify-center">
      <div className="text-primary mb-4">{React.cloneElement(icon as React.ReactElement, { className: "h-10 w-10" })}</div>
      <h3 className="font-bold text-lg mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
