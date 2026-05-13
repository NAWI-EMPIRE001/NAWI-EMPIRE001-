/**
 * NAWI-EMPIRE | VAULT & LIQUIDITY CONTROLLER
 * Bridge: Pillar 6 (Finance) & Pillar 2 (P2P Gateway)
 * Authority: NAWI-EMPIRE001 (Master Node)
 */

const VaultController = {
    balanceElement: document.getElementById('main-balance'),
    ledgerContainer: document.getElementById('ledger-container'),
    conversionRate: 750, 
    cachedTransactions: [], // Stores data for the receipt modal

    init: async function() {
        console.log("Vault Handshake: Aurora-231 Node Synchronizing...");
        await this.syncVaultData();
        this.setupEventListeners();
    },

    /**
     * Synchronizes Balance and Naira Conversion with Node-001 Verification
     */
    syncVaultData: async function() {
        try {
            const response = await fetch('/api/wallet/balance');
            const data = await response.json();
            const balance = parseFloat(data.balance) || 0;

            // Update EMPR Display
            if (this.balanceElement) {
                this.balanceElement.innerHTML = `${balance.toLocaleString(undefined, {minimumFractionDigits: 2})} <span class="text-lg text-zinc-600">EMPR</span>`;
            }

            // Update NGN Conversion Display (Targeting the paragraph in the vault-card)
            const ngnDisplay = document.querySelector('.vault-card p');
            if (ngnDisplay) {
                const ngnValue = (balance * this.conversionRate);
                ngnDisplay.innerHTML = `≈ ${ngnValue.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' })}`;
            }

            await this.loadSovereignLedger();

        } catch (err) {
            console.error("Vault Sync Error: Node-001 connection timed out.");
            if(this.balanceElement) this.balanceElement.innerHTML = `CONNECTION ERROR`;
        }
    },

    /**
     * Loads the 7-Pillar Ledger with forensic row details
     */
    loadSovereignLedger: async function() {
        try {
            const response = await fetch('/api/wallet/ledger');
            const transactions = await response.json();
            this.cachedTransactions = transactions; // Cache for receipt lookup

            if (!transactions || transactions.length === 0) {
                this.ledgerContainer.innerHTML = `
                    <div class="py-10 text-center opacity-30">
                        <i class="fa-solid fa-box-archive mb-2"></i>
                        <p class="text-[9px] uppercase tracking-widest">No Sovereign Records Found</p>
                    </div>`;
                return;
            }

            // Sort by newest first and render
            this.ledgerContainer.innerHTML = transactions.sort((a, b) => new Date(b.date) - new Date(a.date)).map(tx => `
                <div class="ledger-row" onclick="VaultController.showReceiptDetails('${tx._id}')">
                    <div class="flex items-center gap-4">
                        <div class="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-800">
                            <i class="fa-solid ${tx.type === 'credit' ? 'fa-arrow-up-long text-emerald-500' : 'fa-arrow-down-long text-amber-500'} text-[10px]"></i>
                        </div>
                        <div>
                            <span class="pillar-tag">Pillar 0${tx.pillar}</span>
                            <h4 class="text-[11px] font-bold mt-1 text-white">${tx.description.toUpperCase()}</h4>
                        </div>
                    </div>
                    <div class="text-right">
                        <p class="text-[11px] font-black ${tx.type === 'credit' ? 'text-emerald-500' : 'text-zinc-300'}">
                            ${tx.type === 'credit' ? '+' : '-'}${tx.amount.toFixed(2)}
                        </p>
                        <p class="text-[7px] text-zinc-600 font-bold uppercase tracking-tighter">${tx.status}</p>
                    </div>
                </div>
            `).join('');

        } catch (err) {
            this.ledgerContainer.innerHTML = `<p class="text-[9px] text-red-500 text-center">FAILED TO LOAD LEDGER</p>`;
        }
    },

    /**
     * Fetches details for the receipt modal from the cache
     */
    showReceiptDetails: function(txId) {
        const tx = this.cachedTransactions.find(t => t._id === txId);
        if (!tx) return;

        // Populate the Receipt Modal (Code 1 Style)
        const modal = document.getElementById('receipt-overlay');
        if (modal) {
            modal.querySelector('h2').innerText = `₦${(tx.amount * this.conversionRate).toLocaleString()}`;
            modal.querySelector('p').innerText = `Converted from ${tx.amount.toFixed(2)} EMPR`;
            
            // Update Recipient and Bank details if they exist in your DB
            const detailSpans = modal.querySelectorAll('.receipt-box span.text-white');
            if (detailSpans.length >= 2) {
                detailSpans[0].innerText = tx.recipient || "Empire Citizen";
                detailSpans[1].innerText = tx.bank || "Sovereign Gateway";
            }
            
            // Set Handshake ID
            const handshake = modal.querySelector('.font-mono');
            if (handshake) handshake.innerText = `EMPR-${txId.substring(0, 8).toUpperCase()}`;

            showReceipt(); // Call the UI helper to open it
        }
    },

    openWithdraw: async function() {
        const amount = prompt("Withdrawal Amount (EMPR):");
        if (!amount || isNaN(amount) || amount <= 0) return;

        if (confirm(`Authorize withdrawal of ${amount} EMPR?`)) {
            try {
                const res = await fetch('/api/wallet/withdraw', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ amount, node: 'AURORA-231', authority: 'NAWI-EMPIRE001' })
                });
                const result = await res.json();
                if (result.success) {
                    alert("Authorized. Funds in Escrow.");
                    this.syncVaultData();
                }
            } catch (err) {
                alert("Auth Failure.");
            }
        }
    },

    openDeposit: function() {
        const amount = prompt("Deposit Amount (NGN):");
        if (amount >= 5000) {
            window.location.href = `/p2p-gateway.html?action=deposit&amount=${amount}&ref=Node001`;
        } else {
            alert("Minimum deposit is ₦5,000");
        }
    },

    setupEventListeners: function() {
        window.openDeposit = () => this.openDeposit();
        window.openWithdraw = () => this.openWithdraw();
    }
};

// Global Initialization
document.addEventListener('DOMContentLoaded', () => VaultController.init());

/**
 * UI MODAL HELPERS
 */
function showReceipt() {
    const overlay = document.getElementById('receipt-overlay');
    if(overlay) {
        overlay.style.display = 'flex';
        overlay.classList.add('animate-fade-in'); // Purely visual flair
    }
}

function closeReceipt() {
    const overlay = document.getElementById('receipt-overlay');
    if(overlay) overlay.style.display = 'none';
}
