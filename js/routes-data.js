// Banco global de rotas rodoviarias brasileiras usadas pela calculadora.
// Estrutura de cada rota:
// {
//   origin: "Cidade, UF",
//   destination: "Cidade, UF",
//   distanceKm: 123
// }
var RoutesDB = {
  routes: [
    { origin: "São Paulo, SP", destination: "Rio de Janeiro, RJ", distanceKm: 430 },
    { origin: "São Paulo, SP", destination: "Brasília, DF", distanceKm: 1015 },
    { origin: "Rio de Janeiro, RJ", destination: "Brasília, DF", distanceKm: 1148 },
    { origin: "São Paulo, SP", destination: "Belo Horizonte, MG", distanceKm: 586 },
    { origin: "Rio de Janeiro, RJ", destination: "Belo Horizonte, MG", distanceKm: 434 },
    { origin: "Brasília, DF", destination: "Goiânia, GO", distanceKm: 209 },
    { origin: "Brasília, DF", destination: "Belo Horizonte, MG", distanceKm: 740 },
    { origin: "São Paulo, SP", destination: "Curitiba, PR", distanceKm: 408 },
    { origin: "Curitiba, PR", destination: "Florianópolis, SC", distanceKm: 300 },
    { origin: "Florianópolis, SC", destination: "Porto Alegre, RS", distanceKm: 476 },
    { origin: "Porto Alegre, RS", destination: "Curitiba, PR", distanceKm: 711 },
    { origin: "São Paulo, SP", destination: "Porto Alegre, RS", distanceKm: 1119 },
    { origin: "São Paulo, SP", destination: "Campinas, SP", distanceKm: 95 },
    { origin: "Campinas, SP", destination: "Ribeirão Preto, SP", distanceKm: 223 },
    { origin: "São Paulo, SP", destination: "Santos, SP", distanceKm: 85 },
    { origin: "Rio de Janeiro, RJ", destination: "Niterói, RJ", distanceKm: 13 },
    { origin: "Belo Horizonte, MG", destination: "Ouro Preto, MG", distanceKm: 100 },
    { origin: "Belo Horizonte, MG", destination: "Uberlândia, MG", distanceKm: 541 },
    { origin: "Salvador, BA", destination: "Feira de Santana, BA", distanceKm: 116 },
    { origin: "Salvador, BA", destination: "Aracaju, SE", distanceKm: 356 },
    { origin: "Salvador, BA", destination: "Recife, PE", distanceKm: 839 },
    { origin: "Recife, PE", destination: "João Pessoa, PB", distanceKm: 120 },
    { origin: "João Pessoa, PB", destination: "Natal, RN", distanceKm: 185 },
    { origin: "Recife, PE", destination: "Maceió, AL", distanceKm: 285 },
    { origin: "Maceió, AL", destination: "Aracaju, SE", distanceKm: 294 },
    { origin: "Fortaleza, CE", destination: "Natal, RN", distanceKm: 537 },
    { origin: "Fortaleza, CE", destination: "Teresina, PI", distanceKm: 634 },
    { origin: "São Luís, MA", destination: "Teresina, PI", distanceKm: 446 },
    { origin: "Belém, PA", destination: "São Luís, MA", distanceKm: 806 },
    { origin: "Belém, PA", destination: "Palmas, TO", distanceKm: 973 },
    { origin: "Palmas, TO", destination: "Brasília, DF", distanceKm: 973 },
    { origin: "Manaus, AM", destination: "Boa Vista, RR", distanceKm: 785 },
    { origin: "Cuiabá, MT", destination: "Campo Grande, MS", distanceKm: 694 },
    { origin: "Campo Grande, MS", destination: "Curitiba, PR", distanceKm: 991 },
    { origin: "Goiânia, GO", destination: "Uberlândia, MG", distanceKm: 330 },
    { origin: "Vitória, ES", destination: "Rio de Janeiro, RJ", distanceKm: 521 },
    { origin: "Vitória, ES", destination: "Belo Horizonte, MG", distanceKm: 524 },
    { origin: "Brasília, DF", destination: "Salvador, BA", distanceKm: 1446 }
  ],

  // Retorna todas as cidades unicas (origem e destino), sem duplicidade e ordenadas.
  getAllCities: function () {
    var citySet = new Set();

    this.routes.forEach(function collectCities(route) {
      citySet.add(route.origin);
      citySet.add(route.destination);
    });

    return Array.from(citySet).sort(function sortCities(a, b) {
      return a.localeCompare(b, "pt-BR");
    });
  },

  // Busca distancia entre duas cidades em qualquer direcao (A-B ou B-A).
  // Normaliza entrada removendo espacos extras e convertendo para minusculo.
  findDistance: function (origin, destination) {
    var normalizedOrigin = String(origin || "").trim().toLowerCase();
    var normalizedDestination = String(destination || "").trim().toLowerCase();

    if (!normalizedOrigin || !normalizedDestination) {
      return null;
    }

    var route = this.routes.find(function findRoute(item) {
      var itemOrigin = String(item.origin || "").trim().toLowerCase();
      var itemDestination = String(item.destination || "").trim().toLowerCase();

      return (
        (itemOrigin === normalizedOrigin && itemDestination === normalizedDestination) ||
        (itemOrigin === normalizedDestination && itemDestination === normalizedOrigin)
      );
    });

    if (!route) {
      return null;
    }

    var distance = Number(route.distanceKm);
    return Number.isFinite(distance) && distance > 0 ? distance : null;
  }
};