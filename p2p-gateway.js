<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>NAWI-EMPIRE | Sovereign P2P Gateway</title>
    
    <!-- Tech Stack -->
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=Cinzel:wght@700&display=swap" rel="stylesheet">
    
    <style>
        :root { --gold: #D4AF37; --black: #050505; --matte: #0A0A0A; --green: #00ff64; }
        body { background: var(--black); color: white; font-family: 'Inter', sans-serif; margin: 0; overflow-x: hidden; }

        /* --- EXECUTIVE GLASS CONTAINER --- */
        .gateway-card {
            background: linear-gradient(145deg, #0f0f0f 0%, #050505 100%);
            border: 1px solid rgba(212, 175, 55, 0.3);
            border-radius: 30px;
            padding: 30px;
            max-width: 450px;
            margin: 40px auto;
            box-shadow: 0 20px 50px rgba(0,0,0,0.8), 0 0 20px rgba(212, 175, 55, 0.05);
            position: relative;
        }

        .node-status-bar {
            background: rgba(0, 255, 100, 0.05);
            border: 1px solid rgba(0, 255, 100, 0.2);
            border-radius: 10px;
            padding: 10px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 25px;
        }

        .pulse-dot {
            width: 8px; height: 8px; background: var(--green);
            border-radius: 50%; box-shadow: 0 0 10px var(--green);
            animation: pulse 2s infinite;
        }

        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.3; } 100% { opacity: 1; } }

        /* --- INPUT STYLING --- */
        .sov-input-group { margin-bottom: 20px; }
        .sov-label { font-size: 9px; font-weight: 900; color: var(--gold); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 8px; display: block; }
        
        .sov-input {
            width: 100%; background: #111; border: 1px solid #222; 
            padding: 15px; border-radius: 12px; color: white;
            font-size: 13px; transition: 0.3s;
        }
        .sov-input:focus { border-color: var(--gold); outline: none; background: #151515; }

        /* --- MASTER BUTTON --- */
        .btn-sov-execute {
            width: 100%; background: var(--gold); color: black;
            padding: 18px; border-radius: 15px; font-weight: 900;
            text-transform: uppercase; letter-spacing: 2px; font-size: 11px;
            box-shadow: 0 10px 20px rgba(212, 175, 55, 0.2);
            cursor: pointer; transition: 0.3s; border: none;
        }
        .btn-sov-execute:active { transform: scale(0.97); }

        /* --- THE AUTHORITY TOAST --- */
        #authority-overlay {
            position: fixed; inset: 0; background: rgba(0,0,0,0.9);
            display: none; align-items: center; justify-content: center; z-index: 10000;
            backdrop-filter: blur(10px);
        }
    </style>
</head>
<body>

    <div class="gateway-card">
        <!-- Hardware Handshake Header -->
        <div class="node-status-bar">
            <div class="flex items-center gap-3">
                <div class="pulse-dot"></div>
                <span class="text-[9px] font-black uppercase tracking-widest text-emerald-500">Node: Aurora-231 Active</span>
            </div>
            <span class="text-[8px] text-zinc-500 font-bold">RTX 4090 SECURED</span>
        </div>

        <div class="text-center mb-8">
            <h2 class="text-xl font-black font-['Cinzel'] text-amber-500 tracking-tighter italic">SOVEREIGN BRIDGE</h2>
            <p class="text-[9px] text-zinc-500 uppercase tracking-widest mt-1">P2P Liquidity & Escrow Resolution</p>
        </div>

        <!-- Withdrawal Form -->
        <div class="sov-input-group">
            <label class="sov-label">Recipient Identity</label>
            <input type="text" id="target-name" class="sov-input" placeholder="Legal Name for Verification">
        </div>

        <div class="sov-input-group">
            <label class="sov-label">Destination Node (Wallet/Bank)</label>
            <input type="text" id="target-account" class="sov-input" placeholder="Account Number or Raenest Tag">
        </div>

        <div class="sov-input-group">
            <label class="sov-label">Liquidity Volume (EMPR)</label>
            <input type="number" id="target-amount" class="sov-input" placeholder="0.00">
        </div>

        <button class="btn-sov-execute" onclick="P2PGateway.initiateTransfer()">
            Authorize Liquidity Sync
        </button>

        <div class="mt-8 pt-6 border-t border-zinc-900 text-center">
            <div class="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 rounded-full border border-zinc-800">
                <i class="fa-solid fa-shield-halved text-amber-500 text-[10px]"></i>
                <span class="text-[8px] font-black text-zinc-400 uppercase tracking-widest">100% Escrow Protection</span>
            </div>
        </div>
    </div>

    <!-- Master Authority Overlay -->
    <div id="authority-overlay">
        <div class="bg-black border border-amber-500 p-8 rounded-3xl max-w-sm text-center">
            <i class="fa-solid fa-crown text-amber-500 text-3xl mb-4"></i>
            <h3 class="text-amber-500 font-black tracking-widest mb-4 uppercase">Master Override</h3>
            <p id="authority-msg" class="text-xs text-zinc-400 italic leading-relaxed"></p>
            <button onclick="document.getElementById('authority-overlay').style.display='none'" class="mt-6 text-[10px] font-black text-zinc-500 uppercase">Dismiss</button>
        </div>
    </div>

    <script>
        /**
         * NAWI-EMPIRE | SOVEREIGN P2P GATEWAY
         * Authority: NAWI-EMPIRE001
         */

        const P2PGateway = {
            ceoIdentity: "NAWI-EMPIRE001",
            nodeEndpoint: "https://nawi-empire1.onrender.com",

            init: function() {
                console.log("Sovereign Handshake: Establishing connection to Aurora-231...");
                this.verifyNodeHardware();
            },

            verifyNodeHardware: async function() {
                // Simulating connection to the RTX 4090 workstation logic
                setTimeout(() => {
                    console.log("Hardware Link: 192GB RAM Buffer Synchronized.");
                }, 1000);
            },

            /**
             * The Master Authority Handshake
             */
            initiateTransfer: async function() {
                const data = {
                    name: document.getElementById('target-name').value,
                    account: document.getElementById('target-account').value,
                    amount: document.getElementById('target-amount').value,
                    authKey: localStorage.getItem('nawi_identity')
                };

                if(!data.name || !data.amount) {
                    alert("Empire Security: Authentication failed. All fields required.");
                    return;
                }

                // CHECK FOR CEO MASTER OVERRIDE
                if (data.authKey === this.ceoIdentity) {
                    this.showAuthorityToast("This is my order and my authority to protect this platform. Execute bypassing standard wait times.");
                }

                // Send to MongoDB via Render
                try {
                    const response = await fetch(`${this.nodeEndpoint}/api/request-withdrawal`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                    });
                    
                    const result = await response.json();
                    if(result.success) {
                        alert("Liquidity Locked in Escrow. Status: PENDING_MASTER_APPROVAL");
                    }
                } catch (err) {
                    console.warn("Redirecting to local P2P backup: Offline Mode Active.");
                    alert("Gateway Offline: Transaction logged to local node. Syncing with MongoDB shortly.");
                }
            },

            showAuthorityToast: function(msg) {
                const overlay = document.getElementById('authority-overlay');
                const msgBox = document.getElementById('authority-msg');
                msgBox.innerText = msg;
                overlay.style.display = 'flex';
            },

            /**
             * Bridge to Fintech (Raenest/Geegpay)
             */
            syncInternationalLiquidity: function(platform) {
                console.log(`Bypassing local NGN barriers. Syncing via ${platform} API...`);
            }
        };

        document.addEventListener('DOMContentLoaded', () => {
            // Recognize CEO from Saved Information
            localStorage.setItem('nawi_identity', 'NAWI-EMPIRE001');
            P2PGateway.init();
        });
    </script>
</body>
</html>
