# Hospital Management System — Java OOP Reference

This folder contains Java source files that demonstrate the object-oriented
design of the Hospital Management System. It is intended as an academic
reference for an OOP presentation — it is **not** compiled or run as part of
the web application.

## Package structure

```
java-oop-reference/
└── hospital/
    ├── exception/
    │   └── HospitalException.java        Custom exception (exception handling)
    ├── model/
    │   ├── Person.java                   Abstract base class (abstraction, encapsulation)
    │   ├── Patient.java                  extends Person (inheritance, method overriding)
    │   ├── Doctor.java                   extends Person (inheritance, method overriding)
    │   └── Appointment.java              Standalone class (constructor overloading)
    ├── repository/
    │   ├── HospitalRepository.java       Interface (abstraction, contracts)
    │   └── InMemoryHospitalRepository.java  Concrete implementation (interfaces, collections)
    └── service/
        └── HospitalService.java          Business logic (collections, polymorphism, exception handling)
```

## OOP concepts demonstrated

| Concept               | Where to find it                                                          |
|-----------------------|---------------------------------------------------------------------------|
| Classes and objects   | `Person`, `Patient`, `Doctor`, `Appointment`, `HospitalService`           |
| Constructors          | Every class — including `super()` calls in `Patient` and `Doctor`         |
| Encapsulation        | Private fields + public getters/setters in all model classes              |
| Inheritance          | `Patient extends Person`, `Doctor extends Person`                         |
| Polymorphism          | `Person` reference holding `Patient`/`Doctor` objects; `displaySummary()` |
| Method overriding     | `displaySummary()` in `Patient` and `Doctor` (@Override)                   |
| Method overloading    | `contactInfo()` in `Person`; constructors in `Appointment`; `search*()` in `HospitalService` |
| Abstraction           | `abstract class Person`; `interface HospitalRepository`                   |
| Interfaces            | `HospitalRepository` — implemented by `InMemoryHospitalRepository`        |
| Packages              | `hospital.model`, `hospital.repository`, `hospital.service`, `hospital.exception` |
| Collections           | `List`, `ArrayList`, `Map`, `HashMap`, `LinkedHashMap`, stream filtering  |
| Exception handling    | `HospitalException` thrown by service validation; caught by callers      |

## How the layers connect

```
Presentation layer
       │
       ▼
HospitalService  ──depends on──▶  HospitalRepository (interface)
       │                                  │
       ▼                                  ▼
   Validation &                    InMemoryHospitalRepository
   business logic                  (swappable for a DB implementation)
```

The service layer depends on the **interface**, not a concrete class, so the
storage mechanism can change without touching any business logic.
