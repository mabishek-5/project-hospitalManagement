import { Person } from './Person';
import { Gender, BloodGroup } from './types';

// Patient extends Person (inheritance). Adds medical-specific fields and
// overrides displaySummary (polymorphism).
export class Patient extends Person {
  private _patientCode: string;
  private _age: number;
  private _gender: Gender;
  private _address: string;
  private _bloodGroup: BloodGroup;
  private _medicalCondition: string;

  constructor(
    id: string,
    patientCode: string,
    name: string,
    age: number,
    gender: Gender,
    phone: string,
    email: string,
    address: string,
    bloodGroup: BloodGroup,
    medicalCondition: string,
    createdAt: Date = new Date(),
  ) {
    super(id, name, phone, email, createdAt);
    this._patientCode = patientCode;
    this._age = age;
    this._gender = gender;
    this._address = address;
    this._bloodGroup = bloodGroup;
    this._medicalCondition = medicalCondition;
  }

  get patientCode(): string {
    return this._patientCode;
  }

  get age(): number {
    return this._age;
  }

  set age(value: number) {
    this._age = value;
  }

  get gender(): Gender {
    return this._gender;
  }

  set gender(value: Gender) {
    this._gender = value;
  }

  get address(): string {
    return this._address;
  }

  set address(value: string) {
    this._address = value;
  }

  get bloodGroup(): BloodGroup {
    return this._bloodGroup;
  }

  set bloodGroup(value: BloodGroup) {
    this._bloodGroup = value;
  }

  get medicalCondition(): string {
    return this._medicalCondition;
  }

  set medicalCondition(value: string) {
    this._medicalCondition = value;
  }

  // Polymorphism: overrides Person.displaySummary
  displaySummary(): string {
    return `${this.patientCode} — ${this.name}, ${this.age}y ${this.gender}, ${this.medicalCondition}`;
  }
}
