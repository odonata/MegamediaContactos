
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt

from MegamediaContactosApp.views.view_constantes import Constantes
from MegamediaContactosApp.views.view_mant_sistema import UsuarioGrupos
import requests


#VISTA PARA EL MANTENEDOR de AREAS DE NEGOCIO
#----------------------------------------------------------------------------
def mant_areas(request):
    return render(request, 'tmpl_mant_areas.html')

# VISTA PARA CARGAR DEL  MODELO  LOS CATEGORIUAS  REGISTRADAS
#----------------------------------------------------------------------------
@api_view(['GET'])
def get_areas(request):
    # Obtener el número de página desde los parámetros de la solicitud
    numero_pagina = request.query_params.get('page', 1)
    campoBusqueda = request.query_params.get('campoBusqueda', 1)
    numeroRegistrosPagina = 9

    url = "http://localhost:8080/areas"
    params = {
        "busqueda": campoBusqueda,
        "pagina": numero_pagina,
        "registrosPorPagina": numeroRegistrosPagina
    }

    response = requests.get(url, params=params)

    if response.status_code == 200:
        data = response.json()

        salida = {
            'count': len(data['data']),
            'next': data['numeroPagina'] < data['totalPaginas'],
            'previous': data['numeroPagina'] > 1,
            'results': data['data'],
            'numero_pagina': data['numeroPagina'],
            'total_paginas': data['totalPaginas'],
        }

        return JsonResponse(salida, safe=False)
    else:
        return JsonResponse({'error': 'Error al obtener los datos'}, status=response.status_code)



# VISTA PARA GRABAR  UN CARGO
# ----------------------------------------------------------------------------

@csrf_exempt
def set_categoria(request):
    salida=''
    tipoSalida=''
    usuariosGrupos = UsuarioGrupos(request)
    if usuariosGrupos.is_superuser():
        if request.method == 'POST':
            try:
                nombre_categoria = request.POST.get('nombre_categoria')
                imagen = request.FILES.get('imagen')

                # Construye el path donde se guardará la imagen
                file_path = '/opt/apps/kioskopay/imagenes/categorias/' + imagen.name

                # Guarda el archivo en el sistema de archivos
                with open(file_path, 'wb+') as destination:
                    for chunk in imagen.chunks():
                        destination.write(chunk)

                # Crea una nueva instancia de Categorias con el nombre del archivo
                categoria = Categorias(nombre_categoria=nombre_categoria, imagen=imagen.name)
                categoria.save()
                salida = Constantes.OK_Registro_agregado
                tipoSalida = Constantes.TipoSalida_exito
                limpiar_cache_imagenes()
            except:
                salida = Constantes.Error_registro_agregado
                tipoSalida = Constantes.TipoSalida_error
    else:
        salida = ((Constantes.Error_usuario_grupo_invalido + '\n'
             'Se requiere pertenecer al grupo: ' + Constantes.GRUPO_SUPERUSER) + '\n'
             'El usuario pertenece a los grupos:' + usuariosGrupos.obtener_grupos_texto())
        tipoSalida = Constantes.TipoSalida_error
        print(salida)
    return JsonResponse({'mensaje': salida, 'resultado' : tipoSalida})


# VISTA PARA ELIMINAR CATEGORIA  REGISTRADA
# ----------------------------------------------------------------------------
@require_http_methods(["DELETE"])
def del_area(request, id_area):
    salida=''
    tipoSalida=''
    usuariosGrupos = UsuarioGrupos(request)
    if usuariosGrupos.is_superuser():
        try:
            url = f'http://localhost:8080/areas/{id_area}'
            response = requests.delete(url)
            if response.status_code == 200:
                data = response.json()
                codigo = data.get('codigoError')
                mensaje = data.get('mensaje')
                salida = mensaje
                tipoSalida = codigo
        except:
            salida = Constantes.Error_registro_no_eliminado
            tipoSalida = Constantes.TipoSalida_error
    else:
        tipoSalida = Constantes.TipoSalida_error
        salida = ((Constantes.Error_usuario_grupo_invalido + '\n'
             'Para borrar se requiere pertenecer al grupo: ' + Constantes.GRUPO_SUPERUSER) + '\n'
             'El usuario pertenece a los grupos:' + usuariosGrupos.obtener_grupos_texto())

    return JsonResponse({'mensaje': salida, 'resultado' : tipoSalida})

