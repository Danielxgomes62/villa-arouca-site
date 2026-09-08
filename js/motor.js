// Barra de busca -> motor Omnibees. Datas em DDMMAAAA (o motor lê nesse formato).
(function () {
  var MOTOR = 'https://book.omnibees.com/hotel/53380/rateplan/1373152?lang=pt-BR';
  var barra = document.querySelector('.motor-busca');
  if (!barra) return;

  var entrada = barra.querySelector('[name="entrada"]');
  var saida = barra.querySelector('[name="saida"]');
  var hoje = new Date().toISOString().split('T')[0];
  entrada.min = hoje;
  saida.min = hoje;

  function maisUmDia(iso) {
    var d = new Date(iso + 'T00:00:00');
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }
  function ddmmaaaa(iso) {
    var p = iso.split('-');
    return p[2] + p[1] + p[0];
  }

  entrada.addEventListener('change', function () {
    if (!entrada.value) return;
    var minSaida = maisUmDia(entrada.value);
    saida.min = minSaida;
    if (!saida.value || saida.value <= entrada.value) saida.value = minSaida;
  });

  barra.addEventListener('submit', function (e) {
    e.preventDefault();
    var url = MOTOR +
      '&CheckIn=' + ddmmaaaa(entrada.value) +
      '&CheckOut=' + ddmmaaaa(saida.value) +
      '&NRooms=1' +
      '&ad=' + barra.querySelector('[name="adultos"]').value +
      '&ch=' + barra.querySelector('[name="criancas"]').value;
    var cupom = barra.querySelector('[name="cupom"]').value.trim();
    if (cupom) url += '&Code=' + encodeURIComponent(cupom);
    window.open(url, '_blank', 'noopener');
  });
})();
