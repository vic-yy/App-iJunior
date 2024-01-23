export default function isPhoneNumberValid(phoneNumber: string): boolean {
    const cleanedPhoneNumber = phoneNumber.replace(/\D/g, '');

    const regexPatterns = [
        /^\d{10}$/,          //  (sem DDD e sem prefixo)
        /^\d{11}$/,          //  (com DDD e sem prefixo)
        /^\d{12}$/,          //  (com DDD e com prefixo)
        /^\+\d{12}$/         //  (com DDD e com prefixo, usando +)
    ];

    return regexPatterns.some(pattern => pattern.test(cleanedPhoneNumber));
} 