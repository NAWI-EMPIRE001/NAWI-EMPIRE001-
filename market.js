/**
 * NAWI-EMPIRE | MASTER MARKET ENGINE (V3)
 * Authority: NAWI-EMPIRE001
 * Protocols: Forensic Stamping | P2P Escrow | Pillar Sync
 */

// --- PART A: THE SOVEREIGN SCHEMA (For your MongoDB/Server) ---
/* 
   Note: Use this in your server.js or models/Product.js
   It now includes 'Pillar' and 'Watermark' metadata.
*/
const SovereignAssetSchema = {
    ownerId: String,        // The current Master of the asset
    creatorId: String,      // The original Founder (for royalties)
    name: String,
    pillar: { type: Number, enum: [1, 2, 3, 4, 5, 6, 7] },
    price: Number,          // Stored in EMPR
    assetUrl: String,       // Link to the 3D Render/Image
    isForensicStamped: { type: Boolean, default: true },
    escrowStatus: { 
        type: String, 
        enum: ['AVAILABLE', 'LOCKED', 'SOLD'], 
        default: 'AVAILABLE' 
    }
};

// --- PART B: THE MARKET CONTROLLER (Frontend Logic) ---

const marketController = {
    // Config: Adjust these to your Render.com / MongoDB URLs
    config: {
        assetApi: '/api/pillarassets',
        vaultApi: '/api/vault/balance',
        escrowApi: '/api/p2p-gateway/lock',
        currency: 'EMPR'
    },

    init: function() {
        console.log("Sovereign Node: Initializing Alpha-Market Protocols...");
        this.updateVaultDisplay();
        this.fetchMarketAssets();
        this.setupFilters();
    },

    /**
     * UI Logic: Update the user's "Vault" balance in the header
     */
    updateVaultDisplay: async function() {
        try {
            const response = await fetch(this.config.vaultApi);
            const data = await response.json();
            const vaultEl = document.getElementById('vault-balance');
            if (vaultEl) vaultEl.innerText = `${data.balance} ${this.config.currency}`;
        } catch (e) {
            console.warn("Vault Offline: Using Local Node cache.");
        }
    },

    /**
     * Data Logic: Fetch from MongoDB with Pillar Filtering
     */
    fetchMarketAssets: async function(pillarId = 'all') {
        const grid = document.getElementById('marketplace-grid');
        grid.innerHTML = `<div class="col-span-full text-center py-20 opacity-50 italic">Scanning Sovereign Ledger...</div>`;

        try {
            let url = this.config.assetApi;
            if (pillarId !== 'all') url += `?pillar=${pillarId}`;

            const response = await fetch(url);
            const assets = await response.json();

            this.renderAssets(assets);
        } catch (error) {
            this.handleError("P2P Gateway Sync Failed.");
        }
    },

    /**
     * Render Logic: Technical Luxury Cards
     */
    renderAssets: function(assets) {
        const grid = document.getElementById('marketplace-grid');
        if (!assets.length) {
            grid.innerHTML = `<div class="col-span-full text-center py-20 text-zinc-600 uppercase text-[10px] tracking-widest">No Authenticated Assets Found</div>`;
            return;
        }

        grid.innerHTML = assets.map(asset => `
            <div class="asset-card group" onclick="marketController.viewAsset('${asset._id}')">
                <div class="preview-box">
                    ${asset.isForensicStamped ? '<div class="merchant-badge">FORENSIC STAMPED</div>' : ''}
                    <img src="${asset.assetUrl || 'placeholder.jpg'}" alt="Render" class="group-hover:scale-110 transition-transform duration-700">
                </div>
                <div class="asset-info">
                    <span class="text-[9px] text-zinc-500 uppercase font-black">Pillar ${asset.pillar}</span>
                    <span class="asset-name">${asset.name}</span>
                    <div class="flex justify-between items-center mt-2">
                        <span class="asset-price">${asset.price.toLocaleString()} ${this.config.currency}</span>
                        <button class="btn-p2p" onclick="marketController.initiatePurchase('${asset._id}', ${asset.price}, event)">
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    },

    /**
     * Execution Logic: The "Escrow Handshake"
     * This combines Code 1's fund-checking with Code 2's UI trigger.
     */
    initiatePurchase: async function(assetId, price, event) {
        event.stopPropagation(); // Stop from opening the detail view

        // 1. Local Authority Check
        const proceed = confirm(`AUTHORIZE TRANSACTION: Lock ${price} EMPR into Empire Escrow?`);
        if (!proceed) return;

        console.log(`Initiating Secure Handshake for Asset: ${assetId}`);

        try {
            const response = await fetch(this.config.escrowApi, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    assetId: assetId,
                    timestamp: new Date().toISOString(),
                    authorityCode: "EMPIRE-001"
                })
            });

            const result = await response.json();

            if (result.success) {
                alert("SUCCESS: Funds locked in Empire Vault. Awaiting delivery.");
                window.location.href = `/escrow-tracker.html?id=${result.transactionId}`;
            } else {
                alert(`DENIED: ${result.reason || "Insufficient Funds in Vault"}`);
            }
        } catch (err) {
            alert("CRITICAL ERROR: P2P Gateway is unresponsive. Check network.");
        }
    },

    /**
     * Navigation Logic: Filter Mapping
     */
    setupFilters: function() {
        const chips = document.querySelectorAll('.pillar-chip');
        chips.forEach(chip => {
            chip.addEventListener('click', (e) => {
                chips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                
                // Extract Pillar ID (e.g., "Pillar 7" -> 7)
                const text = chip.innerText;
                const pillarId = text.match(/\d+/) ? text.match(/\d+/)[0] : 'all';
                this.fetchMarketAssets(pillarId);
            });
        });
    },

    viewAsset: function(id) {
        // High-Fidelity Detail View
        window.location.href = `/asset-master-view.html?id=${id}`;
    },

    handleError: function(msg) {
        const grid = document.getElementById('marketplace-grid');
        grid.innerHTML = `<div class="col-span-full text-red-500 text-center py-10 font-bold">${msg}</div>`;
    }
};

// Start the Engine
document.addEventListener('DOMContentLoaded', () => marketController.init());
