const convertButton = document.querySelector(".convert-button")
const currencySelect = document.querySelector(".currency-select")

function convertValues() {
  const inputCurrencyValue = parseFloat(document.querySelector(".input-currency").value) || 0
  const currencyValueToConvert = document.querySelector(".currency-value-to-convert") // Valor em Real
  const currencyValueConverted = document.querySelector(".currency-value") // Outras Moedas

  const dolarToday = 5.2
  const euroToday = 5.9
  const realToday = 1
  const bitcoinToday = 0.0000047
  const libraToday = 6.7 

  if (currencySelect.value === "dolar") {
    currencyValueConverted.innerHTML = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(inputCurrencyValue / dolarToday)
  }

  if (currencySelect.value === "euro") {
    currencyValueConverted.innerHTML = new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR"
    }).format(inputCurrencyValue / euroToday)
  }

  if (currencySelect.value === "bitcoin") {
    currencyValueConverted.innerHTML = (inputCurrencyValue / bitcoinToday).toFixed(6) + " BTC"
  }

  if (currencySelect.value === "libra") {
    currencyValueConverted.innerHTML = new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP"
    }).format(inputCurrencyValue / libraToday)
  }

  currencyValueToConvert.innerHTML = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(inputCurrencyValue / realToday)
}

function changeCurrency() {
  const currencyName = document.getElementById("currency-name")
  const currencyImage = document.querySelector(".currency-img")

  if (currencySelect.value === "dolar") {
    currencyName.innerHTML = "Dólar americano"
    currencyImage.src = "./assets/dolar.png"
  }

  if (currencySelect.value === "euro") {
    currencyName.innerHTML = "Euro"
    currencyImage.src = "./assets/euro.png"
  }

  if (currencySelect.value === "bitcoin") {
    currencyName.innerHTML = "Bitcoin"
    currencyImage.src = "./assets/bitcoin.png"
  }

  if (currencySelect.value === "libra") {
    currencyName.innerHTML = "Libra esterlina"
    currencyImage.src = "./assets/libra.png"
  }

  if (currencySelect.value === "real") {
    currencyName.innerHTML = "Real brasileiro"
    currencyImage.src = "./assets/real.png"
  }

  convertValues()
}

currencySelect.addEventListener("change", changeCurrency)
convertButton.addEventListener("click", convertValues)