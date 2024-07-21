let paginaActual = 1;
let id_categoria ;

function getProductos(par_idCategoria) {
    var pUrl = `/get_productos/?page=${paginaActual}` + '&id_categoria=' + par_idCategoria;
    id_categoria = par_idCategoria;
    $.ajax({
        url: pUrl,
        dataType: 'json',
        success: function (data) {

            const productos = data.productos;
            contenedorProductos = $('#productosContainer');
            contenedorProductos.empty(); // Limpiar el contenedor antes de añadir nuevos productos

            let productosSeleccionados = JSON.parse(sessionStorage.getItem('productosSeleccionados')) || {};

            productos.forEach(function (producto) {
                // Verifica si el producto actual está en sessionStorage y obtiene su cantidad
                const productoId = `${producto.id_producto}_PRODUCTO`;
                const cantidadProducto = productosSeleccionados[productoId] ? productosSeleccionados[productoId].cantidad : 0;
                const valorFormateado = formateaMonedaValor(producto.valor_unitario);
                const textbase64 = obtener_imagen_base64(producto.path_imagen, 'productos');
                const div = `
                    <div class="producto">
                        <div class="grid-item" style="background-image: url(data:image/png;base64,${textbase64});"></div>
                        <div class="acciones">
                            <button onclick="quitarCantidad(${producto.id_producto},${producto.valor_unitario},'${producto.tipo_prod_promo}')">
                                <img src="/static/imgs/img-corporativo/icono-memos.png" alt="Quitar" style="width: 30px;">
                            </button>
                            <span id="unitario-unidad-${producto.id_producto}" class="contador">${valorFormateado} - </span>
                            <span id="unidad-${producto.id_producto}" class="contador">${cantidadProducto}</span>
                            <button onclick="agregarCantidad(${producto.id_producto},${producto.valor_unitario},'${producto.tipo_prod_promo}','${producto.descripcion}','${textbase64}')">
                                <img src="/static/imgs/img-corporativo/icono-mas.png" alt="Añadir" style="width: 30px;">
                            </button>
                        </div>
                        <h5 class="producto-descripcion">${producto.descripcion}</h5>
                    </div>
                `;
                contenedorProductos.append(div);
            });

            actualizarBotonesPaginacion(data.paginaActual, data.paginaTotal);
        },
        error: function (xhr, status, error) {
            console.error("Error al recuperar los productos:", status, error);
        }
    });
}


function actualizarBotonesPaginacion(paginaActual, paginasTotal) {
    const contenedorPaginacion = $('#productosContainer'); // O considera usar otro contenedor específico para los botones
    $('.boton-paginacion').remove(); // Limpiar botones existentes

    if (paginaActual > 1) {
        contenedorPaginacion.append(`<button onclick="cambiarPagina(${paginaActual - 1})" class="boton-paginacion">Anterior</button>`);
    }
    if (paginaActual < paginasTotal) {
        contenedorPaginacion.append(`<button onclick="cambiarPagina(${paginaActual + 1})" class="boton-paginacion">Siguiente</button>`);
    }
}

function cambiarPagina(numeroPagina) {
    paginaActual = numeroPagina;
    getProductos(id_categoria);
}


function llenarCarrousel() {
  const swiper = new Swiper('.mySwiper', {
    // Opciones de Swiper
    loop: false,
    slidesPerView: 2,
    spaceBetween: 20,
    breakpoints: {
      768: {
        slidesPerView: 2,
      },
      1024: {
        slidesPerView: 4,
      },
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });

  fetch('/categorias_list/')
    .then(response => response.json())
    .then(data => {
      const swiperWrapper = document.querySelector('.swiper-wrapper');
      let i = 0;
      data.forEach(categoria => {
        if (i == 0) {
          id_categoria = categoria.id_categoria;
          getProductos(id_categoria);
        }
        const slide = document.createElement('div');
        slide.className = 'swiper-slide';
        slide.dataset.categoriaId = categoria.id_categoria;
        let imgElementCategoria;
        const textbase64 = obtener_imagen_base64(categoria.imagen, 'categorias');

        imgElementCategoria = $('<img>').attr('src', 'data:image/png;base64,' + textbase64).css('width', '80%').css('height', 'auto');
        // Construir el elemento <img> en el HTML con la imagen en base64
        slide.innerHTML = `
          <div style="display: flex; flex-direction: column; align-items: center;">
            ${imgElementCategoria.prop('outerHTML')}
            <h5 style="text-align: center; margin-top: 10px;">${categoria.nombre_categoria}</h5>
          </div>
        `;
        slide.addEventListener('click', () => {
          getProductos(categoria.id_categoria);
        });
        swiperWrapper.appendChild(slide);
        i++;
      });
    })
    .catch(error => console.error('Error loading categories:', error));
}

function obtener_imagen_base64(nombre_imagen, tipo) {
    const xhr = new XMLHttpRequest();
    // en la llamda a xhr.open el ultimo parametro indica que la llamada es SINCRONA ( false )
    xhr.open('GET', `/vista_de_imagen/${tipo}/${nombre_imagen}/`, false);
    xhr.send();
    if (xhr.status == 200) {
        return xhr.responseText;
    } else {
        throw new Error('Error al obtener la imagen');
    }
}


