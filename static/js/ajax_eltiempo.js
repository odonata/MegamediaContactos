function llamarApiElTiempo(host,port,ciudad) {
            const url = `http://${host}:${port}/estadoDelClima?ciudad=${encodeURIComponent(ciudad)}`;
            console.timeLog(url);
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    const imagenDiv = document.getElementById('grafico');
                    imagenDiv.innerHTML = `<img src="data:image/png;base64,${data.imagen}" alt="Gráfico del Clima" />`;

                    const datos = data.datos;
                    const table = document.getElementById('datos-clima');
                    table.innerHTML = `
                        <tr><th>Temperatura</th><td>${datos.temperatura} °C</td></tr>
                        <tr><th>Temperatura Máxima</th><td>${datos.temperatura_maxima} °C</td></tr>
                        <tr><th>Temperatura Mínima</th><td>${datos.temperatura_minima} °C</td></tr>
                        <tr><th>Humedad</th><td>${datos.humedad} %</td></tr>
                        <tr><th>Presión</th><td>${datos.presion} hPa</td></tr>
                        <tr><th>Visibilidad</th><td>${datos.visibilidad} m</td></tr>
                        <tr><th>Estado del Clima</th><td>${datos.estado_clima}</td></tr>
                        <tr><th>Velocidad del Viento</th><td>${datos.velocidad_viento} m/s</td></tr>
                    `;
                })
                .catch(error => {
                    console.error('Error al obtener los datos del clima:', error);
                });
        }