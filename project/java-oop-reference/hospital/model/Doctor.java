package hospital.model;

/**
 * Represents a doctor in the hospital.
 *
 * Demonstrates:
 *   - INHERITANCE: extends the abstract Person class
 *   - ENCAPSULATION: additional private fields with getters/setters
 *   - CONSTRUCTORS: calls super() then initialises doctor-specific fields
 *   - METHOD OVERRIDING: provides its own displaySummary() implementation
 *   - POLYMORPHISM: a Person reference can point to a Doctor object
 */
public class Doctor extends Person {

    private String doctorCode;      // e.g. "D-001"
    private String specialization;
    private String department;
    private int experience;        // years of experience

    /**
     * Full constructor — delegates shared fields to the parent via super().
     *
     * Demonstrates: CONSTRUCTORS + INHERITANCE (super call)
     */
    public Doctor(String id, String doctorCode, String name, String specialization,
                  String department, String phone, String email, int experience) {
        super(id, name, phone, email);
        this.doctorCode = doctorCode;
        this.specialization = specialization;
        this.department = department;
        this.experience = experience;
    }

    // --- Getters and Setters (ENCAPSULATION) ---

    public String getDoctorCode() {
        return doctorCode;
    }

    public void setDoctorCode(String doctorCode) {
        this.doctorCode = doctorCode;
    }

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public int getExperience() {
        return experience;
    }

    public void setExperience(int experience) {
        this.experience = experience;
    }

    /**
     * Overrides the abstract method from Person.
     *
     * Demonstrates: METHOD OVERRIDING + POLYMORPHISM (runtime dispatch)
     */
    @Override
    public String displaySummary() {
        return doctorCode + " — " + getName() + ", " + specialization
                + " (" + experience + " yrs)";
    }
}
