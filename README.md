# 🌱 EcoTrip Carbon Calculator

Uma calculadora web interativa para estimar emissões de CO₂ em viagens terrestres, desenvolvida com tecnologias web modernas. O projeto permite comparar diferentes modais de transporte e calcular créditos de carbono necessários para compensar o impacto ambiental.

## Contexto do Bootcamp (DIO)

Este projeto representa o case final do bootcamp "CI&T - Do Prompt ao Agente" da DIO, cujo objetivo principal foi aplicar a inteligência artificial de forma prática no fluxo de trabalho do desenvolvedor. O código foi criado com orientação das aulas e aprimorado iterativamente com assistência de IA.

- **Bootcamp**: CI&T - Do Prompt ao Agente
- **Case final**: desenvolvimento deste projeto com GitHub Copilot
- **Ambiente**: VS Code
- **Agente/Modelo**: ChatGPT Codex 5.3 XHight

## ✨ Funcionalidades

- **Cálculo de Emissões**: Estima emissões de CO₂ baseadas em distância e modal de transporte
- **Comparação de Modais**: Compara eficiência ambiental entre bicicleta, carro, ônibus e caminhão
- **Banco de Rotas**: 38 rotas brasileiras pré-cadastradas com distâncias reais
- **Preenchimento Automático**: Auto-preenchimento de distâncias para rotas conhecidas
- **Sistema de Créditos**: Cálculo de créditos de carbono necessários para compensação
- **Interface Responsiva**: Design adaptável para desktop e dispositivos móveis
- **Formatação Brasileira**: Valores monetários e numéricos em português do Brasil

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura semântica com formulários acessíveis
- **CSS3**: Design responsivo com variáveis CSS e metodologia BEM
- **JavaScript ES5+**: Arquitetura modular sem dependências externas
- **GitHub Actions**: Deploy automatizado para GitHub Pages

## 📊 Fatores de Emissão

| Modal | Fator de Emissão (kg CO₂/km) |
|-------|------------------------------|
| 🚲 Bicicleta | 0.00 |
| 🚗 Carro | 0.12 |
| 🚌 Ônibus | 0.089 |
| 🚛 Caminhão | 0.96 |

## 💰 Sistema de Créditos de Carbono

- **1 Crédito = 1.000 kg CO₂**
- **Faixa de Preço**: R$ 50 - R$ 150 por crédito
- **Cálculo**: Emissões totais ÷ 1.000 = Créditos necessários

## 🚀 Como Executar Localmente

### Pré-requisitos
- Navegador web moderno
- Extensão Live Server do VS Code (recomendado)

### Passos
1. Clone ou baixe o repositório
2. Abra a pasta `ecotrip-carbon-calculator` no VS Code
3. Clique com o botão direito em `index.html`
4. Selecione "Open with Live Server"
5. A aplicação abrirá automaticamente no navegador

## 🌐 GitHub Pages

O projeto está configurado para deploy automático no GitHub Pages:

- **URL**: [https://aquinogabrielbs.github.io/ecotrip-carbon-calculator/](https://aquinogabrielbs.github.io/ecotrip-carbon-calculator/)
- **Branch**: `main` configurado como branch de publicação
- **Workflow**: Deploy automatizado via GitHub Actions (`.github/workflows/deploy.yml`)

### Configuração do Workflow
- **Trigger**: Push para branch `main` ou execução manual
- **Permissões**: `contents: read` e `pages: write`
- **Ambiente**: `github-pages` com branch de deploy automático

## 📁 Estrutura do Projeto

```
ecotrip-carbon-calculator/
├── index.html              # Estrutura principal da aplicação
├── css/
│   └── style.css          # Estilos responsivos com variáveis CSS
├── js/
│   ├── app.js             # Inicialização e controle de eventos
│   ├── calculator.js      # Lógica de cálculos de emissões
│   ├── config.js          # Configurações e fatores de emissão
│   ├── routes-data.js     # Banco de dados de rotas brasileiras
│   └── ui.js              # Interface e formatação de dados
├── .github/
│   └── workflows/
│       └── deploy.yml     # Workflow de deploy para GitHub Pages
└── README.md              # Documentação do projeto
```

## 🔧 Arquitetura

O projeto utiliza uma arquitetura modular em JavaScript puro:

- **`RoutesDB`**: Gerenciamento do banco de dados de rotas
- **`CONFIG`**: Configurações globais e fatores de emissão
- **`Calculator`**: Lógica matemática de cálculos
- **`UI`**: Renderização e formatação da interface
- **`App`**: Coordenação geral e manipulação de eventos

## 📈 Exemplo de Uso

Para uma viagem de São Paulo a Rio de Janeiro (430 km):

- **Carro**: 51,60 kg CO₂
- **Ônibus**: 38,27 kg CO₂ (26% menos que carro)
- **Créditos necessários**: ~0,052 créditos
- **Custo estimado**: R$ 2,60 - R$ 7,80

---

## 👨‍💻 Autor

**Gabriel Silva**
- GitHub: [@aquinogabrielbs](https://github.com/aquinogabrielbs)
- LinkedIn: [Gabriel Silva](https://www.linkedin.com/in/gabriel-aquino777/)

**Menção Honrosa**
- **Professor Pablo Lopes**: Pela orientação excepcional no desafio final e pela inspiração para aplicar IA no desenvolvimento.

---

*Desenvolvido com ❤️ para promover a conscientização ambiental através da tecnologia.*