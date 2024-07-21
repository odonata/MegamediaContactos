 function cerrarPos() {
        Swal.fire({
            title: 'Cerrando el POS',
            text: 'Espere un momento por favor...',
            allowOutsideClick: false,
            showConfirmButton: false,
            onBeforeOpen: () => {
                Swal.showLoading();
            }
        });
        // Realiza la llamada a la vista correspondiente en Django
        fetch('/close_pos/')
            .then(response => response.json())
            .then(data => {
                Swal.close();
                // Actualiza el contenido del textarea con el JSON formateado
                document.getElementById('cerrarPosOutput').value = JSON.stringify(data, null, 4);
            })
            .catch(error => {
                // Mostrar un mensaje de error si ocurre un error en la consulta
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al cerrar el POS. Por favor, inténtalo de nuevo más tarde.'
                });
            });
    }

    function cargarLlavesPos() {
        Swal.fire({
            title: 'Cargando llaves POS',
            text: 'Espere un momento por favor...',
            allowOutsideClick: false,
            showConfirmButton: false,
            onBeforeOpen: () => {
                Swal.showLoading();
            }
        });
        // Realiza la llamada a la vista correspondiente en Django
        fetch('/load_keys/')
            .then(response => response.json())
            .then(data => {
                Swal.close();
                // Actualiza el contenido del textarea con el JSON formateado
                document.getElementById('cargarLlavesPosOutput').value = JSON.stringify(data, null, 4);
            })
            .catch(error => {
                // Mostrar un mensaje de error si ocurre un error en la consulta
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al cargar las llaves POS. Por favor, inténtalo de nuevo más tarde.'
                });
            });
    }

    function pollPos() {
        Swal.fire({
            title: 'Llamando a POLL POS',
            text: 'Espere un momento por favor...',
            allowOutsideClick: false,
            showConfirmButton: false,
            onBeforeOpen: () => {
                Swal.showLoading();
            }
        });
        // Realiza la llamada a la vista correspondiente en Django
        fetch('/poll_pos/')
            .then(response => response.json())
            .then(data => {
                Swal.close();
                // Actualiza el contenido del textarea con el JSON formateado
                document.getElementById('cerrarPosOutput').value = JSON.stringify(data, null, 4);
            })
            .catch(error => {
                // Mostrar un mensaje de error si ocurre un error en la consulta
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al llamar POS. Por favor, inténtalo de nuevo más tarde.'
                });
            });
    }

function ultimaVenta() {
        Swal.fire({
            title: 'Cargarndo Ultima Venta',
            text: 'Espere un momento por favor...',
            allowOutsideClick: false,
            showConfirmButton: false,
            onBeforeOpen: () => {
                Swal.showLoading();
            }
        });
        // Realiza la llamada a la vista correspondiente en Django
        fetch('/last_sale/')
            .then(response => response.json())
            .then(data => {
                Swal.close();
                // Actualiza el contenido del textarea con el JSON formateado
                document.getElementById('cargarLlavesPosOutput').value = JSON.stringify(data, null, 4);
            })
            .catch(error => {
                // Mostrar un mensaje de error si ocurre un error en la consulta
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al llamar la Ultima Venta. Por favor, inténtalo de nuevo más tarde.'
                });
            });
    }

function resetConnectionPos(){
     Swal.fire({
            title: 'Reiniciando Conección al POS',
            text: 'Espere un momento por favor...',
            allowOutsideClick: false,
            showConfirmButton: false,
            onBeforeOpen: () => {
                Swal.showLoading();
            }
        });
        // Realiza la llamada a la vista correspondiente en Django
        fetch('/resetConnectionPos/')
            .then(response => response.json())
            .then(data => {
                Swal.close();
                // Actualiza el contenido del textarea con el JSON formateado
                document.getElementById('cerrarPosOutput').value = JSON.stringify(data, null, 4);
            })
            .catch(error => {
                // Mostrar un mensaje de error si ocurre un error en la consulta
                Swal.fire({
                    icon: 'success',
                    title: 'EXITO',
                    text: 'El Servicio POS se ha reiniciado de forma exitosa.'
                });
            });
}

function totalesVenta() {
        Swal.fire({
            title: 'Cargarndo Totales Venta',
            text: 'Espere un momento por favor...',
            allowOutsideClick: false,
            showConfirmButton: false,
            onBeforeOpen: () => {
                Swal.showLoading();
            }
        });
        // Realiza la llamada a la vista correspondiente en Django
        fetch('/totals/')
            .then(response => response.json())
            .then(data => {
                Swal.close();
                // Actualiza el contenido del textarea con el JSON formateado
                document.getElementById('cargarLlavesPosOutput').value = JSON.stringify(data, null, 4);
            })
            .catch(error => {
                // Mostrar un mensaje de error si ocurre un error en la consulta
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al llamar la Totales Venta. Por favor, inténtalo de nuevo más tarde.'
                });
            });
}


function salir(){
    window.top.location.href = '/mant_sistema';

}

 function limpiarClosePos() {
    document.getElementById('cerrarPosOutput').value = ''; // Limpia el contenido del textarea
}

function limpiarLoadKeys() {
    document.getElementById('cargarLlavesPosOutput').value = ''; // Limpia el contenido del textarea
}

function checkServiceStatus() {
    $.ajax({
        url: '/serviceIsAlive/',
        type: 'GET',
        success: function(response) {
            if ('0' in response) {
                // El servicio está en línea
                $('#service-status').html('Servicio POS en Línea').css('color', 'green');
            } else if ('1' in response) {
                // El servicio no está en línea
                $('#service-status').html('Servicio POS no está en Línea').css('color', 'red');
            }
        },
        error: function(error) {
            console.log('Error al verificar el estado del servicio:', error);
        }
    });
}

// Llama a la función checkServiceStatus cada 5 segundos
setInterval(checkServiceStatus, 5000);

