// THE IMPERIAL DISBURSEMENT ENGINE
const axios = require('axios');

async function sendImperialNaira(userBankCode, accountNum, amountUSD) {
    // 1. Convert USD to Naira (Example Rate: 1500)
    const amountNaira = amountUSD * 1500 * 100; // Paystack uses kobo (cents)

    const payoutData = {
        source: "balance",
        amount: amountNaira,
        recipient: {
            type: "nuban",
            name: "Imperial Citizen",
            account_number: accountNum,
            bank_code: userBankCode,
            currency: "NGN"
        },
        reason: "NAWI-EMPIRE001 Authorized Payout"
    };

    // 2. The Bridge Command
    try {
        const response = await axios.post('https://api.paystack.co/transfer', payoutData, {
            headers: { Authorization: `Bearer YOUR_SECRET_KEY` }
        });
        
        console.log("Vault Released: Money is in the Citizen's bank.");
        return response.data;
    } catch (error) {
        console.error("Vault Error: Bridge Blocked.");
    }
}
