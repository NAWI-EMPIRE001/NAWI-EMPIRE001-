// THE LIVE RADAR CONTROLLER
const LiveRadar = {
    checkActiveStreams: async () => {
        // Scans the 3 Live Pillars for active broadcasts
        const studioCount = await LiveSession.countDocuments({ section: 'Studio', isActive: true });
        const gamingCount = await LiveSession.countDocuments({ section: 'Gaming', isActive: true });
        const kitchenCount = await LiveSession.countDocuments({ section: 'Kitchen', isActive: true });
        
        return { studioCount, gamingCount, kitchenCount };
    }
};

// TRIGGER THE OVERLAY
function openLivePortal() {
    // This function blurs the Marketplace and shows the 3 choices
    document.getElementById('market-view').style.filter = 'blur(10px)';
    document.getElementById('live-portal-overlay').style.display = 'flex';
}
