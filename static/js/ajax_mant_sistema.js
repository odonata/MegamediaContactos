// Manejar el clic en los elementos del menú
$(document).on('click', '.menu-item', function() {
    var page = $(this).data("page");
    $("#content").load(page);
});

// Obtener la lista de menus
function getMenus(){
    $.ajax({
     url: '/obtener_menus/',
     type: 'GET',
     success: function (data) {
         // Generar el menú dinámicamente
         var menuItems = '';
         data.forEach(function (item) {
             menuItems += '<li class="nav-item"><a class="nav-link menu-item" data-page="' + item.pagina_menu + '"><b>' + item.nombre_menu + '</b></a></li>';
         });
         $('.navbar-nav').html(menuItems);
         // Agregar el estilo CSS para el hover
        $('.nav-link').hover(function() {
            $(this).css('background-color', 'rgba(0, 191, 255, 0.6)'); // Cambiar el fondo a naranja cuando el mouse está sobre el enlace
        }, function() {
            $(this).css('background-color', ''); // Restaurar el color de fondo original cuando el mouse sale del enlace
        });
     }
    })
}