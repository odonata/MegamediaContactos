"""
URL configuration for MegamediaContactos project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include
from django.contrib.auth.decorators import login_required
from django.contrib.auth.views import LoginView, LogoutView
from django.contrib.auth import views as auth_views

from MegamediaContactosApp.views.view_mant_areas import get_areas, mant_areas, del_area, set_area
from MegamediaContactosApp.views.view_mant_clientes import get_areas_registradas, mant_clientes, get_clientes_area, \
    set_cliente, upd_cliente, del_cliente
from MegamediaContactosApp.views.view_mant_sistema import home, obtener_menus, pagina_noencontrada

urlpatterns = [
    path('logout/', LogoutView.as_view(next_page='/'), name='logout'),
    path('accounts/login/', LoginView.as_view(template_name='registration/login.html'), name='login'),  # Define tu vista de login aquí
    path('', home, name='home'),  # Página de inicio protegida
    path('admin/', admin.site.urls),
    path('obtener_menus/',obtener_menus,name='obtener_menus'),
    path('get_areas/',get_areas,name='get_areas'),
    path('mant_areas/',mant_areas,name='mant_areas'),
    path('del_area/<int:id_area>',del_area,name='del_area'),
    path('set_area/',set_area,name='set_area'),
    path('get_areas_registradas/',get_areas_registradas, name="get_areas_registradas"),
    path('mant_clientes/',mant_clientes,name='mant_clientes'),
    path('get_clientes_area/',get_clientes_area,name='get_clientes_area'),
    path('set_cliente/',set_cliente,name='set_cliente'),
    path('upd_cliente/',upd_cliente,name='upd_cliente'),
    path('del_cliente/<int:id_cliente>',del_cliente,name='del_cliente'),
    path('<str:not_found>/', pagina_noencontrada),
    # no agregar nada despues de esta linea, todos los nuevos urls debes
    # estar antes de str:not_found
]

# Asigna la vista de página no encontrada a la ruta vacía ''
handler404 = pagina_noencontrada