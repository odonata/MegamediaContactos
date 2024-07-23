# MegamediaContactos

Aplicacion Web para la administración de Contactos de Megamedia.

Este aplicativo web llama a traves de Python a la capa de servicios disponibilizada 
en Java springboot. 

El proyecto ApiRest de java este en la ruta: 

https://github.com/odonata/MegamediaContactosServiceAPI

## Pre Requisitos previos a la instalación

* leer el README_Requisitos_Base_de_Datos.md
* leer el README_Requisitos_Java.md
* Leer el README_Requisitos_Python.md

## Lenguajes / Frameworks Utilizados

Lenguaje Python 3.12
Framewoprk djangio 4.2
JavaScript / Bootstrap / Jquery / Ajax

## Uso

Configuración de la Aplicación ( windows / Linux / MacOS)

La configuración django  ( sola la primera vez que se creo el proyecto no aplica para instalación ya que la base de datos y el programa estan en el git): 

1.	Descargar desde git: Abre una terminal de comandos / Shell en el path desde esta la aplicacion web que se debe descargar de:

     git clone https://github.com/odonata/MegamediaContactos

2. Entra a la ruta donde se descargo el repo ‘Megamnediacontactos’ y crea un ambiente virtual y activarlo:

* Crear Ambiente Virtual django (linux / Mac / Windows)

      python -m venv venv

* Activar ambiente Virtual django: (Windows)

      c:\…<path>MegamediaContactos\venv\Scripts\activate.bat

* Activar ambiente Virtual django: (Linux / Mac)

      .. source/venv/bin/activate
    
3. Instalar las dependencias

Con el ambiente virtual activado  que deberia aparecer después de la activacion :

     (.venv)  ..<path>/MegamediaContactos , ejecutar en esa carpeta el comando
     pip install -r requirements.txt

Eso instalará todas las dependencias requeridas por el proyecto web django

4. Instalar el driver para acceder a postgres: 

       pip install  psycopg2-binary

5. Notas sobre la configuración de base de datos en django:

Dentro del directorio: 

     (.venv)  ..<path>/MegamediaContactos

ir a la carpeta:

     cd MegamediaContactos <enter>

editar el archivo : settings.py:

* verificar que esta permitido que otros equipos de la red puedan acceder al aplicativo: 

      ALLOWED_HOSTS = [‘*’].

Como es para prueba es correcto que se puede acceder desde otros equipos, 
en produccion se definen los rangos y sitios desde los cuales se puede acceder al 
aplicativo MegamediaContactos.

* verificar que la conexión a base de datos está establecida:

		DATABASES = {
				'default': {
					'ENGINE': 'django.db.backends.postgresql',
					'NAME': 'MegamediaDB',
					'USER': 'postgres',
					'PASSWORD': '1qazxsw234',
					'HOST': 'localhost',
					'PORT': '5432',
				}
		}

6. Correr el proyecto 

Dentro del ambiente virtual:

 	(.venv)  ..<path>/MegamediaContactos

Ejecutar el comando ( es necesario que el puerto 8000 este disponible )

	python manage.py runserver 0.0.0.0:8000  , o el puerto que este disponible y se desee utilizar

7. Credenciales

   - Para entrar al aplicativo ( perfil administracion )
   
            http://localhost:8000/
            credenciales megamediaAdmin / 5tgbnhy6

   - Para entrar con usuario de contactos  ( perfil limitado )

            credenciales: contactoGSP / 6yhnmju7