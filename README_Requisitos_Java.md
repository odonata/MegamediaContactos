# Pre requisitos de instalación Java, y detalles de los servicios desplegados

JDK: Pre requisitos marco de ejecución Java 

# 1. Instalar Lenguaje java 1.8 para windows, Mac:

	Windows: https://www.java.com/es/download/windows_offline.jsp
	Mac: https://www.oracle.com/cis/java/technologies/javase/javase8-archive-downloads.html

* Se debe asegurar de instalar Java 1.8 y que este asociado la path de sistema

# 2. Instalar maven 

En Windows

1.	Descargar Maven:
	* Ve al sitio web oficial de Apache Maven.

	•	Descarga el archivo ZIP binario.

2.	Descomprimir el archivo:

	•	Extrae el archivo ZIP en una ubicación de tu elección, por ejemplo, C:\Program Files\Apache\maven.

3.	Configurar las variables de entorno:

	•	Variable MAVEN_HOME:
	•	Abre el Panel de Control y ve a Sistema y Seguridad > Sistema > Configuración avanzada del sistema.
	•	Haz clic en Variables de entorno.
	•	En la sección Variables del sistema, haz clic en Nueva.
	•	Introduce MAVEN_HOME como nombre y la ruta al directorio Maven como valor (por ejemplo, C:\Program Files\Apache\maven).
	•	Actualizar la variable PATH:
	•	En la misma ventana de Variables de entorno, selecciona la variable Path en Variables del sistema y haz clic en Editar.
	•	Añade ;%MAVEN_HOME%\bin al final del valor existente.

4.	Verificar la instalación:

	•	Abre una nueva ventana de Símbolo del sistema y ejecuta:

En macOS

1.	Instalar Maven usando Homebrew:

	•	Si no tienes Homebrew, instálalo siguiendo las instrucciones en su sitio web.
	•	Abre la Terminal y ejecuta:
		
		brew install maven
		mvn -version


# 3. Descargar y compilar la capa de servicios APIREST para Megamedios Contactos

1. GIT:  clonar : https://github.com/odonata/MegamediaContactosServiceAPI 

Entrar a la carpeta MegamediaContactosServiceAPI y ejecutar

	mvn clean package

Eso descargará las dependencias descritas en el pom.xml y compilará generando un jar

2. Compilar con maven : mvn clean package [enter]

Entrar a la carpeta donde se realizó el clone de git :

![Compilar](https://github.com/odonata/MegamediaContactos/blob/main/Artefactos/imagenes/compilar_mvn.png)

Resultado de la compilación:

![Resultado](https://github.com/odonata/MegamediaContactos/blob/main/Artefactos/imagenes/resultado_compilacion_mvn.png)

Correr el apirest java springboot ( dentro de la carpeta target )

	java -jar MegamediaContactos_service_v1.jar

![Inicio](https://github.com/odonata/MegamediaContactos/blob/main/Artefactos/imagenes/InicioSpringBoot.png)

Leer el log , entrar a la carpeta target :

	tail -f MegaMediaContactosService.log

![Log](https://github.com/odonata/MegamediaContactos/blob/main/Artefactos/imagenes/LogCapaServicios.png)

Abrir en el navegador la web swagger del servicio.

ir a : http://localhost:8080/swagger-ui.html#/mega-media-contactos-controller

![Apirest](https://github.com/odonata/MegamediaContactos/blob/main/Artefactos/imagenes/SwaggerCapaServicios.png)

# 4. Servicios desplegados

Los siguientes son la lista de servicios desplegados quenutilkizan un apikey para ser accedidos, y estan 
segmentados por delegación de responsabilidad.

		APIKEY = test.megamedia.apikey.123

* PUT : /areaActualizar/{area_id}/{nombre_area}/{usuario}

		Actualizar el nombre del área de Negocio 

* PUT : /clienteActualizar/{cliente_id}/{area_id}/{nombre_cliente}/{fono_contacto}/{email_contacto}/{usuario}

		Actualizar los datos del cliente
* GET : /areas

		Obtener la lista de areas de negocio paginadas via pl en db
* GET : /areasList

		Obtener todas las areas de negocio
* GET : /clientes

		Obtener la lista de clientes paginados via pl en db
* GET : /estadoDelClima

		Obtiene el estado del Clima, entrega una imagen grqfica y datos bvase, es el único API del sistema que no ocupa 
  		apikey propio. Llama al servicio wether open para obtener la data
* POST : /areas

		Crear un área de negocio
* POST : /clienteCrear

		Crear un Cliente
* DELETE : /areas/{id}

		Borrar un área
* DELETE : /deleteCliente/{cliente_id}

		Borrar un cliente

