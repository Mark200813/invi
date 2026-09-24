import { join } from '@/lib/content';
import JoinFlow from './JoinFlow';
import Waitlist from './Waitlist';
import s from './Join.module.css';

export default function JoinSection() {
  return (
    <section id="join" className={`ground-bone ${s.join}`} aria-labelledby="join-title">
      <div className={`wrap ${s.joinGrid}`}>
        <div className={s.joinIntro}>
          <p className={`label ${s.gift}`}>{join.gift} <span aria-hidden>↘</span></p>
          <p className={`label ${s.eyebrow}`}>{join.eyebrow}</p>
          <h2 id="join-title" className="display t-xl">{join.title}</h2>
          <p className="lede">{join.body}</p>
          <p className="small">{join.community}</p>
        </div>
        <JoinFlow />
      </div>
      <div className="wrap">
        <hr className="rule" />
        <Waitlist />
      </div>
    </section>
  );
}
