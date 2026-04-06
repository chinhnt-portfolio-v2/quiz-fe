import type { ReactNode } from 'react';

interface Props {
  title: string;
  children: ReactNode;
  rightContent?: ReactNode;
}

export function QuizPageLayout({ title, children, rightContent }: Props) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <h1 className="text-lg font-bold text-foreground">{title}</h1>
          {rightContent && <div className="flex items-center gap-2">{rightContent}</div>}
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 px-4 py-6">
        <div className="mx-auto max-w-3xl">{children}</div>
      </main>
    </div>
  );
}
