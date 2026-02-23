/**
 * Shared validation for both Login and Register forms.
 * Returns an object whose keys are field names and values are error messages.
 * An empty object means "no errors – OK to submit".
 */

export interface AuthFieldErrors {
    email?: string;
    password?: string;
    confirmPassword?: string;
    name?: string;
}

interface AuthFields {
    email: string;
    password: string;
    confirmPassword?: string;
    name?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateAuthFields(
    mode: 'login' | 'register',
    fields: AuthFields
): AuthFieldErrors {
    const errors: AuthFieldErrors = {};

    // ── Email ──
    if (!fields.email.trim()) {
        errors.email = 'Email is required.';
    } else if (!EMAIL_REGEX.test(fields.email)) {
        errors.email = 'Enter a valid email address.';
    }

    // ── Password ──
    if (!fields.password) {
        errors.password = 'Password is required.';
    } else if (fields.password.length < 8) {
        errors.password = 'Password must be at least 8 characters.';
    } else if (mode === 'register') {
        if (!/[A-Z]/.test(fields.password)) {
            errors.password = 'Password must include an uppercase letter.';
        } else if (!/[0-9]/.test(fields.password)) {
            errors.password = 'Password must include a number.';
        }
    }

    // ── Register-only fields ──
    if (mode === 'register') {
        if (!fields.name?.trim()) {
            errors.name = 'Name is required.';
        }

        if (!fields.confirmPassword) {
            errors.confirmPassword = 'Please confirm your password.';
        } else if (fields.confirmPassword !== fields.password) {
            errors.confirmPassword = 'Passwords do not match.';
        }
    }

    return errors;
}

/** Helper – returns true when the errors object has no keys. */
export function isValid(errors: AuthFieldErrors): boolean {
    return Object.keys(errors).length === 0;
}
