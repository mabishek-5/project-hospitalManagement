import { supabase } from '../supabaseClient';
import { Patient, Doctor, Appointment } from '../model';
import { PatientDTO, DoctorDTO, AppointmentDTO, NewPatient, NewDoctor, NewAppointment } from '../model/types';
import { ValidationException, NotFoundException } from '../model/exceptions';

// Database row shapes (snake_case in Postgres).
interface PatientRow {
  id: string;
  patient_code: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  address: string;
  blood_group: string;
  medical_condition: string;
  created_at: string;
}

interface DoctorRow {
  id: string;
  doctor_code: string;
  name: string;
  specialization: string;
  department: string;
  phone: string;
  email: string;
  experience: number;
  created_at: string;
}

interface AppointmentRow {
  id: string;
  appointment_code: string;
  patient_id: string;
  doctor_id: string;
  appointment_date: string;
  appointment_time: string;
  reason: string;
  status: string;
  created_at: string;
}

export class PatientRepository {
  static toDTO(r: PatientRow): PatientDTO {
    return {
      id: r.id,
      patientCode: r.patient_code,
      name: r.name,
      age: r.age,
      gender: r.gender as PatientDTO['gender'],
      phone: r.phone,
      email: r.email ?? '',
      address: r.address ?? '',
      bloodGroup: r.blood_group as PatientDTO['bloodGroup'],
      medicalCondition: r.medical_condition ?? '',
      createdAt: r.created_at,
    };
  }

  static toModel(r: PatientRow): Patient {
    const dto = this.toDTO(r);
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

  static async findAll(): Promise<PatientDTO[]> {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw new ValidationException(error.message);
    return (data as PatientRow[]).map((r) => this.toDTO(r));
  }

  static async findById(id: string): Promise<PatientDTO | null> {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw new ValidationException(error.message);
    return data ? this.toDTO(data as PatientRow) : null;
  }

  static async create(p: NewPatient): Promise<PatientDTO> {
    const { data, error } = await supabase
      .from('patients')
      .insert({
        patient_code: p.patientCode,
        name: p.name,
        age: p.age,
        gender: p.gender,
        phone: p.phone,
        email: p.email,
        address: p.address,
        blood_group: p.bloodGroup,
        medical_condition: p.medicalCondition,
      })
      .select('*')
      .single();
    if (error) throw new ValidationException(error.message);
    return this.toDTO(data as PatientRow);
  }

  static async update(id: string, p: NewPatient): Promise<PatientDTO> {
    const { data, error } = await supabase
      .from('patients')
      .update({
        patient_code: p.patientCode,
        name: p.name,
        age: p.age,
        gender: p.gender,
        phone: p.phone,
        email: p.email,
        address: p.address,
        blood_group: p.bloodGroup,
        medical_condition: p.medicalCondition,
      })
      .eq('id', id)
      .select('*')
      .single();
    if (error) throw new ValidationException(error.message);
    if (!data) throw new NotFoundException('Patient not found');
    return this.toDTO(data as PatientRow);
  }

  static async delete(id: string): Promise<void> {
    const { error } = await supabase.from('patients').delete().eq('id', id);
    if (error) throw new ValidationException(error.message);
  }

  static async nextCode(): Promise<string> {
    const { count } = await supabase
      .from('patients')
      .select('*', { count: 'exact', head: true });
    const n = (count ?? 0) + 1;
    return `P-${String(n).padStart(3, '0')}`;
  }
}

export class DoctorRepository {
  static toDTO(r: DoctorRow): DoctorDTO {
    return {
      id: r.id,
      doctorCode: r.doctor_code,
      name: r.name,
      specialization: r.specialization,
      department: r.department,
      phone: r.phone,
      email: r.email ?? '',
      experience: r.experience,
      createdAt: r.created_at,
    };
  }

  static toModel(r: DoctorRow): Doctor {
    const dto = this.toDTO(r);
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

  static async findAll(): Promise<DoctorDTO[]> {
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw new ValidationException(error.message);
    return (data as DoctorRow[]).map((r) => this.toDTO(r));
  }

  static async findById(id: string): Promise<DoctorDTO | null> {
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw new ValidationException(error.message);
    return data ? this.toDTO(data as DoctorRow) : null;
  }

  static async create(d: NewDoctor): Promise<DoctorDTO> {
    const { data, error } = await supabase
      .from('doctors')
      .insert({
        doctor_code: d.doctorCode,
        name: d.name,
        specialization: d.specialization,
        department: d.department,
        phone: d.phone,
        email: d.email,
        experience: d.experience,
      })
      .select('*')
      .single();
    if (error) throw new ValidationException(error.message);
    return this.toDTO(data as DoctorRow);
  }

  static async update(id: string, d: NewDoctor): Promise<DoctorDTO> {
    const { data, error } = await supabase
      .from('doctors')
      .update({
        doctor_code: d.doctorCode,
        name: d.name,
        specialization: d.specialization,
        department: d.department,
        phone: d.phone,
        email: d.email,
        experience: d.experience,
      })
      .eq('id', id)
      .select('*')
      .single();
    if (error) throw new ValidationException(error.message);
    if (!data) throw new NotFoundException('Doctor not found');
    return this.toDTO(data as DoctorRow);
  }

  static async delete(id: string): Promise<void> {
    const { error } = await supabase.from('doctors').delete().eq('id', id);
    if (error) throw new ValidationException(error.message);
  }

  static async nextCode(): Promise<string> {
    const { count } = await supabase
      .from('doctors')
      .select('*', { count: 'exact', head: true });
    const n = (count ?? 0) + 1;
    return `D-${String(n).padStart(3, '0')}`;
  }
}

export class AppointmentRepository {
  static toDTO(r: AppointmentRow): AppointmentDTO {
    return {
      id: r.id,
      appointmentCode: r.appointment_code,
      patientId: r.patient_id,
      doctorId: r.doctor_id,
      patientName: '',
      doctorName: '',
      date: r.appointment_date,
      time: r.appointment_time,
      reason: r.reason ?? '',
      status: r.status as AppointmentDTO['status'],
      createdAt: r.created_at,
    };
  }

  static toModel(r: AppointmentRow): Appointment {
    const dto = this.toDTO(r);
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

  static async findAll(): Promise<AppointmentDTO[]> {
    const { data, error } = await supabase
      .from('appointments')
      .select(
        'id, appointment_code, patient_id, doctor_id, appointment_date, appointment_time, reason, status, created_at',
      )
      .order('created_at', { ascending: false });
    if (error) throw new ValidationException(error.message);
    return (data as AppointmentRow[]).map((r) => this.toDTO(r));
  }

  static async create(a: NewAppointment): Promise<AppointmentDTO> {
    const { data, error } = await supabase
      .from('appointments')
      .insert({
        appointment_code: a.appointmentCode,
        patient_id: a.patientId,
        doctor_id: a.doctorId,
        appointment_date: a.date,
        appointment_time: a.time,
        reason: a.reason,
      })
      .select('*')
      .single();
    if (error) throw new ValidationException(error.message);
    return this.toDTO(data as AppointmentRow);
  }

  static async updateStatus(id: string, status: string): Promise<void> {
    const { error } = await supabase
      .from('appointments')
      .update({ status })
      .eq('id', id);
    if (error) throw new ValidationException(error.message);
  }

  static async delete(id: string): Promise<void> {
    const { error } = await supabase.from('appointments').delete().eq('id', id);
    if (error) throw new ValidationException(error.message);
  }

  static async nextCode(): Promise<string> {
    const { count } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true });
    const n = (count ?? 0) + 1;
    return `A-${String(n).padStart(3, '0')}`;
  }
}
