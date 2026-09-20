// Shared type definitions used across the model, repository, and service layers.

export type Gender = 'Male' | 'Female' | 'Other';

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type AppointmentStatus = 'Scheduled' | 'Completed' | 'Cancelled';

export interface Identifiable {
  id: string;
}

export interface Displayable {
  displaySummary(): string;
}

export interface Searchable<T> {
  search(query: string): T[];
}

export interface Auditable {
  createdAt: Date;
}

export interface PersistedEntity extends Identifiable {
  createdAt: Date;
}

export type PatientDTO = {
  id: string;
  patientCode: string;
  name: string;
  age: number;
  gender: Gender;
  phone: string;
  email: string;
  address: string;
  bloodGroup: BloodGroup;
  medicalCondition: string;
  createdAt: string;
};

export type DoctorDTO = {
  id: string;
  doctorCode: string;
  name: string;
  specialization: string;
  department: string;
  phone: string;
  email: string;
  experience: number;
  createdAt: string;
};

export type AppointmentDTO = {
  id: string;
  appointmentCode: string;
  patientId: string;
  doctorId: string;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  reason: string;
  status: AppointmentStatus;
  createdAt: string;
};

export type NewPatient = Omit<PatientDTO, 'id' | 'createdAt'>;
export type NewDoctor = Omit<DoctorDTO, 'id' | 'createdAt'>;
export type NewAppointment = {
  appointmentCode: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  reason: string;
};
