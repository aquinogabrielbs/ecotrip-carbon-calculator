var UI = (function createUI() {
  var SECTION_IDS = ["results", "comparison", "carbon-credits"];

  function getElement(elementId) {
    if (!elementId) {
      return null;
    }

    var direct = document.getElementById(elementId);
    if (direct) {
      return direct;
    }

    if (elementId === "carbom-credits") {
      return document.getElementById("carbon-credits");
    }

    if (elementId === "carbon-credits") {
      return document.getElementById("carbom-credits");
    }

    if (elementId === "carbom-credits-content") {
      return document.getElementById("carbom-credits-content") || document.getElementById("carbon-credits-content");
    }

    return null;
  }

  function getTransportMeta(modeKey) {
    var modes = (window.CONFIG && window.CONFIG.TRANSPORT_MODES) || {};
    return modes[modeKey] || {
      label: modeKey || "Desconhecido",
      icon: "🚘",
      color: "#6b7280"
    };
  }

  function getProgressBarColor(percentageVsCar) {
    if (percentageVsCar <= 25) {
      return "#10b981";
    }

    if (percentageVsCar <= 75) {
      return "#f59e0b";
    }

    if (percentageVsCar <= 100) {
      return "#f97316";
    }

    return "#ef4444";
  }

  return {
    // Formata numero com casas decimais e separador de milhar em pt-BR.
    formatNumber: function (number, decimals) {
      var numericValue = Number(number);
      var safeDecimals = Number.isFinite(Number(decimals)) ? Number(decimals) : 2;

      if (!Number.isFinite(numericValue)) {
        numericValue = 0;
      }

      var fixed = numericValue.toFixed(safeDecimals);
      var parsed = Number(fixed);
      return parsed.toLocaleString("pt-BR", {
        minimumFractionDigits: safeDecimals,
        maximumFractionDigits: safeDecimals
      });
    },

    // Formata valor monetario em reais (BRL).
    formatCurrency: function (number) {
      var numericValue = Number(number);
      if (!Number.isFinite(numericValue)) {
        numericValue = 0;
      }

      return numericValue.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
      });
    },

    // Exibe elemento removendo classe utilitaria de ocultacao.
    showElement: function (elementId) {
      var element = getElement(elementId);
      if (!element) {
        return;
      }

      element.classList.remove("hidden");
      element.classList.add("is-visible");
    },

    // Oculta elemento adicionando classe utilitaria hidden.
    hideElement: function (elementId) {
      var element = getElement(elementId);
      if (!element) {
        return;
      }

      element.classList.add("hidden");
      element.classList.remove("is-visible");
    },

    // Leva a viewport ate o elemento com animacao suave.
    scrollToElement: function (elementId) {
      var element = getElement(elementId);
      if (!element) {
        return;
      }

      element.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    },

    // Monta HTML do resultado principal em cards BEM.
    // Estrutura: rota, distancia, emissao, transporte e economia (quando aplicavel).
    renderResults: function (data) {
      var payload = data || {};
      var mode = String(payload.mode || "car");
      var modeMeta = getTransportMeta(mode);
      var hasSavings = mode !== "car" && payload.savings;

      var distanceValue = Number(payload.distance);
      var distanceLabel = Number.isFinite(distanceValue)
        ? (Number.isInteger(distanceValue) ? this.formatNumber(distanceValue, 0) : this.formatNumber(distanceValue, 1))
        : this.formatNumber(0, 0);

      var rows = [
        {
          icon: "🗺️",
          label: "Rota",
          value: String(payload.origin || "-") + " → " + String(payload.destination || "-")
        },
        {
          icon: "📏",
          label: "Distância",
          value: distanceLabel + " km"
        },
        {
          icon: "🌿",
          label: "Emissão de CO₂",
          value: this.formatNumber(payload.emission, 2) + " kg"
        },
        {
          icon: modeMeta.icon,
          label: "Meio de Transporte",
          value: modeMeta.label
        }
      ];

      if (hasSavings) {
        rows.push({
          icon: "✅",
          label: "Economia vs Carro",
          className: "results-layout__item--savings",
          value: this.formatNumber(payload.savings.savedKg, 2) + " kg (" + this.formatNumber(payload.savings.percentage, 2) + "%)"
        });
      }

      var rowsHtml = rows
        .map(function renderRow(item) {
          var itemClass = "results-layout__item" + (item.className ? " " + item.className : "");

          return (
            '<div class="' + itemClass + '">' +
              '<div class="results-layout__icon" aria-hidden="true">' + item.icon + "</div>" +
              '<div class="results-layout__label">' + item.label + "</div>" +
              '<div class="results-layout__value">' + item.value + "</div>" +
            "</div>"
          );
        })
        .join("");

      return '<div class="results-layout">' + rowsHtml + "</div>";
    },

    // Monta comparativo em cards com badge, estatisticas e barra de intensidade.
    renderComparison: function (modesArray, selectedMode) {
      var modes = Array.isArray(modesArray) ? modesArray : [];

      if (!modes.length) {
        return '<div class="comparison__empty">Sem dados de comparação.</div>';
      }

      var self = this;
      var maxEmission = modes.reduce(function getMaxEmission(accumulator, item) {
        var emission = Number(item && item.emission);
        return Number.isFinite(emission) && emission > accumulator ? emission : accumulator;
      }, 0);

      if (maxEmission <= 0) {
        maxEmission = 1;
      }

      var itemsHtml = modes
        .map(
          function renderMode(item) {
            var mode = String((item && item.mode) || "");
            var emission = Number(item && item.emission);
            var percentageVsCar = Number(item && item.percentageVsCar);
            var metadata = getTransportMeta(mode);
            var isSelected = mode === selectedMode;
            var progressWidth = Math.max(0, Math.min((emission / maxEmission) * 100, 100));
            var barModifier = "comparison__bar--green";

            if (percentageVsCar > 100) {
              barModifier = "comparison__bar--red";
            } else if (percentageVsCar > 75) {
              barModifier = "comparison__bar--orange";
            } else if (percentageVsCar > 25) {
              barModifier = "comparison__bar--yellow";
            }

            return (
              '<div class="comparison__item' + (isSelected ? " comparison__item--selected" : "") + '">' +
                '<div class="comparison__header">' +
                  '<div class="comparison__mode">' +
                    '<span class="comparison__icon" aria-hidden="true">' + metadata.icon + "</span>" +
                    '<span class="comparison__label">' + metadata.label + "</span>" +
                  "</div>" +
                  (isSelected ? '<span class="comparison__badge">SELECIONADO</span>' : "") +
                "</div>" +
                '<div class="comparison__stats">' +
                  '<div class="comparison__stat">' +
                    '<div class="comparison__stat-label">EMISSÃO</div>' +
                    '<div class="comparison__emission">' + self.formatNumber(emission, 2) + ' kg CO₂</div>' +
                  "</div>" +
                  '<div class="comparison__stat">' +
                    '<div class="comparison__stat-label">VS CARRO</div>' +
                    '<div class="comparison__percentage">' + self.formatNumber(percentageVsCar, 2) + "%</div>" +
                  "</div>" +
                "</div>" +
                '<div class="comparison__bar-container">' +
                  '<div class="comparison__bar ' + barModifier + '" style="width:' + progressWidth.toFixed(2) + '%"></div>' +
                "</div>" +
              "</div>"
            );
          }
        )
        .join("");

      var tipBox =
        '<div class="comparison__tip">' +
          '<div class="comparison__tip-icon" aria-hidden="true">💡</div>' +
          '<div class="comparison__tip-text"><strong>Dica:</strong> Escolher meios de transporte mais sustentáveis ajuda a reduzir significativamente as emissões de CO₂ e contribui para um planeta mais saudável!</div>' +
        "</div>";

      return '<div class="comparison">' + itemsHtml + tipBox + "</div>";
    },

    // Monta bloco de créditos com dois cards, info box e botão de ação.
    renderCarbonCredits: function (creditsData) {
      var payload = creditsData || {};
      var price = payload.price || {};

      return (
        '<div class="carbon-credits">' +
          '<div class="carbon-credits__grid">' +
            '<div class="carbon-credits__card">' +
              '<div class="carbon-credits__label">🌳 CRÉDITOS NECESSÁRIOS</div>' +
              '<div class="carbon-credits__value">' + this.formatNumber(payload.credits, 4) + "</div>" +
              '<div class="carbon-credits__hint">1 crédito = 1.000 kg CO₂</div>' +
            "</div>" +
            '<div class="carbon-credits__card">' +
              '<div class="carbon-credits__label">💰 CUSTO ESTIMADO</div>' +
              '<div class="carbon-credits__value">' + this.formatCurrency(price.average) + "</div>" +
              '<div class="carbon-credits__hint">Variação: ' + this.formatCurrency(price.min) + " - " + this.formatCurrency(price.max) + "</div>" +
            "</div>" +
          "</div>" +
          '<div class="carbon-credits__info">' +
            '<strong>O que são Créditos de Carbono?</strong>' +
            '<p>Créditos de carbono são certificados que representam a redução de uma tonelada de CO₂ da atmosfera. Ao comprar créditos, você compensa suas emissões financiando projetos de preservação ambiental, reflorestamento e energia renovável.</p>' +
          "</div>" +
          '<button type="button" class="carbon-credits__btn">🌱 Compensar Emissões</button>' +
        "</div>"
      );
    },

    // Mostra estado de carregamento no botao e preserva texto original no dataset.
    showLoading: function (buttonElement) {
      if (!buttonElement) {
        return;
      }

      if (!buttonElement.dataset.originalText) {
        buttonElement.dataset.originalText = buttonElement.textContent || "";
      }

      buttonElement.disabled = true;
      buttonElement.innerHTML = '<span class="spinner"></span> Calculando...';
    },

    // Restaura estado normal do botao apos processamento.
    hideLoading: function (buttonElement) {
      if (!buttonElement) {
        return;
      }

      buttonElement.disabled = false;
      buttonElement.innerHTML = buttonElement.dataset.originalText || "Calcular";
    },

    // Compatibilidade com fluxo atual da aplicacao.
    showSection: function (sectionId) {
      this.showElement(sectionId);
    },

    // Compatibilidade com fluxo atual da aplicacao.
    hideSection: function (sectionId) {
      this.hideElement(sectionId);
    },

    // Compatibilidade com fluxo atual da aplicacao.
    hideAllSections: function () {
      SECTION_IDS.forEach(this.hideElement.bind(this));
      this.hideElement("carbom-credits");
    },

    // Compatibilidade com fluxo atual da aplicacao.
    renderMessage: function (message) {
      var container = getElement("results-content");
      if (!container) {
        return;
      }

      container.textContent = String(message || "");
    },

    // Compatibilidade com fluxo atual da aplicacao usando o novo renderer de resultados.
    renderResult: function (result, contextData) {
      var container = getElement("results-content");
      if (!container || !result) {
        return;
      }

      var mode = String(result.transport || "car");
      var carEmission = window.Calculator && typeof window.Calculator.calculateEmission === "function"
        ? window.Calculator.calculateEmission(result.distanceKm, "car")
        : null;
      var savings =
        mode !== "car" && window.Calculator && typeof window.Calculator.calculateSavings === "function" && carEmission !== null
          ? window.Calculator.calculateSavings(result.emissionsKg, carEmission)
          : null;

      container.innerHTML = this.renderResults({
        origin: contextData && contextData.origin,
        destination: contextData && contextData.destination,
        distance: result.distanceKm,
        emission: result.emissionsKg,
        mode: mode,
        savings: savings
      });
    }
  };
})();

window.UI = UI;