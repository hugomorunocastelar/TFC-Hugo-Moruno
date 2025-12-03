# **[DOT & DOT] Diseño de Base de Datos**  

Este documento describe la estructura de la base de datos del backend de la aplicación **DOT & DOT**, estableciendo las tablas que permitirán la gestión eficiente de la información relacionada con jugadores, equipos, partidos y arbitraje.  

**Base de Datos**: MySQL  
**ORM**: JPA/Hibernate  
**Generación de IDs**: AUTO_INCREMENT (GenerationType.IDENTITY)  

## **1. Estructura de Entidades del Sistema**  

El sistema se organiza en los siguientes módulos de entidades:  

### **1.1 Módulo de Personas**  
- **Person** - Datos básicos de personas (DNI, nombre, apellidos, fecha nacimiento, dirección, teléfono, email, verificaciones, tutor)
- **Player** - Jugadores (hereda de Person, añade número camiseta, equipo, categoría)
- **Coach** - Entrenadores (hereda de Person, añade licencia, nivel, equipo)
- **Referee** - Árbitros (hereda de Person, añade licencia, nivel, ciudad)

### **1.2 Módulo de Clubes y Equipos**  
- **Club** - Instituciones deportivas (nombre, ciudad)
- **Team** - Equipos (nombre, capitán, club, categoría)

### **1.3 Módulo de Lugares**  
- **City** - Ciudades (nombre, región, rango CP)
- **Gameplace** - Pabellones/Canchas (nombre, dirección, número de pistas, ciudad)

### **1.4 Módulo de Competiciones**  
- **Season** - Temporadas (nombre, fecha inicio/fin, estado activo)
- **Competition** - Competiciones (nombre, fecha inicio/fin)
- **League** - Ligas (nombre, categoría, competición, prefijo código)
<div style="page-break-after: always;"></div>

### **1.5 Módulo de Partidos**  
- **Game** - Partido principal (código único, detalles, situación inicial, equipo arbitral, observaciones, sets, sanciones, resultado, estados playing/finished, relevancia, liga)
- **GameDetails** - Detalles del partido (categoría, división, competición, ciudad, fecha, hora inicio)
- **GameInitialSituation** - Situación inicial (equipos local/visitante, equipo que saca/recibe, posiciones izquierda/derecha)
- **GameRefereeTeam** - Equipo arbitral asignado
- **GameObservations** - Observaciones del partido
- **GameSet** - Sets del partido (código único, número set, puntos local/visitante, horas inicio/fin, alineaciones)
- **GameSanctions** - Sanciones (tipo, equipo, marcador, timestamp)
- **GameResult** - Resultado final (ganador, perdedor, horas, duración, sets ganados)

### **1.6 Módulo de Autenticación**  
- **User** - Usuarios del sistema (username, email, password cifrado, enabled, verified, roles, timestamps)
- **Role** - Roles del sistema (ROLE_ADMIN, ROLE_REFEREE, ROLE_USER)
- **VerificationToken** - Tokens de verificación de email
<div style="page-break-after: always;"></div>

## **2. Enumeraciones del Sistema**  

### **2.1 Category**  
Define las categorías deportivas:
- PRE_BENJAMIN(0, "Pre-Benjamin", 6, 7)
- BENJAMIN(1, "Benjamin", 8, 9)
- ALEVIN(2, "Alevin", 10, 11)
- INFANTILE(3, "Infantile", 12, 13)
- CADET(4, "Cadet", 14, 15)
- YOUTH(5, "Youth", 16, 17)
- JUNIOR(6, "Junior", 18, 19)
- ABSOLUTE(7, "Absolute", 20, 39)
- SENIOR(8, "Senior", 40, 99)

### **2.2 Division**  
Define las divisiones competitivas:
- MIXED('X', "Mixed")
- FEMININE('F', "Feminine")
- MASCULINE('M', "Masculine")

### **2.3 SanctionType**  
Define los tipos de sanciones:
- INDIVIDUAL('I', "Individual"),
- COACH('C', "Coach"),
- ASSISTANT_COACH('A', "Assistant Coach"),
- SUPPORT('T', "Support"),
- IMPROPER('S', "Improper solicitude"),
- DELAY('D', "Delay"); 


<div style="page-break-after: always;"></div>

## **3. Seguridad con Spring Security**  

El sistema implementa **Spring Security** con autenticación basada en JWT y gestión de roles.

### **3.1 Usuarios (users)**  
Almacena las credenciales y estado de los usuarios del sistema:
- **username**: Identificador único para login
- **email**: Correo electrónico único
- **password**: Contraseña cifrada con BCrypt
- **enabled**: Usuario habilitado/deshabilitado
- **verified**: Estado de verificación del email

### **3.2 Roles (roles)**  
Define los roles disponibles en el sistema:
- **ROLE_ADMIN**: Acceso completo al sistema
- **ROLE_REFEREE**: Gestión de partidos asignados
- **ROLE_USER**: Acceso a funciones básicas (favoritos, visualización)

### **3.3 Relación Usuario-Rol (user_roles)**  
Tabla intermedia que permite asignar múltiples roles a un usuario mediante una relación Many-to-Many.

### **3.4 Verificación de Email (verification_token)**  
Gestiona tokens temporales para:
- Verificación de registro de nuevos usuarios
- Recuperación de contraseña (forgot/reset password)
- Tokens con fecha de expiración

### **3.5 Autenticación JWT**  
El sistema utiliza:
- **Access Token**: Token principal con tiempo de vida limitado
- **Refresh Token**: Token para renovar el access token sin re-login
- **Cookies HttpOnly**: Almacenamiento seguro de tokens en el cliente


<div style="page-break-after: always;"></div>

## **4. Tablas Principales del Sistema**  

### **4.1 Tabla: person**  
Almacena información básica de todas las personas del sistema.

#### **Original**
![TABLA-PERSONAS](diagramas/personas.svg)

#### **Final**
| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | BIGINT | PK, AUTO_INCREMENT | Identificador único |
| dni | VARCHAR(12) | UNIQUE, NOT NULL | DNI de la persona |
| name | VARCHAR(20) | NOT NULL | Nombre |
| surnames | VARCHAR(60) | NOT NULL | Apellidos |
| birth_date | DATE | NOT NULL | Fecha de nacimiento |
| address | VARCHAR(100) | | Dirección |
| phone | VARCHAR(25) | | Teléfono |
| email | VARCHAR(70) | | Email |
| dni_verified | BOOLEAN | NOT NULL | DNI verificado |
| tutored | BOOLEAN | NOT NULL | Es tutelado (menor) |
| tutor_id | BIGINT | FK → person(id) | Tutor si es menor |  
<div style="page-break-after: always;"></div>

### **4.2 Tabla: player**  
Jugadores registrados en el sistema.

#### **Original**
![TABLA-JUGADOR](diagramas/jugadores.svg)

#### **Final**
| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | BIGINT | PK, AUTO_INCREMENT | Identificador único |
| no_shirt | INT | NOT NULL | Número de camiseta |
| team_id | BIGINT | FK → team(id) | Equipo al que pertenece |
| person_id | BIGINT | FK → person(id), UNIQUE | Persona asociada |  

<div style="page-break-after: always;"></div>

### **4.3 Tabla: coach**  
Entrenadores de equipos.

#### **Original**
![TABLA-ENTRENADORES](diagramas/entrenadores.svg)

#### **Final**
| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | BIGINT | PK, AUTO_INCREMENT | Identificador único |
| license_number | VARCHAR(50) | | Número de licencia |
| license_level | VARCHAR(50) | | Nivel de licencia |
| team_id | BIGINT | FK → team(id) | Equipo al que pertenece |
| person_id | BIGINT | FK → person(id), UNIQUE | Persona asociada |  
<div style="page-break-after: always;"></div>

### **4.4 Tabla: referee**  
Árbitros del sistema.

#### **Original**
![TABLA-ARBITRO](diagramas/arbitro.svg)

#### **Final**
| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | BIGINT | PK, AUTO_INCREMENT | Identificador único |
| license_number | VARCHAR(50) | | Número de licencia |
| license_level | VARCHAR(50) | | Nivel de licencia |
| city_id | BIGINT | FK → city(id) | Ciudad de residencia |
| person_id | BIGINT | FK → person(id), UNIQUE | Persona asociada |  
<div style="page-break-after: always;"></div>

### **4.5 Tabla: club**  
Clubes deportivos.

#### **Original**
![TABLA-CLUBES](diagramas/club.svg)

#### **Final**
| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | BIGINT | PK, AUTO_INCREMENT | Identificador único |
| name | VARCHAR(50) | NOT NULL | Nombre del club |
| city_id | BIGINT | FK → city(id) | Ciudad del club |  
<div style="page-break-after: always;"></div>

### **4.6 Tabla: team**  
Equipos registrados.

#### **Original**
![TABLA-EQUIPOS](diagramas/equipo.svg)

#### **Final**
| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | BIGINT | PK, AUTO_INCREMENT | Identificador único |
| name | VARCHAR(50) | NOT NULL | Nombre del equipo |
| dni_captain_id | BIGINT | FK → person(id), NOT NULL | Capitán del equipo |
| id_club_id | BIGINT | FK → club(id), NOT NULL | Club al que pertenece |
| category | ENUM | NOT NULL | Categoría del equipo |  
<div style="page-break-after: always;"></div>

### **4.7 Tabla: city**  
Ciudades registradas.

#### **Original**
![TABLA-CIUDAD](diagramas/ciudades.svg)

#### **Final**
| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | BIGINT | PK, AUTO_INCREMENT | Identificador único |
| name | VARCHAR(50) | NOT NULL | Nombre de la ciudad |
| region | VARCHAR(50) | | Región/Provincia |
| cp_range | VARCHAR(20) | | Rango de códigos postales |  
<div style="page-break-after: always;"></div>

### **4.8 Tabla: gameplace**  
Pabellones y canchas.

#### **Original**
![TABLA-CANCHA](diagramas/cancha.svg)

#### **Final**
| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | BIGINT | PK, AUTO_INCREMENT | Identificador único |
| name | VARCHAR(50) | NOT NULL | Nombre del pabellón |
| gamefields | INT | NOT NULL, DEFAULT 1 | Número de pistas |
| address | VARCHAR(100) | NOT NULL | Dirección |
| id_city | BIGINT | FK → city(id) | Ciudad donde está ubicado |  

<div style="page-break-after: always;"></div>

### **4.9 Tabla: season**  
Temporadas deportivas.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | BIGINT | PK, AUTO_INCREMENT | Identificador único |
| name | VARCHAR(20) | NOT NULL | Nombre (ej: "2024-2025") |
| start_date | DATE | NOT NULL | Fecha de inicio |
| end_date | DATE | NOT NULL | Fecha de finalización |
| active | BOOLEAN | NOT NULL | Temporada activa |

### **4.10 Tabla: competition**  
Competiciones.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | BIGINT | PK, AUTO_INCREMENT | Identificador único |
| name | VARCHAR(50) | NOT NULL | Nombre de la competición |
| day_start | DATE | NOT NULL | Fecha de inicio |
| day_end | DATE | NOT NULL | Fecha de finalización |

### **4.11 Tabla: league**  
Ligas dentro de competiciones.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | BIGINT | PK, AUTO_INCREMENT | Identificador único |
| name | VARCHAR(50) | NOT NULL | Nombre de la liga |
| category | ENUM | NOT NULL | Categoría |
| competition_id | BIGINT | FK → competition(id), NOT NULL | Competición a la que pertenece |
| code_prefix | VARCHAR(20) | UNIQUE, NOT NULL | Prefijo para códigos de partido |
<div style="page-break-after: always;"></div>

### **4.12 Tabla: game**  
Partidos del sistema.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | BIGINT | PK, AUTO_INCREMENT | Identificador único |
| unique_code | VARCHAR(50) | UNIQUE, NOT NULL | Código único del partido |
| playing | BOOLEAN | NOT NULL, DEFAULT false | Partido en curso |
| finished | BOOLEAN | NOT NULL, DEFAULT false | Partido finalizado |
| relevance | INT | DEFAULT 0 | Nivel de relevancia |
| league_id | BIGINT | FK → league(id) | Liga a la que pertenece |
<div style="page-break-after: always;"></div>

### **4.13 Tabla: game_details**  
Detalles de cada partido.

#### **Original**
![TABLA-DETALLESPARTIDO](diagramas/detallesPartido.svg)

#### **Final**
| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | BIGINT | PK, AUTO_INCREMENT | Identificador único |
| unique_code | VARCHAR(50) | FK → game(unique_code), UNIQUE | Referencia al partido |
| category | ENUM | | Categoría |
| division | ENUM | | División |
| competition_id | BIGINT | FK → competition(id) | Competición |
| city_id | BIGINT | FK → city(id) | Ciudad |
| date | DATE | | Fecha del partido |
| time_start | TIMESTAMP | | Hora de inicio |  
<div style="page-break-after: always;"></div>

### **4.14 Tabla: game_initial_situation**  
Situación inicial del partido.

#### **Original**
![TABLA-SITUACIONPARTIDO](diagramas/situacionInicioPartido.svg)

#### **Final**
| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | BIGINT | PK, AUTO_INCREMENT | Identificador único |
| unique_code | VARCHAR(50) | FK → game(unique_code), UNIQUE | Referencia al partido |
| local_team_id | BIGINT | FK → team(id) | Equipo local |
| visit_team_id | BIGINT | FK → team(id) | Equipo visitante |
| serving_team_id | BIGINT | FK → team(id) | Equipo que saca |
| receiving_team_id | BIGINT | FK → team(id) | Equipo que recibe |
| left_team_id | BIGINT | FK → team(id) | Equipo a la izquierda |
| right_team_id | BIGINT | FK → team(id) | Equipo a la derecha |  

<div style="page-break-after: always;"></div>

### **4.15 Tabla: game_set**  
Sets de los partidos.

#### **Original**
![TABLA-SET](diagramas/set.svg)

#### **Final**
| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | BIGINT | PK, AUTO_INCREMENT | Identificador único |
| unique_code | VARCHAR(50) | FK → game(unique_code), NOT NULL | Referencia al partido |
| set_number | INT | NOT NULL | Número del set (1-5) |
| points_local | INT | DEFAULT 0 | Puntos equipo local |
| points_visit | INT | DEFAULT 0 | Puntos equipo visitante |
| time_start | TIMESTAMP | NOT NULL | Hora de inicio |
| time_end | TIMESTAMP | | Hora de finalización |
| local_alignment | VARCHAR(255) | NOT NULL | Alineación local (JSON) |
| visit_alignment | VARCHAR(255) | NOT NULL | Alineación visitante (JSON) |  

<div style="page-break-after: always;"></div>

### **4.16 Tabla: game_referee_team**  
Equipo arbitral asignado al partido.

#### **Original**
![TABLA-EQUIPOARBITRAL](diagramas/equipoArbitral.svg)

#### **Final**
| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | BIGINT | PK, AUTO_INCREMENT | Identificador único |
| unique_code | VARCHAR(50) | FK → game(unique_code), UNIQUE | Referencia al partido |
| principal_referee_id | BIGINT | FK → referee(id), NOT NULL | Árbitro principal |
| secondary_referee_id | BIGINT | FK → referee(id) | Árbitro secundario |
| scorer_id | BIGINT | FK → referee(id) | Anotador |
| line_referee_1_id | BIGINT | FK → referee(id) | Juez de línea 1 |
| line_referee_2_id | BIGINT | FK → referee(id) | Juez de línea 2 |
| line_referee_3_id | BIGINT | FK → referee(id) | Juez de línea 3 |
| line_referee_4_id | BIGINT | FK → referee(id) | Juez de línea 4 |  
<div style="page-break-after: always;"></div>

### **4.17 Tabla: game_observations**  
Observaciones del partido.

#### **Original**
![TABLA-OBSERVACION](diagramas/observaciones.svg)

#### **Final**
| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | BIGINT | PK, AUTO_INCREMENT | Identificador único |
| unique_code | VARCHAR(50) | FK → game(unique_code), UNIQUE | Referencia al partido |
| description | TEXT | | Observaciones del partido |  
<div style="page-break-after: always;"></div>

### **4.18 Tabla: game_sanctions**  
Sanciones durante partidos.

#### **Original**
![TABLA-SANCION](diagramas/sancion.svg)

#### **Final**
| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | BIGINT | PK, AUTO_INCREMENT | Identificador único |
| game_id | BIGINT | FK → game(id) | Partido |
| type | ENUM | NOT NULL | Tipo de sanción |
| team_id | BIGINT | | Equipo sancionado |
| marcador | VARCHAR(20) | | Marcador al momento |
| timestamp | TIMESTAMP | | Momento de la sanción |  
<div style="page-break-after: always;"></div>

### **4.19 Tabla: game_result**  
Resultados finales de partidos.

#### **Original**
![TABLA-RESULTADO](diagramas/resultado.svg)

#### **Final**
| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | BIGINT | PK, AUTO_INCREMENT | Identificador único |
| game_id | BIGINT | FK → game(id), UNIQUE | Partido |
| winner_id | BIGINT | FK → team(id) | Equipo ganador |
| loser_id | BIGINT | FK → team(id) | Equipo perdedor |
| time_start | TIMESTAMP | | Hora de inicio |
| time_end | TIMESTAMP | | Hora de finalización |
| duration | BIGINT | | Duración en milisegundos |
| sets_won_by_local | INT | | Sets ganados por local |
| sets_won_by_visit | INT | | Sets ganados por visitante |  
<div style="page-break-after: always;"></div>

### **4.20 Tabla: users**  
Usuarios del sistema.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | BIGINT | PK, AUTO_INCREMENT | Identificador único |
| username | VARCHAR(50) | UNIQUE, NOT NULL | Nombre de usuario |
| email | VARCHAR(100) | UNIQUE, NOT NULL | Email |
| password | VARCHAR(255) | NOT NULL | Contraseña cifrada (BCrypt) |
| enabled | BOOLEAN | DEFAULT true | Usuario habilitado |
| verified | BOOLEAN | DEFAULT false | Email verificado |
| created_at | TIMESTAMP | | Fecha de creación |
| updated_at | TIMESTAMP | | Última actualización |

### **4.21 Tabla: roles**  
Roles del sistema.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | BIGINT | PK, AUTO_INCREMENT | Identificador único |
| name | VARCHAR(20) | NOT NULL | Nombre del rol |
| created_at | TIMESTAMP | | Fecha de creación |
| updated_at | TIMESTAMP | | Última actualización |

### **4.22 Tabla: user_roles** (Tabla de relación)  
Asociación entre usuarios y roles.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| user_id | BIGINT | FK → users(id) | Usuario |
| role_id | BIGINT | FK → roles(id) | Rol |
| | | PK (user_id, role_id) | Clave primaria compuesta |
<div style="page-break-after: always;"></div>

### **4.23 Tabla: verification_token**  
Tokens de verificación de email.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | BIGINT | PK, AUTO_INCREMENT | Identificador único |
| token | VARCHAR(255) | UNIQUE, NOT NULL | Token único |
| user_id | BIGINT | FK → users(id) | Usuario asociado |
| expiry_date | TIMESTAMP | NOT NULL | Fecha de expiración |

<div style="page-break-after: always;"></div>

## **5. Relaciones y Restricciones**  

### **5.1 Relaciones entre Personas**
- **person → person**: Una persona puede ser tutor de otra (menores de edad).
- **person ↔ player**: Relación OneToOne entre persona y jugador.
- **person ↔ coach**: Relación OneToOne entre persona y entrenador.
- **person ↔ referee**: Relación OneToOne entre persona y árbitro.

### **5.2 Relaciones de Equipos**
- **team → person**: Un equipo tiene un capitán (persona).
- **team → club**: Un equipo pertenece a un club.
- **player → team**: Un jugador pertenece a un equipo.
- **coach → team**: Un entrenador pertenece a un equipo.

### **5.3 Relaciones Geográficas**
- **club → city**: Un club pertenece a una ciudad.
- **gameplace → city**: Un pabellón está en una ciudad.
- **referee → city**: Un árbitro reside en una ciudad.

### **5.4 Relaciones de Competición**
- **league → competition**: Una liga pertenece a una competición.
- **league → category**: Una liga tiene una categoría específica.
- **game → league**: Un partido pertenece a una liga.

### **5.5 Relaciones de Partido**
- **game_details → game**: Relación OneToOne por unique_code.
- **game_initial_situation → game**: Relación OneToOne por unique_code.
- **game_initial_situation → team**: Referencias a equipos local, visitante, que saca, que recibe, izquierda, derecha.
- **game_referee_team → game**: Relación OneToOne por unique_code.
- **game_referee_team → referee**: Referencias a árbitro principal (obligatorio), secundario, anotador, jueces de línea.
- **game_observations → game**: Relación OneToOne por unique_code.
- **game_set → game**: Un partido tiene múltiples sets (OneToMany).
- **game_sanctions → game**: Un partido puede tener múltiples sanciones.
- **game_result → game**: Un partido tiene un resultado final (OneToOne).
<div style="page-break-after: always;"></div>

### **5.6 Relaciones de Autenticación**
- **users ↔ roles**: Relación ManyToMany mediante tabla user_roles.
- **verification_token → users**: Un token pertenece a un usuario.

### **5.7 Restricciones de Integridad**
- **Claves únicas**: dni, email, username, token, unique_code, code_prefix.
- **Validaciones**: DNI verificado, email verificado, temporada activa.
- **Enumeraciones**: Categorías, divisiones, tipos de sanción predefinidos.
- **Fechas**: Validación de rangos (fecha inicio < fecha fin).

Este modelo de base de datos permite estructurar de manera eficiente la información del sistema, asegurando una gestión óptima de personas, clubes, competiciones y partidos con las correspondientes relaciones e integridad referencial.

<div style="page-break-after: always;"></div>

## **6. Diagramas de Sistemas Completos**

### **6.1 Sistema de Personas**
Sistema de almacenamiento de las tablas referentes a personas.  
![TABLAS-PERSONAS](diagramas/1-sistema-personas.svg)

<div style="page-break-after: always;"></div>

### **6.2 Sistema de Equipos**
Sistema de almacenamiento de las tablas referentes a los equipos.  
![TABLAS-EQUIPOS](diagramas/2-sistema-equipos.svg)

### **6.3 Sistema Arbitral**
Sistema de almacenamiento de las tablas referentes a los equipos arbitrales.  
![TABLAS-ARBITRALES](diagramas/3-sistema-arbitral.svg)

<div style="page-break-after: always;"></div>

### **6.4 Sistema de Partidos**
Sistema de almacenamiento de las tablas referentes a los partidos.  
![TABLAS-PARTIDOS](diagramas/4-sistema-partidos.svg)