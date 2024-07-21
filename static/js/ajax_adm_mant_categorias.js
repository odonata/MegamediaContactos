var paginaActual;
var totalPaginas;

warn_id.addEventListener('mouseover', (event) => {
  event.target.style.pointerEvents = 'none';
});

//document.addEventListener("DOMContentLoaded", function() {
    //alert(1);
    // Añade un escuchador para el cambio en el input de tipo archivo
    document.getElementById("imagenCategoria").addEventListener("change", function(event) {
        var reader = new FileReader();
        reader.onload = function(){
            var output = document.getElementById('vistaPreviaImagen');
            output.src = reader.result;
            // Asegúrate de tener un elemento img con id="vistaPreviaImagen" en tu HTML donde se mostrará la vista previa
        };
        reader.readAsDataURL(event.target.files[0]);
    });
//});

function validarYGuardarCategoria() {
    var nombreCategoria = document.getElementById("categoria").value;
    var imagenCategoria = document.getElementById("imagenCategoria").files[0];

    if (!nombreCategoria || !imagenCategoria) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Por favor, indica un nombre y selecciona una imagen para la categoría.'
        });
        return false; // Detiene la ejecución adicional
    }

    // Si todo está correcto, llama a la función que realiza la solicitud de guardado
    guardarCategoria();
}

function guardarCategoria() {
    var formData = new FormData();
    var nombreCategoria = document.getElementById("categoria").value;
    var imagenCategoria = document.getElementById("imagenCategoria").files[0];

    formData.append('nombre_categoria', nombreCategoria);
    formData.append('imagen', imagenCategoria);

    // Asegúrate de actualizar la URL a la que apuntas en tu aplicación
    var url = '/set_categoria/'; // Cambia esto por la URL correcta de tu vista

    fetch(url, {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        if (data.resultado==='Éxito'){
            getCategorias(url_get_categorias,1,'inicio',filtroBusqueda);
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
    getCategorias(url_get_categorias,1,'inicio',filtroBusqueda);

}

/* AJAX getCategorias
*  Trae todas las categorias registradas
*  llamando a la vista : get_categorias  de forma paginada
* */
function getCategorias(pUrl, pagina, tipoCargaPagina, filtroBusquedatxt) {
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
                // Llamar a la vista de imagen para obtener la imagen en formato base64
                $.ajax({
                    url: '/vista_de_imagen/categorias/' + resp.imagen, // Usa el nombre de la imagen como parámetro
                    success: function(base64Image) {
                        // Construir el elemento <img> en el HTML con la imagen en base64
                        var imgElement = $('<img>').attr('src', 'data:image/png;base64,' + base64Image).css('width', '150px');

                        // Construir la fila de la tabla
                        var fila = $('<tr>').attr('data-hidden-value', resp.id_categoria)
                            .append($('<td style="text-align: center;">').text(resp.nombre_categoria))
                            .append($('<td style="text-align: center;">').append(imgElement))
                            .append($('<td style="text-align: center;">').append($('<button>').addClass('btn btn-outline-info').text('Ver imagen').click(function() {
                                verImagen( base64Image);
                            })))
                            .append($('<td style="text-align: center;">').append($('<button>').addClass('btn btn-outline-danger').text('Eliminar Categoría').click(function() {
                                eliminarCategoria(resp.id_categoria,resp.nombre_categoria);
                            })));

                        // Agregar la fila a la tabla
                        tabla.append(fila);
                    }
                });
            });
        }
    });
}


function eliminarCategoria(idCategoria , nomCategoria) {
    var csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    titulo = `¿Eliminar Categoría \n ${nomCategoria} , estás seguro?`;
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
                url: '/del_categoria/' + idCategoria, // Ajusta esta URL a tu configuración
                type: 'DELETE', // Utiliza el método HTTP adecuado
                headers: {
                    'X-CSRFToken': csrfToken
                },
                success: function(response) {
                    if (response.resultado === 'Éxito') {
                         Swal.fire('¡Éxito!', response.mensaje, 'success').then(() => {
                            // Limpiar y Recargar la lista de categorías
                            limpiarFormulario();
                            getCategorias(url_get_categorias, 1, 'inicio',filtroBusqueda);
                         });
                    }else{
                         Swal.fire('Error', response.mensaje, 'error');
                    }

                },
                error: function(xhr, status, error) {
                     Swal.fire('Error', "Al borrar categoria :"+status, 'error');

                }
            });
      }
    });


}


function verImagen(base64Image) {
   var img = $('<img>').attr('src', 'data:image/png;base64,' + base64Image).css('width', '300px');

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
    /*
    var imagen = document.createElement("img");
    imagen.src = src;
    imagen.style.maxWidth = "80%";
    imagen.style.maxHeight = "80%";
    imagen.style.margin = "auto";
    */
    // como imagene s un elemento jquery se debe acceder el primner elemento
    var imgElement = img.get(0);

    contenedorImagen.appendChild(imgElement);

    contenedorImagen.onclick = function() {
        document.body.removeChild(contenedorImagen);
    };

    document.body.appendChild(contenedorImagen);
}




/* AJAX Evento de manejo de botones para paginacion
*
* */
document.getElementById("inicioPagina").addEventListener("click", function() {
        getCategorias(url_get_categorias,1,'inicio',filtroBusqueda);
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
            getCategorias(url_get_categorias,paginaActual,'paginando',filtroBusqueda);
    });

document.getElementById("siguientePagina").addEventListener("click", function() {
            if(paginaActual<totalPaginas){
                paginaActual = paginaActual +1;
            }else{
                paginaActual = totalPaginas;
            }
            NumPag.value=paginaActual;
            getCategorias(url_get_categorias,paginaActual,'paginando',filtroBusqueda);
    });

document.getElementById("ultimaPagina").addEventListener("click", function() {
            getCategorias(url_get_categorias,totalPaginas,'paginando',filtroBusqueda);
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
       document.getElementById("imagenCategoria").value = ''; // Limpia el input del archivo
       document.getElementById("vistaPreviaImagen").src = ''; // Opcional: Limpia la vista previa de la imagen
       $('#campoBusqueda').val("");
       getCategorias(url_get_categorias,1,'inicio','SINFILTROBUSQUEDA');

}


function salir(){
window.top.location.href = '/mant_sistema';

}



/* Javascript para manejo de mensajes ventana modal*/

function openModal(type,mensaje) {
    var modal = document.getElementById('modalResultado');
    var estadoResultado = document.getElementById('estadoResultado_id');
    var estadoResultadoMensaje = document.getElementById('estadoResultadoMensaje_id');
    estadoResultado.value = type;
    estadoResultadoMensaje.value= mensaje;
    modal.show();
}

function openModalCamposError(camposError){
    var modal = document.getElementById('modalResultado');
    var estadoResultado = document.getElementById('estadoResultado_id'); ;
    var estadoResultadoMensaje = document.getElementById('estadoResultadoMensaje_id');
    estadoResultado.value = "Error";
    estadoResultadoMensaje.value= camposError;
    modal.show();
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