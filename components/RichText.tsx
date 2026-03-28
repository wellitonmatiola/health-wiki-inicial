'use client';

import ReactMarkdown from 'react-markdown';

interface Props {
  content: string;
  italic?: boolean;
  small?: boolean;
}

export default function RichText({ content, italic, small }: Props) {
  const baseText = small
    ? 'text-sm text-[var(--muted)] leading-relaxed'
    : 'text-[var(--muted)] leading-relaxed';

  return (
    <ReactMarkdown
      components={{
        p: ({ children }) => (
          <p className={`${baseText} ${italic ? 'italic' : ''} mb-3 last:mb-0`}>{children}</p>
        ),
        strong: ({ children }) => (
          <strong className="font-semibold text-[var(--text)] not-italic">{children}</strong>
        ),
        em: ({ children }) => (
          <em className="italic">{children}</em>
        ),
        ul: ({ children }) => (
          <ul className={`${baseText} list-disc list-inside space-y-1 mb-3`}>{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className={`${baseText} list-decimal list-inside space-y-1 mb-3`}>{children}</ol>
        ),
        li: ({ children }) => (
          <li className={`${baseText} ${italic ? 'italic' : ''}`}>{children}</li>
        ),
        h2: ({ children }) => (
          <h2 className="font-serif text-base font-semibold text-[var(--text)] mt-5 mb-2">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="font-medium text-sm text-[var(--text)] mt-4 mb-1.5">{children}</h3>
        ),
        a: ({ href, children }) => (
          <a href={href} target="_blank" rel="noopener noreferrer" className="text-forest-600 underline underline-offset-2 hover:text-forest-800">
            {children}
          </a>
        ),
        hr: () => <hr className="border-[var(--border)] my-4" />,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
