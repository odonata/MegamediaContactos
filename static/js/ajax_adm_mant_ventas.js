var NumPag          = document.getElementById('numeroPagina');
var PagTot          = document.getElementById('PaginasTotales');
var totalPaginas   = 0;
var currentPage = 1;  // Variable global para almacenar la página actual

/* AJAX getTotems
*  Trae todos los totems registrados del Local
* */
function getTotems() {
    // Llamada AJAX para obtener los datos de los cargos
    var list = $('#lista-totems');
    var id_totem ;
    $.ajax({
        url: '/get_totems/',
        dataType: 'json',
        async: false,
        success: function (data) {
            // Llenar el listbox con los datos obtenidos
            list.empty();
            list.append('<option value="0">TODOS</option>');
            $.each(data, function (index, row) {
                list.append('<option value="' + row.id_totem + '">' + row.nombre_totem + '</option>');
            });

        }

    });
}


function cargarVentas() {
    var id_totem    = $('#lista-totems').val();
    var rut_cliente = 77190764;
    var fecha_desde = $('#fechaInicio').val();
    var fecha_hasta = $('#fechaFin').val();

    // Llamar al view con los parámetros
    $.ajax({
        url: '/obtener_ventas_con_detalle/',
        method: 'GET',
        data: {
            rut_cliente: rut_cliente,
            id_totem: id_totem,
            fecha_desde: fecha_desde,
            fecha_hasta: fecha_hasta,
            page: currentPage  // Enviar la página actual al view
        },
        success: function(response) {
            var ventas      = response.data;
            totalPaginas    = response.total_pages;
            PagTot.value    = totalPaginas;
            NumPag.value    = currentPage;
            var fila = "";
            var tabla = $('#items-table tbody');
            tabla.empty(); // Limpiar la tabla antes de agregar nuevos datos
            ventas.forEach(function(venta) {
                fila += '<tr>';
                fila += '<td style="text-align: center;">' + venta.id_venta + '</td>';
                fila += '<td style="text-align: center;">' + venta.rut_cliente + '</td>';
                fila += '<td style="text-align: center;">' + venta.id_totem + '</td>';
                fila += '<td style="text-align: center;">' + venta.nombre_sucursal + '</td>';
                fila += '<td style="text-align: center;">' + venta.fecha_venta + '</td>';
                fila += '<td style="text-align: center;">' + venta.total_venta + '</td>';
                fila += '<td style="text-align: center;">' + venta.id_detalle_venta + '</td>';
                fila += '<td style="text-align: center;">' + venta.descripcion + '</td>';
                fila += '<td style="text-align: center;">' + venta.nombre_categoria + '</td>';
                fila += '<td style="text-align: center;">' + venta.cantidad_vendida + '</td>';
                fila += '<td style="text-align: center;">' + venta.json_respuesta_pos + '</td>';
                fila += '</tr>';
            });
            tabla.append(fila);
        },
        error: function(xhr, status, error) {
            console.error('Error al cargar las ventas:', error);
        }
    });
}




function descargarCSV() {
    // Obtener los parámetros necesarios para llamar a la función desde Django
    var id_totem    = $('#lista-totems').val();
    var rut_cliente = 77190764;
    var fecha_desde = $('#fechaInicio').val();
    var fecha_hasta = $('#fechaFin').val();

    // Hacer la llamada a la vista de Django para obtener los datos en formato CSV
    fetch(`/obtener_ventas_con_detalle_csv/?rut_cliente=${rut_cliente}&id_totem=${id_totem}&fecha_desde=${fecha_desde}&fecha_hasta=${fecha_hasta}`)
        .then(response => response.blob())
        .then(blob => {
            // Crear un enlace temporal para descargar el archivo CSV
            const url = window.URL.createObjectURL(new Blob([blob]));
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'ventas.csv';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        })
        .catch(error => console.error('Error al descargar el archivo CSV:', error));
}


console.log(1);
/* AJAX Evento de manejo de botones para paginacion
*
* */
document.getElementById("inicioPagina").addEventListener("click", function() {
        currentPage=1;
        NumPag.value=currentPage;
        cargarVentas();
    });
console.log(2);

document.getElementById("anteriorPagina").addEventListener("click", function() {
            if(currentPage>1){
                currentPage = currentPage -1;
            }else{
                currentPage = 1;
            }
            NumPag.value=currentPage;
            cargarVentas();
    });
console.log(3);

document.getElementById("siguientePagina").addEventListener("click", function() {
            if(currentPage < PagTot.value){
                currentPage = currentPage +1;
            }else{
                currentPage = PagTot.value;
            }
            NumPag.value=currentPage;
            cargarVentas();
    });
console.log(4);

document.getElementById("ultimaPagina").addEventListener("click", function() {
            currentPage=PagTot.value;
            NumPag.value=currentPage;
            cargarVentas();
    });


console.log('fin carga');

/* FIN AJAX Evento de manejo de botones para paginacion */



function salir(){
    window.top.location.href = '/mant_sistema';

}