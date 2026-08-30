"use client";

import { type FormEvent, useState } from "react";
import { CheckCircle2, Clock, ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import { demoRestaurant } from "@/data/mock";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function DemoContactPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.currentTarget.reset();
    setSubmitted(true);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="display-font text-3xl font-semibold tracking-tight sm:text-4xl">
        Contact
      </h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="space-y-5 rounded-[24px] border border-[var(--r-line)] bg-[var(--r-surface)] p-6">
          <a href="https://maps.google.com/?q=12+Abovyan+Street+Yerevan" target="_blank" rel="noreferrer" className="flex gap-3 text-sm text-[var(--r-muted)] transition hover:text-[var(--r-primary)]">
            <MapPin className="mt-0.5 size-4 shrink-0 text-[var(--r-primary)]" />
            {demoRestaurant.address}
          </a>
          <a href={`tel:${demoRestaurant.phone.replace(/\s/g, "")}`} className="flex gap-3 text-sm text-[var(--r-muted)] transition hover:text-[var(--r-primary)]">
            <Phone className="mt-0.5 size-4 shrink-0 text-[var(--r-primary)]" />
            {demoRestaurant.phone}
          </a>
          <a href={`mailto:${demoRestaurant.email}`} className="flex gap-3 text-sm text-[var(--r-muted)] transition hover:text-[var(--r-primary)]">
            <Mail className="mt-0.5 size-4 shrink-0 text-[var(--r-primary)]" />
            {demoRestaurant.email}
          </a>
          <div>
            <p className="mb-2 flex items-center gap-2 font-semibold">
              <Clock className="size-4 text-[var(--r-primary)]" /> Hours
            </p>
            <ul className="space-y-1 text-sm text-[var(--r-muted)]">
              {demoRestaurant.hours.map((h) => (
                <li key={h.days}>
                  {h.days}: {h.time}
                </li>
              ))}
            </ul>
          </div>
          <a
            href="https://maps.google.com/?q=12+Abovyan+Street+Yerevan"
            target="_blank"
            rel="noreferrer"
            className="group flex h-48 flex-col items-center justify-center rounded-2xl border border-[var(--r-line)] bg-[var(--r-bg)] px-6 text-center transition hover:border-[var(--r-primary)]/40 hover:bg-[var(--r-primary)]/5"
          >
            <span className="grid size-12 place-items-center rounded-full bg-[var(--r-primary)] text-white shadow-sm transition group-hover:-translate-y-0.5"><MapPin className="size-5" /></span>
            <strong className="mt-3 flex items-center gap-1.5 text-sm text-[var(--r-text)]">Get directions <ExternalLink className="size-3.5" /></strong>
            <span className="mt-1 text-xs text-[var(--r-muted)]">4 min walk from Republic Square</span>
          </a>
        </div>
        <form onSubmit={handleSubmit} className="rounded-[24px] border border-[var(--r-line)] bg-[var(--r-surface)] p-6">
          <h2 className="text-xl font-semibold">Send a message</h2>
          <div className="mt-5 space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" placeholder="Your name" autoComplete="name" required />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="you@email.com" autoComplete="email" required />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" name="message" placeholder="How can we help?" required />
            </div>
            <Button type="submit" className="w-full">
              Send message
            </Button>
            <p className="text-center text-xs text-[var(--r-muted)]">Demo form · no message leaves this prototype</p>
            {submitted ? (
              <div role="status" className="flex items-start gap-3 rounded-2xl bg-success/10 p-4 text-sm text-success">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0" />
                <span><strong className="block">Message received</strong>Thanks — Avena will be in touch shortly.</span>
              </div>
            ) : null}
          </div>
        </form>
      </div>
    </div>
  );
}
