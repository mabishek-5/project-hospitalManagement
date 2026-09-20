package hospital.repository;

import hospital.model.Patient;
import hospital.model.Doctor;
import hospital.model.Appointment;

import hospital.exception.HospitalException;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * In-memory implementation of the HospitalRepository interface.
 *
 * Demonstrates:
 *   - INTERFACES: implements HospitalRepository
 *   - COLLECTIONS: uses Map (LinkedHashMap) to store entities by id, and
 *     returns List copies to callers
 *   - CLASSES AND OBJECTS: a concrete class instantiated and passed into the
 *     HospitalService constructor
 *
 * In a real application this would be replaced by a JDBC or JPA
 * implementation that talks to a database. The service layer would not
 * change at all because it depends on the interface, not this class.
 */
public class InMemoryHospitalRepository implements HospitalRepository {

    private final Map<String, Patient> patients = new LinkedHashMap<>();
    private final Map<String, Doctor> doctors = new LinkedHashMap<>();
    private final Map<String, Appointment> appointments = new LinkedHashMap<>();

    // --- Patient operations ---

    @Override
    public List<Patient> findAllPatients() {
        return new ArrayList<>(patients.values());
    }

    @Override
    public Patient findPatientById(String id) {
        return patients.get(id);
    }

    @Override
    public Patient savePatient(Patient patient) {
        if (patient.getId() == null || patient.getId().isEmpty()) {
            String newId = UUID.randomUUID().toString();
            patient.setId(newId);
        }
        patients.put(patient.getId(), patient);
        return patient;
    }

    @Override
    public void deletePatient(String id) throws HospitalException {
        if (patients.remove(id) == null) {
            throw new HospitalException("Patient not found: " + id, "NOT_FOUND", null);
        }
    }

    // --- Doctor operations ---

    @Override
    public List<Doctor> findAllDoctors() {
        return new ArrayList<>(doctors.values());
    }

    @Override
    public Doctor findDoctorById(String id) {
        return doctors.get(id);
    }

    @Override
    public Doctor saveDoctor(Doctor doctor) {
        if (doctor.getId() == null || doctor.getId().isEmpty()) {
            String newId = UUID.randomUUID().toString();
            doctor.setId(newId);
        }
        doctors.put(doctor.getId(), doctor);
        return doctor;
    }

    @Override
    public void deleteDoctor(String id) throws HospitalException {
        if (doctors.remove(id) == null) {
            throw new HospitalException("Doctor not found: " + id, "NOT_FOUND", null);
        }
    }

    // --- Appointment operations ---

    @Override
    public List<Appointment> findAllAppointments() {
        return new ArrayList<>(appointments.values());
    }

    @Override
    public Appointment saveAppointment(Appointment appointment) {
        if (appointment.getId() == null || appointment.getId().isEmpty()) {
            String newId = UUID.randomUUID().toString();
            // Use the overloaded constructor to copy with a new id
            Appointment copy = new Appointment(
                    newId,
                    appointment.getAppointmentCode(),
                    appointment.getPatientId(),
                    appointment.getDoctorId(),
                    appointment.getDate(),
                    appointment.getTime(),
                    appointment.getReason(),
                    appointment.getStatus());
            appointments.put(newId, copy);
            return copy;
        }
        appointments.put(appointment.getId(), appointment);
        return appointment;
    }

    @Override
    public void updateAppointmentStatus(String id, String status) throws HospitalException {
        Appointment a = appointments.get(id);
        if (a == null) {
            throw new HospitalException("Appointment not found: " + id, "NOT_FOUND", null);
        }
        a.setStatus(status);
    }

    @Override
    public void deleteAppointment(String id) throws HospitalException {
        if (appointments.remove(id) == null) {
            throw new HospitalException("Appointment not found: " + id, "NOT_FOUND", null);
        }
    }
}
