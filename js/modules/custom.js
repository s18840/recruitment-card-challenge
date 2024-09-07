export default function () {
  const cardNumberInput = document.getElementById("cardNumberInput");
  const cardNumberPreview = document.getElementById("cardNumberPreview");
  const cardOwnerInput = document.getElementById("cardHolderInput");
  const cardOwnerPreview = document.getElementById("cardHolderPreview");
  const visaLogo = document.getElementById("visa");
  const mastercardLogo = document.getElementById("mastercard");
  const discoverLogo = document.getElementById("discover");
  const monthSelect = document.getElementById("cardFormMonthSelect");
  const yearSelect = document.getElementById("cardFormYearSelect");
  const expirationMonthPreview = document.getElementById("expirationMonth");
  const expirationYearPreview = document.getElementById("expirationYear");
  const expirationDatePreview = document.getElementById("cardPreviewDetailsExpiration");
  const cardPreviewDetailsHolder = document.getElementById("cardPreviewDetailsHolder");
  const cardPreview = document.querySelector(".card__preview");
  const cardCvvInput = document.querySelector(".card__form__cvv--input");
  const cvvPreview = document.getElementById("cvvPreview");
  const visaLogoBack = document.getElementById("visaBack");
  const mastercardLogoBack = document.getElementById("mastercardBack");
  const discoverLogoBack = document.getElementById("discoverBack");
  const form = document.getElementById("cardForm");

  let previousValue = "";
  expirationMonthPreview.textContent = "MM";
  expirationYearPreview.textContent = "YY";
  cardOwnerPreview.textContent = "Name Surname";
  let cardDigits = Array(16).fill("#");
  cardNumberPreview.innerHTML = formatCardPreview(cardDigits);
  let previousLength = 0;

  addEventListeners();

  // Add Event Listeners
  function addEventListeners() {
    form.addEventListener("submit", handleFormSubmit);
    cardCvvInput.addEventListener("focus", handleCvvFocus);
    cardCvvInput.addEventListener("blur", handleCvvBlur);
    cardCvvInput.addEventListener("input", handleCvvInput);

    cardNumberInput.addEventListener("input", handleCardNumberInput);
    cardOwnerInput.addEventListener("input", handleCardOwnerInput);

    monthSelect.addEventListener("change", handleMonthChange);
    yearSelect.addEventListener("change", handleYearChange);

    addBorderActive(cardNumberInput, cardNumberPreview);
    addBorderActive(cardOwnerInput, cardPreviewDetailsHolder);
    addBorderActive(monthSelect, expirationDatePreview);
    addBorderActive(yearSelect, expirationDatePreview);
  }

  // Remove Event Listeners
  function removeEventListeners() {
    cardCvvInput.removeEventListener("focus", handleCvvFocus);
    cardCvvInput.removeEventListener("blur", handleCvvBlur);
    cardCvvInput.removeEventListener("input", handleCvvInput);

    cardNumberInput.removeEventListener("input", handleCardNumberInput);
    cardOwnerInput.removeEventListener("input", handleCardOwnerInput);

    monthSelect.removeEventListener("change", handleMonthChange);
    yearSelect.removeEventListener("change", handleYearChange);

    removeBorderActive(cardNumberInput, cardNumberPreview);
    removeBorderActive(cardOwnerInput, cardPreviewDetailsHolder);
    removeBorderActive(monthSelect, expirationDatePreview);
    removeBorderActive(yearSelect, expirationDatePreview);
  }

  function handleFormSubmit(event) {
    event.preventDefault();

    const cardNumber = cardNumberInput.value;
    const cardHolder = cardOwnerInput.value;
    const cardMonth = monthSelect.value;
    const cardYear = yearSelect.value;
    const cardCvv = cardCvvInput.value;

    if (
      cardNumber.length !== 16 ||
      !cardHolder ||
      !cardMonth ||
      !cardYear ||
      !cardCvv
    ) {
      alert(
        "Please ensure all fields are filled correctly and the card number has exactly 16 digits."
      );
      return;
    }

    console.log("Form Submitted!", {
      cardNumber,
      cardHolder,
      expirationDate: `${cardMonth}/${cardYear}`,
      cardCvv,
    });

    // form.submit();
  }

  // Event Handlers
  function handleCvvFocus() {
    cardPreview.classList.add("flipped");
    cvvPreview.textContent = cardCvvInput.value;
  }

  function handleCvvBlur() {
    cardPreview.classList.remove("flipped");
  }

  function handleCvvInput() {
    let inputValue = cardCvvInput.value;

    const cleanedValue = inputValue.replace(/\D/g, "");

    if (inputValue !== cleanedValue) {
      alert("Only digits are allowed in the CVV.");
      cardCvvInput.value = cleanedValue;
      return;
    }

    if (cleanedValue.length > 4) {
      cardCvvInput.value = cleanedValue.substring(0, 4);
    } else {
      cardCvvInput.value = cleanedValue;
    }

    cvvPreview.textContent = cardCvvInput.value;
  }

  function handleCardNumberInput() {
    let inputValue = cardNumberInput.value;

    let cleanedValue = inputValue.replace(/\s+/g, "");

    if (/\D/.test(cleanedValue)) {
      alert("Only digits are allowed in the card number.");
      cleanedValue = cleanedValue.replace(/\D/g, "");
    }

    if (cleanedValue.length > 16) {
      cleanedValue = cleanedValue.substring(0, 16);
    }

    const formattedValue = formatCardNumber(cleanedValue);

    cardNumberInput.value = formattedValue;

    let newDigits = [];
    for (let i = 0; i < 16; i++) {
      if (i < cleanedValue.length) {
        newDigits.push({
          digit: cleanedValue[i],
          animate: cardDigits[i] === "#",
          type: "number",
        });
        cardDigits[i] = cleanedValue[i];
      } else {
        newDigits.push({
          digit: "#",
          animate: i < previousLength,
          type: "hash",
        });
        cardDigits[i] = "#";
      }
    }

    cardNumberPreview.innerHTML = formatCardPreview(
      newDigits.map((digitObj) => digitObj.digit)
    );
    const digitElements = document.querySelectorAll(
      "#cardNumberPreview .digit"
    );

    digitElements.forEach((digitElement, index) => {
      const item = newDigits[index];
      if (item && item.animate) {
        if (item.type === "number") {
          digitElement.classList.add("animate-appear");
        } else if (item.type === "hash") {
          digitElement.classList.add("animate-disappear");
        }
      }

      digitElement.addEventListener("animationend", () => {
        digitElement.classList.remove("animate-appear");
        digitElement.classList.remove("animate-disappear");
      });
    });

    previousLength = cleanedValue.length;

    if (cleanedValue.startsWith("4")) {
      showLogo(visaLogo);
      hideLogo(mastercardLogo);
      hideLogo(discoverLogo);
      showLogo(visaLogoBack);
      hideLogo(mastercardLogoBack);
      hideLogo(discoverLogoBack);
    } else if (cleanedValue.startsWith("5") || cleanedValue.startsWith("2")) {
      hideLogo(visaLogo);
      showLogo(mastercardLogo);
      hideLogo(discoverLogo);
      showLogo(mastercardLogoBack);
      hideLogo(visaLogoBack);
      hideLogo(discoverLogoBack);
    } else if (cleanedValue.startsWith("6")) {
      hideLogo(visaLogo);
      hideLogo(mastercardLogo);
      showLogo(discoverLogo);
      showLogo(discoverLogoBack);
      hideLogo(visaLogoBack);
      hideLogo(mastercardLogoBack);
    }
  }

  // Helper function to format card number with spaces every 4 digits
  function formatCardNumber(value) {
    return value
      .split("")
      .map((digit, index) =>
        index > 0 && index % 4 === 0 ? " " + digit : digit
      )
      .join("");
  }

  function handleCardOwnerInput() {
    let currentValue = cardOwnerInput.value;

    if (/\d/.test(currentValue) || /[^a-zA-Z\s]/.test(currentValue)) {
      alert(
        "Numbers and special characters are not allowed in the card holder's name."
      );
      cardOwnerInput.value = previousValue;
      return;
    }

    let formattedValue = currentValue
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

    cardOwnerInput.value = formattedValue;

    let changedCharIndex = findChangedIndex(previousValue, currentValue);
    updateOwnerPreview(formattedValue, changedCharIndex);

    previousValue = formattedValue;
  }

  function handleMonthChange() {
    updateExpiration("month");
  }

  function handleYearChange() {
    updateExpiration("year");
  }

  function showLogo(logo) {
    logo.classList.remove("logo-disappear");
    logo.classList.add("logo-appear");
    logo.style.display = "block";
  }

  function hideLogo(logo) {
    logo.classList.remove("logo-appear");
    logo.classList.add("logo-disappear");
  }

  function formatCardPreview(cardDigits) {
    return cardDigits
      .map((digit, i) => (i > 0 && i % 4 === 0 ? " " + digit : digit))
      .join("")
      .split("")
      .map((char, index) => {
        if (char === " ") {
          return `<span class="space">&nbsp;</span>`;
        } else {
          return `<span class="digit" data-index="${index}">${char}</span>`;
        }
      })
      .join("");
  }

  function findChangedIndex(previous, current) {
    let minLength = Math.min(previous.length, current.length);
    for (let i = 0; i < minLength; i++) {
      if (previous[i] !== current[i]) {
        return i;
      }
    }
    return current.length > previous.length
      ? current.length - 1
      : previous.length;
  }

  function updateOwnerPreview(name, changedIndex) {
    cardOwnerPreview.innerHTML = "";
    name.split("").forEach((char, index) => {
      const span = document.createElement("span");
      span.classList.add("letter");
      span.textContent = char === " " ? "\u00A0" : char;
      if (index === changedIndex) {
        span.classList.add("animate");
      }
      cardOwnerPreview.appendChild(span);
    });
  }

  function updateExpiration(type) {
    const selectedValue =
      type === "month" ? monthSelect.value : yearSelect.value;
    const formattedValue =
      type === "month"
        ? selectedValue || "MM"
        : selectedValue
        ? selectedValue.slice(-2)
        : "YY";
    const previewElement =
      type === "month" ? expirationMonthPreview : expirationYearPreview;

    previewElement.classList.add("animate-disappear");
    previewElement.addEventListener("animationend", () => {
      previewElement.textContent = formattedValue;
      previewElement.classList.remove("animate-disappear");
      previewElement.classList.add("animate-appear");
    });
    previewElement.addEventListener("animationend", () => {
      previewElement.classList.remove("animate-appear");
    });
    previewElement.textContent = `${formattedValue}`;
  }

  function addBorderActive(element, previewElement) {
    element.addEventListener("focus", () => {
      previewElement.classList.add("border-active");
    });
    element.addEventListener("blur", () => {
      previewElement.classList.remove("border-active");
    });
  }

  function removeBorderActive(element, previewElement) {
    element.removeEventListener("focus", () => {
      previewElement.classList.add("border-active");
    });
    element.removeEventListener("blur", () => {
      previewElement.classList.remove("border-active");
    });
  }

  return removeEventListeners;
}