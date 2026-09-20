package hospital.service;

import hospital.model.Patient;
import hospital.model.Doctor;
import hospital.model.Appointment;
import hospital.model.Person;

import hospital.exception.HospitalException;

import hospital.repository.HospitalRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

/**
 * Business-logic layer for the Hospital Management System.
 *
 * Demonstrates:
 *   - CLASSES AND OBJECTS: the service is a class instantiated and used by the
 *     presentation layer
 *   - COLLECTIONS: uses List, ArrayList, Map, HashMap and stream-based
 *     filtering to manage in-memory data
 *   - EXCEPTION HANDLING: validates input and throws HospitalException for
 *     invalid data or missing records
 *   - METHOD OVERLOADING: search() is overloaded — one version searches
 *     patients, another searches doctors
 *   - POLYMORPHISM: treats Patient and Doctor objects through their common
 *     Person supertype when calling displaySummary()
 *   - INTERFACES (dependency): depends on the HospitalRepository interface,
 *     not a concrete implementation
 *
 * In a layered architecture the controller/presentation layer creates a
 * HospitalService and delegates all operations to it. The service in turn
 * delegates persistence to the repository interface.
 */
public class HospitalService {

    private final HospitalRepository repository;

    /**
     * Constructor — accepts any implementation of HospitalRepository.
     *
     * Demonstrates: CONSTRUCTORS + INTERFACES (programming to an interface)
     */
    public HospitalService(HospitalRepository repository) {
        this.repository = repository;
    }

    // ===================================================================
    //  Patient operations
    // ===================================================================

    public List<Patient> getAllPatients() throws HospitalException {
        return repository.findAllPatients();
    }

    public Patient getPatientById(String id) throws HospitalException {
        Patient p = repository.findPatientById(id);
        if (p == null) {
            throw new HospitalException("Patient not found: " + id, "NOT_FOUND", null);
        }
        return p;
    }

    public Patient addPatient(Patient patient) throws HospitalException {
        validatePatient(patient);
        return repository.savePatient(patient);
    }

    public Patient updatePatient(Patient patient) throws HospitalException {
        validatePatient(patient);
        if (repository.findPatientById(patient.getId()) == null) {
            throw new HospitalException("Patient not found: " + patient.getId(), "NOT_FOUND", null);
        }
        return repository.savePatient(patient);
    }

    public void removePatient(String id) throws HospitalException {
        repository.deletePatient(id);
    }

    // --- METHOD OVERLOADING: search patients by query string ---

    public List<Patient> searchPatients(List<Patient> patients, String query) {
        if (query == null || query.trim().isEmpty()) {
            return new ArrayList<>(patients);
        }
        String q = query.trim().toLowerCase();
        return patients.stream()
                .filter(p -> p.getName().toLowerCase().contains(q)
                        || p.getPatientCode().toLowerCase().contains(q)
                        || p.getPhone().toLowerCase().contains(q)
                        || p.getMedicalCondition().toLowerCase().contains(q)
                        || p.getBloodGroup().toLowerCase().contains(q))
                .collect(Collectors.toList());
    }

    // Overloaded: fetches all patients from the repository first, then searches
    public List<Patient> searchPatients(String query) throws HospitalException {
        return searchPatients(repository.findAllPatients(), query);
    }

    // ===================================================================
    //  Doctor operations
    // ===================================================================

    public List<Doctor> getAllDoctors() throws HospitalException {
        return repository.findAllDoctors();
    }

    public Doctor getDoctorById(String id) throws HospitalException {
        Doctor d = repository.findDoctorById(id);
        if (d == null) {
            throw new HospitalException("Doctor not found: " + id, "NOT_FOUND", null);
        }
        return d;
    }

    public Doctor addDoctor(Doctor doctor) throws HospitalException {
        validateDoctor(doctor);
        return repository.saveDoctor(doctor);
    }

    public Doctor updateDoctor(Doctor doctor) throws HospitalException {
        validateDoctor(doctor);
        if (repository.findDoctorById(doctor.getId()) == null) {
            throw new HospitalException("Doctor not found: " + doctor.getId(), "NOT_FOUND", null);
        }
        return repository.saveDoctor(doctor);
    }

    public void removeDoctor(String id) throws HospitalException {
        repository.deleteDoctor(id);
    }

    // --- METHOD OVERLOADING: search doctors by query string ---

    public List<Doctor> searchDoctors(List<Doctor> doctors, String query) {
        if (query == null || query.trim().isEmpty()) {
            return new ArrayList<>(doctors);
        }
        String q = query.trim().toLowerCase();
        return doctors.stream()
                .filter(d -> d.getName().toLowerCase().contains(q)
                        || d.getDoctorCode().toLowerCase().contains(q)
                        || d.getSpecialization().toLowerCase().contains(q)
                        || d.getDepartment().toLowerCase().contains(q)
                        || d.getPhone().toLowerCase().contains(q))
                .collect(Collectors.toList());
    }

    public List<Doctor> searchDoctors(String query) throws HospitalException {
        return searchDoctors(repository.findAllDoctors(), query);
    }

    // ===================================================================
    //  Appointment operations
    // ===================================================================

    public List<Appointment> getAllAppointments() throws HospitalException {
        return repository.findAllAppointments();
    }

    public Appointment bookAppointment(Appointment appointment) throws HospitalException {
        validateAppointment(appointment);
        return repository.saveAppointment(appointment);
    }

    public void cancelAppointment(String id) throws HospitalException {
        repository.updateAppointmentStatus(id, "Cancelled");
    }

    public void completeAppointment(String id) throws HospitalException {
        repository.updateAppointmentStatus(id, "Completed");
    }

    public void removeAppointment(String id) throws HospitalException {
        repository.deleteAppointment(id);
    }

    public List<Appointment> searchAppointments(List<Appointment> appointments, String query) {
        if (query == null || query.trim().isEmpty()) {
            return new ArrayList<>(appointments);
        }
        String q = query.trim().toLowerCase();
        return appointments.stream()
                .filter(a -> a.getAppointmentCode().toLowerCase().contains(q)
                        || a.getReason().toLowerCase().contains(q)
                        || a.getStatus().toLowerCase().contains(q)
                        || a.getDate().toLowerCase().contains(q))
                .collect(Collectors.toList());
    }

    // ===================================================================
    //  Dashboard statistics — uses COLLECTIONS (Map for grouping)
    // ===================================================================

    /**
     * Returns a map of department name → number of doctors in that department.
     *
     * Demonstrates: COLLECTIONS (Map / HashMap) + stream groupingBy
     */
    public Map<String, Long> getDoctorCountByDepartment() throws HospitalException {
        return repository.findAllDoctors().stream()
                .collect(Collectors.groupingBy(
                        Doctor::getDepartment,
                        Collectors.counting()));
    }

    /**
     * Returns the count of upcoming (Scheduled) appointments.
     */
    public long getUpcomingAppointmentCount() throws HospitalException {
        return repository.findAllAppointments().stream()
                .filter(a -> "Scheduled".equals(a.getStatus()))
                .count();
    }

    /**
     * Prints a summary of every person (patients + doctors) using polymorphism.
     *
     * Demonstrates: POLYMORPHISM — a List<Person> holds both Patient and Doctor
     * objects, and displaySummary() resolves to the correct override at runtime.
     */
    public void printAllPersonSummaries() throws HospitalException {
        List<Person> people = new ArrayList<>();
        people.addAll(repository.findAllPatients());
        people.addAll(repository.findAllDoctors());

        for (Person person : people) {
            // Polymorphic call — resolves to Patient.displaySummary()
            // or Doctor.displaySummary() depending on the actual object type
            System.out.println(person.displaySummary());
        }
    }

    // ===================================================================
    //  Validation helpers — EXCEPTION HANDLING
    // ===================================================================

    private void validatePatient(Patient p) throws HospitalException {
        if (p == null) {
            throw new HospitalException("Patient cannot be null", "VALIDATION", null);
        }
        if (p.getName() == null || p.getName().trim().isEmpty()) {
            throw new HospitalException("Patient name is required", "VALIDATION", null);
        }
        if (p.getPatientCode() == null || p.getPatientCode().trim().isEmpty()) {
            throw new HospitalException("Patient ID is required", "VALIDATION", null);
        }
        if (p.getAge() < 0 || p.getAge() > 150) {
            throw new HospitalException("Age must be between 0 and 150", "VALIDATION", null);
        }
        if (p.getPhone() == null || p.getPhone().trim().isEmpty()) {
            throw new HospitalException("Phone number is required", "VALIDATION", null);
        }
    }

    private void validateDoctor(Doctor d) throws HospitalException {
        if (d == null) {
            throw new HospitalException("Doctor cannot be null", "VALIDATION", null);
        }
        if (d.getName() == null || d.getName().trim().isEmpty()) {
            throw new HospitalException("Doctor name is required", "VALIDATION", null);
        }
        if (d.getDoctorCode() == null || d.getDoctorCode().trim().isEmpty()) {
            throw new HospitalException("Doctor ID is required", "VALIDATION", null);
        }
        if (d.getSpecialization() == null || d.getSpecialization().trim().isEmpty()) {
            throw new HospitalException("Specialization is required", "VALIDATION", null);
        }
        if (d.getExperience() < 0) {
            throw new HospitalException("Experience must be 0 or greater", "VALIDATION", null);
        }
    }

    private void validateAppointment(Appointment a) throws HospitalException {
        if (a == null) {
            throw new HospitalException("Appointment cannot be null", "VALIDATION", null);
        }
        if (a.getPatientId() == null || a.getPatientId().trim().isEmpty()) {
            throw new HospitalException("A patient must be selected", "VALIDATION", null);
        }
        if (a.getDoctorId() == null || a.getDoctorId().trim().isEmpty()) {
            throw new HospitalException("A doctor must be selected", "VALIDATION", null);
        }
        if (a.getDate() == null || a.getDate().trim().isEmpty()) {
            throw new HospitalException("Appointment date is required", "VALIDATION", null);
        }
        if (a.getTime() == null || a.getTime().trim().isEmpty()) {
            throw new HospitalException("Appointment time is required", "VALIDATION", null);
        }
    }
}
