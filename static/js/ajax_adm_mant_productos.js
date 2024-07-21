console.log('inicio carga script');
var paginaActual;
var totalPaginas;
var glb_idProducto=0;
warn_id.addEventListener('mouseover', (event) => {
  event.target.style.pointerEvents = 'none';
});

//document.addEventListener("DOMContentLoaded", function() {
    // Añade un escuchador para el cambio en el input de tipo archivo
    document.getElementById("path_imagen_producto").addEventListener("change", function(event) {
        var reader = new FileReader();
        reader.onload = function(){
            var output = document.getElementById('vistaPreviaImagenProducto');
            output.src = reader.result;
            // Asegúrate de tener un elemento img con id="vistaPreviaImagen" en tu HTML donde se mostrará la vista previa
        };
        reader.readAsDataURL(event.target.files[0]);
    });
//});

$(document).ready(function() {
    getCategorias();

    // Manejador de clics para las opciones del menú
    $('.dropdown-content').on('click', 'a', function(e) {
        e.preventDefault(); // Prevenir la acción por defecto de los enlaces
        var idCategoria = $(this).data('id'); // Recuperar el id_categoria
        var nombreCategoria = $(this).text(); // Recuperar el nombre de la categoría
        var imagenSrc = $(this).find('img').attr('src'); // Recuperar el src de la imagen

        // Actualizar el contenedor con el nombre y la imagen de la categoría seleccionada
        $('#categoriaSeleccionada').html('<label id="nombreCategoria"> ' + nombreCategoria + '</label>&emsp;  <img id="vistaPreviaCategoria" src="' + imagenSrc + '" style="max-width: 100px; max-height: 100px;">');

        // Aquí puedes realizar acciones adicionales con el idCategoria, como asignarlo a un input oculto en un formulario
        document.getElementById('categoria').value=idCategoria;
    });
});


// llamar a guardar  el nuevo producto
function set_producto(tipoOperacion) {
    // Validaciones
    const descripcion = $('#descripcion').val();
    const valorUnitario = $('#valor_unitario').val();
    const imagenProducto = $('#path_imagen_producto')[0].files[0];
    const categoria = $('#categoria').val();

    if (!descripcion) {
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
    formData.append('descripcion', descripcion);
    formData.append('habilitado', $('#habilitado').is(':checked'));
    formData.append('valor_unitario', valorUnitario);
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
                    $('#descripcion').val('');
                    $('#valor_unitario').val('');
                    $('#path_imagen_producto').val('');
                    $('#categoria').val('');
                    $('#habilitado').prop('checked', false);
                    document.getElementById("vistaPreviaImagenProducto").src = '';
                    document.getElementById("vistaPreviaCategoria").src = '';
                    $('#categoriaSeleccionada').empty();
                    */
                    // getProductosCategorias(url_get_productos,1,'inicio',filtroBusqueda,'NORMAL');
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
    getProductosCategorias(url_get_productos,1,'inicio',filtroBusqueda,'NORMAL');

}

/* AJAX getProductosCategorias
*  Trae todas los productos
*  llamando a la vista : get_productos  de forma paginada
* */
function getProductosCategorias(pUrl,pagina,tipoCargaPagina,filtroBusquedatxt , tipoBusqueda) {
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
                // recuperar la imagen de categoria
                 $.ajax({
                    url: '/vista_de_imagen/categorias/' + resp.imagen_categoria, // Usa el nombre de la imagen como parámetro
                    async: false, // Hacer la llamada AJAX síncrona
                    success: function(base64Image_categoria) {
                        // Construir el elemento <img> en el HTML con la imagen en base64
                        imgElementCategoria = $('<img>').attr('src', 'data:image/png;base64,' + base64Image_categoria).css('width', '100px');
                    }
                });
                // recuperar la imagen de producto
                 $.ajax({
                    url: '/vista_de_imagen/productos/' + resp.path_imagen, // Usa el nombre de la imagen como parámetro
                    success: function(base64Image_producto) {
                        // Construir el elemento <img> en el HTML con la imagen en base64
                        imgElementProducto = $('<img>').attr('src', 'data:image/png;base64,' + base64Image_producto).css('width', '100px');
                        var habilitadoTexto = resp.habilitado ? 'Habilitado' : 'No Habilitado';
                        var fila = `<tr>
                            <td style="text-align: center;">${resp.descripcion}</td>
                            <td style="text-align: center;">${habilitadoTexto}</td>
                            <td style="text-align: center;">${imgElementProducto.prop('outerHTML')}</td>
                            <td style="text-align: center;">${imgElementCategoria.prop('outerHTML')}</td>
                            <td style="text-align: center;">${resp.valor_unitario}</td>
                            <td style="text-align: center;">${resp.descripcion}</td>
                            <td style="text-align: center;">${resp.nombre_categoria}</td>
                            <td style="text-align: center;"><button class="btn btn-outline-warning" onclick="modificarProducto(${resp.id_producto},'${resp.descripcion}',${resp.habilitado},${resp.valor_unitario},${resp.id_categoria},'${base64Image_producto}')">Modificar</button></td>
                            <td style="text-align: center;"><button class="btn btn-outline-danger" onclick="eliminarProducto(${resp.id_producto},'${resp.descripcion}')">Eliminar</button></td>
                        </tr>`;
                        tabla.append(fila);
                    }
                });

            });
        }
    });
}


function modificarProducto(id_producto, descripcion , habilitado , valor_unitario , id_categoria , base64Image_producto  ){
    getProductosCategorias(url_get_productos,1,'inicio',id_producto,'MODIFICACION');
     $('#botonGuardar').prop('disabled', true);
     $('#campoBusqueda').prop('disabled', true);
     $('#botonModificar').show();
     $('#botonCancelar').show();
     $('#botonLimpiar').hide();
     $('#descripcion').val(descripcion);
     $('#habilitado').prop('checked', habilitado);
     $('#valor_unitario').val(valor_unitario);
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
    $('#descripcion').val("");
    $('#habilitado').prop('checked', true);
    $('#valor_unitario').val("");
    $('#campoBusqueda').val("");
    document.getElementById("vistaPreviaImagenProducto").src = '';
    $('#categoriaSeleccionada').empty();
    glb_idProducto=0;
    getProductosCategorias(url_get_productos,1,'inicio','SINFILTROBUSQUEDA','NORMAL');
}

function getCategorias() {
    $.ajax({
        url: '/get_categorias_registradas/',
        dataType: 'json',
        success: function (data) {
            var lista = $('.dropdown-content');
            lista.empty();
            $.each(data, function (index, reg) {
                var option = $('<a id="categoria_'+reg.id_categoria+'" href="#" data-id="' + reg.id_categoria + '">').html('<img src="/static/imagenes/categorias/' + reg.imagen + '" style="height:20px;"> ' + reg.nombre_categoria);
                lista.append(option);
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
        getProductosCategorias(url_get_productos,1,'inicio',filtroBusqueda,'NORMAL');
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
            getProductosCategorias(url_get_productos,paginaActual,'paginando',filtroBusqueda,'NORMAL');
    });

function eliminarProducto(id_producto, descripcion) {
    var csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    titulo = `¿Eliminar Producto \n ${descripcion} , estás seguro?`;
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
            getProductosCategorias(url_get_productos,paginaActual,'paginando',filtroBusqueda,'NORMAL');
    });

document.getElementById("ultimaPagina").addEventListener("click", function() {
            getProductosCategorias(url_get_productos,paginaActual,'paginando',filtroBusqueda,'NORMAL');
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
       getProductosCategorias(url_get_productos,paginaActual,'paginando',filtroBusqueda,'NORMAL');

}

function salir(){
    window.top.location.href = '/mant_sistema';

}

console.log('cargo script');

