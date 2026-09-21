export function HeroVideo() {
  return (
    <div className="relative mx-auto aspect-[9/16] w-full max-w-xs overflow-hidden rounded-2xl shadow-xl sm:max-w-sm lg:h-[min(calc(100svh-9rem),640px)] lg:w-auto lg:max-w-none">
      <video
        className="h-full w-full object-cover"
        poster="/images/hero-procedimento-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label="Vídeo de procedimento realizado pela equipe médica da Neuropleno"
      >
        <source src="/videos/hero-procedimento.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
