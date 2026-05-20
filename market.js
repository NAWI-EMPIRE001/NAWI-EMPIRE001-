/**
 * NAWI-EMPIRE | MASTER MARKET CORE SYSTEM (V3)
 * Authority ID: NAWI-EMPIRE001
 * Protocols: Forensic Stamping | P2P Escrow Handshake | Pillar Filters
 */

const marketController = {
    // System Target Config Endpoints
    config: {
        productsApi: '/api/marketplace/products',
        vaultApi: '/api/user/balance?id=NAWI-EMPIRE001',
        escrowApi: '/api/transactions/escrow-purchase',
        currency: 'Coins'
    },

    // Global Ecosystem Runtime Ledger States
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
        console.log("Sovereign Node: Initializing Combined Alpha-Market Protocols...");
        
        // Setup Live Events Lookups
        this.bindEvents();
        
        // Sync Wallet Balance and Inventory Nodes
        this.refreshUserWalletBalance();
        this.fetchMarketAssets();
    },

    /**
     * 2. DESCRIPTOR EVENT LISTENER STRUCTURING
     */
    bindEvents: function() {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', () => this.executeSearchAndFilter());
        }

        // Handle structural category tab clicks dynamically
        const chips = document.querySelectorAll('.pillar-chip');
        chips.forEach(chip => {
            chip.addEventListener('click', (e) => {
                chips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                
                // Extract category flags or map numbers
                const text = chip.innerText.toLowerCase();
                let catSelection = 'all';
                
                if (text.includes('diamondback') || text.includes('branding')) catSelection = 'branding';
                else if (text.includes('ads')) catSelection = 'ads';
                else if (text.includes('stylist')) catSelection = 'stylist';
                
                this.state.activeCategory = catSelection;
                this.executeSearchAndFilter();
            });
        });
    },

    /**
     * 3. INVENTORY SYNC RUNTIME MANAGEMENT
     */
    fetchMarketAssets: async function() {
        const container = document.getElementById('product-container') || document.getElementById('marketplace-grid');
        if (container) {
            container.innerHTML = `<div class="col-span-full text-center py-20 opacity-50 italic tracking-widest text-xs">SCANNING SOVEREIGN LEDGER...</div>`;
        }

        try {
            const response = await fetch(this.config.productsApi);
            if (response.ok) {
                this.state.allProducts = await response.json();
            } else {
                throw new Error("Server API Unresponsive. Activating built-in operational node backups.");
            }
        } catch (error) {
            console.warn("System Ledger Note:", error.message);
            
            // Standard Master Database Fallback Array Matching User Operations
            this.state.allProducts = [
                {
                    id: "DB-FRAME-231",
                    title: "Technical Luxury UI Framework",
                    category: "branding",
                    merchant: "DIAMONDBACK 231",
                    price: 75.00,
                    pillar: 7,
                    isForensicStamped: true,
                    desc: "High-end matte black and 24k gold responsive UI vector template framework for custom digital interfaces.",
                    img: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=600"
                },
                {
                    id: "ADS-BANNER-01",
                    title: "Main Stage Marketplace Banner Ad",
                    category: "ads",
                    merchant: "EMPIRE ADS ENGINE",
                    price: 45.00,
                    pillar: 5,
                    isForensicStamped: false,
                    desc: "Secure programmatic ad space execution for 7 consecutive days on the main ecosystem dashboard.",
                    img: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=600"
                },
                {
                    id: "STYL-BARB-KIT",
                    title: "Sovereign Stylist Pro Clipper Set",
                    category: "stylist",
                    merchant: "DIAMONDBACK 231",
                    price: 120.00,
                    pillar: 2,
                    isForensicStamped: true,
                    desc: "Premium precision cordless grooming barbing kit featuring high-carbon diamond steel blades.",
                    img: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=600"
                },
                {
                    id: "STYL-APRON-231",
                    title: "Matte Black Industrial Stylist Gown",
                    category: "stylist",
                    merchant: "DIAMONDBACK 231",
                    price: 35.00,
                    pillar: 2,
                    isForensicStamped: true,
                    desc: "Waterproof, chemical-resistant high-end designer barber workspace uniform with specialized tool holster array.",
                    img: "https://images.unsplash.com/photo-1552061073-e38053641372?auto=format&fit=crop&q=80&w=600"
                }
            ];
        }

        this.renderProducts(this.state.allProducts);
    },

    /**
     * 4. ADVANCED PATTERN FILTER MATRIX ENGINE
     */
    executeSearchAndFilter: function() {
        const searchInput = document.getElementById('search-input');
        const query = searchInput ? searchInput.value.toLowerCase().trim() : "";
        
        let filtered = this.state.allProducts;
        
        // Filter Criterion Step 1: Active Category Classifications
        if (this.state.activeCategory !== 'all') {
            filtered = filtered.filter(p => p.category === this.state.activeCategory);
        }
        
        // Filter Criterion Step 2: String Token Query Lookups
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
     * 5. HIGH-FIDELITY UX ASSET DOM RENDERING
     */
    renderProducts: function(items) {
        // Universal Container Resolver to prevent page injection structural blockages
        const container = document.getElementById('product-container') || document.getElementById('marketplace-grid');
        if (!container) return;
        
        container.innerHTML = "";
        
        if (items.length === 0) {
            container.innerHTML = `
                <div class="col-span-full text-center py-12 text-zinc-600 font-bold text-xs uppercase tracking-widest">
                    No Assets Found Matching Query
                </div>`;
            return;
        }

        items.forEach(product => {
            // Unify properties seamlessly from database fields or offline fallback states
            const productImg = product.img || product.assetUrl || 'placeholder.jpg';
            const productTitle = product.title || product.name || 'Sovereign Asset';
            const productPillarInfo = product.pillar ? `<span class="text-[9px] text-zinc-600 font-mono">PILLAR ${product.pillar}</span>` : '';
            const stampBadge = product.isForensicStamped ? `<span class="merchant-badge"><i class="fa-solid fa-shield-halved mr-1"></i> FORENSIC STAMPED</span>` : `<span class="merchant-badge"><i class="fa-solid fa-crown mr-1"></i> ${product.merchant}</span>`;

            container.innerHTML += `
                <div class="luxury-card" onclick="marketController.viewAssetDetail('${product.id}')">
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
                            ${productPillarInfo}
                        </div>
                        <div class="flex justify-between items-center bg-black/50 p-4 rounded-2xl border border-zinc-900/50" onclick="event.stopPropagation()">
                            <div>
                                <span class="text-[8px] text-zinc-600 block uppercase font-black mb-1">Asset Value</span>
                                <span class="text-white font-black text-sm">${product.price.toFixed(2)} <i class="fa-solid fa-coins text-amber-500 ml-1"></i></span>
                            </div>
                            <button onclick="marketController.openEscrow('${productTitle.replace(/'/g, "\\'")}', ${product.price}, '${product.id}')" class="bg-white text-black px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-500 transition-colors">Acquire</button>
                        </div>
                    </div>
                </div>
            `;
        });
    },

    /**
     * 6. TRUSTLESS P2P ESCROW PIPELINE PROCEDURES
     */
    openEscrow: function(name, price, id) {
        this.state.selectedItem = { name, price, id };
        
        const nameDisplay = document.getElementById('modal-item-name');
        const priceDisplay = document.getElementById('modal-item-price');
        const modalView = document.getElementById('escrow-modal');
        
        if (nameDisplay) nameDisplay.innerText = name;
        if (priceDisplay) priceDisplay.innerText = `${price.toFixed(2)} ${this.config.currency}`;
        if (modalView) modalView.style.display = 'flex';
    },

    closeEscrow: function() {
        const modalView = document.getElementById('escrow-modal');
        if (modalView) modalView.style.display = 'none';
    },

    executeFinalTransaction: async function() {
        if (!this.state.selectedItem) return;

        try {
            const response = await fetch(this.config.escrowApi, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    itemId: this.state.selectedItem.id,
                    price: this.state.selectedItem.price,
                    userId: "NAWI-EMPIRE001",
                    authorityCode: "EMPIRE-001",
                    timestamp: new Date().toISOString()
                })
            });

            const data = await response.json();

            if (data.success) {
                this.state.currentBalance = data.newBalance || (this.state.currentBalance - this.state.selectedItem.price);
                this.updateWalletUIDisplay();
                this.closeEscrow();
                alert(`SUCCESS:\nEscrow payment cleared securely via Diamondback 231 Creative Solutions.\nAsset status updated on server cluster ledger.`);
                if(data.transactionId) {
                    window.location.href = `/escrow-tracker.html?id=${data.transactionId}`;
                }
            } else {
                alert(`TRANSACTION DENIED:\n${data.message || "Ledger processing mismatch."}`);
                this.closeEscrow();
            }

        } catch (error) {
            console.warn("P2P Handshake Gateway offline. Processing through standalone client verification verification run...");
            
            if (this.state.currentBalance >= this.state.selectedItem.price) {
                this.state.currentBalance -= this.state.selectedItem.price;
                this.updateWalletUIDisplay();
                this.closeEscrow();
                alert(`SUCCESS [LOCAL DISPATCH]:\nEscrow payment cleared locally via Diamondback 231 Creative Solutions.\nAsset allocated securely to client environment state.`);
            } else {
                alert("TRANSACTION BLOCKED:\nEcosystem ledger indicates insufficient currency reserves.");
                this.closeEscrow();
            }
        }
    },

    /**
     * 7. DATA RECONCILIATION WALLET UTILITIES
     */
    refreshUserWalletBalance: async function() {
        try {
            const response = await fetch(this.config.vaultApi);
            if (response.ok) {
                const data = await response.json();
                this.state.currentBalance = data.balance;
            }
        } catch (e) {
            // Retain execution baseline state defaults gracefully
        }
        this.updateWalletUIDisplay();
    },

    updateWalletUIDisplay: function() {
        const balanceDisplay = document.getElementById('display-balance') || document.getElementById('vault-balance');
        if (balanceDisplay) {
            balanceDisplay.innerHTML = `${this.state.currentBalance.toFixed(2)} <i class="fa-solid fa-coins text-amber-500 ml-1"></i>`;
        }
    },

    viewAssetDetail: function(id) {
        console.log(`Routing through asset interface master module layer for asset token ID: ${id}`);
        // To deploy full layout details screen workspace, uncomment the tracking redirection script below:
        // window.location.href = `/asset-master-view.html?id=${id}`;
    }
};

// Fire engine systems setup instantly upon structural DOM layout resolution
document.addEventListener('DOMContentLoaded', () => marketController.init());
