import { PatientRepository, DoctorRepository, AppointmentRepository } from '../repository/repositories';
import { Patient, Doctor, Appointment } from '../model';
import {
  PatientDTO,
  DoctorDTO,
  AppointmentDTO,
  NewPatient,
  NewDoctor,
  NewAppointment,
  AppointmentStatus,
} from '../model/types';
import { ValidationException, NotFoundException } from '../model/exceptions';

// Service layer: business logic, validation, and search. Uses the repository
// for persistence and the model classes for domain behaviour.

export class PatientService {
  static async getAll(): Promise<PatientDTO[]> {
    return PatientRepository.findAll();
  }

  static async getById(id: string): Promise<PatientDTO> {
    const p = await PatientRepository.findById(id);
    if (!p) throw new NotFoundException('Patient not found');
    return p;
  }

  static async create(data: NewPatient): Promise<PatientDTO> {
    validatePatient(data);
    return PatientRepository.create(data);
  }

  static async update(id: string, data: NewPatient): Promise<PatientDTO> {
    validatePatient(data);
    return PatientRepository.update(id, data);
  }

  static async delete(id: string): Promise<void> {
    return PatientRepository.delete(id);
  }

  static async nextCode(): Promise<string> {
    return PatientRepository.nextCode();
  }

  // Search by name, code, phone, or condition (collections filtering).
  static search(patients: PatientDTO[], query: string): PatientDTO[] {
    const q = query.trim().toLowerCase();
    if (!q) return patients;
    return patients.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.patientCode.toLowerCase().includes(q) ||
        p.phone.toLowerCase().includes(q) ||
        p.medicalCondition.toLowerCase().includes(q) ||
        p.bloodGroup.toLowerCase().includes(q),
    );
  }

  static toModel(dto: PatientDTO): Patient {
    return new Patient(
      dto.id,
      dto.patientCode,
      dto.name,
      dto.age,
      dto.gender,
      dto.phone,
      dto.email,
      dto.address,
      dto.bloodGroup,
      dto.medicalCondition,
      new Date(dto.createdAt),
    );
  }
}

export class DoctorService {
  static async getAll(): Promise<DoctorDTO[]> {
    return DoctorRepository.findAll();
  }

  static async getById(id: string): Promise<DoctorDTO> {
    const d = await DoctorRepository.findById(id);
    if (!d) throw new NotFoundException('Doctor not found');
    return d;
  }

  static async create(data: NewDoctor): Promise<DoctorDTO> {
    validateDoctor(data);
    return DoctorRepository.create(data);
  }

  static async update(id: string, data: NewDoctor): Promise<DoctorDTO> {
    validateDoctor(data);
    return DoctorRepository.update(id, data);
  }

  static async delete(id: string): Promise<void> {
    return DoctorRepository.delete(id);
  }

  static async nextCode(): Promise<string> {
    return DoctorRepository.nextCode();
  }

  static search(doctors: DoctorDTO[], query: string): DoctorDTO[] {
    const q = query.trim().toLowerCase();
    if (!q) return doctors;
    return doctors.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.doctorCode.toLowerCase().includes(q) ||
        d.specialization.toLowerCase().includes(q) ||
        d.department.toLowerCase().includes(q) ||
        d.phone.toLowerCase().includes(q),
    );
  }

  static toModel(dto: DoctorDTO): Doctor {
    return new Doctor(
      dto.id,
      dto.doctorCode,
      dto.name,
      dto.specialization,
      dto.department,
      dto.phone,
      dto.email,
      dto.experience,
      new Date(dto.createdAt),
    );
  }
}

export class AppointmentService {
  static async getAll(): Promise<AppointmentDTO[]> {
    return AppointmentRepository.findAll();
  }

  static async create(data: NewAppointment): Promise<AppointmentDTO> {
    validateAppointment(data);
    return AppointmentRepository.create(data);
  }

  static async cancel(id: string): Promise<void> {
    await AppointmentRepository.updateStatus(id, 'Cancelled');
  }

  static async complete(id: string): Promise<void> {
    await AppointmentRepository.updateStatus(id, 'Completed');
  }

  static async reschedule(id: string): Promise<void> {
    await AppointmentRepository.updateStatus(id, 'Scheduled');
  }

  static async delete(id: string): Promise<void> {
    return AppointmentRepository.delete(id);
  }

  static async nextCode(): Promise<string> {
    return AppointmentRepository.nextCode();
  }

  // Enrich raw appointment DTOs with patient/doctor names for display.
  static enrich(
    appts: AppointmentDTO[],
    patients: PatientDTO[],
    doctors: DoctorDTO[],
  ): AppointmentDTO[] {
    return appts.map((a) => {
      const patient = patients.find((p) => p.id === a.patientId);
      const doctor = doctors.find((d) => d.id === a.doctorId);
      return {
        ...a,
        patientName: patient ? patient.name : 'Unknown',
        doctorName: doctor ? doctor.name : 'Unknown',
      };
    });
  }

  static search(appts: AppointmentDTO[], query: string): AppointmentDTO[] {
    const q = query.trim().toLowerCase();
    if (!q) return appts;
    return appts.filter(
      (a) =>
        a.appointmentCode.toLowerCase().includes(q) ||
        a.patientName.toLowerCase().includes(q) ||
        a.doctorName.toLowerCase().includes(q) ||
        a.reason.toLowerCase().includes(q) ||
        a.status.toLowerCase().includes(q) ||
        a.date.toLowerCase().includes(q),
    );
  }

  static toModel(dto: AppointmentDTO): Appointment {
    return new Appointment(
      dto.id,
      dto.appointmentCode,
      dto.patientId,
      dto.doctorId,
      dto.date,
      dto.time,
      dto.reason,
      dto.status,
      new Date(dto.createdAt),
    );
  }
}

// --- Validation helpers (exception handling) ---

function validatePatient(p: NewPatient): void {
  if (!p.name?.trim()) throw new ValidationException('Patient name is required');
  if (!p.patientCode?.trim()) throw new ValidationException('Patient ID is required');
  if (p.age == null || p.age < 0 || p.age > 150)
    throw new ValidationException('Age must be between 0 and 150');
  if (!p.phone?.trim()) throw new ValidationException('Phone number is required');
  if (!p.gender) throw new ValidationException('Gender is required');
}

function validateDoctor(d: NewDoctor): void {
  if (!d.name?.trim()) throw new ValidationException('Doctor name is required');
  if (!d.doctorCode?.trim()) throw new ValidationException('Doctor ID is required');
  if (!d.specialization?.trim()) throw new ValidationException('Specialization is required');
  if (!d.department?.trim()) throw new ValidationException('Department is required');
  if (!d.phone?.trim()) throw new ValidationException('Phone number is required');
  if (d.experience == null || d.experience < 0)
    throw new ValidationException('Experience must be 0 or greater');
}

function validateAppointment(a: NewAppointment): void {
  if (!a.patientId) throw new ValidationException('A patient must be selected');
  if (!a.doctorId) throw new ValidationException('A doctor must be selected');
  if (!a.date) throw new ValidationException('Appointment date is required');
  if (!a.time) throw new ValidationException('Appointment time is required');
}
