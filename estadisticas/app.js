async function cargarAlumnos() {
    try {
        const response = await fetch('/.netlify/functions/obtenerAlumnos');
        return await response.json();
    } catch (e) {
        console.error(e);
        return [];
    }
}

function promedio(lista, campo) {
    if (lista.length === 0) return 0;
    const suma = lista.reduce((acc, item) => acc + (item[campo] || 0), 0);
    return (suma / lista.length).toFixed(2);
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
}

init();
