export default function isPhoneNumberValid(phoneNumber: string): boolean {
    const cleanedPhoneNumber = phoneNumber.replace(/\D/g, '');

    const regexPatterns = [
        /^\d{11}$/,          //  (com DDD e com prefixo)
    ];

    return regexPatterns.some(pattern => pattern.test(cleanedPhoneNumber));
} 