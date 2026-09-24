import { Fragment } from 'react';

/** Renders copy with *stressed words* as <em>, which the type system sets in
 *  the serif italic. Nothing else is parsed. */
export function Rich({ text }: { text: string }) {
  const parts = text.split(/(\*[^*]+\*)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith('*') && p.endsWith('*')
          ? <em key={i}>{p.slice(1, -1)}</em>
          : <Fragment key={i}>{p}</Fragment>,
      )}
    </>
  );
}
