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

// Botón calcular (placeholder)
document.querySelector(".calculate-btn").addEventListener("click", () => {
    if (!selectedSex) {
        alert("Selecciona el sexo");
        return;
    }
    alert("Cálculo pendiente de implementar");
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



document.querySelector(".calculate-btn").addEventListener("click", () => {
    const datos = obtenerYValidarDatos();

    if (!datos) return;

    console.log("Datos válidos:", datos);
    // Aquí ya puedes calcular el VO2 Max
});
