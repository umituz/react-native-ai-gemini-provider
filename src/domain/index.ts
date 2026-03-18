/**
 * Domain Layer
 * Core business logic and contracts
 */

// Entities (re-export from existing)
export * from "./entities";

// Value Objects
export * from "./value-objects";

// Repository Interfaces
export * from "./repositories";

// Services
export { ValidationService, ValidationError } from "./services/validation.service";
