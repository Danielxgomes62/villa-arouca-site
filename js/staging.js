/* Só existe no ambiente de teste (branch gh-pages).
   GitHub Pages serve arquivo estático — não há Netlify Functions aqui.
   Sem este stub, todo fetch('/api/...') vira erro de rede e a página trava
   num "carregando" eterno. Aqui ele responde algo coerente e avisa o revisor. */
(() => {
  const original = window.fetch;
  window.fetch = function (entrada, opcoes) {
    const url = typeof entrada === "string" ? entrada : entrada?.url || "";
    if (!url.includes("/api/")) return original.apply(this, arguments);

    const metodo = (opcoes?.method || "GET").toUpperCase();
    const corpo =
      metodo === "GET"
        ? { horarios: [], precos: null, codigos: [], reservas: [] }
        : {
            erro: "Ambiente de teste: reservas e pagamentos estão desativados.",
          };

    console.info(
      `[teste] ${metodo} ${url} — respondido pelo stub, sem backend.`,
    );
    if (metodo !== "GET") {
      alert(
        "Ambiente de teste.\n\nReservas e pagamentos estão desativados nesta versão de revisão.",
      );
    }
    return Promise.resolve(
      new Response(JSON.stringify(corpo), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
  };
})();
