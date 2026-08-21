/* Villa Arouca — camada de movimento.
   Sem dependência: IntersectionObserver + CSS. ~2KB.
   Falha segura: se o JS não rodar, nada fica invisível (marcação é feita aqui). */
(() => {
  const semMovimento = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- 1. Hero: extrai o background inline para uma camada animável ---- */
  document.querySelectorAll(".hero-suave, .hero").forEach((hero) => {
    const img = hero.style.backgroundImage;
    if (!img || semMovimento) return;
    const camada = document.createElement("div");
    camada.className = "hero-bg";
    camada.style.backgroundImage = img;
    hero.style.backgroundImage = "none";
    hero.prepend(camada);
  });

  /* ---- 2. Reveal por scroll ---- */
  // ponytail: seleção por convenção em vez de marcar cada elemento no HTML.
  const alvos = [];
  document.querySelectorAll("section").forEach((sec) => {
    // Cada filho direto de .container vira um passo da sequência.
    const bloco = sec.querySelector(".container") || sec;
    [...bloco.children].forEach((el) => alvos.push([el, ""]));
    // Itens de grid revelam em cascata dentro do próprio grid.
    sec
      .querySelectorAll(".grid-2, .grid-3, .rest-grid, .ano-vinha")
      .forEach((grid) => {
        [...grid.children].forEach((filho, i) => {
          filho.style.setProperty("--i", i);
          alvos.push([
            filho,
            filho.classList.contains("foto-slot") ? "foto" : "lado",
          ]);
        });
      });
  });

  if (semMovimento) return;

  const vistos = new WeakSet();
  alvos.forEach(([el, variante]) => {
    if (vistos.has(el)) return; // grid ganha do container: variante mais específica
    vistos.add(el);
    el.setAttribute("data-revelar", variante);
  });

  /* ---- 3. Um único loop de scroll: revela + compacta a nav ----
     ponytail: varredura direta em vez de IntersectionObserver. O IO não emite
     callback quando o elemento pula de "abaixo" para "acima" do viewport num
     salto instantâneo (âncora, F5 com scroll restaurado) e o bloco ficava
     invisível pra sempre. Com N pequeno e a lista encolhendo, medir na mão
     é mais barato que o bug. */
  const nav = document.querySelector(".nav");
  let pendentes = [...document.querySelectorAll("[data-revelar]")];

  const varrer = () => {
    if (nav) nav.classList.toggle("compacta", scrollY > 60);
    if (!pendentes.length) return;
    const gatilho = innerHeight * 0.88; // revela um pouco antes de encostar na base
    pendentes = pendentes.filter((el) => {
      const { top, bottom } = el.getBoundingClientRect();
      if (top > gatilho && bottom > 0) return true; // ainda abaixo: mantém na fila
      el.classList.add("visivel");
      return false;
    });
  };

  let pendente = false;
  addEventListener(
    "scroll",
    () => {
      if (pendente) return;
      pendente = true;
      requestAnimationFrame(() => {
        varrer();
        pendente = false;
      });
    },
    { passive: true },
  );
  addEventListener("resize", varrer, { passive: true });
  varrer(); // estado inicial, sem depender de scroll
})();
