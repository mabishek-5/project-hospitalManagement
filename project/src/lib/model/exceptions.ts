// Exception hierarchy for the Hospital Management System.
// Mirrors the custom-exception classes you'd find in a Java HMS project.

export class HospitalException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'HospitalException';
  }
}

export class ValidationException extends HospitalException {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationException';
  }
}

export class NotFoundException extends HospitalException {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundException';
  }
}

export class DuplicateRecordException extends HospitalException {
  constructor(message: string) {
    super(message);
    this.name = 'DuplicateRecordException';
  }
}
