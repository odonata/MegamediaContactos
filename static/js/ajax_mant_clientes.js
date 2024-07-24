console.log('inicio carga script');
var paginaActual;
var totalPaginas;
var glb_clienteId=0;
warn_id.addEventListener('mouseover', (event) => {
  event.target.style.pointerEvents = 'none';
});



$(document).ready(function() {
    getAreas();


});

// Función para validar el formato del correo electrónico
function validarEmail(email) {
    // Expresión regular para validar el formato del correo electrónico
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return regex.test(email);
}

// llamar a guardar  el nuevo producto
function set_cliente(tipoOperacion) {
    // Validaciones
    const nombre_cliente = $('#nombre_cliente');
    const email_contacto = $('#email_contacto');
    const fono_contacto = $('#fono_contacto');
    const lista_areas = $('#lista_areas');
    if (!nombre_cliente.val()) {
        Swal.fire('Error', 'Debe agregar un nombre de cliente.', 'error');
        return;
    }
    if (!validarEmail(email_contacto.val())) {
        Swal.fire('Error', 'Debe tener un formato de correo electrónico', 'error');
        return;
    }
    if(!fono_contacto.val()){
       Swal.fire('Error', 'Debe ingresar un numero de telefono', 'error');
        return;

    }
    if (!lista_areas.val() || isNaN(lista_areas.val())) {
        Swal.fire('Error', 'Debe seleccionar un área de negocio para el cliente.', 'error');
        return;
    }

    // Preparar datos para el envío
    let formData = new FormData();
    formData.append('nombre_cliente', nombre_cliente.val());
    formData.append('email_contacto', email_contacto.val());
    formData.append('fono_contacto', fono_contacto.val());
    formData.append('lista_areas', lista_areas.val());

    if(tipoOperacion=="NUEVO"){
        rest_path='/set_cliente/';
    }else{
        rest_path='/upd_cliente/';
        formData.append('cliente_id', glb_clienteId);
    }
    console.log(rest_path);
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
                    set_cancelar();
                });
            } else {
                // Si el resultado no es de éxito, mostrar mensaje de error
                Swal.fire('Error', response.mensaje, 'error');
            }
        },
        error: function(error) {
            Swal.fire('Error', 'Ocurrió un error al agregar el Cliente.', 'error');
        }
    });
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        buscarProductos();
    }
}

function buscarProductos(){
    filtroBusqueda='FILTRO';
    getClientesArea(url_get_clientes,1,'inicio',filtroBusqueda,'NORMAL');

}

/* AJAX getClientesArea
*  Trae todas los productos
*  llamando a la vista : get_productos  de forma paginada
* */
function getClientesArea(pUrl,pagina,tipoCargaPagina,filtroBusquedatxt , tipoBusqueda) {
    var PagTot          = document.getElementById('PaginasTotales');
    var NumPag          = document.getElementById('numeroPagina');
    var campoBusqueda          = document.getElementById('campoBusqueda').value;
    var imgElementCategoria;
    var imgElementProducto;
    NumPag.value=paginaActual;
    // Llamada AJAX para obtener los datos de los menús activos
    urlPagina = pUrl+"?page="+pagina+"&filtroBusqueda="+filtroBusquedatxt+"&campoBusqueda="+campoBusqueda+"&tipoBusqueda="+tipoBusqueda;
    $.ajax({
        url: urlPagina,
        async: false, // Hacer la llamada AJAX síncrona
        dataType: 'json',
        success: function (data) {
            // Parsear el objeto JSON devuelto
            var count = data.count;
            var next = data.next;
            var previous = data.previous;
            var results = data.results;
            var numeroPagina = data.numero_pagina;
            totalPaginas = data.total_paginas;
            PagTot.value=totalPaginas;
            // Llenar la tabla con los datos obtenidos
            var tabla = $('#items-table tbody');
            tabla.empty(); // Limpiar la tabla antes de agregar nuevos datos

            $.each(results, function (index, resp) {
                var fila = `<tr>
                <td style="text-align: center;">${resp.nombre_cliente}</td>
                <td style="text-align: center;">${resp.nombre_area}</td>
                <td style="text-align: center;">${resp.email_contacto}</td>
                <td style="text-align: center;">${resp.fono_contacto}</td>
                <td style="text-align: center;"><button class="btn btn-outline-warning" onclick="modificarCliente(${resp.cliente_id},'${resp.nombre_cliente}','${resp.email_contacto}',${resp.area_id},'${resp.fono_contacto}')">Modificar</button></td>
                <td style="text-align: center;"><button class="btn btn-outline-danger" onclick="eliminarCliente(${resp.cliente_id},'${resp.nombre_cliente}')">Eliminar</button></td>
                </tr>`;
                tabla.append(fila);
            });
        }
    });
}

function modificarCliente(cliente_id, nombre_cliente   , email_contacto , area_id, fono_contacto  ){
    getClientesArea(url_get_clientes,1,'inicio',cliente_id,'MODIFICACION');
     $('#botonGuardar').prop('disabled', true);
     $('#campoBusqueda').prop('disabled', true);
     $('#botonModificar').show();
     $('#botonCancelar').show();
     $('#botonLimpiar').hide();
     $('#nombre_cliente').val(nombre_cliente);
     $('#email_contacto').val(email_contacto);
     $('#fono_contacto').val(fono_contacto);
     $('#lista_areas').val(String(area_id))
     glb_clienteId=cliente_id;
}

function set_cancelar(){
    totalPaginas               = 0;
    seleccionadoActual         = 0;
    $('#botonGuardar').prop('disabled', false);
    $('#botonModificar').hide();
    $('#botonCancelar').hide();
    $('#botonLimpiar').show();
    $('#campoBusqueda').prop('disabled', false);
    $('#categoria').val("");
    $('#email_contacto').val("");
    $('#fono_contacto').val("");
    $('#campoBusqueda').val("");
    $('#lista_area').empty();
    glb_clienteId=0;
    getClientesArea(url_get_clientes,1,'inicio','SINFILTROBUSQUEDA','NORMAL');
}

function getAreas() {
    $.ajax({
        url: '/get_areas_registradas/',
        dataType: 'json',
        success: function (data) {
            var lista = $('#lista_areas');
            lista.empty();
            $.each(data, function (index, reg) {
                console.log(reg.id_area);
                lista.append('<option value="' + reg.id + '">' + reg.nombre + '</option>');
            });
        }
    });
}

/* AJAX Evento de manejo de botones para paginacion
*
* */
document.getElementById("inicioPagina").addEventListener("click", function() {
        getClientesArea(url_get_clientes,1,'inicio',filtroBusqueda,'NORMAL');
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
            getClientesArea(url_get_clientes,paginaActual,'paginando',filtroBusqueda,'NORMAL');
    });

function eliminarCliente(cliente_id, nombre_cliente) {
    var csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    titulo = `¿Eliminar Producto \n ${nombre_cliente} , estás seguro?`;
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
                url: '/del_cliente/' + cliente_id, // Ajusta esta URL a tu configuración
                type: 'DELETE', // Utiliza el método HTTP adecuado
                headers: {
                    'X-CSRFToken': csrfToken
                },
                success: function(response) {

                    if (response.resultado === 'Exito') {
                         Swal.fire('¡Éxito!', response.mensaje, 'success').then(() => {
                            // Limpiar Recargar la lista de productos
                            set_cancelar(); // se utiliza para limpiar
                         });
                    }else{
                         Swal.fire('Error', response.mensaje, 'error');
                    }
                },
                error: function(xhr, status, error) {
                    Swal.fire('Error', "Al borrar Cliente :"+status, 'error');
                }
            });
      }
    });


}

document.getElementById("siguientePagina").addEventListener("click", function() {
            if(paginaActual<totalPaginas){
                paginaActual = paginaActual +1;
            }else{
                paginaActual = totalPaginas;
            }
            NumPag.value=paginaActual;
            getClientesArea(url_get_clientes,paginaActual,'paginando',filtroBusqueda,'NORMAL');
    });

document.getElementById("ultimaPagina").addEventListener("click", function() {
            getClientesArea(url_get_clientes,paginaActual,'paginando',filtroBusqueda,'NORMAL');
            paginaActual=totalPaginas;
            NumPag.value=paginaActual;
    });

var NumPag          = document.getElementById('numeroPagina');
var PagTot          = document.getElementById('PaginasTotales');

NumPag.value=paginaActual;
PagTot.value=totalPaginas;

/* FIN AJAX Evento de manejo de botones para paginacion */




function limpiarFormulario() {
       paginaActual               = 1;
       totalPaginas               = 0;
       seleccionadoActual         = 0;
       document.getElementById("categoria").value = ''; // Limpia el input de nombre de categoría
       document.getElementById("imagenCategoria").value = ''; // Limpia el input del archivo
       document.getElementById("vistaPreviaImagen").src = ''; // Opcional: Limpia la vista previa de la imagen
       getClientesArea(url_get_clientes,paginaActual,'paginando',filtroBusqueda,'NORMAL');

}

function salir(){
    window.top.location.href = '/';

}

console.log('cargo script');

