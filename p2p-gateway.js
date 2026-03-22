<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>NAWI-EMPIRE | SOVEREIGN P2P</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        :root { --gold: #D4AF37; --black: #050505; --card: #111; --green: #00ff64; }
        body { background: var(--black); color: white; font-family: 'Inter', sans-serif; margin: 0; padding-bottom: 50px; }

        /* --- THE P2P INTERFACE --- */
        .p2p-container { 
            background: #080808; border: 1px solid var(--gold); 
            border-radius: 25px; padding: 25px; margin: 20px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.5);
        }
        
        .p2p-header { text-align: center; margin-bottom: 25px; }
        .p2p-header i { color: var(--gold); font-size: 30px; margin-bottom: 10px; }
        .p2p-header h2 { font-size: 16px; letter-spacing: 3px; margin: 0; text-transform: uppercase; }
        .p2p-header p { font-size: 10px; color: #555; margin-top: 5px; }

        .input-group { margin-bottom: 18px; }
        .input-group label { font-size: 10px; color: var(--gold); display: block; margin-bottom: 8px; font-weight: 900; letter-spacing: 1px; }
        
        .p2p-input { 
            width: 100%; background: #111; border: 1px solid #222; 
            color: white; padding: 15px; border-radius: 12px; 
            box-sizing: border-box; font-size: 14px;
        }
        .p2p-input:focus { border-color: var(--gold); outline: none; }

        .btn-p2p-main { 
            width: 100%; background: var(--gold); color: black; border: none; 
            padding: 18px; border-radius: 15px; font-weight: 900; 
            text-transform: uppercase; letter-spacing: 1px; cursor: pointer;
            margin-top: 10px; transition: 0.3s;
        }
        .btn-p2p-main:active { transform: scale(0.96); opacity: 0.8; }

        /* --- ESCROW STATUS TAG --- */
        .escrow-badge { 
            display: inline-block; background: rgba(0, 255, 100, 0.1); 
            color: var(--green); padding: 5px 12px; border-radius: 50px; 
            font-size: 9px; font-weight: 900; margin-top: 15px;
        }
    </style>
</head>
<body>

    <div class="p2p-container" id="p2p-withdrawal-form">
        <div class="p2p-header">
            <i class="fa-solid fa-building-columns"></i>
            <h2>Sovereign Withdrawal</h2>
            <p>ASSET CLEARANCE: 24H ESCROW PROTECTION</p>
        </div>

        <div class="input-group">
            <label>RECIPIENT LEGAL NAME</label>
            <input type="text" id="p2p-name" class="p2p-input" placeholder="As seen on Identity Card">
        </div>

        <div class="input-group">
            <label>BANK ACCOUNT / DIGITAL WALLET</label>
            <input type="text" id="p2p-account" class="p2p-input" placeholder="Account Number or Crypto Address">
        </div>

        <div class="input-group">
            <label>AMOUNT TO WITHDRAW (🪙)</label>
            <input type="number" id="p2p-amount" class="p2p-input" placeholder="Minimum: 10.00">
        </div>

        <button class="btn-p2p-main" onclick="P2P_GATEWAY.submitToVault()">
            Authorize Asset Transfer
        </button>

        <center><div class="escrow-badge"><i class="fa-solid fa-shield-halved"></i> SECURE P2P ESCROW ACTIVE</div></center>
    </div>

    <script>
        /**
         * NAWI-EMPIRE SOVEREIGN P2P GATEWAY
         * Authority: 7 Pillars Control Center
         * Security Level: MAX (Sovereign)
         */

        const API_URL = "https://nawi-empire1.onrender.com"; // Your Render Backend

        const P2P_GATEWAY = {
            ceoName: "NAWI-EMPIRE001",
            ceoSocial: "7 pillars",

            // CHECK IF OWNER IS LOGGED IN
            isMasterAuthority: function() {
                return localStorage.getItem('nawi_identity') === this.ceoName;
            },

            // MASTER BYPASS LOGIC
            executeMasterBypass: function(serviceName) {
                const toast = document.createElement('div');
                toast.style = "position:fixed; top:20px; left:50%; transform:translateX(-50%); background:#D4AF37; color:#000; padding:12px 25px; border-radius:50px; font-weight:900; font-size:11px; z-index:20000; box-shadow:0 10px 30px rgba(0,0,0,0.5); text-transform:uppercase;";
                toast.innerText = `MASTER ACCESS GRANTED: ${serviceName}`;
                document.body.appendChild(toast);
                setTimeout(() => { toast.remove(); }, 3000);
                return true; 
            },

            // SUBMIT REAL WITHDRAWAL TO MONGODB
            submitToVault: async function() {
                const data = {
                    name: document.getElementById('p2p-name').value,
                    account: document.getElementById('p2p-account').value,
                    amount: document.getElementById('p2p-amount').value,
                    userId: localStorage.getItem('user_id') || 'GUEST_FOUNDER',
                    status: "PENDING"
                };

                if(!data.name || !data.amount || !data.account) {
                    alert("Empire Security: All fields must be filled to authorize transfer.");
                    return;
                }

                try {
                    const response = await fetch(`${API_URL}/api/request-withdrawal`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                    });
                    
                    const result = await response.json();
                    if(result.success) {
                        alert("✅ SUCCESS: Your request is in the Master Approval Queue.");
                        this.clearForm();
                    }
                } catch (err) {
                    alert("⚠️ GATEWAY ERROR: Check your Render server connection.");
                }
            },

            clearForm: function() {
                document.getElementById('p2p-name').value = '';
                document.getElementById('p2p-account').value = '';
                document.getElementById('p2p-amount').value = '';
            },

            // TRANSACTION HANDLER FOR TOOLS (ADS, MUSIC, ETC)
            initiateTransaction: function(service, amountCoins) {
                if (this.isMasterAuthority()) {
                    return this.executeMasterBypass(service);
                }
                
                const confirmPay = confirm(`Authorize ${amountCoins} 🪙 for ${service}?`);
                if(confirmPay) {
                    alert(`✅ Verified. ${amountCoins} 🪙 held in Escrow for ${service}.`);
                }
            }
        };

        // --- AUTO-INITIALIZATION ---
        document.addEventListener('DOMContentLoaded', () => {
            // Auto-Login for CEO Identity
            localStorage.setItem('nawi_identity', 'NAWI-EMPIRE001');
            console.log("P2P System Online: Authority Recognized.");
        });
    </script>
</body>
</html>
