/**
 * NAWI-EMPIRE V1: THE IMPERIAL SOVEREIGN CORE (FINAL MERGE)
 * Target: Universal (Spark 30C, iOS, Android, Web)
 * Authority: NAWI-EMPIRE001
 */

const NawiEmpire = {
    config: {
        version: "1.3.0-Sovereign-Gold",
        reserve: 35000000,
        rates: { spread: 0.08, royalty: 0.02 },
        pillars: ['General', 'Market', 'Games', 'Studio', 'LiveStream', 'Kitchen', 'Music', 'Stylist'],
        assets: {
            goldFrame: "https://cdn.nawi-empire.com/assets/NODE_001_GOLD_FRAME.png",
            imperialSeal: "https://cdn.nawi-empire.com/assets/7_PILLARS_SEAL.png"
        }
    },

    // 🛡️ BORDER CONTROL & SECURITY
    security: {
        restricted: ["whatsapp", "telegram", "+234", "dm me", "inbox me"],
        sanitizeContent: (text) => {
            const forbidden = NawiEmpire.security.restricted.some(word => text.toLowerCase().includes(word));
            return forbidden ? "CONTENT_RESTRICTED: FOLLOW PLATFORM RULES" : text;
        }
    },

    // 🎨 THE BRANDING & INJECTION ENGINE
    branding: {
        /**
         * Automatically wraps assets in the Gold Frame or applies the Seal
         * This protects the intellectual property of the founders.
         */
        applyImperialStyle: (assetUrl, pillarId) => {
            console.log(`Protecting Asset: ${assetUrl} for Pillar ${pillarId}`);
            
            // Logic: If it's Pillar 7 (Stylist) or Pillar 3 (Studio), apply the Gold Frame
            if (pillarId === 7 || pillarId === 3) {
                return {
                    wrapperClass: "gold-frame-container",
                    overlay: NawiEmpire.config.assets.goldFrame
                };
            }
            // Otherwise, just apply the subtle Imperial Seal
            return {
                wrapperClass: "standard-protected",
                overlay: NawiEmpire.config.assets.imperialSeal
            };
        }
    },

    // 💰 ECONOMIC ENGINE
    economy: {
        calculatePayout: (coins) => (coins * NawiEmpire.config.rates.royalty).toFixed(2),
        processWithdrawal: (amount, reputation) => {
            return (amount > 200000 || reputation < 90) ? "PENDING_MASTER_APPROVAL" : "AUTO_DISBURSED";
        }
    },

    // 🖼️ SOVEREIGN RENDERING ENGINE
    ui: {
        async renderFeed() {
            const feedElement = document.getElementById('home-feed');
            if (!feedElement) return;

            try {
                const response = await fetch('/api/home-feed');
                const posts = await response.json();

                feedElement.innerHTML = posts.map(post => {
                    const style = NawiEmpire.branding.applyImperialStyle(post.media_url, post.pillar_origin);
                    const safeCaption = NawiEmpire.security.sanitizeContent(post.caption || "");
                    const isMaster = post.is_master_post;

                    return `
                        <div class="post-card ${style.wrapperClass}">
                            <div class="post-header">
                                <span class="pillar-tag">PILLAR ${post.pillar_origin}: ${NawiEmpire.config.pillars[post.pillar_origin]}</span>
                                ${post.content_type === 'Sponsored_Ad' ? '<span class="ad-badge">ADS MANAGER</span>' : ''}
                                ${isMaster ? '<span class="master-seal">👑 NAWI-EMPIRE001</span>' : ''}
                            </div>
                            
                            <div class="media-wrapper">
                                <img src="${post.media_url}" class="main-asset" alt="Empire Asset">
                                <img src="${style.overlay}" class="overlay-seal" alt="Imperial Seal">
                            </div>

                            <div class="post-content">
                                <h3>${safeCaption}</h3>
                                <div class="post-footer">
                                    <span class="auth-text">AUTHORITY: SOVEREIGN NODE</span>
                                    <span class="price-tag">${post.priceInCoins || 0} COINS ($${NawiEmpire.economy.calculatePayout(post.priceInCoins || 0)})</span>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('');
            } catch (err) {
                console.error("Critical Feed Failure:", err);
            }
        },

        init() {
            console.log(`EMPIRE ONLINE: ${this.config.version}`);
            this.renderFeed();
        }
    }
};

document.addEventListener('DOMContentLoaded', () => NawiEmpire.ui.init());
