import requests
from datetime import datetime
from django.db import  connection
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt

from MegamediaContactosApp.views.view_constantes import Constantes
from MegamediaContactosApp.views.view_mant_areas import UsuarioGrupos
from django.conf import settings



#VISTA PARA EL MANTENEDOR CLIENTES
#----------------------------------------------------------------------------
def mant_clientes(request):
    return render(request, 'tmpl_mant_clientes.html')

# VISTA PARA TRAER TODAS LAS AREAS  A SER MOSTRADAS EN UN HTML SELECT
#----------------------------------------------------------------------------
@csrf_exempt
@api_view(['GET'])
def get_areas_registradas(request):

    # URL del endpoint
    url = f'http://{settings.HOST_REST_API_URL}:{settings.HOST_REST_API_PORT}/areasList'
    # Realizar la solicitud GET
    response = requests.get(url)

    # Parsear la respuesta JSON
    data = response.json()

    # Filtrar solo los campos id y nombre
    filtered_data = [
        {
            "id": item["id"],
            "nombre": item["nombre"]
        }
        for item in data
    ]

    return JsonResponse(filtered_data, safe=False)



# VISTA PARA CARGAR DEL  MODELO  LOS CARGOS REGISTRADAS
#----------------------------------------------------------------------------
@csrf_exempt
@api_view(['GET'])
def get_clientes_area(request):

    # Obtener el número de página desde los parámetros de la solicitud
    numero_pagina = request.query_params.get('page', 1)
    campoBusqueda = request.query_params.get('campoBusqueda', 1)
    registros_por_pagina = settings.REGISTROS_POR_PAGINACION_CLIENTE

    # url de consulta y parametros
    url = f'http://{settings.HOST_REST_API_URL}:{settings.HOST_REST_API_PORT}/clientes'
    params = {
        'busqueda': campoBusqueda,
        'pagina': numero_pagina,
        'registrosPorPagina': registros_por_pagina
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
def set_cliente(request):
    usuariosGrupos = UsuarioGrupos(request)
    if usuariosGrupos.buscar_grupo(Constantes.GRUPO_EDITOR) or usuariosGrupos.is_superuser():
        if request.method == 'POST':
            try:
                # Obtener el próximo valor de la secuencia para id_producto
                with connection.cursor() as cursor:
                    cursor.execute("SELECT nextval('seq_productos_promos')")
                    id_producto = cursor.fetchone()[0]

                # Procesar la imagen
                imagen = request.FILES.get('imagenProducto')
                # Obtener el próximo valor para la secuencia de imagen
                with connection.cursor() as cursor:
                    cursor.execute("SELECT nextval('seq_imagen')")
                    secuencia_imagen = cursor.fetchone()[0]

                # Crear el nuevo nombre del archivo
                nombre_archivo_original = imagen.name
                extension_original = nombre_archivo_original.split('.')[-1]
                nuevo_nombre_archivo = f"{nombre_archivo_original}_{secuencia_imagen}.{extension_original}"

                # Guardar el archivo en el sistema de archivos
                path_imagen = '/opt/apps/kioskopay/imagenes/productos/'+ nuevo_nombre_archivo
                with open(path_imagen, 'wb+') as destination:
                    for chunk in imagen.chunks():
                        destination.write(chunk)

                # Crear el producto
                producto = ProductosPromos(
                    id_producto=id_producto,
                    nombre_cliente=request.POST.get('nombre_cliente'),
                    tipo_prod_promo='PRODUCTO',
                    path_imagen=nuevo_nombre_archivo, # Guardar el nuevo nombre del archivo
                    habilitado=request.POST.get('habilitado') == 'true',
                    email_contacto=request.POST.get('email_contacto'),
                    id_categoria_id=request.POST.get('categoria'), # Asumiendo que 'categoria' es el ID
                    usuario=request.user.username,
                    usuario_modif=request.user.username,
                    eliminado_logico=False,
                    fecha_creacion = datetime.now(),
                    fecha_modificacion = datetime.now(),
                )
                producto.save()

                # Respuesta exitosa
                salida = Constantes.OK_Registro_agregado
                tipoSalida = Constantes.TipoSalida_exito
                limpiar_cache_imagenes()
            except Exception as e:
                salida = Constantes.Error_registro_agregado + ' - '+ str(e)
                tipoSalida = Constantes.TipoSalida_error
        else:
            salida = Constantes.Error_registro_agregado + ' - Método http no soportado.'
            tipoSalida = Constantes.TipoSalida_error
    else:
        salida = ((Constantes.Error_usuario_grupo_invalido + '\n' 
                  'Se requiere pertenecer al grupo: '+ Constantes.GRUPO_EDITOR)+ '\n' 
                  'El usuario pertenece a los grupos:' + usuariosGrupos.obtener_grupos_texto())
        tipoSalida = Constantes.TipoSalida_error
    return JsonResponse({'mensaje': salida, 'resultado' : tipoSalida})

@csrf_exempt
def upd_cliente(request):
    usuariosGrupos = UsuarioGrupos(request)
    # para saber si viene una imagen para remplazar la existente se establece
    # la variabla esConImagen , si queda en true significa que se debe crear un jnuevo archivo
    # que remplaza el existente
    esConImagen = False
    if usuariosGrupos.buscar_grupo(Constantes.GRUPO_EDITOR) or usuariosGrupos.is_superuser():
        if request.method == 'POST':
            try:
                # Procesar la imagen
                imagen = request.FILES.get('imagenProducto')
                if imagen is not None and len(imagen.name.strip().replace(" ", "")) > 0:
                    # Obtener el próximo valor para la secuencia de imagen
                    with connection.cursor() as cursor:
                        cursor.execute("SELECT nextval('seq_imagen')")
                        secuencia_imagen = cursor.fetchone()[0]
                    # Crear el nuevo nombre del archivo
                    nombre_archivo_original = imagen.name
                    extension_original = nombre_archivo_original.split('.')[-1]
                    nuevo_nombre_archivo = f"{nombre_archivo_original}_{secuencia_imagen}.{extension_original}"
                    # Guardar el archivo en el sistema de archivos
                    pathImagen = '/opt/apps/kioskopay/imagenes/productos/'+ nuevo_nombre_archivo
                    with open(pathImagen, 'wb+') as destination:
                        for chunk in imagen.chunks():
                            destination.write(chunk)
                    esConImagen = True
                #FIN IF
                # Crear el producto
                producto = ProductosPromos.objects.get(id_producto=int(request.POST.get('id_producto')) )
                producto.nombre_cliente=request.POST.get('nombre_cliente')
                if esConImagen==True:
                    producto.path_imagen=nuevo_nombre_archivo  # Guardar el nuevo nombre del archivo
                producto.habilitado=request.POST.get('habilitado') == 'true'
                producto.email_contacto=request.POST.get('email_contacto')
                producto.id_categoria_id=request.POST.get('categoria')
                producto.usuario_modif = request.user.username
                producto.fecha_modificacion = datetime.now()

                producto.save()
                # Respuesta exitosa
                salida = Constantes.OK_Registro_modificado
                tipoSalida = Constantes.TipoSalida_exito
                limpiar_cache_imagenes()
            except Exception as e:
                salida = Constantes.Error_registro_modificado + ' - '+ str(e)
                tipoSalida = Constantes.TipoSalida_error
        else:
            salida = Constantes.Error_registro_modificado + ' - Método http no soportado.'
            tipoSalida = Constantes.TipoSalida_error
    else:
        salida = ((Constantes.Error_usuario_grupo_invalido + '\n' 
                  'Se requiere pertenecer al grupo: '+ Constantes.GRUPO_EDITOR)+ '\n' 
                  'El usuario pertenece a los grupos:' + usuariosGrupos.obtener_grupos_texto())

        tipoSalida = Constantes.TipoSalida_error

    return JsonResponse({'mensaje': salida, 'resultado' : tipoSalida})


# VISTA PARA ELIMINAR PRODUCTO  REGISTRADO
# ----------------------------------------------------------------------------
@require_http_methods(["DELETE"])
def del_cliente(request, id_producto):
    salida=''
    tipoSalida=''
    usuariosGrupos = UsuarioGrupos(request)
    if usuariosGrupos.is_superuser():
        try:
            producto = ProductosPromos.objects.get(id_producto=id_producto)
            producto.eliminado_logico=True
            producto.usuario_modif=usuariosGrupos.usuario
            producto.fecha_modificacion=datetime.now()
            producto.save()
            salida = Constantes.Registro_Eliminado
            tipoSalida = Constantes.TipoSalida_exito
            limpiar_cache_imagenes()
        except :
            salida = Constantes.Error_registro_no_eliminado
            tipoSalida = Constantes.TipoSalida_error
    else:
        salida = ((Constantes.Error_usuario_grupo_invalido + '\n'
            'Se requiere pertenecer al grupo: ' + Constantes.GRUPO_SUPERUSER) + '\n'
            'El usuario pertenece a los grupos:' + usuariosGrupos.obtener_grupos_texto())
        tipoSalida = Constantes.TipoSalida_error
    print(salida , '  ' , tipoSalida)
    return JsonResponse({'mensaje': salida, 'resultado' : tipoSalida})


def view_name(request):
    pass

