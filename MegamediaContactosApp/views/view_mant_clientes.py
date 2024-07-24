import requests
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
    # Definir los encabezados incluyendo la API Key
    headers = {
        'X-API-KEY': settings.APIKEY_SERVICIOS_MEGAMEDIA_CONTACTOS
    }
    # Realizar la solicitud GET
    response = requests.get(url, headers=headers)

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



# VISTA PARA CARGAR DEL  MODELO  LOS CLIENTES REGISTRADAS
#----------------------------------------------------------------------------
@csrf_exempt
@api_view(['GET'])
def get_clientes_area(request):

    # Obtener el número de página desde los parámetros de la solicitud
    numero_pagina = request.query_params.get('page', 1)
    campo_busqueda = request.query_params.get('campoBusqueda', 1)
    tipo_buqueda = request.query_params.get('tipoBusqueda', 1)
    filtroBusqueda = request.query_params.get('filtroBusqueda', 1)

    registros_por_pagina = settings.REGISTROS_POR_PAGINACION_CLIENTE

    # url de consulta y parametros
    url = f'http://{settings.HOST_REST_API_URL}:{settings.HOST_REST_API_PORT}/clientes'
    params = {
        'busqueda': campo_busqueda,
        'pagina': numero_pagina,
        'registrosPorPagina': registros_por_pagina,
        'filtroBusqueda': filtroBusqueda,
        'tipoBusqueda' : tipo_buqueda
    }
    # Definir los encabezados incluyendo la API Key
    headers = {
        'X-API-KEY': settings.APIKEY_SERVICIOS_MEGAMEDIA_CONTACTOS
    }
    response = requests.get(url, params=params, headers=headers)
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


# VISTA PARA GRABAR  UN CLIENTE
# ----------------------------------------------------------------------------
@csrf_exempt
def set_cliente(request):
    usuariosGrupos = UsuarioGrupos(request)
    if request.method == 'POST':
        try:
            nombre_cliente = request.POST.get('nombre_cliente')
            email_contacto = request.POST.get('email_contacto')
            fono_contacto = request.POST.get('fono_contacto')
            area = request.POST.get('lista_areas')

            url = f'http://{settings.HOST_REST_API_URL}:{settings.HOST_REST_API_PORT}/clienteCrear'

            # Definir los datos que se enviarán en la solicitud POST
            data = {
                'area_id'       : area,
                'nombre_cliente': nombre_cliente,
                'fono_contacto' : fono_contacto,
                'email_contacto': email_contacto,
                'usuario': usuariosGrupos.usuario
            }
            # Definir los encabezados incluyendo la API Key
            headers = {
                'X-API-KEY': settings.APIKEY_SERVICIOS_MEGAMEDIA_CONTACTOS
            }
            # Realizar la solicitud POST
            response = requests.post(url, data=data,headers=headers)

            # Verificar el código de estado de la respuesta
            if response.status_code == 200:
                # Respuesta exitosa
                salida = Constantes.OK_Registro_agregado
                tipoSalida = Constantes.TipoSalida_exito
            else:
                tipoSalida = Constantes.TipoSalida_error
                salida = response.text

        except Exception as e:
            salida = Constantes.Error_registro_agregado + ' - '+ str(e)
            tipoSalida = Constantes.TipoSalida_error
    else:
        salida = Constantes.Error_registro_agregado + ' - Método http no soportado.'
        tipoSalida = Constantes.TipoSalida_error

    return JsonResponse({'mensaje': salida, 'resultado' : tipoSalida})

# VISTA PARA ACTUALIZAR  UN CLIENTE
# ----------------------------------------------------------------------------
@csrf_exempt
def upd_cliente(request):
    usuariosGrupos = UsuarioGrupos(request)

    if request.method == 'POST':
        try:
            cliente_id = request.POST.get('cliente_id')
            area_id = request.POST.get('lista_areas')
            nombre_cliente = request.POST.get('nombre_cliente')
            fono_contacto = request.POST.get('fono_contacto')
            email_contacto = request.POST.get('email_contacto')
            usuario = usuariosGrupos.usuario

            url = f'http://{settings.HOST_REST_API_URL}:{settings.HOST_REST_API_PORT}/clienteActualizar/{cliente_id}/{area_id}/{nombre_cliente}/{fono_contacto}/{email_contacto}/{usuario}'
            # Definir los encabezados incluyendo la API Key
            headers = {
                'X-API-KEY': settings.APIKEY_SERVICIOS_MEGAMEDIA_CONTACTOS
            }
            # Hacer la solicitud PUT
            try:
                response = requests.put(url,headers=headers)

                # Verificar el código de estado de la respuesta
                if response.status_code == 200:
                    # Respuesta exitosa
                    salida = Constantes.OK_Registro_modificado
                    tipoSalida = Constantes.TipoSalida_exito
                else:
                    tipoSalida = Constantes.TipoSalida_error
                    salida = response.text
            except Exception as e:
                salida = Constantes.Error_registro_modificado + ' - '+ str(e)
                tipoSalida = Constantes.TipoSalida_error
        except Exception as e:
            salida = Constantes.Error_registro_modificado + ' - ' + str(e)
            tipoSalida = Constantes.TipoSalida_error
    else:
        salida = Constantes.Error_registro_modificado + ' - Método http no soportado.'
        tipoSalida = Constantes.TipoSalida_error


    return JsonResponse({'mensaje': salida, 'resultado' : tipoSalida})


# VISTA PARA ELIMINAR CLIENTE  REGISTRADO
# ----------------------------------------------------------------------------
@require_http_methods(["DELETE"])
def del_cliente(request, cliente_id):
    salida=''
    tipoSalida=''
    try:
        # Construir la URL del endpoint DELETE
        url = f'http://{settings.HOST_REST_API_URL}:{settings.HOST_REST_API_PORT}/deleteCliente/{cliente_id}'
        # Definir los encabezados incluyendo la API Key
        headers = {
            'X-API-KEY': settings.APIKEY_SERVICIOS_MEGAMEDIA_CONTACTOS
        }
        # Realizar la solicitud DELETE
        response = requests.delete(url,headers=headers)

        # Verificar el código de estado de la respuesta
        if response.status_code == 200:
            salida = Constantes.Registro_Eliminado
            tipoSalida = Constantes.TipoSalida_exito
        else:
            salida = Constantes.Error_registro_no_eliminado + ' - ' + str(response)
            tipoSalida = Constantes.TipoSalida_error
    except :
        salida = Constantes.Error_registro_no_eliminado
        tipoSalida = Constantes.TipoSalida_error

    return JsonResponse({'mensaje': salida, 'resultado' : tipoSalida})


def view_name(request):
    pass

