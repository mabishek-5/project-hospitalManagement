package hospital.exception;

/**
 * Custom exception class for the Hospital Management System.
 *
 * Demonstrates: EXCEPTION HANDLING, CUSTOM EXCEPTIONS
 *
 * In a real Java application this would be thrown by the service or repository
 * layers when validation fails, a record is not found, or a duplicate is
 * detected. The caller can catch it with a try/catch block and display a
 * user-friendly message.
 */
public class HospitalException extends Exception {

    private final String errorCode;

    /**
     * Constructor — accepts a human-readable message.
     *
     * Demonstrates: CONSTRUCTORS
     */
    public HospitalException(String message) {
        super(message);
        this.errorCode = "HOSPITAL_ERROR";
    }

    /**
     * Overloaded constructor — accepts a message plus an error code and a
     * root cause. This demonstrates METHOD OVERLOADING on constructors.
     */
    public HospitalException(String message, String errorCode, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
    }

    /**
     * Getter for the error code.
     *
     * Demonstrates: ENCAPSULATION (private field accessed via getter)
     */
    public String getErrorCode() {
        return errorCode;
    }
}
