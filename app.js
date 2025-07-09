function showIMEIInstructions() {
    alert("Откройте настройки телефона → О телефоне → IMEI и сделайте скриншот.");
    document.getElementById("uploadBtn").disabled = false;
}

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const preview = document.getElementById("preview");
    const resultDiv = document.getElementById("result");

    // Показываем превью изображения
    const reader = new FileReader();
    reader.onload = function(e) {
        preview.src = e.target.result;
        preview.style.display = "block";
        resultDiv.textContent = "Обработка...";
        
        // Распознаём текст с помощью Tesseract.js
        recognizeIMEI(e.target.result);
    };
    reader.readAsDataURL(file);
}

function recognizeIMEI(imageSrc) {
    const resultDiv = document.getElementById("result");

    Tesseract.recognize(
        imageSrc,
        'eng',  // Язык (английский для цифр)
        { logger: m => console.log(m) }
    ).then(({ data: { text } }) => {
        console.log("Распознанный текст:", text);
        
        // Ищем 15-значный IMEI (обычно он имеет такой формат)
        const imeiMatch = text.match(/\b\d{15}\b/);
        
        if (imeiMatch) {
            const imei = imeiMatch[0];
            resultDiv.innerHTML = `IMEI найден: <strong>${imei}</strong>`;
        } else {
            resultDiv.textContent = "IMEI не найден. Попробуйте другой скриншот.";
        }
    }).catch(err => {
        console.error("Ошибка распознавания:", err);
        resultDiv.textContent = "Ошибка. Попробуйте ещё раз.";
    });
}