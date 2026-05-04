var Calculator = (function buildCalculator() {
  function round(value, decimals) {
    const factor = Math.pow(10, decimals);
    return Math.round((value + Number.EPSILON) * factor) / factor;
  }

  function getEmissionFactors() {
    return (window.CONFIG && window.CONFIG.EMISSION_FACTORS) || {};
  }

  function getCarbonCreditConfig() {
    return (window.CONFIG && window.CONFIG.CARBON_CREDIT) || {};
  }

  return {
    // Calcula emissao: distancia (km) multiplicada pelo fator do modal escolhido.
    calculateEmission: function (distanceKm, transportMode) {
      const distance = Number(distanceKm);
      const factors = getEmissionFactors();
      const factor = Number(factors[transportMode]);

      if (!Number.isFinite(distance) || distance < 0) {
        return null;
      }

      if (!Number.isFinite(factor) || factor < 0) {
        return null;
      }

      const emission = distance * factor;
      return round(emission, 2);
    },

    // Calcula emissao para todos os modais e compara percentual contra carro.
    calculateAllModes: function (distanceKm) {
      const distance = Number(distanceKm);
      const factors = getEmissionFactors();

      if (!Number.isFinite(distance) || distance < 0) {
        return [];
      }

      const results = [];
      const carEmission = this.calculateEmission(distance, "car");

      Object.keys(factors).forEach(
        function calculateForMode(mode) {
          const emission = this.calculateEmission(distance, mode);
          if (emission === null) {
            return;
          }

          const percentageVsCar =
            Number.isFinite(carEmission) && carEmission > 0
              ? round((emission / carEmission) * 100, 2)
              : 0;

          results.push({
            mode: mode,
            emission: emission,
            percentageVsCar: percentageVsCar
          });
        }.bind(this)
      );

      results.sort(function sortByEmission(a, b) {
        return a.emission - b.emission;
      });

      return results;
    },

    // Calcula economia absoluta e percentual em relacao a uma emissao base.
    calculateSavings: function (emission, baselineEmission) {
      const current = Number(emission);
      const baseline = Number(baselineEmission);

      if (!Number.isFinite(current) || !Number.isFinite(baseline) || baseline <= 0) {
        return {
          savedKg: 0,
          percentage: 0
        };
      }

      const savedKg = baseline - current;
      const percentage = (savedKg / baseline) * 100;

      return {
        savedKg: round(savedKg, 2),
        percentage: round(percentage, 2)
      };
    },

    // Converte emissao total (kg) em quantidade de creditos de carbono.
    calculateCarbonCredits: function (emissionKg) {
      const emission = Number(emissionKg);
      const creditConfig = getCarbonCreditConfig();
      const kgPerCredit = Number(creditConfig.KG_PER_CREDIT);

      if (!Number.isFinite(emission) || emission < 0 || !Number.isFinite(kgPerCredit) || kgPerCredit <= 0) {
        return 0;
      }

      const credits = emission / kgPerCredit;
      return round(credits, 4);
    },

    // Estima faixa de preco dos creditos (minimo, maximo e media) em BRL.
    estimateCreditPrice: function (credits) {
      const totalCredits = Number(credits);
      const creditConfig = getCarbonCreditConfig();
      const minUnitPrice = Number(creditConfig.PRICE_MIN_BRL);
      const maxUnitPrice = Number(creditConfig.PRICE_MAX_BRL);

      if (
        !Number.isFinite(totalCredits) ||
        totalCredits < 0 ||
        !Number.isFinite(minUnitPrice) ||
        minUnitPrice < 0 ||
        !Number.isFinite(maxUnitPrice) ||
        maxUnitPrice < 0
      ) {
        return {
          min: 0,
          max: 0,
          average: 0
        };
      }

      const min = totalCredits * minUnitPrice;
      const max = totalCredits * maxUnitPrice;
      const average = (min + max) / 2;

      return {
        min: round(min, 2),
        max: round(max, 2),
        average: round(average, 2)
      };
    }
  };
})();