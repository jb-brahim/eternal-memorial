const validator = {
    user: {
        register: (data) => {
            const errors = [];
            
            if (!data.name || data.name.trim().length < 2) {
                errors.push('Name must be at least 2 characters long');
            }
            
            if (!data.email || !data.email.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) {
                errors.push('Please provide a valid email address');
            }
            
            if (!data.password || data.password.length < 8) {
                errors.push('Password must be at least 8 characters long');
            }
            
            return {
                isValid: errors.length === 0,
                errors
            };
        },
        
        login: (data) => {
            const errors = [];
            
            if (!data.email) {
                errors.push('Email is required');
            }
            
            if (!data.password) {
                errors.push('Password is required');
            }
            
            return {
                isValid: errors.length === 0,
                errors
            };
        }
    },

    memorial: {
        create: (data) => {
            const errors = [];
            
            if (!data.name || data.name.trim().length < 2) {
                errors.push('Name must be at least 2 characters long');
            }
            
            if (!data.story || data.story.trim().length < 10) {
                errors.push('Story must be at least 10 characters long');
            }
            
            if (data.birthDate && !isValidDate(data.birthDate)) {
                errors.push('Invalid birth date');
            }
            
            if (data.deathDate && !isValidDate(data.deathDate)) {
                errors.push('Invalid death date');
            }
            
            if (data.birthDate && data.deathDate && new Date(data.birthDate) > new Date(data.deathDate)) {
                errors.push('Birth date cannot be after death date');
            }
            
            return {
                isValid: errors.length === 0,
                errors
            };
        }
    },

    comment: {
        create: (data) => {
            const errors = [];
            
            if (!data.content || data.content.trim().length < 1) {
                errors.push('Comment cannot be empty');
            }
            
            if (data.content && data.content.trim().length > 1000) {
                errors.push('Comment cannot exceed 1000 characters');
            }
            
            return {
                isValid: errors.length === 0,
                errors
            };
        }
    },

    report: {
        create: (data) => {
            const errors = [];
            
            if (!data.reason || data.reason.trim().length < 10) {
                errors.push('Please provide a detailed reason for the report');
            }
            
            if (!['memorial', 'comment', 'user'].includes(data.targetType)) {
                errors.push('Invalid report target type');
            }
            
            return {
                isValid: errors.length === 0,
                errors
            };
        }
    }
};

// Helper function to validate date
function isValidDate(dateString) {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
}

module.exports = validator;