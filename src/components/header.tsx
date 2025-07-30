import { Logo } from './logo';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex items-center">
          <Logo />
          <span className="font-bold text-lg">UMLVisualizer</span>
        </div>
      </div>
    </header>
  );
}
