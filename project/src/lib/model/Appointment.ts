import { AppointmentStatus } from './types';

// Appointment is a standalone model (not a Person) that links a Patient to a Doctor.
export class Appointment {
  private _id: string;
  private _appointmentCode: string;
  private _patientId: string;
  private _doctorId: string;
  private _date: string;
  private _time: string;
  private _reason: string;
  private _status: AppointmentStatus;
  private _createdAt: Date;

  constructor(
    id: string,
    appointmentCode: string,
    patientId: string,
    doctorId: string,
    date: string,
    time: string,
    reason: string,
    status: AppointmentStatus = 'Scheduled',
    createdAt: Date = new Date(),
  ) {
    this._id = id;
    this._appointmentCode = appointmentCode;
    this._patientId = patientId;
    this._doctorId = doctorId;
    this._date = date;
    this._time = time;
    this._reason = reason;
    this._status = status;
    this._createdAt = createdAt;
  }

  get id(): string {
    return this._id;
  }

  get appointmentCode(): string {
    return this._appointmentCode;
  }

  get patientId(): string {
    return this._patientId;
  }

  get doctorId(): string {
    return this._doctorId;
  }

  get date(): string {
    return this._date;
  }

  set date(value: string) {
    this._date = value;
  }

  get time(): string {
    return this._time;
  }

  set time(value: string) {
    this._time = value;
  }

  get reason(): string {
    return this._reason;
  }

  set reason(value: string) {
    this._reason = value;
  }

  get status(): AppointmentStatus {
    return this._status;
  }

  set status(value: AppointmentStatus) {
    this._status = value;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  displaySummary(): string {
    return `${this.appointmentCode} — ${this.date} ${this.time} (${this.status})`;
  }
}
