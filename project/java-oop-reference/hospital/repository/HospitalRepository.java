package hospital.repository;

import hospital.model.Patient;
import hospital.model.Doctor;
import hospital.model.Appointment;

import hospital.exception.HospitalException;

import java.util.List;

/**
 * Data-access contract for the Hospital Management System.
 *
 * Demonstrates:
 *   - INTERFACES: defines a contract without implementation
 *   - ABSTRACTION: the service layer depends on this interface, not a concrete
 *     class, so the storage mechanism (in-memory, file, database) can be
 *     swapped without changing the service code
 *   - PACKAGES: lives in hospital.repository, imported by the service layer
 *   - COLLECTIONS: methods return List<T> rather than raw arrays
 *
 * A concrete implementation (e.g. InMemoryHospitalRepository) would implement
 * this interface and provide the actual storage logic.
 */
public interface HospitalRepository {

    // --- Patient operations ---

    List<Patient> findAllPatients() throws HospitalException;

    Patient findPatientById(String id) throws HospitalException;

    Patient savePatient(Patient patient) throws HospitalException;

    void deletePatient(String id) throws HospitalException;

    // --- Doctor operations ---

    List<Doctor> findAllDoctors() throws HospitalException;

    Doctor findDoctorById(String id) throws HospitalException;

    Doctor saveDoctor(Doctor doctor) throws HospitalException;

    void deleteDoctor(String id) throws HospitalException;

    // --- Appointment operations ---

    List<Appointment> findAllAppointments() throws HospitalException;

    Appointment saveAppointment(Appointment appointment) throws HospitalException;

    void updateAppointmentStatus(String id, String status) throws HospitalException;

    void deleteAppointment(String id) throws HospitalException;
}
