"""
VIEW: view_mant_sistema.py
Funcionalidad: Cargar los Menus para acceder a los mantenedores
de area y clientes.

Controller asociado: ajax_mant_sistema.js
"""

from datetime import date
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from rest_framework.decorators import api_view
from django.http import JsonResponse
from django.contrib.auth import logout
from django.shortcuts import redirect
from MegamediaContactosApp.models import Menu

"""
Nombre Clase: UsuarioGrupo
Entrega funcionalidades de obtencion datos de grupos definidos para este proyecto desde framework
django
"""
class UsuarioGrupos:
    def __init__(self,request):
        self.usuario    = request.user.username
        self.grupos     = request.user.groups.values_list('name',flat=True)
        self.usuarioObj = request.user

    def buscar_grupo(self,nombre_grupo):
        return nombre_grupo in self.grupos

    def obtener_gruos(self):
        return self.grupos

    def obtener_grupos_texto(self):
        return ', '.join(self.grupos)

    def is_superuser(self):
        return self.usuarioObj.is_superuser


"""
Nombre def: home
Funcionalidad: una vez que el usuario ha realizado login es dirigido a tmpl_mant_sistema.html 
el cual carga los menus dados los perfiles disponibles.
"""
@login_required
def home(request):
    fecha_actual = date.today().strftime("%d/%m/%Y")
    usuariosGrupos = UsuarioGrupos(request)
    if usuariosGrupos.is_superuser():
        grupos = "Supervisor"
    else:
        grupos = usuariosGrupos.obtener_grupos_texto()
    return render(request, 'tmpl_mant_sistema.html', {'grupos':grupos })


@api_view(['GET'])
def obtener_menus(request):
    menu = Menu.objects.order_by('nombre_menu').\
              values('nombre_menu', 'pagina_menu')
    return JsonResponse(list(menu), safe=False)

# PERMITE ENVIAR A PAGINA NO ENCONTRADA
def pagina_noencontrada(request,not_found):
    return render(request, 'tmpl_pagina_noencontrada.html', status=404)