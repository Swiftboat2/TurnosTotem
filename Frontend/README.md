
# TurnosTotem

TurnosTotem es un sistema de gestión de turnos diseñado para una empresa de Wi-Fi. Permite a los usuarios ingresar, seleccionar un destino y mostrar su información de turno. El sistema maneja tres destinos: Técnica, Consulta y Pago, con una interfaz intuitiva para que los operadores gestionen los turnos.

## Características

- **Gestión de Turnos**: Asignar y mostrar turnos para los tres destinos.
- **Actualizaciones en Tiempo Real**: Utiliza Socket.IO para mostrar la información actualizada.
- **Panel de Administración**: Ver y gestionar todos los turnos activos.
- **Almacenamiento de Datos**: Almacena la información de los turnos en una base de datos PostgreSQL.

## Instalación

### Backend
1. Clonar el repositorio:
   ```bash
   git clone https://github.com/Swiftboat2/TurnosTotem.git
   ```

2. Navegar al directorio `backend` e instalar dependencias:
   ```bash
   cd backend
   npm install
   ```

3. Configurar la conexión a la base de datos PostgreSQL.

4. Iniciar el servidor backend:
   ```bash
   npm start
   ```

### Frontend
1. Navegar al directorio `frontend` e instalar dependencias:
   ```bash
   cd frontend
   npm install
   ```

2. Iniciar el frontend:
   ```bash
   npm start
   ```

## Uso

- **Para Usuarios**: Los usuarios pueden registrarse ingresando su DNI y seleccionando un destino.
- **Para Operadores**: Los operadores pueden gestionar los turnos de cada destino desde el panel de administración.

## Licencia

Este proyecto está bajo la Licencia MIT.

---

# TurnosTotem

TurnosTotem is a queue management system designed for a Wi-Fi service company. It allows users to check in, select a destination, and display their queue information. The system handles three destinations: Técnica, Consulta, and Pago, with a user-friendly interface for operators to manage the queues.

## Features

- **Queue Management**: Assign and display queues for the three destinations.
- **Real-Time Updates**: Uses Socket.IO to display updated queue status.
- **Admin Panel**: View and manage all active queues.
- **Data Storage**: Stores queue data in a PostgreSQL database.

## Installation

### Backend
1. Clone the repository:
   ```bash
   git clone https://github.com/Swiftboat2/TurnosTotem.git
   ```

2. Navigate to the `backend` directory and install dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Configure the PostgreSQL database connection.

4. Start the backend server:
   ```bash
   npm start
   ```

### Frontend
1. Navigate to the `frontend` directory and install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Start the frontend:
   ```bash
   npm start
   ```

## Usage

- **For Users**: Users can check in by entering their DNI and selecting a destination.
- **For Operators**: Operators can manage the queues for each destination from the admin panel.

## License

This project is licensed under the MIT License.
