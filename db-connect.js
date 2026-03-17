/**
 * NAWI-EMPIRE MONGODB GATEWAY
 * Authority: 7 Pillars Control Center
 */

const MONGO_CONFIG = {
    // You get this URL from your MongoDB Atlas 'App Services' -> 'HTTPS Endpoints'
    endpoint: "YOUR_MONGODB_HTTPS_ENDPOINT_URL", 
    apiKey: "YOUR_APP_SERVICES_API_KEY"
};

async function pushToGlobalMarket(productData) {
    try {
        const response = await fetch(MONGO_CONFIG.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': MONGO_CONFIG.apiKey
            },
            body: JSON.stringify({
                dataSource: "NAWI-EMPIRE001", // Your Cluster Name
                database: "NAWI-EMPIRE",
                collection: "Kitchen-menu",
                document: productData
            })
        });

        if (response.ok) {
            return { success: true };
        } else {
            const error = await response.json();
            console.error("Empire DB Error:", error);
            return { success: false };
        }
    } catch (err) {
        console.error("Connection Failed:", err);
        return { success: false };
    }
}
