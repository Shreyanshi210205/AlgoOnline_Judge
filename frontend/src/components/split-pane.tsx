import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '../utils/cn';

interface SplitPaneProps {
  left: ReactNode;
  right: ReactNode;
  defaultLeftWidth?: number;
}

export function SplitPane({ left, right, defaultLeftWidth = 48 }: SplitPaneProps) {
  const [leftWidth, setLeftWidth] = useState(defaultLeftWidth);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef(false);

  useEffect(() => {
    const handleMove = (event: PointerEvent) => {
      if (!isDraggingRef.current || !containerRef.current) {
        return;
      }

      const rect = containerRef.current.getBoundingClientRect();
      const nextWidth = ((event.clientX - rect.left) / rect.width) * 100;
      setLeftWidth(Math.min(62, Math.max(32, nextWidth)));
    };

    const handleUp = () => {
      isDraggingRef.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };
  }, []);

  return (
    <div ref={containerRef} className="grid min-h-[70vh] gap-4 xl:grid-cols-[minmax(0,var(--left-width))_12px_minmax(0,1fr)]" style={{ ['--left-width' as string]: `${leftWidth}%` }}>
      <div className="min-w-0">{left}</div>
      <button
        type="button"
        aria-label="Resize panels"
        className="hidden cursor-col-resize rounded-full bg-white/10 transition hover:bg-cyan-400/60 xl:block"
        onPointerDown={() => {
          isDraggingRef.current = true;
          document.body.style.cursor = 'col-resize';
          document.body.style.userSelect = 'none';
        }}
      />
      <div className={cn('min-w-0 xl:pl-2')}>{right}</div>
    </div>
  );
}
