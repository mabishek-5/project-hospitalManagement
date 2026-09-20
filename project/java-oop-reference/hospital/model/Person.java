package hospital.model;

/**
 * Abstract base class representing a person in the hospital system.
 *
 * Demonstrates:
 *   - ABSTRACTION: abstract class, cannot be instantiated directly
 *   - ENCAPSULATION: private fields with public getters/setters
 *   - CONSTRUCTORS: parameterized constructor
 *   - METHOD OVERLOADING: contactInfo() has two overloaded versions
 *   - POLYMORPHISM contract: declares abstract displaySummary() that every
 *     subclass must override
 *
 * Inheritance hierarchy:
 *
 *        Person (abstract)
 *       /          \
 *   Patient        Doctor
 */
public abstract class Person {

    // --- ENCAPSULATION: private fields, accessible only through getters/setters ---

    private String id;
    private String name;
    private String phone;
    private String email;

    /**
     * Parameterized constructor.
     *
     * Demonstrates: CONSTRUCTORS
     */
    public Person(String id, String name, String phone, String email) {
        this.id = id;
        this.name = name;
        this.phone = phone;
        this.email = email;
    }

    // --- Getters and Setters (ENCAPSULATION) ---

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    // --- ABSTRACTION: abstract method, implementation left to subclasses ---

    /**
     * Returns a one-line summary of this person.
     * Each subclass (Patient, Doctor) provides its own implementation,
     * which is an example of METHOD OVERRIDING / POLYMORPHISM.
     */
    public abstract String displaySummary();

    // --- METHOD OVERLOADING: same method name, different parameter lists ---

    /**
     * Returns contact info without a prefix.
     */
    public String contactInfo() {
        return name + " — " + phone;
    }

    /**
     * Overloaded version that accepts a custom prefix label.
     *
     * Demonstrates: METHOD OVERLOADING (compile-time polymorphism)
     */
    public String contactInfo(String prefix) {
        return prefix + ": " + name + " — " + phone;
    }
}
