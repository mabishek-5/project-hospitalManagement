import { Identifiable, Displayable } from './types';

// Abstract base class representing a person in the hospital system.
// Demonstrates abstraction — cannot be instantiated directly and defines
// the contract every person (patient, doctor) must follow.
export abstract class Person implements Identifiable, Displayable {
  private _id: string;
  private _name: string;
  private _phone: string;
  private _email: string;
  private _createdAt: Date;

  constructor(id: string, name: string, phone: string, email: string, createdAt: Date = new Date()) {
    this._id = id;
    this._name = name;
    this._phone = phone;
    this._email = email;
    this._createdAt = createdAt;
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get phone(): string {
    return this._phone;
  }

  set phone(value: string) {
    this._phone = value;
  }

  get email(): string {
    return this._email;
  }

  set email(value: string) {
    this._email = value;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  // Polymorphism — each subclass provides its own summary.
  abstract displaySummary(): string;

  // Method overloading simulated via optional parameter (TS doesn't allow
  // duplicate method names like Java). contactInfo() or contactInfo("Contact").
  contactInfo(prefix?: string): string {
    return prefix
      ? `${prefix}: ${this._name} — ${this._phone}`
      : `${this._name} — ${this._phone}`;
  }
}
