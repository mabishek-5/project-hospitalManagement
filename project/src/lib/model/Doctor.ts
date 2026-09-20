import { Person } from './Person';

// Doctor extends Person (inheritance). Adds specialization/department fields
// and overrides displaySummary (polymorphism).
export class Doctor extends Person {
  private _doctorCode: string;
  private _specialization: string;
  private _department: string;
  private _experience: number;

  constructor(
    id: string,
    doctorCode: string,
    name: string,
    specialization: string,
    department: string,
    phone: string,
    email: string,
    experience: number,
    createdAt: Date = new Date(),
  ) {
    super(id, name, phone, email, createdAt);
    this._doctorCode = doctorCode;
    this._specialization = specialization;
    this._department = department;
    this._experience = experience;
  }

  get doctorCode(): string {
    return this._doctorCode;
  }

  get specialization(): string {
    return this._specialization;
  }

  set specialization(value: string) {
    this._specialization = value;
  }

  get department(): string {
    return this._department;
  }

  set department(value: string) {
    this._department = value;
  }

  get experience(): number {
    return this._experience;
  }

  set experience(value: number) {
    this._experience = value;
  }

  // Polymorphism: overrides Person.displaySummary
  displaySummary(): string {
    return `${this.doctorCode} — ${this.name}, ${this.specialization} (${this.experience} yrs)`;
  }
}
