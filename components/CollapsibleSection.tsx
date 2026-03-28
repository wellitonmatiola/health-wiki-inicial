'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import RichText from './RichText';

interface Props {
  title: React.ReactNode;
  content: string;
  italic?: boolean;
  summaryLength?: number;
}

function plainText(content: string, length: number): string {
  const stripped = content
    .replace(/#{1,6}\s+/g, '')
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/\n+/g, ' ')
    .trim();
  if (stripped.length <= length) return stripped;
  return stripped.slice(0, length) + '…';
}

export default function CollapsibleSection({ title, content, italic, summaryLength = 220 }: Props) {
  const [expanded, setExpanded] = useState(false);
  const summary = plainText(content, summaryLength);

  return (
    <>
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">{title}</div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="shrink-0 flex items-center gap-1 text-xs text-[var(--muted)] hover:text-[var(--accent)] transition-colors mt-1"
          aria-expanded={expanded}
        >
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {expanded ? 'Recolher' : 'Expandir informação'}
        </button>
      </div>

      {expanded ? (
        <RichText content={content} italic={italic} />
      ) : (
        <p className={`text-sm leading-relaxed text-[var(--muted)] ${italic ? 'italic' : ''}`}>
          {summary}
        </p>
      )}
    </>
  );
}
