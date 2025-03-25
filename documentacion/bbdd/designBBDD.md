# **Diseño de la Base de Datos para el Backend de la Aplicación DOT & DOT**  

Este documento describe la estructura de la base de datos del backend de la aplicación **DOT & DOT**, estableciendo las clases y tablas que permitirán la gestión eficiente de la información relacionada con jugadores, equipos, partidos y arbitraje.  

## **1. Estructura de Clases Base en el Backend**  

Para organizar los datos de manera estructurada y escalable, se han definido las siguientes clases principales:  

### **1.1 Persona**  
Las personas dentro del sistema pueden desempeñar diferentes roles según su función en el ámbito deportivo:  
- **Jugador**  
- **Entrenador**  
- **Técnico**  
- **Árbitro**  

### **1.2 Equipo**  
- Representa a un grupo de jugadores registrados en el sistema.  
- Se puede asociar a un **partido** como "Equipo en Partido".  

### **1.3 Club**  
- Institución a la que pertenece un equipo.  

### **1.4 Ciudad**  
- Registro de las ciudades donde se encuentran los clubes, canchas y donde se disputan los partidos.  

### **1.5 Cancha**  
- Lugar donde se desarrollan los partidos.  

### **1.6 Detalles del Partido**  
- Información específica sobre cada partido, incluyendo fecha, hora y equipos participantes.  

### **1.7 Situación de Inicio**  
- Condiciones iniciales del partido, como alineaciones y configuraciones previas.  

### **1.8 Equipo Arbitral**  
- Conjunto de árbitros designados para un partido.  

### **1.9 Observaciones**  
- Registro de comentarios o incidencias durante el partido.  

### **1.10 Sanción**  
- Historial de sanciones impuestas a jugadores o equipos.  

### **1.11 Set**  
- División del partido en sets, según la modalidad del juego.  

### **1.12 Alineación**  
- Listado de jugadores titulares y suplentes de cada equipo en un partido.  

### **1.13 Punto**  
- Registro detallado de los puntos obtenidos en el partido.  

### **1.14 Resultado**  
- Resultado final del partido, basado en los sets ganados.  

### **1.15 Puntaje**  
- Acumulado de puntos obtenidos por los equipos en torneos o ligas.  


<div style="page-break-after: always;"></div>

## **2. Seguridad con Spring Security**  
---
Para garantizar la autenticación y autorización en el sistema, se implementa **Spring Security** con la siguiente estructura:  

### **2.1 User**  
- Representa a los usuarios que pueden acceder a la aplicación.  

### **2.2 Role**  
- Define los roles disponibles en el sistema (administrador, árbitro, jugador, etc.).  

### **2.3 Role per User**  
- Asociación entre usuarios y roles, permitiendo asignaciones personalizadas.  


<div style="page-break-after: always;"></div>

## **3. Modelo Relacional – Tablas**  
---
A continuación, se presentan las tablas principales del sistema junto con sus relaciones.  

### **3.1 Tabla Persona**  
Contiene la información básica de todas las personas dentro del sistema.  
![TABLA-PERSONAS](diagramas/personas.svg)  

### **3.2 Tabla Jugador**  
Información específica de los jugadores registrados.  
![TABLA-JUGADOR](diagramas/jugadores.svg)  

<div style="page-break-after: always;"></div>

### **3.3 Tabla Entrenador**  
Detalles sobre los entrenadores de los equipos.  
![TABLA-ENTRENADORES](diagramas/entrenadores.svg)  

### **3.4 Tabla Técnico**  
Información de los técnicos del equipo.  
![TABLA-TÉCNICOS](diagramas/tecnicos.svg)  

### **3.5 Tabla Equipo**  
Registro de los equipos que participan en la competencia.  
![TABLA-EQUIPOS](diagramas/equipo.svg)  

### **3.6 Tabla Club**  
Información sobre los clubes deportivos.  
![TABLA-CLUBES](diagramas/club.svg)  

<div style="page-break-after: always;"></div>

### **3.7 Tabla Ciudad**  
Ciudades registradas en el sistema.  
![TABLA-CIUDAD](diagramas/ciudades.svg)  

### **3.8 Tabla Cancha**  
Registro de las canchas donde se disputan los partidos.  
![TABLA-CANCHA](diagramas/cancha.svg)  

### **3.9 Tabla Detalles del Partido**  
Información detallada de cada partido disputado.  
![TABLA-DETALLESPARTIDO](diagramas/detallesPartido.svg)  

<div style="page-break-after: always;"></div>

### **3.10 Tabla Situación de Inicio**  
Información sobre la situación de inicio de cada partido.  
![TABLA-SITUACIONPARTIDO](diagramas/situacionInicioPartido.svg) 

### **3.11 Tabla Árbitros**  
Información sobre los árbitros.  
![TABLA-ARBITRO](diagramas/arbitro.svg) 

### **3.12 Tabla Equipos Arbitrales**  
Información sobre los conjuntos de árbitros.  
![TABLA-EQUIPOARBITRAL](diagramas/equipoArbitral.svg) 

### **3.13 Tabla Observaciones**  
Información sobre las observaciones de los partidos.  
![TABLA-OBSERVACION](diagramas/observaciones.svg) 

---

### **3.13 Tabla Sanción**  
Contiene las sanciones impuestas.  
![TABLA-OBSERVACION](diagramas/sancion.svg) 


Este modelo de base de datos permite estructurar de manera eficiente la información del sistema, asegurando una gestión óptima de jugadores, equipos y partidos.
