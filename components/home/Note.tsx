import { note } from '@/lib/content';
import Wordmark from '@/components/site/Wordmark';
import s from './Note.module.css';

export default function Note() {
  return (
    <section className={`ground-stage ${s.note}`} aria-labelledby="note-title">
      <div className={`wrap ${s.inner}`}>
        <h2 id="note-title" className="label">{note.eyebrow}</h2>
        <p className={s.body}>{note.body}</p>
        <p className={`label ${s.sign}`}>
          {note.signoff[0]} <Wordmark className={s.mark} /> {note.signoff[1]}
        </p>
      </div>
    </section>
  );
}
