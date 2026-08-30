import Image from "next/image";
import Link from "next/link";
import { demoRestaurant } from "@/data/mock";

export default function DemoAboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <section className="grid items-center gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:gap-14">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--r-primary)]">Our story · Since 2019</p>
          <h1 className="display-font mt-3 text-4xl font-semibold leading-[1.04] tracking-tight sm:text-5xl lg:text-6xl">Armenian roots,<br />an open horizon.</h1>
          <p className="mt-6 text-base leading-8 text-[var(--r-muted)]">{demoRestaurant.about}</p>
          <p className="mt-5 text-sm leading-7 text-[var(--r-muted)]">Every plate begins close to home: herbs from Garni, trout from mountain water, apricots at their brief summer best. From there, our kitchen follows curiosity.</p>
          <Link href="/r/demo-restaurant/menu" className="mt-7 inline-flex rounded-full bg-[var(--r-primary)] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5">Explore today’s menu</Link>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-[var(--r-bg)] sm:aspect-[5/4] lg:aspect-[4/5]">
          <Image src="/images/avena-interior.png" alt="The open kitchen and dining room at Avena" fill sizes="(max-width: 1024px) 100vw, 55vw" className="object-cover" />
          <div className="absolute inset-x-5 bottom-5 rounded-2xl bg-black/45 p-5 text-white backdrop-blur-md sm:inset-x-auto sm:right-5 sm:max-w-xs">
            <p className="display-font text-xl leading-snug">“Food should carry a memory — then make a new one.”</p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-white/65">Mariam · Chef & founder</p>
          </div>
        </div>
      </section>

      <section className="mt-14 border-t border-[var(--r-line)] pt-10 sm:mt-20 sm:pt-14">
        <div className="grid gap-5 sm:grid-cols-3">
          {[
            ["01", "Led by the seasons", "Our menu changes with the farms and markets, not a fixed calendar."],
            ["02", "Made over fire", "Charcoal, smoke, and patience bring depth without hiding the ingredient."],
            ["03", "Served generously", "Armenian hospitality means another plate, another story, and never a rushed table."],
          ].map(([number, title, body]) => (
            <article key={number} className="rounded-[24px] border border-[var(--r-line)] bg-[var(--r-surface)] p-6">
              <span className="text-xs font-bold tracking-[0.16em] text-[var(--r-primary)]">{number}</span>
              <h2 className="display-font mt-8 text-2xl font-semibold">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--r-muted)]">{body}</p>
            </article>
          ))}
        </div>
      </section>

      <div className="mt-12 grid gap-5 rounded-[28px] bg-[var(--r-text)] p-7 text-white sm:grid-cols-[1fr_auto] sm:items-center sm:p-10">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/55">Come as you are</p>
          <h2 className="display-font mt-2 text-3xl font-semibold">There is always room for one more.</h2>
        </div>
        <Link href="/r/demo-restaurant/contact" className="w-fit rounded-full bg-white px-5 py-3 text-sm font-semibold text-[var(--r-text)]">Plan your visit</Link>
      </div>
    </div>
  );
}
