# EN2H Backend Engineering Internship - Booking Platform REST API

This repository contains a clean, production ready Booking Platform REST API built for the EN2H Software Engineer Intern technical assessment. The architecture is designed using NestJS modular best practices, featuring strong data validation, JWT authentication and automated local data persistence using TypeORM and SQLite.

---

## 🛠️ Project Architecture & Structure

The codebase utilizes a clean folder hierarchy split into specialized functional domains:
* **`src/auth/`**: Core user validation architecture, JWT token strategy and endpoint access guards.
* **`src/services/`**: System structures to create, modify, list and fetch details for individual platform offerings.
* **`src/bookings/`**: Complex business validation rules, appointment slot locking and customer reservation scheduling models.

```text
en2h-booking-platform/
├── src/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts
│   │   ├── jwt.strategy.ts
│   │   └── jwt-auth.guard.ts
│   ├── services/
│   │   ├── dto/
│   │   │   └── create-service.dto.ts
│   │   ├── service.entity.ts
│   │   ├── services.controller.ts
│   │   ├── services.module.ts
│   │   └── services.service.ts
│   ├── bookings/
│   │   ├── dto/
│   │   │   ├── create-booking.dto.ts
│   │   │   └── update-booking-status.dto.ts
│   │   ├── booking.entity.ts
│   │   ├── bookings.controller.ts
│   │   ├── bookings.module.ts
│   │   └── bookings.service.ts
│   ├── app.module.ts
│   └── main.ts
├── .env
├── .env.example
└── package.json
```

---

## 🚀 Installation & Setup Instructions

### 1. Clone the Project
Open your computer's terminal, navigate to your desired directory and download the repository:
```bash
git clone <your-github-repository-url>
cd en2h-booking-platform
```

### 2. Install Project Packages
Install the required framework files, data models and cryptography tools:
```bash
npm install
```

### 3. Setup Environment Configurations
Create a .env file in the root folder (at the same level as package.json). Copy the structure from .env.example and supply a secret key string:
```Code Snippet
PORT=3000
JWT_SECRET=
JWT_EXPIRATION=1d
```

### 4. Database Initialization
This application utilizes an embedded SQLite configuration. There are no extra database server installations or migrations to execute manually. The schema maps out and initializes the database.sqlite file automatically upon booting up for the first time.  

💻 Running the ApplicationTo boot up the local development API server, execute:
```bash
npm run start:dev
```
The console will start the compilation and listen at http://localhost:3000.

📋 Implemented Core Business Rules
* **Service Constraints**: Bookings cannot be created unless they are tied to a service ID that actively exists in the system.  
* **Temporal Rules**: Appointment dates set in the past are automatically blocked by the validation engine.  
* **Workflow Integrity**: Bookings marked as CANCELLED are prohibited from mutating directly to a COMPLETED status state.  
* **Access Control**: Public consumers can request bookings anonymously, whereas service creation, alteration and deletion routes are restricted to authenticated accounts behind a JWT Bearer Guard.
* **Slot Duplication Prevention**: The engine blocks duplicate schedules from occurring on the exact same service, date, and hour slot.

💡 Assumptions Made & Future Improvements
Assumptions Made:
* **Mock Authentication**: For assessment agility, the system checks incoming login data against static credentials (admin / password123) inside the service layer rather than maintaining full multi-relational database user models.
* **Database Selection**: Relocated the storage choice from PostgreSQL to SQLite to eliminate third-party local database engines, achieving zero-config validation for evaluators out-of-the-box.

🧪 Postman API Testing Manual

1. Authentication Flow
* **Register User** (POST http://localhost:3000/auth/register)
```json
{ "username": "admin", "password": "password123" }
```

* **Login User** (POST http://localhost:3000/auth/login) 
```json
{ "username": "admin", "password": "password123" }
```
Check: Returns an access_token. Copy it to authenticate your next requests.  

2. Service Management
🔒 Set the Authorization tab in Postman to Bearer Token and paste your access_token.

* **Create Service** (POST http://localhost:3000/services)
```json
{
  "title": "Haircut & Styling",
  "description": "Premium haircut service",
  "duration": 45,
  "price": 50.00
}
```

* **Get All Services** (GET http://localhost:3000/services) - Public endpoint

3. Booking Management and Business Rule Verification
* **Create Valid Booking**(POST http://localhost:3000/bookings)
```json
{
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "1234567890",
  "serviceId": 1,
  "bookingDate": "2026-08-15",
  "bookingTime": "14:00",
  "notes": "First time customer"
}
```

* **Verify Past Date Block**: Change bookingDate to "2025-01-01". The server will return 400 Bad Request ("Booking date cannot be in the past").  
* **Verify Double Booking Prevention**: Submit the exact same future booking payload twice. The second attempt returns 400 Bad Request ("This service slot is already booked for this time.").  
* **Cancel Booking** (PUT http://localhost:3000/bookings/1/cancel) -> Transitions status to CANCELLED[cite: 1].
* **Verify Status Flow Block** (PATCH http://localhost:3000/bookings/1/status with body { "status": "COMPLETED" }). The server blocks this request with 400 Bad Request ("Cancelled bookings cannot be marked as completed")[cite: 1].

---