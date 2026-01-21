let contador = 0;
let alumnosGlobal = [];

document.addEventListener('DOMContentLoaded', async () => {
    alumnosGlobal = await cargarAlumnos();

    if (alumnosGlobal.length === 0) {
        alert('No se pudieron cargar los alumnos');
        return;
    }

    // Crear la primera card cuando ya hay alumnos
    agregarCard();
});

function crearSelectAlumnos() {
    const select = document.createElement('select');
    select.innerHTML = `<option value="">Nombre alumno</option>`;

    if (alumnosGlobal.length > 0) {
        alumnosGlobal.forEach(alumno => {
            const option = document.createElement('option');
            option.value = alumno.id;
            option.textContent = `${alumno.nombre} ${alumno.apellido_paterno} ${alumno.apellido_materno}`;
            select.appendChild(option);
        });


    }

    return select;
}

function agregarCard() {
    contador++;

    const card = document.createElement('div');
    card.className = 'card';

    card.innerHTML = `
            <button class="delete-btn" onclick="this.parentElement.remove()">Eliminar</button>

            <div class="row">
                <div class="row-alumno"></div>
                <input type="number" min="0" placeholder="Edad">
            </div>

            <div class="row">
                <input type="number" min="0" placeholder="Min">
                <input type="number" min="0" placeholder="Seg">
                <input type="number" min="0" placeholder="Frec. ❤️">
            </div>

            <div class="row">
                <input type="number" placeholder="Peso (kg)">
                <select>
                    <option value="hombre">Hombre</option>
                    <option value="mujer">Mujer</option>
                </select>
            </div>

            <div class="resultado">
        `;

    const rowAlumno = card.querySelector('.row-alumno');
    rowAlumno.appendChild(crearSelectAlumnos());

    document.getElementById('cardsContainer').appendChild(card);
}


/* Evento del boton calcular */
document.querySelector(".calc-btn").addEventListener("click", () => {
    const datos = obtenerYValidarDatosDeCards();
    if (!datos) return;

    datos.forEach(registro => {
        const vo2 = calcularVoMax(registro);
        registro.rockport = vo2;
    });

    console.log("Resultados finales:", datos);
    alert("Cálculo completado (ver consola)");
});

document.querySelector(".calculate-btn").addEventListener("click", async () => {
    const datos = obtenerYValidarDatosDeCards();
    if (!datos) return;

    for (const registro of datos) {
        // 1 Calcular VO₂max
        const vo2 = calcularVoMax(registro);
        registro.rockport = vo2;

        // 2 Mostrar resultado en su card
        mostrarResultadoEnCard(registro._cardRef, vo2);

        // 3 Guardar en Neon
        const tiempoDecimal =
            registro.tiempo.minutos + (registro.tiempo.segundos / 60);

        await guardarResultados(
            registro.alumnoId,
            registro.edad,
            registro.peso,
            tiempoDecimal,
            vo2
        );
    }

    alert("Cálculo y guardado completado correctamente");
});



function obtenerYValidarDatosDeCards() {
    const cards = document.querySelectorAll('.card');

    if (cards.length === 0) {
        alert("Debe crear al menos un registro.");
        return null;
    }

    const datos = [];

    for (let index = 0; index < cards.length; index++) {
        const card = cards[index];
        const inputs = card.querySelectorAll('input, select');

        const alumnoId = inputs[0].value;
        const nombreAlumno = inputs[0].selectedOptions[0]?.textContent || '';

        const edad = inputs[1].value.trim();
        const minutos = inputs[2].value.trim();
        const segundos = inputs[3].value.trim();
        const fc = inputs[4].value.trim();
        const peso = inputs[5].value.trim();
        const sexo = inputs[6].value;

        // ===== Validación campos vacíos =====
        if (
            !alumnoId || edad === "" || minutos === "" || segundos === "" ||
            fc === "" || peso === "" || !sexo
        ) {
            alert(`Todos los campos son obligatorios (Card ${index + 1})`);
            return null;
        }

        // ===== Conversión numérica =====
        const edadNum = Number(edad);
        const minutosNum = Number(minutos);
        const segundosNum = Number(segundos);
        const fcNum = Number(fc);
        const pesoNum = Number(peso);

        // ===== Validación numérica =====
        if (
            isNaN(edadNum) || edadNum <= 0 ||
            isNaN(minutosNum) || minutosNum < 0 ||
            isNaN(segundosNum) || segundosNum < 0 || segundosNum >= 60 ||
            isNaN(fcNum) || fcNum <= 0 ||
            isNaN(pesoNum) || pesoNum <= 0
        ) {
            alert(`Valores inválidos en la Card ${index + 1}`);
            return null;
        }

        datos.push({
            alumnoId,
            nombre: nombreAlumno,
            edad: edadNum,
            tiempo: {
                minutos: minutosNum,
                segundos: segundosNum
            },
            frecuenciaCardiaca: fcNum,
            peso: pesoNum,
            sexo,
            _cardRef: card 
        });
    }

    return datos;
}


function calcularVoMax(datos) {
    const tiempoMinutos =
        datos.tiempo.minutos + (datos.tiempo.segundos / 60);

    const sexoValor = datos.sexo === "hombre" ? 1 : 0;

    const vo2max =
        132.853
        - (0.3877 * datos.edad)
        + (6.315 * sexoValor)
        - (3.2649 * tiempoMinutos)
        - (0.1565 * datos.frecuenciaCardiaca);

    return Number(vo2max.toFixed(2));
}


function mostrarResultadoEnCard(card, vo2max) {
    const contenedor = card.querySelector('.resultado');

    contenedor.innerHTML = `
        <div class="result-card">
            <strong>VO₂ máx</strong>
            <div class="result-value">${vo2max}</div>
            <div class="result-unit">ml/kg/min</div>
        </div>
    `;
}


