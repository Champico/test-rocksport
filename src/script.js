// Solo números
document.querySelectorAll("input[inputmode='numeric']").forEach(input => {
    input.addEventListener("input", () => {
        input.value = input.value.replace(/[^0-9.]/g, "");
    });
});

// Toggle sexo
const sexButtons = document.querySelectorAll(".sex-btn");
let selectedSex = null;

sexButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        sexButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        selectedSex = btn.dataset.sex;
    });
});

//Boton para calcular el vomax
document.querySelector(".calculate-btn").addEventListener("click", () => {
    const datos = obtenerYValidarDatos();
    if (!datos) return;

    const vo2 = calcularVoMax(datos);
    mostrarResultado(vo2);
});



function obtenerYValidarDatos() {
    // ===== Obtener valores =====
    const minutos = document.getElementById("tiempo-minutos").value.trim();
    const segundos = document.getElementById("tiempo-segundos").value.trim();
    const fc = document.getElementById("fc").value.trim();
    const peso = document.getElementById("peso").value.trim();
    const edad = document.getElementById("edad").value.trim();

    // Sexo seleccionado
    const sexoBtnActivo = document.querySelector(".sex-btn.active");
    const sexo = sexoBtnActivo ? sexoBtnActivo.dataset.sex : null;

    // ===== Validación de campos vacíos =====
    if (
        minutos === "" ||
        segundos === "" ||
        fc === "" ||
        peso === "" ||
        edad === ""
    ) {
        alert("Todos los campos son obligatorios.");
        return null;
    }

    // ===== Validación numérica =====
    const minutosNum = Number(minutos);
    const segundosNum = Number(segundos);
    const fcNum = Number(fc);
    const pesoNum = Number(peso);
    const edadNum = Number(edad);

    if (
        isNaN(minutosNum) || minutosNum < 0 ||
        isNaN(segundosNum) || segundosNum < 0 || segundosNum >= 60 ||
        isNaN(fcNum) || fcNum <= 0 ||
        isNaN(pesoNum) || pesoNum <= 0 ||
        isNaN(edadNum) || edadNum <= 0
    ) {
        alert("Verifica que todos los valores numéricos sean válidos.");
        return null;
    }

    // ===== Validación sexo =====
    if (!sexo) {
        alert("Selecciona el sexo.");
        return null;
    }

    // ===== Datos listos =====
    return {
        tiempo: {
            minutos: minutosNum,
            segundos: segundosNum
        },
        frecuenciaCardiaca: fcNum,
        peso: pesoNum,
        edad: edadNum,
        sexo: sexo // "male" o "female"
    };
}


function calcularVoMax(datos) {
    // Conversión de tiempo a minutos decimales
    const tiempoMinutos =
        datos.tiempo.minutos + (datos.tiempo.segundos / 60);

    // Conversión de sexo a valor numérico
    // Hombre = 1 | Mujer = 0
    const sexoValor = datos.sexo === "male" ? 1 : 0;

    // Fórmula del Test de Rockport
    const vo2max =
        132.853
        - (0.1694 * datos.peso)
        - (0.3877 * datos.edad)
        + (6.315 * sexoValor)
        - (3.2649 * tiempoMinutos)
        - (0.1565 * datos.frecuenciaCardiaca);

    // Redondear a 2 decimales (opcional pero recomendado)
    return Number(vo2max.toFixed(2));
}

function mostrarResultado(vo2max) {
    const contenedor = document.getElementById("resultado");

    contenedor.innerHTML = `
        <div class="result-card">
            <h3>Resultado</h3>

            <div class="result-value">
                ${vo2max}
            </div>

            <div class="result-unit">
                ml/kg/min
            </div>

            <div class="result-image-container">
                <img src="src/resultado.png" alt="Tabla de resultados">
            </div>
        </div>
    `;
}
