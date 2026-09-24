/**
 * The supplied INVI wordmark, never redrawn. The raster is used as a mask so
 * the mark takes its colour from `currentColor` on any ground. Swap the file
 * for the vector (01_LOGOS) when it arrives; nothing else changes.
 */
export default function Wordmark({ className = '', label = true }: { className?: string; label?: boolean }) {
  return (
    <span
      className={`wordmark ${className}`}
      {...(label ? { role: 'img', 'aria-label': 'INVI' } : { 'aria-hidden': true })}
    />
  );
}
