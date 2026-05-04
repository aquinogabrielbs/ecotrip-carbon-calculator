(function initApp() {
  // Processo principal do submit: valida, calcula, renderiza e exibe seções.
  function handleFormSubmit(event) {
    event.preventDefault();

    var form = event.currentTarget;
    var originInput = document.getElementById("origin");
    var destinationInput = document.getElementById("destination");
    var distanceInput = document.getElementById("distance");
    var selectedTransportInput = document.querySelector('input[name="transport"]:checked');

    if (!form || !originInput || !destinationInput || !distanceInput || !selectedTransportInput) {
      alert("Não foi possível ler os campos do formulário. Recarregue a página e tente novamente.");
      return;
    }

    // 1) Lê e normaliza os valores do formulário.
    var origin = originInput.value.trim();
    var destination = destinationInput.value.trim();
    var distance = parseFloat(distanceInput.value);
    var selectedMode = selectedTransportInput.value;

    // 2) Valida entradas obrigatórias e distância válida.
    var hasRequiredValues = origin && destination && Number.isFinite(distance);
    if (!hasRequiredValues || distance <= 0) {
      alert("Preencha origem, destino e uma distância válida maior que zero.");
      return;
    }

    // 3) Obtém botão de submit para controlar estado de carregamento.
    var submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
      UI.showLoading(submitButton);
    }

    // 4) Oculta seções de resultado anteriores antes do novo processamento.
    UI.hideElement("results");
    UI.hideElement("comparison");
    UI.hideElement("carbon-credits");
    UI.hideElement("carbom-credits");

    // 5) Simula processamento assíncrono para demonstrar feedback visual.
    setTimeout(function processCalculation() {
      try {
        // 6) Calcula emissão do modo selecionado.
        var emission = Calculator.calculateEmission(distance, selectedMode);
        if (emission === null) {
          throw new Error("Falha ao calcular emissão para o modal selecionado.");
        }

        // 7) Calcula baseline do carro e economia relativa.
        var carEmission = Calculator.calculateEmission(distance, "car");
        var savings = Calculator.calculateSavings(emission, carEmission);

        // 8) Monta comparação entre todos os modais.
        var allModesComparison = Calculator.calculateAllModes(distance);

        // 9) Calcula créditos de carbono e estimativa de preço.
        var credits = Calculator.calculateCarbonCredits(emission);
        var priceEstimate = Calculator.estimateCreditPrice(credits);

        // 10) Prepara objetos de dados para renderização da UI.
        var resultsData = {
          origin: origin,
          destination: destination,
          distance: distance,
          emission: emission,
          mode: selectedMode,
          savings: selectedMode === "car" ? null : savings
        };

        var creditsData = {
          credits: credits,
          price: priceEstimate
        };

        // 11) Renderiza HTML nas três áreas principais.
        var resultsContainer = document.getElementById("results-content");
        var comparisonContainer = document.getElementById("comparison-content");
        var carbonCreditsContainer =
          document.getElementById("carbon-credits-content") || document.getElementById("carbom-credits-content");

        if (!resultsContainer || !comparisonContainer || !carbonCreditsContainer) {
          throw new Error("Containers de resultados não encontrados no DOM.");
        }

        resultsContainer.innerHTML = UI.renderResults(resultsData);
        comparisonContainer.innerHTML = UI.renderComparison(allModesComparison, selectedMode);
        carbonCreditsContainer.innerHTML = UI.renderCarbonCredits(creditsData);

        // 12) Exibe seções e move viewport para os resultados.
        UI.showElement("results");
        UI.showElement("comparison");
        UI.showElement("carbon-credits");
        UI.scrollToElement("results");

        // 13) Remove estado de loading do botão.
        if (submitButton) {
          UI.hideLoading(submitButton);
        }
      } catch (error) {
        console.error("Erro ao processar cálculo de emissão:", error);
        alert("Ocorreu um erro ao calcular as emissões. Tente novamente em instantes.");

        if (submitButton) {
          UI.hideLoading(submitButton);
        }
      }
    }, 1500);
  }

  document.addEventListener("DOMContentLoaded", function onDomReady() {
    // Inicializa recursos de apoio da interface quando o DOM estiver pronto.
    if (window.CONFIG && typeof window.CONFIG.populateDatalist === "function") {
      CONFIG.populateDatalist();
    }

    if (window.CONFIG && typeof window.CONFIG.setupDistanceAutofill === "function") {
      CONFIG.setupDistanceAutofill();
    }

    // Obtém o formulário principal e registra o manipulador de submit.
    var calculatorForm = document.getElementById("calculator-form");
    if (!calculatorForm) {
      return;
    }

    calculatorForm.addEventListener("submit", handleFormSubmit);

    // Log de confirmação da inicialização solicitada.
    console.log("🟢 Calculadora inicializada!");
  });
})();