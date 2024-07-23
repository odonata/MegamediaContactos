var paginaActual;
var totalPaginas;

warn_id.addEventListener('mouseover', (event) => {
  event.target.style.pointerEvents = 'none';
});

function validarYGuardar() {
    var nombre = document.getElementById("categoria").value;

    if (!nombre ) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Por favor, indica un nombre de área '
        });
        return false; // Detiene la ejecución adicional
    }

    // Si todo está correcto, llama a la función que realiza la solicitud de guardado
    guardarArea();
}

function guardarArea() {
    var formData = new FormData();
    var nombreArea = document.getElementById("categoria").value;

    formData.append('nombre_area', nombreArea);

    var url = '/set_area/';

    fetch(url, {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        if (data.resultado==='Exito'){
            Swal.fire('Exito', data.mensaje, 'Exito');
            getAreas(url_get_areas,1,'inicio',filtroBusqueda);
            limpiarFormulario();
        }else{
            // Si el resultado no es de éxito, mostrar mensaje de error
            Swal.fire('Error', data.mensaje, 'error');
        }
    })
    .catch((error) => {
        console.error('Error:', error); // Manejar el error
    });
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        buscarCategorias();
    }
}

function buscarCategorias(){
    filtroBusqueda='FILTRO';
    getAreas(url_get_areas,1,'inicio',filtroBusqueda);

}

/* AJAX getAreas
*  Trae todas las areas registradas
*  llamando a la vista : getAreas  de forma paginada
* */
function getAreas(pUrl, pagina, tipoCargaPagina, filtroBusquedatxt) {
    var PagTot = document.getElementById('PaginasTotales');
    var NumPag = document.getElementById('numeroPagina');
    var campoBusqueda = document.getElementById('campoBusqueda').value;

    NumPag.value = paginaActual;

    // Llamada AJAX para obtener los datos de los menús activos
    urlPagina = pUrl + "?page=" + pagina + "&filtroBusqueda=" + filtroBusquedatxt + "&campoBusqueda=" + campoBusqueda;
    $.ajax({
        url: urlPagina,
        dataType: 'json',
        success: function(data) {
            // Parsear el objeto JSON devuelto
            var count = data.count;
            var next = data.next;
            var previous = data.previous;
            var results = data.results;
            var numeroPagina = data.numero_pagina;
            totalPaginas = data.total_paginas;
            PagTot.value = totalPaginas;

            // Llenar la tabla con los datos obtenidos
            var tabla = $('#items-table tbody');
            tabla.empty(); // Limpiar la tabla antes de agregar nuevos datos
            $.each(results, function(index, resp) {
                // Construir la fila de la tabla
                var fila = $('<tr>').attr('data-hidden-value', resp.id_categoria)
                    .append($('<td style="text-align: center;">').text(resp.nombre))
                    .append($('<td style="text-align: center;">').text(resp.creacion))
                    .append($('<td style="text-align: center;">').text(resp.fecha_actualizacion))
                    .append($('<td style="text-align: center;">').text(resp.usuario))
                    .append($('<td style="text-align: center;">').append($('<button>').addClass('btn btn-outline-danger').text('Eliminar Categoría').click(function() {
                        eliminarArea(resp.id,resp.nombre);
                    })));

                // Agregar la fila a la tabla
                tabla.append(fila);


            });
        }
    });
}


function eliminarArea(idArea , nomCategoria) {
    var csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    titulo = `¿Eliminar Área de Negocio \n ${nomCategoria} , estás seguro?`;
    Swal.fire({
      title: titulo,
      text: "No podrá revertir esto.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo!'
    }).then((result) => {
      if (result.isConfirmed) {
            $.ajax({
                url: '/del_area/' + idArea, // Ajusta esta URL a tu configuración
                type: 'DELETE', // Utiliza el método HTTP adecuado
                headers: {
                    'X-CSRFToken': csrfToken
                },
                success: function(response) {
                    if (response.resultado === 'Exito') {
                         Swal.fire('¡Éxito!', response.mensaje, 'success').then(() => {
                            // Limpiar y Recargar la lista de categorías
                            limpiarFormulario();
                            getAreas(url_get_areas, 1, 'inicio',filtroBusqueda);
                         });
                    }else{
                         Swal.fire('Error', response.mensaje, 'error');
                    }

                },
                error: function(xhr, status, error) {
                     Swal.fire('Error', "Al borrar Área de Negocio :"+status, 'error');

                }
            });
      }
    });


}




/* AJAX Evento de manejo de botones para paginacion
*
* */
document.getElementById("inicioPagina").addEventListener("click", function() {
        getAreas(url_get_areas,1,'inicio',filtroBusqueda);
        paginaActual=1;
        NumPag.value=paginaActual;
    });

document.getElementById("anteriorPagina").addEventListener("click", function() {
            if(paginaActual>1){
                paginaActual = paginaActual -1;
            }else{
                paginaActual = 1;
            }
            NumPag.value=paginaActual;
            getAreas(url_get_areas,paginaActual,'paginando',filtroBusqueda);
    });

document.getElementById("siguientePagina").addEventListener("click", function() {
            if(paginaActual<totalPaginas){
                paginaActual = paginaActual +1;
            }else{
                paginaActual = totalPaginas;
            }
            NumPag.value=paginaActual;
            getAreas(url_get_areas,paginaActual,'paginando',filtroBusqueda);
    });

document.getElementById("ultimaPagina").addEventListener("click", function() {
            getAreas(url_get_areas,totalPaginas,'paginando',filtroBusqueda);
            paginaActual=totalPaginas;
            NumPag.value=paginaActual;
    });

var NumPag          = document.getElementById('numeroPagina');
var PagTot          = document.getElementById('PaginasTotales');

NumPag.value=paginaActual;
PagTot.value=totalPaginas;

/* FIN AJAX Evento de manejo de botones para paginacion */



/* AJAX limpiar formulario*/

function limpiarCampoWarnings(){
    var camposInvalidos = document.getElementById('warn_id');
    camposInvalidos.value='';
    camposInvalidos.rows=1;
}
function limpiarFormulario() {
       paginaActual               = 1;
       totalPaginas               = 0;
       seleccionadoActual         = 0;
       document.getElementById("categoria").value = ''; // Limpia el input de nombre de categoría

       $('#campoBusqueda').val("");
       getAreas(url_get_areas,1,'inicio','SINFILTROBUSQUEDA');

}


function salir(){
window.top.location.href = '/';

}





function closeModal() {
    var modal = document.getElementById('modalResultado');
    modal.close();
}
/** para validaciones de formulario **/
function validarCamposVacio() {
    var cargo = document.getElementById('cargo_id').value.trim();


    var mensaje ='';
    var salida = 'V';
    lineas=0;
    // Verificar si el nombre está vacío
    if (cargo == '' || /^\s+$/.test(cargo)) {
        mensaje='El campo nombre de cargo  no puede estar vacío o solo espacios en blanco';
        salida= 'F';
        lineas++;
    }


    var respuesta = {
        salida: salida,
        mensaje: mensaje,
        tlineas: lineas
    };
    var respuestaJson=JSON.stringify(respuesta);
    return respuestaJson;
}