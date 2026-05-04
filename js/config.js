// Configuracoes globais da calculadora.
// Tudo fica centralizado em um unico objeto global: CONFIG.
var CONFIG = {
  // Fatores de emissao em kg CO2 por km.
  EMISSION_FACTORS: {
    bicycle: 0,
    car: 0.12,
    bus: 0.089,
    truck: 0.96
  },

  // Metadados de apresentacao por modal de transporte.
  TRANSPORT_MODES: {
    bicycle: {
      label: "Bicicleta",
      icon: "🚲",
      color: "#10b981"
    },
    car: {
      label: "Carro",
      icon: "🚗",
      color: "#3b82f6"
    },
    bus: {
      label: "Ônibus",
      icon: "🚌",
      color: "#f59e0b"
    },
    truck: {
      label: "Caminhão",
      icon: "🚛",
      color: "#ef4444"
    }
  },

  // Parametros de credito de carbono.
  CARBON_CREDIT: {
    KG_PER_CREDIT: 1000,
    PRICE_MIN_BRL: 50,
    PRICE_MAX_BRL: 150
  },

  // Preenche o datalist com todas as cidades vindas do RoutesDB.
  populateDatalist: function () {
    if (!window.RoutesDB || typeof window.RoutesDB.getAllCities !== "function") {
      return;
    }

    var datalist = document.getElementById("cities-list") || document.getElementById("cityes-list");
    if (!datalist) {
      return;
    }

    var cities = window.RoutesDB.getAllCities();
    datalist.innerHTML = "";

    cities.forEach(function appendCityOption(city) {
      var option = document.createElement("option");
      option.value = city;
      datalist.appendChild(option);
    });
  },

  // Configura preenchimento automatico de distancia com base em origem/destino.
  setupDistanceAutofill: function () {
    var originInput = document.getElementById("origin");
    var destinationInput = document.getElementById("destination");
    var distanceInput = document.getElementById("distance");
    var manualCheckbox = document.getElementById("manual-distance");
    var helperText = document.querySelector(".calculator__help");

    if (!originInput || !destinationInput || !distanceInput || !manualCheckbox) {
      return;
    }

    var defaultHelperText = helperText ? helperText.textContent : "";
    var defaultHelperColor = helperText ? window.getComputedStyle(helperText).color : "";

    function updateHelper(text, color) {
      if (!helperText) {
        return;
      }

      helperText.textContent = text;
      helperText.style.color = color;
    }

    function tryAutofillDistance() {
      var origin = originInput.value.trim();
      var destination = destinationInput.value.trim();

      if (manualCheckbox.checked) {
        distanceInput.readOnly = false;
        return;
      }

      distanceInput.readOnly = true;

      if (!origin || !destination) {
        updateHelper(defaultHelperText, defaultHelperColor);
        return;
      }

      var distance = window.RoutesDB && typeof window.RoutesDB.findDistance === "function"
        ? window.RoutesDB.findDistance(origin, destination)
        : null;

      if (distance !== null) {
        distanceInput.value = String(distance);
        updateHelper("Distancia encontrada automaticamente.", "#16a34a");
        return;
      }

      distanceInput.value = "";
      updateHelper(
        "Rota nao encontrada. Marque \"Inserir distância manualmente\" para informar a distancia.",
        "#b45309"
      );
    }

    function handleManualToggle() {
      if (manualCheckbox.checked) {
        distanceInput.readOnly = false;
        updateHelper("Modo manual ativado. Informe a distancia em km.", defaultHelperColor);
        return;
      }

      distanceInput.readOnly = true;
      tryAutofillDistance();
    }

    originInput.addEventListener("change", tryAutofillDistance);
    destinationInput.addEventListener("change", tryAutofillDistance);
    manualCheckbox.addEventListener("change", handleManualToggle);

    if (manualCheckbox.checked) {
      distanceInput.readOnly = false;
    } else {
      distanceInput.readOnly = true;
      tryAutofillDistance();
    }
  }
};