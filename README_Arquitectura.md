# Conceptos, Solución y Arquitectura

## Conceptualizacion de la solución para Megamedia

Investigando lo que hace Megamnedia como holding, se peuyde ver diversas áreas de negocio, con ellas se modeló la base de datos 
considerando que se deben registrar lás áreas de negocio: 

1. Anunciantes y Publicidad:

   * Empresas nacionales e internacionales que buscan promover sus productos y servicios a través de los diferentes canales de Megamedia, tales como televisión, radio, y plataformas digitales.
2. gencias de Publicidad y Medios:

   * Agenncias que gestionan las campañas publicitarias para sus clientes y compran espacios publicitarios en los medios de Megamedia.
3. Audiencia General:

   * Los televidentes, oyentes y usuarios de las plataformas digitales que consumen contenido informativo, entretenimiento y otros programas ofrecidos por Megamedia.
4. Empresas de Medición y Análisis:

   * Compañías que analizan y reportan las audiencias y el impacto de los contenidos y anuncios transmitidos a través de los medios de Megamedia.
5. Empresas Tecnológicas y Proveedores de Servicios:

   * Proveedores de tecnología, software y otros servicios relacionados con la producción y distribución de contenido.
6. Clientes Corporativos:

   * Aresas que utilizan los servicios de producción de contenido, organización de eventos, y otros servicios ofrecidos por Megamedia para sus necesidades corporativas.

Clientes por área de negocios:

1. Anunciantes y Publicidad:

   * Retail: Falabella, Ripley, Paris
   * Automotriz: Chevrolet, Hyundai, Toyota
   * Telecomunicaciones: Entel, Movistar, Claro
   * Bancos y Servicios Financieros: Banco de Chile, Banco Santander, BCI
   * Alimentos y Bebidas: Coca-Cola, Nestlé, CCU

2.Agencias de Publicidad y Medios:

   * Agencias de Publicidad: BBDO, McCann, Ogilvy
   * Agencias de Medios: Mindshare, GroupM, Initiative

3.Empresas Tecnológicas y Proveedores de Servicios:

  * Tecnología: Samsung, Sony, LG
  * Software y Servicios Digitales: Microsoft, Oracle, IBM

4.Clientes Corporativos:

  * Salud: Clínica Alemana, Red Salud, Bupa
  * Energía: Enel, Copec, Arauco

  por lo que se modeló una base de datos de clientes que se basa en :

  * Áreas de Neogio —> Clientes por Área de Negocio

## Arquitectura

1. Diagrama de Arquitectura de Componentes

   * Front-End (Django)
   * Descripción: Sistema web para contactos.
   * Tecnología: Django (versión 4.2), Python 3.10
   * Comunicación: Envía solicitudes API REST con seguridad via API Key a la capa de servicios Java Spring Boot.
   * Capa de Servicios (Java Spring Boot)
   * Descripción: Procesa solicitudes API REST, maneja la lógica de negocio.
   * Tecnología: Java Spring Boot (versión 1.8)
   * Comunicación: Realiza consultas, actualizaciones, inserciones y eliminaciones en la base de datos PostgreSQL.
   * Base de Datos (PostgreSQL)
   * Descripción: Almacena datos.
   * Nombre: MegamediosDB
   * Tecnología: PostgreSQL


![Arquitectura](https://github.com/odonata/MegamediaContactos/blob/main/Artefactos/imagenes/MegamediaContactos_ArquitecturaComponentes.png)


2. Diagrama de Secuencia

	1.	Front-End (Django)
   
       * Envía una solicitud (consulta, actualización, inserción o eliminación) a la Capa de Servicios (Java Spring Boot) con un API Key.
   
	2.	Capa de Servicios (Java Spring Boot)
   
       * Recibe la solicitud.
       * Procesa la solicitud según el tipo de operación.
       * Realiza la operación correspondiente en la Base de Datos (PostgreSQL).
   
	3.	Base de Datos (PostgreSQL)
   
       * Ejecuta la operación solicitada (consulta, actualización, inserción o eliminación).
       * Devuelve el resultado a la Capa de Servicios (Java Spring Boot).

	4.	Capa de Servicios (Java Spring Boot)
   
       * Devuelve el resultado al Front-End (Django).

![Secuencia](https://github.com/odonata/MegamediaContactos/blob/main/Artefactos/imagenes/Megamedia_Scuencia.png)

3. Front End

![login](https://github.com/odonata/MegamediaContactos/blob/main/Artefactos/imagenes/InicioApp.png)
![1](https://github.com/odonata/MegamediaContactos/blob/main/Artefactos/imagenes/Frontend/1.png)
![2](https://github.com/odonata/MegamediaContactos/blob/main/Artefactos/imagenes/Frontend/2.png)
![3](https://github.com/odonata/MegamediaContactos/blob/main/Artefactos/imagenes/Frontend/3.png)
![4](https://github.com/odonata/MegamediaContactos/blob/main/Artefactos/imagenes/Frontend/4.png)
![5](https://github.com/odonata/MegamediaContactos/blob/main/Artefactos/imagenes/Frontend/5.png)
![6](https://github.com/odonata/MegamediaContactos/blob/main/Artefactos/imagenes/Frontend/6.png)
![7](https://github.com/odonata/MegamediaContactos/blob/main/Artefactos/imagenes/Frontend/7.png)
![8](https://github.com/odonata/MegamediaContactos/blob/main/Artefactos/imagenes/Frontend/8.png)
![9](https://github.com/odonata/MegamediaContactos/blob/main/Artefactos/imagenes/Frontend/9.png)
![10](https://github.com/odonata/MegamediaContactos/blob/main/Artefactos/imagenes/Frontend/10.png)
![11](https://github.com/odonata/MegamediaContactos/blob/main/Artefactos/imagenes/Frontend/11.png)
![12](https://github.com/odonata/MegamediaContactos/blob/main/Artefactos/imagenes/Frontend/12.png)
![13](https://github.com/odonata/MegamediaContactos/blob/main/Artefactos/imagenes/Frontend/13.png)
![14](https://github.com/odonata/MegamediaContactos/blob/main/Artefactos/imagenes/Frontend/14.png)
![15](https://github.com/odonata/MegamediaContactos/blob/main/Artefactos/imagenes/Frontend/15.png)
