package hospital.model;

/**
 * Represents a patient in the hospital.
 *
 * Demonstrates:
 *   - INHERITANCE: extends the abstract Person class
 *   - ENCAPSULATION: additional private fields with getters/setters
 *   - CONSTRUCTORS: calls super() to initialise the parent, then initialises
 *     its own fields
 *   - METHOD OVERRIDING: provides a concrete displaySummary() implementation
 *   - POLYMORPHISM: a Person reference can point to a Patient object and
 *     displaySummary() will resolve to this version at runtime
 */
public class Patient extends Person {

    private String patientCode;   // e.g. "P-001"
    private int age;
    private String gender;
    private String address;
    private String bloodGroup;
    private String medicalCondition;

    /**
     * Full constructor — delegates shared fields to the parent constructor
     * via super(), then sets patient-specific fields.
     *
     * Demonstrates: CONSTRUCTORS + INHERITANCE (super call)
     */
    public Patient(String id, String patientCode, String name, int age,
                   String gender, String phone, String email, String address,
                   String bloodGroup, String medicalCondition) {
        super(id, name, phone, email);
        this.patientCode = patientCode;
        this.age = age;
        this.gender = gender;
        this.address = address;
        this.bloodGroup = bloodGroup;
        this.medicalCondition = medicalCondition;
    }

    // --- Getters and Setters (ENCAPSULATION) ---

    public String getPatientCode() {
        return patientCode;
    }

    public void setPatientCode(String patientCode) {
        this.patientCode = patientCode;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getBloodGroup() {
        return bloodGroup;
    }

    public void setBloodGroup(String bloodGroup) {
        this.bloodGroup = bloodGroup;
    }

    public String getMedicalCondition() {
        return medicalCondition;
    }

    public void setMedicalCondition(String medicalCondition) {
        this.medicalCondition = medicalCondition;
    }

    /**
     * Overrides the abstract method from Person.
     *
     * Demonstrates: METHOD OVERRIDING + POLYMORPHISM (runtime dispatch)
     */
    @Override
    public String displaySummary() {
        return patientCode + " — " + getName() + ", " + age + "y " + gender
                + ", " + medicalCondition;
    }
}
