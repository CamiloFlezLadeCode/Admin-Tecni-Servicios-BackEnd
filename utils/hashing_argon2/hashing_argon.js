const argon2 = require('argon2');


async function hashUserPassword(plainPassword) {
    try {
        const hash = await argon2.hash(plainPassword, {
            type: argon2.argon2id, // Recommended type for general use
            memoryCost: 102400, // Adjust memory usage (in KB)
            timeCost: 3, // Adjust the number of iterations
            parallelism: 1 // Adjust based on your CPU cores
        });
        return hash;
    } catch (error) {
        console.error("Password hashing failed:", error);
        throw error;
    }
}

async function verifyUserPassword(plainPassword, storedHash) {
    try {
        const match = await argon2.verify(storedHash, plainPassword);
        return match; // true if passwords match, false otherwise
    } catch (error) {
        console.error("Password verification failed:", error);
        throw error;
    }
}

module.exports = {
    hashUserPassword,
    verifyUserPassword
}