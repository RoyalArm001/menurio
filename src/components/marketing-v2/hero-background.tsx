export function HeroBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      <div className="hero-bg-aurora absolute -inset-[40%] opacity-70" />
      <div className="hero-bg-wash absolute inset-0" />
      <div className="hero-bg-orb hero-bg-orb-a absolute -left-20 -top-16 size-[36rem] rounded-full bg-brand/25 blur-[100px]" />
      <div className="hero-bg-orb hero-bg-orb-b absolute -right-16 top-[10%] size-[30rem] rounded-full bg-[#e6b65f]/30 blur-[90px]" />
      <div className="hero-bg-orb hero-bg-orb-c absolute -bottom-24 left-[20%] size-[28rem] rounded-full bg-olive/20 blur-[80px]" />
      <div className="hero-bg-grid dot-grid absolute inset-0 opacity-50 [mask-image:linear-gradient(to_bottom,black_20%,black_55%,transparent_92%)]" />
      <div className="hero-bg-shimmer absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-brand/60 to-transparent" />
    </div>
  );
}
