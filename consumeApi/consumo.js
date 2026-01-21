async function cargarAlumnos() {
    try {
        const response = await fetch('/.netlify/functions/obtenerAlumnos');
        const alumnos = await response.json();
        return alumnos
    } catch (e) {
        return []
    }
}

async function guardarResultados(id, edad, kg, tiempo, rockport) {
    const data = { id, edad, kg, tiempo, rockport };

    try {
        const res = await fetch('/.netlify/functions/actualizarAlumno', {
            method: 'POST',
            body: JSON.stringify(data)
        });

        const resultado = await res.json();

        if (!resultado.ok) {
            console.log(resultado.message || resultado.error);
        }
    } catch (e) {
        alert(e.message);
    }
}


