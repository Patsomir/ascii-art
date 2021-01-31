class Validator {
    errors

    constructor() {
        this.errors = [];
    }

    validateMinLength(str, min, displayName = 'Value') {
        if(str.length < min) {
            this.errors.push(`${displayName} must be at least ${min} character${min === 1 ? '' : 's'} long`);
            return false;
        }
        return true;
    }

    validateMaxLength(str, max, displayName = 'Value') {
        if(str.length > max) {
            this.errors.push(`${displayName} must be no more than ${max} character${max === 1 ? '' : 's'} long`);
            return false;
        }
        return true;
    }

    validateEquals(left, right, leftDisplayName = 'Left Value', rightDisplayName = 'Left Value') {
        if(left !== right) {
            this.errors.push(`${leftDisplayName} and ${rightDisplayName} must be equal`);
            return false;
        }
        return true;
    }

    hasErrors() {
        return this.errors.length > 0;
    }
}