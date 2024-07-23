
let cantidadProductos = 0;
let totalProductos = 0;

function limpiarDatosSesion() {
    sessionStorage.removeItem('productosSeleccionados');
    sessionStorage.removeItem('totalesSeleccionados');
    sessionStorage.removeItem('paginaActual');
    // Aquí puedes añadir cualquier otra clave que necesites eliminar
}

function recuperarEstadoCarrito() {

    let productosSeleccionados = JSON.parse(sessionStorage.getItem('productosSeleccionados')) || {};
    let totalesSeleccionados = JSON.parse(sessionStorage.getItem('totalesSeleccionados')) || { 'cProductos': 0, 'tProductos': 0 };

    // Asegura que 'cProductos' y 'tProductos' están definidos. Si no, establece a 0.
    let cProductos = totalesSeleccionados['cProductos'] || 0;
    let tProductos = totalesSeleccionados['tProductos'] || 0;

    actualizarCantidad();
    actualizarTotal();

    $('#cantidad-productos').text(cProductos);
    // Muestra el total de productos directamente sin formatear
    $('#total-productos').text(tProductos);

    // Actualizar la UI para cada producto basado en el estado guardado
    for (let codigo in productosSeleccionados) {
        if (productosSeleccionados.hasOwnProperty(codigo)) {
            let producto = productosSeleccionados[codigo];
            let id = codigo.split('_')[0]; // Obtiene el ID del producto desde el código
            //console.log("identificador span :"+id);
            // Asegura que el elemento existe antes de intentar actualizarlo
            let unidadElement = $("#unidad-" + id);
            if (unidadElement.length) {
                unidadElement.text(producto.cantidad);
                //console.log(unidadElement.text);

            }
        }
    }
}

function actualizarCantidadYTotalDesdeSesion(totalesSeleccionados, paginaActual) {
    // Actualiza la UI con la cantidad de productos/promociones y el total
    // Ejemplo: asumiendo que tienes elementos con los IDs 'cantidad-productos' y 'total-productos' en tu HTML
    if(totalesSeleccionados && totalesSeleccionados['cProductos'] !== undefined && totalesSeleccionados['tProductos'] !== undefined) {
        $('#cantidad-productos').text(totalesSeleccionados['cProductos']);
        $('#total-productos').text(totalesSeleccionados['tProductos'].toLocaleString());
    }
    // Puedes añadir más lógica aquí para manejar distintas páginas (productos vs promociones)
}

function agregarCantidad(id,valor, tipo,nombre_cliente,imgCache) {
    // Obtener valores actuales de sessionStorage o usar valores por defecto
    let pcantidadProductos = parseInt(sessionStorage.getItem('CP')) || 0;
    cantidadProductos = pcantidadProductos;
    let ptotalProductos = parseInt(sessionStorage.getItem('TP')) || 0;
    totalProductos = ptotalProductos;

    var unidadElement = document.getElementById("unidad-" + id);

    var unidadActual = parseInt(unidadElement.innerHTML);
    unidadActual += 1;
    totalProductos = totalProductos +valor;
    cantidadProductos++;

    // Actualizar sessionStorage
    sessionStorage.setItem('CP', cantidadProductos.toString());
    sessionStorage.setItem('TP', totalProductos.toString());

    unidadElement.innerHTML = unidadActual;


    // agregar el tipo de propducto / promocion a la session
    var objSesion = JSON.parse(sessionStorage.getItem('productosSeleccionados')) || {};
    var objSesionTotales = JSON.parse(sessionStorage.getItem('totalesSeleccionados')) || {};
    var objSesionPaginaActual = JSON.parse(sessionStorage.getItem('paginaActual')) || {};

    // el codigo para almacenarse en la session es el id de producto o promo + el tipo (promo + producto)
    codigo = id+"_"+tipo;
    objSesion[codigo] = { cantidad: unidadActual, precio: valor, nombre_cliente: nombre_cliente, imgCache: imgCache };
    objSesionTotales[tipo] = {cProductos: cantidadProductos , tProductos: totalProductos};
    objSesionPaginaActual = {pActual : tipo};
    sessionStorage.setItem('productosSeleccionados', JSON.stringify(objSesion));
    sessionStorage.setItem('totalesSeleccionados', JSON.stringify(objSesionTotales));
    sessionStorage.setItem('paginaActual', JSON.stringify(objSesionPaginaActual));

    actualizarCantidad();
    actualizarTotal();

    //console.log(JSON.parse(sessionStorage.getItem('productosSeleccionados')));
    //console.log(JSON.parse(sessionStorage.getItem('totalesSeleccionados')));
    //console.log(JSON.parse(sessionStorage.getItem('paginaActual')));



}

function quitarCantidad(id, valor, tipo) {
    var unidadElement = document.getElementById("unidad-" + id);
    // Presumo que esta línea podría no ser necesaria, ya que no veo que se utilice 'cantidadElement' para mostrar la cantidad.
    // var cantidadElement = document.getElementById("cantidad-" + id);
    var unidadActual = parseInt(unidadElement.innerHTML);
    if (unidadActual > 0) {
        unidadActual -= 1;
        // Actualiza la cantidad en la interfaz de usuario
        unidadElement.innerHTML = unidadActual;
        // Actualiza el total de productos y la cantidad

        var totales = calcularTotales();
        var cantidad = totales.totalCantidad;
        var totalAcumulado = totales.totalAcumulado;

        cantidadProductos = cantidad - 1;
        totalProductos = totalAcumulado-valor;


        // Actualizar sessionStorage
        sessionStorage.setItem('CP', cantidadProductos.toString());
        sessionStorage.setItem('TP', totalProductos.toString());


        actualizarCantidad();
        actualizarTotal();

        // Actualizar sessionStorage para reflejar el cambio
        var objSesion = JSON.parse(sessionStorage.getItem('productosSeleccionados')) || {};
        var codigo = id + "_" + tipo;
        if (objSesion[codigo]) {
            if (unidadActual > 0) {
                objSesion[codigo].cantidad = unidadActual;
            } else {
                // Considera si quieres eliminar el producto del objeto cuando su cantidad es 0
                delete objSesion[codigo];
            }
            sessionStorage.setItem('productosSeleccionados', JSON.stringify(objSesion));
        }
    }

}



function actualizarCantidad() {
    // Actualiza el contenido del div en la franja de pago con la nueva cantidad de productos.
    const cantidadSpan = document.getElementById('cantidad-productos');
    if (cantidadSpan) {

        cantidadSpan.textContent = sessionStorage.getItem('CP') || '0';
    }
}

function actualizarTotal() {
    const totalSpan = document.getElementById('total-productos');
    const inputTotalProductos = document.getElementById('totalProductos');
    if (totalSpan) {
        const ptotal = parseFloat(sessionStorage.getItem('TP')) || 0;
        const formattedTotal = formatMoney(ptotal);
        totalSpan.textContent = formattedTotal; // Agrega el texto 'pesos' al final del total formateado
        inputTotalProductos.value=ptotal;
    }
}

function formateaMonedaValor(valor){
    var formatter = new Intl.NumberFormat('es-ES', {
        style: 'decimal',
        minimumFractionDigits: 0,
        useGrouping: true,
    });

    return formatter.format(valor);
}

function validarPagoPROMO() {
    var totalProductos = parseInt(document.getElementById('totalProductos').value);
    if (totalProductos > 0) {
         window.location.href = "/pagar/";
    }
    // Si totalProductos es cero, no se realiza ninguna acción
}

function salir(){
    window.location.href = "/";
}

function llenarTablaProductos() {
    // Obtener la referencia de la tabla y el objeto de sesión
    var tabla = document.querySelector('.tabla-productosdetalle tbody');
    var productosSeleccionados = JSON.parse(sessionStorage.getItem('productosSeleccionados')) || {};

    // Limpiar contenido existente en la tabla
    tabla.innerHTML = '';

    // Recorrer el objeto de sesión y agregar filas a la tabla
    for (var key in productosSeleccionados) {
        if (productosSeleccionados.hasOwnProperty(key)) {
            (function (key) {
                var producto = productosSeleccionados[key];

                // Crear una nueva fila
                var fila = tabla.insertRow();

                // Añadir celdas a la fila
                var celdaDetalle = fila.insertCell(0);
                var celdaCantidad = fila.insertCell(1);
                var celdaValor = fila.insertCell(2);
                var celdaValorTotal = fila.insertCell(3);
                var celdaBotones = fila.insertCell(4);

                // Crear el elemento img y asignar el src al texto base64 con el prefijo adecuado
                var img = document.createElement('img');
                img.src = 'data:image/png;base64,' + producto.imgCache; // Asegúrate de ajustar el prefijo si el formato no es PNG
                img.style.width = '50px';  // Ajusta el tamaño según sea necesario
                img.style.height = '50px'; // Ajusta el tamaño según sea necesario
                img.alt = 'Imagen del producto';

                // Crear un contenedor div para la imagen y la descripción
                var divDetalle = document.createElement('div');
                divDetalle.appendChild(img);
                divDetalle.appendChild(document.createTextNode(' ' + producto.nombre_cliente));

                // Agregar el contenedor a la celdaDetalle
                celdaDetalle.appendChild(divDetalle);

                // Crear botones + y -
                var btnIncrementar = document.createElement('button');
                btnIncrementar.className = 'btn-incrementar';

                var btnDecrementar = document.createElement('button');
                btnDecrementar.className = 'btn-decrementar';

                // Agregar botones a la celda
                celdaBotones.appendChild(btnDecrementar);
                celdaBotones.appendChild(document.createTextNode('   '));
                celdaBotones.appendChild(btnIncrementar);

                // Agregar datos a las celdas
                celdaCantidad.textContent = producto.cantidad;

                // Formatear el valor como dinero usando la función formatMoney
                var valorFormateado = formatMoney(producto.precio);
                celdaValor.textContent = valorFormateado;

                // Convertir las celdas de cantidad y valor a números
                var cantidad = parseFloat(producto.cantidad);
                var valor = parseFloat(producto.precio);

                // Calcular el valor total y formatearlo como dinero
                var valorTotal = cantidad * valor;
                celdaValorTotal.textContent = formatMoney(valorTotal);

                // Función para actualizar la cantidad y el valor total
                function actualizarCantidad(nuevaCantidad) {
                    producto.cantidad = nuevaCantidad;
                    celdaCantidad.textContent = nuevaCantidad;
                    var nuevoValorTotal = nuevaCantidad * valor;
                    celdaValorTotal.textContent = formatMoney(nuevoValorTotal);

                    // Actualizar sessionStorage
                    productosSeleccionados[key] = producto;
                    sessionStorage.setItem('productosSeleccionados', JSON.stringify(productosSeleccionados));

                    // Actualizar el total de productos
                    actualizarTotalProductos();
                }

                // Event listener para el botón incrementar
                btnIncrementar.addEventListener('click', function () {
                    var nuevaCantidad = parseInt(producto.cantidad) + 1;

                    // Actualizar sessionStorage
                    cantProductos = parseInt(sessionStorage.getItem('CP') || '0') + 1;
                    sessionStorage.setItem('CP', cantProductos.toString());
                    actualizarCantidad(nuevaCantidad);
                });

                // Event listener para el botón decrementar
                btnDecrementar.addEventListener('click', function () {
                    if (producto.cantidad > 1) {
                        cantProductos = parseInt(sessionStorage.getItem('CP') || '0') - 1;
                        var nuevaCantidad = parseInt(producto.cantidad) - 1;
                        sessionStorage.setItem('CP', cantProductos.toString());
                        actualizarCantidad(nuevaCantidad);
                    }
                });
            })(key); // Llamada a la IIFE con la variable key
        }
    }

    // Función para actualizar el total de productos
    function actualizarTotalProductos() {
        var objTotalesSeleccionados = JSON.parse(sessionStorage.getItem('totalesSeleccionados')) || {};

        // Inicializar la suma total
        var total = 0;

        // Iterar sobre las categorías del objeto totalesSeleccionados
        for (var categoria in objTotalesSeleccionados) {
            if (objTotalesSeleccionados.hasOwnProperty(categoria)) {
                // Verificar si la categoría tiene la propiedad 'tProductos'
                if (objTotalesSeleccionados[categoria].hasOwnProperty('tProductos')) {
                    // Sumar el valor tProductos al total
                    total += objTotalesSeleccionados[categoria].tProductos;
                }
            }
        }

        // Formatear el total como dinero usando la función formatMoney
        var montoTotalformateado = formatMoney(total);

        // Actualizar el contenido del span con el monto total
        var spanTotalProductos = document.getElementById('total-productos');
        spanTotalProductos.textContent = montoTotalformateado;
        document.getElementById('hmontoPago').value = total;
        document.getElementById('hproductosSeleccionados').value = JSON.stringify(productosSeleccionados);

        calcularTotales();
    }

    // Llamar a actualizarTotalProductos para inicializar el total
    actualizarTotalProductos();
}

function calcularTotales() {
    // Obtener el objeto de productosSeleccionados de la sessionStorage
    var objSesion = JSON.parse(sessionStorage.getItem('productosSeleccionados')) || {};

    // Inicializar variables para los totales
    var totalCantidad = 0;
    var totalAcumulado = 0;

    // Recorrer el objeto objSesion
    for (var codigo in objSesion) {
        if (objSesion.hasOwnProperty(codigo)) {
            var producto = objSesion[codigo];
            var cantidad = parseFloat(producto.cantidad);
            var precio = parseFloat(producto.precio);

            // Sumar la cantidad al total de productos
            totalCantidad += cantidad;

            // Calcular el valor total para este producto y sumarlo al total acumulado
            totalAcumulado += cantidad * precio;
        }
    }

    // Formatear el total acumulado como dinero usando la función formatMoney
    var totalAcumuladoFormateado = formatMoney(totalAcumulado);

    // Actualizar los elementos en el DOM con los totales calculados
    document.getElementById('total-productos').textContent = totalAcumuladoFormateado;

    // Devolver los totales para usar en otro lugar si es necesario
    return {
        totalCantidad: totalCantidad,
        totalAcumulado: totalAcumulado
    };
}




    // Función para formatear un número como dinero
function formatMoney(amount) {
    return '$' + amount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}








function enviarFormulario() {
      // Abre la ventana modal
      var modal = document.getElementById("idModalPago");
      modal.style.display = "block";
      return false;
      // Envía el formulario
      //document.getElementById("idFormPago").submit();
    }

    function ultimaVenta_e() {
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
                //Swal.fire({
                //    icon: 'error',
                //    title: 'Error',
                //    text: 'Error al llamar la Ultima Venta. Por favor, inténtalo de nuevo más tarde.'
                //});
            });
    }


