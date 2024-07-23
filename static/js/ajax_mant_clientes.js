console.log('inicio carga script');
var paginaActual;
var totalPaginas;
var glb_idProducto=0;
warn_id.addEventListener('mouseover', (event) => {
  event.target.style.pointerEvents = 'none';
});



$(document).ready(function() {
    getAreas();


});


// llamar a guardar  el nuevo producto
function set_producto(tipoOperacion) {
    // Validaciones
    const nombre_cliente = $('#nombre_cliente').val();
    const valorUnitario = $('#email_contacto').val();
    const imagenProducto = $('#path_imagen_producto')[0].files[0];
    const categoria = $('#categoria').val();

    if (!nombre_cliente) {
        Swal.fire('Error', 'Debe agregar una descripción.', 'error');
        return;
    }
    if (!valorUnitario || isNaN(valorUnitario) || parseInt(valorUnitario) <= 0) {
        Swal.fire('Error', 'El valor debe ser numérico y mayor a cero.', 'error');
        return;
    }
    if(glb_idProducto==0){
        if (!imagenProducto || !(imagenProducto.type === 'image/png' || imagenProducto.type === 'image/jpeg')) {
            Swal.fire('Error', 'Debe agregar una imagen del producto en formato PNG o JPG.', 'error');
        return;
        }
    }
    if (!categoria || isNaN(categoria)) {
        Swal.fire('Error', 'Debe seleccionar una categoría para el producto.', 'error');
        return;
    }

    // Preparar datos para el envío
    let formData = new FormData();
    formData.append('nombre_cliente', nombre_cliente);
    formData.append('habilitado', $('#habilitado').is(':checked'));
    formData.append('email_contacto', valorUnitario);
    formData.append('imagenProducto', imagenProducto);
    formData.append('categoria', categoria);
    formData.append('tipo_prod_promo', 'PRODUCTO');

    if(tipoOperacion=="NUEVO"){
        rest_path='/set_producto/';
    }else{
        rest_path='/upd_producto/';
        formData.append('id_producto', glb_idProducto);
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
            if (response.resultado === 'Éxito') {
                Swal.fire('¡Éxito!', response.mensaje, 'success').then(() => {
                    // Limpiar formulario
                    /*
                    $('#nombre_cliente').val('');
                    $('#email_contacto').val('');
                    $('#path_imagen_producto').val('');
                    $('#categoria').val('');
                    $('#habilitado').prop('checked', false);
                    document.getElementById("vistaPreviaImagenProducto").src = '';
                    document.getElementById("vistaPreviaCategoria").src = '';
                    $('#categoriaSeleccionada').empty();
                    */
                    // getClientesArea(url_get_clientes,1,'inicio',filtroBusqueda,'NORMAL');
                    set_cancelar();
                });
            } else {
                // Si el resultado no es de éxito, mostrar mensaje de error
                Swal.fire('Error', response.mensaje, 'error');
            }
        },
        error: function(error) {
            Swal.fire('Error', 'Ocurrió un error al agregar el producto.', 'error');
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
                <td style="text-align: center;"><button class="btn btn-outline-warning" onclick="modificarCliente(${resp.cliente_id},'${resp.nombre_cliente}','${resp.email_contacto}',${resp.area_id},'${resp.fono_contacto}','${resp.email_contacto}')">Modificar</button></td>
                <td style="text-align: center;"><button class="btn btn-outline-danger" onclick="eliminarCliente(${resp.cliente_id},'${resp.nombre_cliente}')">Eliminar</button></td>
                </tr>`;
                tabla.append(fila);
            });
        }
    });
}


function modificarCliente(id_producto, nombre_cliente , habilitado , email_contacto , id_categoria , base64Image_producto  ){
    getClientesArea(url_get_clientes,1,'inicio',id_producto,'MODIFICACION');
     $('#botonGuardar').prop('disabled', true);
     $('#campoBusqueda').prop('disabled', true);
     $('#botonModificar').show();
     $('#botonCancelar').show();
     $('#botonLimpiar').hide();
     $('#nombre_cliente').val(nombre_cliente);
     $('#habilitado').prop('checked', habilitado);
     $('#email_contacto').val(email_contacto);
     $('#categoria_'+id_categoria).click();
     var base64Image = "data:image/png;base64," + base64Image_producto;
     $('#vistaPreviaImagenProducto').attr('src', base64Image);
     glb_idProducto=id_producto;
}

function set_cancelar(){
    totalPaginas               = 0;
    seleccionadoActual         = 0;
    $('#botonGuardar').prop('disabled', false);
    $('#botonModificar').hide();
    $('#botonCancelar').hide();
    $('#botonLimpiar').show();
    $('#campoBusqueda').prop('disabled', false);
    $('#nombre_cliente').val("");
    $('#habilitado').prop('checked', true);
    $('#email_contacto').val("");
    $('#campoBusqueda').val("");
    document.getElementById("vistaPreviaImagenProducto").src = '';
    $('#categoriaSeleccionada').empty();
    glb_idProducto=0;
    getClientesArea(url_get_clientes,1,'inicio','SINFILTROBUSQUEDA','NORMAL');
}

function getAreas() {
    $.ajax({
        url: '/get_areas_registradas/',
        dataType: 'json',
        success: function (data) {
            var lista = $('#lista-areas');
            lista.empty();
            $.each(data, function (index, reg) {
                console.log(reg.id_area);
                lista.append('<option value="' + reg.id + '">' + reg.nombre + '</option>');
            });
        }
    });
}



function verImagen(src) {
    var contenedorImagen = document.createElement("div");
    contenedorImagen.id = "contenedorImagen";
    contenedorImagen.style.position = "fixed";
    contenedorImagen.style.top = "0";
    contenedorImagen.style.left = "0";
    contenedorImagen.style.width = "100vw";
    contenedorImagen.style.height = "100vh";
    contenedorImagen.style.display = "flex";
    contenedorImagen.style.justifyContent = "center";
    contenedorImagen.style.alignItems = "center";
    contenedorImagen.style.backgroundColor = "rgba(0,0,0,0.5)";

    var imagen = document.createElement("img");
    imagen.src = src;
    imagen.style.maxWidth = "80%";
    imagen.style.maxHeight = "80%";
    imagen.style.margin = "auto";

    contenedorImagen.appendChild(imagen);

    contenedorImagen.onclick = function() {
        document.body.removeChild(contenedorImagen);
    };

    document.body.appendChild(contenedorImagen);
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

function eliminarCliente(id_producto, nombre_cliente) {
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
                url: '/del_producto/' + id_producto, // Ajusta esta URL a tu configuración
                type: 'DELETE', // Utiliza el método HTTP adecuado
                headers: {
                    'X-CSRFToken': csrfToken
                },
                success: function(response) {

                    if (response.resultado === 'Éxito') {
                         Swal.fire('¡Éxito!', response.mensaje, 'success').then(() => {
                            // Limpiar Recargar la lista de productos
                            set_cancelar(); // se utiliza para limpiar
                         });
                    }else{
                         Swal.fire('Error', response.mensaje, 'error');
                    }
                },
                error: function(xhr, status, error) {
                    Swal.fire('Error', "Al borrar Producto :"+status, 'error');
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

