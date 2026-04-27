const fromCurrency = document.querySelector(".from-currency")
const currencySelect = document.querySelector(".currency-select")
const convertButton = document.querySelector(".convert-button")
const statusMessage = document.querySelector(".status-message")
const swapButton = document.querySelector(".swap-button")
const historyList = document.querySelector(".history-list")
const inputField = document.querySelector(".input-currency")
const clearHistoryButton = document.querySelector(".clear-history")
const loader = document.querySelector(".loader")
const modal = document.getElementById("confirm-modal")
const confirmBtn = document.querySelector(".confirm-btn")
const cancelBtn = document.querySelector(".cancel-btn")
const toast = document.getElementById("toast")

let cachedRates = null
let lastFetchTime = null
const CACHE_TIME = 10 * 60 * 1000

const currencyMap = {
  USD: { name: "Dólar americano", img: "./assets/dolar.png", locale: "en-US" },
  EUR: { name: "Euro", img: "./assets/euro.png", locale: "de-DE" },
  GBP: { name: "Libra esterlina", img: "./assets/libra.png", locale: "en-GB" },
  BRL: { name: "Real brasileiro", img: "./assets/real.png", locale: "pt-BR" }
}

// API
async function getRates() {
  const now = Date.now()

  if (cachedRates && (now - lastFetchTime < CACHE_TIME)) {
    return cachedRates
  }

  try {
    const response = await fetch("https://api.exchangerate-api.com/v4/latest/BRL")
    const data = await response.json()

    cachedRates = data.rates
    lastFetchTime = now

    return cachedRates
  } catch {
    showToast("Erro ao buscar cotação", "error")
    return null
  }
}

// UI
function updateFromCurrencyUI() {
  const name = document.getElementById("currency-name-from")
  const img = document.querySelector(".currency-img-from")

  const data = currencyMap[fromCurrency.value]
  if (!data) return

  name.innerHTML = data.name
  img.src = data.img
}

function updateToCurrencyUI() {
  const name = document.getElementById("currency-name")
  const img = document.querySelector(".currency-img")

  const data = currencyMap[currencySelect.value]
  if (!data) return

  name.innerHTML = data.name
  img.src = data.img
}

// INPUT
inputField.addEventListener("input", handleCurrencyInput)

function handleCurrencyInput(e) {
  let value = e.target.value

  value = value.replace(/\D/g, "")
  value = Number(value) / 100

  const currency = fromCurrency.value
  const locale = currencyMap[currency].locale

  e.target.value = value.toLocaleString(locale, {
    style: "currency",
    currency: currency
  })
}

// HISTÓRICO
function saveToHistory(item) {
  const history = JSON.parse(localStorage.getItem("history")) || []
  history.unshift(item)
  localStorage.setItem("history", JSON.stringify(history.slice(0, 5)))
}

function renderHistory() {
  const history = JSON.parse(localStorage.getItem("history")) || []

  historyList.innerHTML = ""

  if (history.length === 0) {
    historyList.innerHTML = "<li>Nenhuma conversão ainda</li>"
    return
  }

  history.forEach(item => {
    const li = document.createElement("li")

    li.innerText = `${item.inputValue} ${item.from} → ${item.result.toFixed(2)} ${item.to}`

    li.addEventListener("click", () => {
      inputField.value = item.inputValue
      fromCurrency.value = item.from
      currencySelect.value = item.to

      updateFromCurrencyUI()
      updateToCurrencyUI()
      convertValues(false)
    })

    historyList.appendChild(li)
  })
}

// CONVERSÃO
async function convertValues(save = true) {
  const rawInput = inputField.value
  const numeric = rawInput.replace(/\D/g, "")
  const inputValue = Number(numeric) / 100

  if (!numeric) {
    showToast("Digite um valor válido", "error")
    return
  }

  const currencyValueToConvert = document.querySelector(".currency-value-to-convert")
  const currencyValueConverted = document.querySelector(".currency-value")

  loader.classList.remove("hidden")
  statusMessage.innerHTML = "Carregando..."
  convertButton.disabled = true

  const rates = await getRates()

  if (!rates) {
    loader.classList.add("hidden")
    convertButton.disabled = false
    return
  }

  const from = fromCurrency.value
  const to = currencySelect.value

  const result = inputValue * (rates[to] / rates[from])

  currencyValueToConvert.innerHTML = new Intl.NumberFormat(currencyMap[from].locale, {
    style: "currency",
    currency: from
  }).format(inputValue)

  currencyValueConverted.innerHTML = new Intl.NumberFormat(currencyMap[to].locale, {
    style: "currency",
    currency: to
  }).format(result)

  // animação
  currencyValueToConvert.classList.remove("fade")
  currencyValueConverted.classList.remove("fade")
  void currencyValueToConvert.offsetWidth
  currencyValueToConvert.classList.add("fade")
  currencyValueConverted.classList.add("fade")

  if (save) {
    saveToHistory({ from, to, inputValue, result })
    renderHistory()
  }

  loader.classList.add("hidden")
  convertButton.disabled = false
  statusMessage.innerHTML = ""

  showToast("Conversão realizada")
}

// TOAST
function showToast(message, type = "success") {
  toast.innerText = message
  toast.className = `toast show ${type}`

  setTimeout(() => {
    toast.classList.remove("show")
  }, 2500)
}

// EVENTOS
convertButton.addEventListener("click", () => convertValues(true))

currencySelect.addEventListener("change", () => {
  updateToCurrencyUI()
  convertValues(false)
})

fromCurrency.addEventListener("change", () => {
  updateFromCurrencyUI()
  handleCurrencyInput({ target: inputField })
  convertValues(false)
})

swapButton.addEventListener("click", () => {
  const from = fromCurrency.value
  fromCurrency.value = currencySelect.value
  currencySelect.value = from

  updateFromCurrencyUI()
  updateToCurrencyUI()
  convertValues(false)
})

// ABRIR MODAL
clearHistoryButton.addEventListener("click", () => {
  modal.classList.remove("hidden")
})

// CANCELAR
cancelBtn.addEventListener("click", closeModal)

// CONFIRMAR
confirmBtn.addEventListener("click", () => {
  localStorage.removeItem("history")
  renderHistory()

  closeModal()
  showToast("Histórico limpo com sucesso", "success")
})

// FECHAR MODAL (função centralizada)
function closeModal() {
  modal.classList.add("hidden")
}

// FECHAR clicando fora do modal
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeModal()
  }
})

// FECHAR com ESC
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModal()
  }
})

cancelBtn.addEventListener("click", () => {
  closeModal()
})

confirmBtn.addEventListener("click", () => {
  localStorage.removeItem("history")
  renderHistory()
  modal.classList.add("hidden")

  showToast("Histórico limpo com sucesso")
})

clearHistoryButton.addEventListener("click", () => {
  modal.classList.remove("hidden")
  document.body.classList.add("modal-open")
})

function closeModal() {
  modal.classList.add("hidden")
  document.body.classList.remove("modal-open")
}

const themeToggle = document.querySelector(".theme-toggle")

// carregar preferência salva
const savedTheme = localStorage.getItem("theme")

if (savedTheme === "dark") {
  document.body.classList.add("dark-mode")
  themeToggle.innerText = "☀️"
}

// alternar tema
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode")

  const isDark = document.body.classList.contains("dark-mode")

  localStorage.setItem("theme", isDark ? "dark" : "light")

  themeToggle.innerText = isDark ? "☀️" : "🌙"
})

// INIT
updateFromCurrencyUI()
updateToCurrencyUI()
renderHistory()