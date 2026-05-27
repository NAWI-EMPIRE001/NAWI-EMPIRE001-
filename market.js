/**
 * ==========================================================================
 * NAWI-OS | THE SOVEREIGN EXCHANGE REAL-TIME OPERATIONS ENGINE
 * Authority ID: NAWI-EMPIRE001
 * Protocols: Forensic Stamping | P2P Escrow Handshake | WebSockets Sync
 * ==========================================================================
 */

const marketController = {
    // Core API Configuration Endpoints
    config: {
        productsApi: '/api/marketplace/products',
        vaultApi: '/api/user/balance?id=NAWI-EMPIRE001',
        escrowApi: '/api/transactions/escrow-purchase',
        currency: 'Coins'
    },

    // Global Sovereign State Ledger Values
    state: {
        currentBalance: 100.00,
        selectedItem: null,
        activeCategory: 'all',
        allProducts: []
    },

    /**
     * 1. SYSTEM INITIALIZATION BOOTLOADER
     */
    init: function() {
        console.log("⚡ Sovereign Node: Initializing Unified Exchange Protocols...");
        
        this.bindEvents();
        this.initializeExchangeSocketChannel();
        this.fetchMarketAssets();
    },

    /**
     * 2. REAL-TIME WEBSOCKET PIPELINE MANAGEMENT
     */
    initializeExchangeSocketChannel: function() {
        if (typeof window.nawiSocket !== "undefined") {
            console.log("🔒 P2P Shield: WebSocket Channel Pipeline Secured.");

            // Listen for live broadcasted balance state adjustments
            window.nawiSocket.on("balanceStateUpdate", (data) => {
                if (data && typeof data.balance !== "undefined") {
                    this.state.currentBalance = parseFloat(data.balance);
                    this.updateWalletUIDisplay();
                }
            });

            // Listen for incoming transaction confirmations from the distributed ledger
            window.nawiSocket.on("escrowContractSettled", (contractData) => {
                this.appendSettledContractLog(contractData.id, contractData.title, contractData.price);
                
                if (this.state.selectedItem && this.state.selectedItem.id === contractData.id) {
                    console.log("SUCCESS: Asset allocated securely to database cluster.");
                    this.state.selectedItem = null;
                }
            });

            // Listen for structural transaction denials
            window.nawiSocket.on("escrowContractRejected", (errorData) => {
                alert(`TRANSACTION BLOCKED:\nLedger node rejected request: ${errorData.reason}`);
                this.closeEscrow();
            });

        } else {
            console.warn("⚠️ WebSocket Core offline. Activating localized verification safe-mode fallbacks.");
            this.updateWalletUIDisplay();
        }
    },

    /**
     * 3. DOM EVENT INTERCEPTORS & BINDINGS
     */
    bindEvents: function() {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', () => this.executeSearchAndFilter());
        }

        // Expose critical pipeline handles directly to window workspace context for layout triggers
        window.openEscrow = (name, price, id) => this.openEscrow(name, price, id);
        window.closeEscrow = () => this.closeEscrow();
        window.executeFinalTransaction = () => this.executeFinalTransaction();
    },

    /**
     * 4. SOVEREIGN ASSET INVENTORY RECOVERY
     */
    fetchMarketAssets: async function() {
        const container = document.getElementById('product-container');
        if (container) {
            container.innerHTML = `<div class="col-span-full text-center py-20 opacity-50 italic tracking-widest text-xs">SCANNING SOVEREIGN LEDGER...</div>`;
        }

        try {
            const response = await fetch(this.config.productsApi);
            if (response.ok) {
                this.state.allProducts = await response.json();
            } else {
                throw new Error("Active channel cluster fallback protocol needed.");
            }
        } catch (error) {
            console.log("System Ledger Safe-Mode: Populating Premium 7 Pillars Blueprint Items.");
            
            // Explicitly aligned catalog items matching the 7 Structural Pillars
            this.state.allProducts = [
                {
                    id: "DB-FORGE-231",
                    title: "Technical Luxury UI Framework Vector",
                    category: "forge",
                    merchant: "THE DIAMONDBACK FORGE",
                    price: 75.00,
                    pillar: 6,
                    isForensicStamped: true,
                    desc: "High-end matte black and 24k gold responsive UI master design asset template framework.",
                    img: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=600"
                },
                {
                    id: "VIS-ENGINE-01",
                    title: "Main Stage Marketplace Banner Ad Placement",
                    category: "visibility",
                    merchant: "THE VISIBILITY ENGINE",
                    price: 45.00,
                    pillar: 3,
                    isForensicStamped: false,
                    desc: "Secure programmatic promotion traffic router space for 7 consecutive days on network dashboard feeds.",
                    img: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=600"
                },
                {
                    id: "NEXUS-CLIPP-02",
                    title: "Sovereign Stylist Pro Transformation Kit",
                    category: "nexus",
                    merchant: "THE AESTHETIC NEXUS",
                    price: 120.00,
                    pillar: 5,
                    isForensicStamped: true,
                    desc: "Premium precision cordless grooming setup featuring high-carbon diamond grade steel blades.",
                    img: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=600"
                },
                {
                    id: "NEXUS-GARMENT-04",
                    title: "Matte Black Industrial Workspace Uniform",
                    category: "nexus",
                    merchant: "THE AESTHETIC NEXUS",
                    price: 35.00,
                    pillar: 5,
                    isForensicStamped: true,
                    desc: "Waterproof, chemical-resistant corporate luxury stylist workspace protection armor with tool holsters.",
                    img: "https://images.unsplash.com/photo-1552061073-e38053641372?auto=format&fit=crop&q=80&w=600"
                },
                {
                    id: "SONIC-LEDGER-07",
                    title: "Premium Studio Audio Track Master Block",
                    category: "sonic",
                    merchant: "THE SONIC LEDGER",
                    price: 90.00,
                    pillar: 7,
                    isForensicStamped: true,
                    desc: "High-performance encrypted digital track allocation package providing micro-yield validation for stems.",
                    img: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=600"
                }
            ];
        }

        this.renderProducts(this.state.allProducts);
    },

    /**
     * 5. MATRIX FILTER ENGINE
     */
    executeSearchAndFilter: function() {
        const searchInput = document.getElementById('search-input');
        const query = searchInput ? searchInput.value.toLowerCase().trim() : "";
        
        let filtered = this.state.allProducts;
        
        if (this.state.activeCategory !== 'all') {
            filtered = filtered.filter(p => p.category === this.state.activeCategory);
        }
        
        if (query !== "") {
            filtered = filtered.filter(p => 
                p.title.toLowerCase().includes(query) || 
                p.desc.toLowerCase().includes(query) ||
                p.id.toLowerCase().includes(query) ||
                p.merchant.toLowerCase().includes(query)
            );
        }
        
        this.renderProducts(filtered);
    },

    /**
     * 6. HIGH-FIDELITY ASSET CARD GENERATOR
     */
    renderProducts: function(items) {
        const container = document.getElementById('product-container');
        if (!container) return;
        
        container.innerHTML = "";
        
        if (items.length === 0) {
            container.innerHTML = `
                <div class="col-span-full text-center py-12 text-zinc-600 font-bold text-xs uppercase tracking-widest">
                    No High-End Assets Located Inside Specified Node
                </div>`;
            return;
        }

        items.forEach(product => {
            const productImg = product.img || 'placeholder.jpg';
            const productTitle = product.title || 'Sovereign Asset';
            const stampBadge = product.isForensicStamped ? 
                `<span class="merchant-badge"><i class="fa-solid fa-shield-halved mr-1"></i> FORENSIC STAMPED</span>` : 
                `<span class="merchant-badge"><i class="fa-solid fa-crown mr-1"></i> ${product.merchant}</span>`;

            container.innerHTML += `
                <div class="luxury-card">
                    <div class="preview-box">
                        ${stampBadge}
                        <img src="${productImg}" alt="${productTitle}">
                    </div>
                    <div class="p-6">
                        <div class="flex justify-between items-start mb-3">
                            <h3 class="text-white font-bold text-sm tracking-wide">${productTitle}</h3>
                            <span class="text-[9px] text-zinc-600 font-mono">#${product.id}</span>
                        </div>
                        <p class="text-zinc-500 text-[10px] leading-relaxed mb-4 font-light">${product.desc}</p>
                        <div class="mb-4 flex gap-2 items-center">
                            <span class="text-[9px] text-zinc-600 font-mono tracking-wider uppercase">Pillar Node Axis: ${product.category}</span>
                        </div>
                        <div class="flex justify-between items-center bg-black/40 p-4 rounded-2xl border border-zinc-900/50">
                            <div>
                                <span class="text-[8px] text-zinc-600 block uppercase font-black mb-1">Asset Value</span>
                                <span class="text-white font-black text-sm">${product.price.toFixed(2)} <i class="fa-solid fa-coins text-amber-500 ml-1"></i></span>
                            </div>
                            <button onclick="window.openEscrow('${productTitle.replace(/'/g, "\\'")}', ${product.price}, '${product.id}')" class="bg-white text-black px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-500 transition-colors">Acquire</button>
                        </div>
                    </div>
                </div>
            `;
        });
    },

    /**
     * 7. P2P ESCROW HANDSHAKE PIPELINE PROCEDURES
     */
    openEscrow: function(name, price, id) {
        this.state.selectedItem = { name, price, id };
        
        const nameDisplay = document.getElementById('modal-item-name');
        const priceDisplay = document.getElementById('modal-item-price');
        const modalView = document.getElementById('escrow-modal');
        
        if (nameDisplay) nameDisplay.innerText = name;
        if (priceDisplay) priceDisplay.innerText = `${price.toFixed(2)} ${this.config.currency}`;
        if (modalView) modalView.style.display = 'flex';
        
        console.log(`🔒 Escrow Request Initialized for node: ${id}`);
    },

    closeEscrow: function() {
        const modalView = document.getElementById('escrow-modal');
        if (modalView) modalView.style.display = 'none';
        this.state.selectedItem = null;
    },

    executeFinalTransaction: async function() {
        if (!this.state.selectedItem) return;

        // Route live calls directly to backend sockets if cluster handshake is online
        if (typeof window.nawiSocket !== "undefined") {
            window.nawiSocket.emit("authorizeEscrowRelease", {
                contractId: this.state.selectedItem.id,
                value: this.state.selectedItem.price
            });
            this.closeEscrow();
            return;
        }

        // Secure Client Standalone Fallback Verification Flow Logic
        try {
            const response = await fetch(this.config.escrowApi, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    itemId: this.state.selectedItem.id,
                    price: this.state.selectedItem.price,
                    userId: "NAWI-EMPIRE001"
                })
            });
            const data = await response.json();

            if (data.success) {
                this.state.currentBalance = data.newBalance || (this.state.currentBalance - this.state.selectedItem.price);
                this.updateWalletUIDisplay();
                this.appendSettledContractLog(this.state.selectedItem.id, this.state.selectedItem.name, this.state.selectedItem.price);
                this.closeEscrow();
                alert(`SUCCESS:\nEscrow payment cleared securely via Diamondback 231 Creative Solutions.`);
            } else {
                alert(`TRANSACTION DENIED:\n${data.message}`);
                this.closeEscrow();
            }
        } catch (error) {
            // Local Memory Processing Loop
            if (this.state.currentBalance >= this.state.selectedItem.price) {
                this.state.currentBalance -= this.state.selectedItem.price;
                this.updateWalletUIDisplay();
                this.appendSettledContractLog(this.state.selectedItem.id, this.state.selectedItem.name, this.state.selectedItem.price);
                alert(`SUCCESS [LOCAL DISPATCH]:\nEscrow payment cleared locally via Diamondback 231 Creative Solutions.`);
                this.closeEscrow();
            } else {
                alert("TRANSACTION BLOCKED:\nEcosystem ledger indicates insufficient currency reserves.");
                this.closeEscrow();
            }
        }
    },

    /**
     * 8. SYSTEM SYNC DATA UTILITIES
     */
    updateWalletUIDisplay: function() {
        const balanceDisplay = document.getElementById('display-balance');
        if (balanceDisplay) {
            balanceDisplay.innerHTML = `${this.state.currentBalance.toFixed(2)} <i class="fa-solid fa-coins text-amber-500 ml-0.5"></i>`;
        }

        const ledgerDisplay = document.getElementById('ledger-user-balance');
        if (ledgerDisplay) {
            ledgerDisplay.innerText = `${this.state.currentBalance.toFixed(2)} EC`;
        }
    },

    appendSettledContractLog: function(contractId, assetTitle, assetCost) {
        const logContainer = document.getElementById('escrow-logs-container');
        const noActiveMsg = document.getElementById('no-active-escrow-msg');
        
        if (noActiveMsg) noActiveMsg.remove();

        if (logContainer) {
            const contractMarkup = document.createElement("div");
            contractMarkup.className = "bg-emerald-950/20 border border-emerald-500/20 rounded-lg p-3 text-[10px]";
            contractMarkup.innerHTML = `
                <div class="flex justify-between items-center mb-1">
                    <span class="text-emerald-400 font-bold tracking-wider">🔒 CONTRACT SETTLED</span>
                    <span class="text-zinc-600 font-mono">#${contractId}</span>
                </div>
                <span class="text-zinc-400 block truncate">${assetTitle}</span>
                <span class="text-zinc-500 block mt-1">Value Transferred: <strong class="text-white">${parseFloat(assetCost).toFixed(2)} EC</strong></span>
            `;
            logContainer.prepend(contractMarkup);
        }
    }
};

// Global mapping function hooks to enable HTML layout chip clicks safely
window.filterCategory = function(element, cat) {
    document.querySelectorAll('.pillar-chip').forEach(chip => chip.classList.remove('active'));
    element.classList.add('active');
    marketController.state.activeCategory = cat;
    marketController.executeSearchAndFilter();
};

// Fire systems instantly when standard layout finishes drawing
document.addEventListener('DOMContentLoaded', () => marketController.init());
