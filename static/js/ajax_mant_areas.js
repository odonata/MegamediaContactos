var paginaActual;
var totalPaginas;
var gbl_areaId = 0;
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
            getAreas(url_get_areas,1,'inicio',filtroBusqueda, 'NORMAL');
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
    getAreas(url_get_areas,1,'inicio',filtroBusqueda, 'NORMAL');

}

/* AJAX getAreas
*  Trae todas las areas registradas
*  llamando a la vista : getAreas  de forma paginada
* */
function getAreas(pUrl, pagina, tipoCargaPagina, filtroBusquedatxt, tipoBusqueda) {
    var PagTot = document.getElementById('PaginasTotales');
    var NumPag = document.getElementById('numeroPagina');
    var campoBusqueda = document.getElementById('campoBusqueda').value;
    NumPag.value = paginaActual;

    // Llamada AJAX para obtener los datos de los menús activos
    urlPagina = pUrl + "?page=" + pagina + "&filtroBusqueda=" + filtroBusquedatxt + "&campoBusqueda=" + campoBusqueda+"&tipoBusqueda="+tipoBusqueda;
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
                var fila = $('<tr>').attr('data-hidden-value', resp.id)
                    .append($('<td style="text-align: center;">').text(resp.nombre))
                    .append($('<td style="text-align: center;">').text(resp.creacion))
                    .append($('<td style="text-align: center;">').text(resp.fecha_actualizacion))
                    .append($('<td style="text-align: center;">').text(resp.usuario))
                    .append($('<td style="text-align: center;">').append($('<button>').addClass('btn btn-outline-warning').text('Modificar').click(function() {
                        modificarArea(resp.id,resp.nombre)})))
                    .append($('<td style="text-align: center;">').append($('<button>').addClass('btn btn-outline-danger').text('Eliminar').click(function() {
                        eliminarArea(resp.id,resp.nombre);
                    })));

                // Agregar la fila a la tabla
                tabla.append(fila);


            });
        }
    });
}

function modificarArea(area_id, nombre   ){
     getAreas(url_get_areas,1,'inicio', area_id, 'MODIFICACION');
     $('#botonGuardar').prop('disabled', true);
     $('#campoBusqueda').prop('disabled', true);
     $('#botonModificar').show();
     $('#botonCancelar').show();
     $('#botonLimpiar').hide();
     $('#categoria').val(nombre);
     gbl_areaId=area_id;
}

// llamar a guardar  el nuevo producto
function upd_area(tipoOperacion) {
    // Validaciones
    const nombre_area = $('#categoria').val();

    if (!nombre_area) {
        Swal.fire('Error', 'Debe agregar un nombre de area.', 'error');
        return;
    }

    // Preparar datos para el envío
    let formData = new FormData();
    formData.append('nombre_area', nombre_area);
    formData.append('area_id', gbl_areaId);
    rest_path='/upd_area/';


    // Envío AJAX
    $.ajax({
        url: rest_path, // URL del view de Django
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function(response) {
            if (response.resultado === 'Exito') {
                Swal.fire('¡Éxito!', response.mensaje, 'success').then(() => {
                    set_cancelar_area();
                });
            } else {
                // Si el resultado no es de éxito, mostrar mensaje de error
                Swal.fire('Error', response.mensaje, 'error');
            }
        },
        error: function(error) {
            Swal.fire('Error', 'Ocurrió un error al agregar el Área de Negocio.', 'error');
        }
    });
}

function set_cancelar_area(){
    totalPaginas               = 0;
    seleccionadoActual         = 0;
    $('#botonGuardar').prop('disabled', false);
    $('#botonModificar').hide();
    $('#botonCancelar').hide();
    $('#botonLimpiar').show();
    $('#campoBusqueda').prop('disabled', false);
    $('#categoria').val("");
    gbl_areaId=0;
    getAreas(url_get_areas,1,'inicio',filtroBusqueda,'NORMAL');
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
                            getAreas(url_get_areas, 1, 'inicio',filtroBusqueda,'NORMAL');
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
        getAreas(url_get_areas,1,'inicio',filtroBusqueda,'NORMAL');
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
            getAreas(url_get_areas,paginaActual,'paginando',filtroBusqueda,'NORMAL');
    });

document.getElementById("siguientePagina").addEventListener("click", function() {
            if(paginaActual<totalPaginas){
                paginaActual = paginaActual +1;
            }else{
                paginaActual = totalPaginas;
            }
            NumPag.value=paginaActual;
            getAreas(url_get_areas,paginaActual,'paginando',filtroBusqueda,'NORMAL');
    });

document.getElementById("ultimaPagina").addEventListener("click", function() {
            getAreas(url_get_areas,totalPaginas,'paginando',filtroBusqueda,'NORMAL');
            paginaActual=totalPaginas;
            NumPag.value=paginaActual;
    });

var NumPag          = document.getElementById('numeroPagina');
var PagTot          = document.getElementById('PaginasTotales');

NumPag.value=paginaActual;
PagTot.value=totalPaginas;

/* FIN AJAX Evento de manejo de botones para paginacion */



/* AJAX limpiar formulario*/
function limpiarFormulario() {
       paginaActual               = 1;
       totalPaginas               = 0;
       seleccionadoActual         = 0;
       document.getElementById("categoria").value = ''; // Limpia el input de nombre de categoría

       $('#campoBusqueda').val("");
       getAreas(url_get_areas,1,'inicio','SINFILTROBUSQUEDA','NORMAL');

}


function salir(){
window.top.location.href = '/';

}


function closeModal() {
    var modal = document.getElementById('modalResultado');
    modal.close();
}
