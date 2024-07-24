# Pre requisitos de instalación DB

Se aconseja descargar el cliente de db Dbeaver para su sistema operativo desde : 
https://dbeaver.io/ Este es un cliente SQL para multiples bases de datos.

Este instructivo aunque es general, se aconseja que el motor de db sea instalado en la 
misma maquina donde correra el aplicativo Python y Java Springboot, de lo contrario habrá 
que configurar el datassource del framework django ( esta indicado en el archivo [README.md](https://github.com/odonata/MegamediaContactos/blob/main/README.md) en este mismo directorio)

Dicho lo anterior, si se decide probar en máquinas diferentes, el aplicativo java springboot tendrá 
que ser reconfigurado su dataspource a través del archivo application.properties que se encuentra 
en la ruta /src/main/resources.

## Instalación de PostgreSQL en Windows / MacOS

Paso 1: Descargar PostgreSQL

	1.	Ve al sitio web oficial de PostgreSQL: https://www.postgresql.org/
	2.	Haz clic en el botón “Download the installer” para descargar el instalador de PostgreSQL.

Paso 2: Ejecutar el instalador

	1.	Ejecuta el archivo descargado 
	2.	Sigue las instrucciones del instalador:
	•	Elige el directorio de instalación.
	•	Selecciona los componentes a instalar (por defecto, todos los componentes están seleccionados y es recomendable dejarlos así).
	•	Configura el directorio de datos.
	•	Establece la contraseña del superusuario,. Usar: 1qazxsw2334
	•	Configura el puerto (por defecto es el 5432).
	•	Selecciona el locale (por defecto es adecuado dejarlo en Default locale).

Paso 3: Finalizar la instalación

	1.	No instalar el  Stack Builder, una herramienta opcional para instalar herramientas adicionales.

	2. Verificar  que el motor de db estar corriendo, abrir el cliente SQL preferido y establecer una conexión a :
- [ ] 	Tipo de Motor DB: Postgres
- [ ] 	host: localhost
- [ ] 	Nombre Conexion :MegamediaDb
- [ ]      Usuario postgres
- [ ]      Contraselña : 1qazxsw2334
- [ ]      Puerto 5432
     
	Hacer clic el botón “Probar conexión…” , si el driver no esta presente dbeaver ofrecerá descargarlo

## Restaurar el backup Inicial para la base de datos

Esteb proyecto utiliza el framework django para Python para proveer la funcionalidad de menajeo de usuarios, lo que incluye 
tablas, indices, y artefactos propios del framework para componente Frontend de cara al usuario. Dado que son muchios artefactos
se creo un dumop inicial con todos los datos base para el funcionamiento, incluyendo las tablas , PL's propias de la solución
Sistema Megamedia Contactos.

Este archivo se encuentra en : 

	Artefactos/dump-MegamediaDB-202407240320_MegamediaContactos_JULIO2024.tar

Adicionalmente se ha agregado uun archivo que contiene la creación de tablas , los inserts de datos base, y la creación de todos 
las funciones y procedimientos almacenados con los cuales trabaja la capa de servicios api rest, este archivo se agregfa para 
la lectura y entendimiento de la logica que trabajan con los datos como lo son los procedimientos con paginación en base de datos
para áreas de negocio y clientes entre otros, este archivo se en encuentra en:

	Artefactos/ScriptBase_SistemaMegamediaContactos.sql

Paso 1: Restaurar el Backupo Inicial

Se asume que se tiene claridad como instalar el cliente 'Dbeaver' y configurar una conexion a la base datos recién creada.

Con la base de datos en blanco y el archivo ya descargado : dump-MegamediaDB-202407240320_MegamediaContactos_JULIO2024.tar ya descargado
proceder a restaurar los objetos de la base de datos, para ello abrir el cliente , crear una nueva conexión a la base datos
y proceder a restaurar el backup:

Paso a Paso:

* Abrir y seleccionar herramientas > Herramientas Backup

![Restaurar Bakup](https://github.com/odonata/MegamediaContactos/blob/main/Artefactos/imagenes/herramientas_backup.png)

* Seleccionar herramientas > Restaurar Bakup

![Restaurar Bakup](https://github.com/odonata/MegamediaContactos/blob/main/Artefactos/imagenes/Restaurar_backup.png)

Esperar que termine la importación al motor de datos y salir, se puede verificar entrando 
al esquema público y deberia ver la siguiente estructura:

![Estructura de Objetos](https://github.com/odonata/MegamediaContactos/blob/main/Artefactos/imagenes/EstructuraDB.png)

Eso es todo ya se puede proicedeer a la instalacion de la parte Java

