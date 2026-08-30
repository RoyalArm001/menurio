import Image from "next/image";
import Link from "next/link";
import { demoRestaurant } from "@/data/mock";

export default function DemoGalleryPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="grid gap-5 border-b border-[var(--r-line)] pb-8 sm:grid-cols-[1fr_0.8fr] sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--r-primary)]">Inside Avena</p>
          <h1 className="display-font mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">A room made<br />for long evenings.</h1>
        </div>
        <p className="max-w-md text-sm leading-7 text-[var(--r-muted)] sm:justify-self-end">
          Warm stone, an open kitchen, and tables close enough to share a recommendation. Take a look around before you arrive.
        </p>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-12">
        {demoRestaurant.gallery.map((item, index) => (
          <div
            key={item.id}
            className={`${index === 0 ? "lg:col-span-7" : index === 1 ? "lg:col-span-5" : index === 2 ? "lg:col-span-5" : "lg:col-span-7"} group relative overflow-hidden rounded-[24px] border border-[var(--r-line)] bg-[var(--r-surface)]`}
          >
            <div className="relative aspect-[4/3] bg-[var(--r-bg)] lg:aspect-auto lg:h-[390px]">
              <Image src={item.image} alt={item.title} fill sizes="(max-width: 640px) 100vw, 50vw" className="object-cover transition duration-700 group-hover:scale-[1.025]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <p className="absolute inset-x-0 bottom-0 p-5 font-semibold text-white sm:p-6">{item.title}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-10 flex flex-col items-start justify-between gap-5 rounded-[24px] bg-[var(--r-primary)] p-6 text-white sm:flex-row sm:items-center sm:p-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/65">See it in person</p>
          <h2 className="display-font mt-2 text-2xl font-semibold sm:text-3xl">Your table is ready.</h2>
        </div>
        <Link href="/r/demo-restaurant/contact" className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-[var(--r-primary)] transition hover:-translate-y-0.5">Reserve a table</Link>
      </div>
    </div>
  );
}
