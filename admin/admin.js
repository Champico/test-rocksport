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

console.log(alumnosGlobal)
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
                    <option value="male">Hombre</option>
                    <option value="female">Mujer</option>
                </select>
            </div>
        `;

    const rowAlumno = card.querySelector('.row-alumno');
    rowAlumno.appendChild(crearSelectAlumnos());

    document.getElementById('cardsContainer').appendChild(card);
}

function calcular() {
    const cards = document.querySelectorAll('.card');

    // VALIDACIÓN: no hay registros
    if (cards.length === 0) {
        alert("Debe crear al menos un registro para calcular");
        return;
    }


    const datos = [];

    cards.forEach(card => {
        const inputs = card.querySelectorAll('input, select');

        const registro = {
            nombre: inputs[0].value,
            edad: inputs[1].value,
            minutos: inputs[2].value,
            segundos: inputs[3].value,
            fc: inputs[4].value,
            peso: inputs[5].value,
            sexo: inputs[6].value
        };

        datos.push(registro);
    });

    console.log("Datos capturados:", datos);
    alert("Datos listos para cálculo (ver consola)");
}
