
function promedio(lista, campo) {
    const valoresValidos = lista
        .map(item => Number(item[campo]))
        .filter(v => !isNaN(v));

    if (valoresValidos.length === 0) return '0.00';

    const suma = valoresValidos.reduce((acc, v) => acc + v, 0);
    return (suma / valoresValidos.length).toFixed(2);
}

function filtrarPorSexo(alumnos, sexo) {
    return alumnos.filter(a =>
        a.sexo && a.sexo.toLowerCase().startsWith(sexo)
    );
}

function contarEdades(alumnos) {
    const edades = {};
    alumnos.forEach(a => {
        if (a.edad != null) {
            edades[a.edad] = (edades[a.edad] || 0) + 1;
        }
    });
    return edades;
}

async function init() {
    const alumnos = await cargarAlumnos();

    const hombres = filtrarPorSexo(alumnos, 'hombre');
    const mujeres = filtrarPorSexo(alumnos, 'mujer');

    // Promedios Rockport
    document.getElementById('rockportTotal').textContent =
        promedio(alumnos, 'rockport');

    document.getElementById('rockportHombres').textContent =
        promedio(hombres, 'rockport');

    document.getElementById('rockportMujeres').textContent =
        promedio(mujeres, 'rockport');

    // Promedios Tiempo
    document.getElementById('tiempoTotal').textContent =
        promedio(alumnos, 'tiempo');

    document.getElementById('tiempoHombres').textContent =
        promedio(hombres, 'tiempo');

    document.getElementById('tiempoMujeres').textContent =
        promedio(mujeres, 'tiempo');





    const tbody = document.getElementById('tablaAlumnos');
    tbody.innerHTML = '';

    alumnos.forEach(a => {
        if (a.rockport == null) return;

        const nivel = clasificarRockport(a.rockport, a.sexo);
        if (!nivel) return;

        const tr = document.createElement('tr');

        tr.innerHTML = `
        <td>${a.nombre} ${a.apellido_paterno}</td>
        <td class="${nivel}">${Number(a.rockport).toFixed(2)}</td>
    `;

        tbody.appendChild(tr);
    });



    // Gráfica pastel sexo
    new Chart(document.getElementById('graficaSexo'), {
        type: 'pie',
        data: {
            labels: ['Hombres', 'Mujeres'],
            datasets: [{
                data: [hombres.length, mujeres.length]
            }]
        }
    });

    // Gráfica barras edades
    const edades = contarEdades(alumnos);

    new Chart(document.getElementById('graficaEdad'), {
        type: 'bar',
        data: {
            labels: Object.keys(edades),
            datasets: [{
                label: 'Cantidad de alumnos',
                data: Object.values(edades)
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });





    const listaSinTest = document.getElementById('listaSinTest');

    // Filtrar alumnos sin información de test
    const alumnosSinTest = alumnos
        .filter(a => a.rockport == null || a.tiempo == null)
        .sort((a, b) => {
            const nombreA = `${a.nombre} ${a.apellido_paterno} ${a.apellido_materno || ''}`.toLowerCase();
            const nombreB = `${b.nombre} ${b.apellido_paterno} ${b.apellido_materno || ''}`.toLowerCase();
            return nombreA.localeCompare(nombreB);
        });

    // Mostrar lista
    if (alumnosSinTest.length === 0) {
        listaSinTest.innerHTML = '<li>Todos los alumnos tienen información completa </li>';
    } else {
        alumnosSinTest.forEach(a => {
            const li = document.createElement('li');
            li.innerHTML = `
            ${a.nombre} ${a.apellido_paterno} ${a.apellido_materno || ''}
            <span> (sin test)</span>
        `;
            listaSinTest.appendChild(li);
        });
    }

}

init();




function clasificarRockport(valor, sexo) {
    if (valor == null) return null;

    const v = Number(valor);
    const s = sexo.toLowerCase();

    if (s === 'h' || s === 'hombre' || s === 'masculino') {
        if (v < 41) return 'bajo';
        if (v <= 45) return 'regular';
        if (v <= 50) return 'bueno';
        if (v <= 55) return 'excelente';
        return 'superior';
    }

    if (s === 'm' || s === 'mujer' || s === 'femenino') {
        if (v < 35) return 'bajo';
        if (v <= 39) return 'regular';
        if (v <= 43) return 'bueno';
        if (v <= 49) return 'excelente';
        return 'superior';
    }

    return null;
}

