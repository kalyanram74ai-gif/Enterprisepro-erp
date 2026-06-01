# EnterprisePro ERP

EnterprisePro ERP is a full-stack enterprise resource planning application for operations, sales, finance, procurement, inventory, HR, and system administration.

## Overview

This repository contains:

- Backend: Spring Boot 3 + Java 17 + JPA + JWT + MySQL/H2
- Frontend: React + Vite + Tailwind CSS
- Database support: MySQL and embedded H2 for local development
- API docs: Swagger/OpenAPI via SpringDoc

## Prerequisites

- Java 17 or newer
- Maven 3.9+
- Node.js 18 or newer
- npm 9 or newer
- MySQL 8.x (optional for production profile)

## Installation

### 1) Clone the repository

```bash
git clone <repository-url>
cd enterprisepro-erp
```

### 2) Install frontend dependencies

```bash
npm install --prefix frontend
```

### 3) Configure environment

The backend reads configuration from `backend/src/main/resources/application.properties` and optional profile-specific files such as `application-mysql.properties`.

For local development, make sure the database connection settings are valid. By default, the app uses an H2 in-memory database unless a MySQL profile is selected.

## Build

### Backend

```bash
mvn -f backend/pom.xml clean package
```

### Frontend

```bash
npm --prefix frontend run build
```

## Run

### Backend

```bash
mvn -f backend/pom.xml spring-boot:run
```

This starts the REST API on the default Spring Boot port.

### Frontend

```bash
npm --prefix frontend run dev
```

The frontend is served by Vite and is typically available at `http://localhost:5173`.

### Full stack using Docker

```bash
docker build -t enterprisepro-erp .
docker run -p 8080:8080 enterprisepro-erp
```

## Project structure

```text
backend/     Spring Boot backend
frontend/    React frontend
README.md    Project overview and run instructions
```

## Features

- Employee and department management
- Attendance, leave, and payroll tracking
- Inventory, warehouse, and logistics workflows
- Procurement and vendor management
- Finance, accounting, and reporting
- Sales and CRM pipelines
- Projects, assets, and manufacturing BOMs
- Audit and system configuration tools

## Default admin access

The application includes a seeded default admin user for initial setup as defined in the backend initializer.

## License

This project is proprietary software. All rights reserved.
