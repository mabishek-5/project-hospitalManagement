package hospital.model;

/**
 * Represents an appointment that links a Patient to a Doctor.
 *
 * Demonstrates:
 *   - CLASSES AND OBJECTS: a standalone class (not a Person subclass)
 *   - ENCAPSULATION: private fields with getters/setters
 *   - CONSTRUCTORS: overloaded constructors (default status + full status)
 *   - METHOD OVERLOADING: two constructor variants
 */
public class Appointment {

    private String id;
    private String appointmentCode;   // e.g. "A-001"
    private String patientId;
    private String doctorId;
    private String date;              // ISO format yyyy-MM-dd
    private String time;              // 24h format HH:mm
    private String reason;
    private String status;            // Scheduled | Completed | Cancelled

    private static final String DEFAULT_STATUS = "Scheduled";

    /**
     * Constructor without status — defaults to "Scheduled".
     *
     * Demonstrates: METHOD OVERLOADING (constructor variant 1)
     */
    public Appointment(String id, String appointmentCode, String patientId,
                       String doctorId, String date, String time, String reason) {
        this(id, appointmentCode, patientId, doctorId, date, time, reason, DEFAULT_STATUS);
    }

    /**
     * Full constructor with explicit status.
     *
     * Demonstrates: METHOD OVERLOADING (constructor variant 2)
     */
    public Appointment(String id, String appointmentCode, String patientId,
                       String doctorId, String date, String time, String reason,
                       String status) {
        this.id = id;
        this.appointmentCode = appointmentCode;
        this.patientId = patientId;
        this.doctorId = doctorId;
        this.date = date;
        this.time = time;
        this.reason = reason;
        this.status = status;
    }

    // --- Getters and Setters (ENCAPSULATION) ---

    public String getId() {
        return id;
    }

    public String getAppointmentCode() {
        return appointmentCode;
    }

    public String getPatientId() {
        return patientId;
    }

    public String getDoctorId() {
        return doctorId;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    /**
     * Returns a human-readable summary of this appointment.
     */
    public String displaySummary() {
        return appointmentCode + " — " + date + " " + time + " (" + status + ")";
    }
}
