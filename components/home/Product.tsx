import Image from 'next/image';
import { product, moments } from '@/lib/content';
import BeachLoop from './BeachLoop';
import s from './Product.module.css';

export default function Product() {
  return (
    <section id="product" className={`ground-stage ${s.product}`} aria-labelledby="product-title">
      <div className={`wrap ${s.intro}`}>
        <p className={`label ${s.eyebrow}`}>{product.eyebrow}</p>
        <h2 id="product-title" className="display t-xl">
          {product.title.map((l) => <span key={l} className={s.block}>{l}</span>)}
        </h2>
        <p className={`lede ${s.introBody}`}>{product.body}</p>
      </div>

      {/* The line-up: all three, the first time they stand together. */}
      <div className={s.lineup} aria-label="The three INVI colourways">
        {moments.items.map((m, i) => (
          <figure key={m.key} className={s.lineupCan} data-speed={[0.25, 0.55, 0.35][i]}>
            <Image src={m.canAngle} alt={`INVI ${m.name.toUpperCase()}`} width={1100} height={1600}
              sizes="(max-width: 899px) 44vw, 30vw" />
            <figcaption className="label">{m.name}</figcaption>
          </figure>
        ))}
      </div>

      <div className={`wrap ${s.spec}`}>
        <div className={s.specHead}>
          <p className={`label ${s.eyebrow}`}>{product.subEyebrow}</p>
          <h3 className="display t-lg">
            {product.subTitle.map((l) => <span key={l} className={s.block}>{l}</span>)}
          </h3>
          {product.subBody.map((p) => <p key={p} className="body">{p}</p>)}
        </div>
        <ol className={s.features}>
          {product.features.map((f) => (
            <li key={f.n} className={s.feature}>
              <p className="index-n"><span className="num">{f.n}</span> · {f.k}</p>
              <h4 className={`display ${s.featureTitle}`}>{f.t}</h4>
              <p className="body">{f.d}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className={`wrap ${s.air}`}>
        <div className={s.airCopy}>
          <p className={`label ${s.eyebrow}`}>{product.air.eyebrow}</p>
          <h3 className="display t-lg">
            {product.air.title.map((l) => <span key={l} className={s.block}>{l}</span>)}
          </h3>
          {product.air.body.map((p) => <p key={p} className="body">{p}</p>)}
        </div>
        {/* Close-up of the cap and shoulder, rendered from the can model.
            Phase 3 replaces it with the camera moving in on the live can. */}
        <figure className={s.airDetail} data-parallax="10">
          <Image src="/cans/closeup-after-dark.webp" alt="Close-up of the INVI can’s cap and shoulder" width={1500} height={1200}
            sizes="(max-width: 899px) 100vw, 50vw" />
        </figure>
      </div>

      <BeachLoop lines={product.moment} label={product.momentVideoLabel} />
    </section>
  );
}
