// Add this to your inbox.html script section
async function fetchMyMessages() {
    const userId = localStorage.getItem('userId'); // Get logged-in ID
    const response = await fetch(`/api/messages/${userId}`);
    const messages = await response.json();
    
    const inboxContainer = document.getElementById('message-list');
    inboxContainer.innerHTML = ''; // Clear static placeholders

    messages.forEach(msg => {
        const card = `
        <div class="p-4 mb-3 bg-zinc-900/50 rounded-2xl border border-zinc-800 flex gap-4">
            <div class="w-12 h-12 bg-black rounded-full flex items-center justify-center border border-zinc-700">
                <i class="${msg.icon} text-amber-500"></i>
            </div>
            <div class="flex-1">
                <div class="flex justify-between items-center mb-1">
                    <h4 class="text-xs font-black text-white">${msg.sender}</h4>
                    <span class="text-[8px] text-zinc-500">${new Date(msg.createdAt).toLocaleTimeString()}</span>
                </div>
                <p class="text-[10px] text-zinc-400 leading-tight mb-2">${msg.text}</p>
                <span class="text-[8px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 uppercase">
                    ${msg.type}
                </span>
            </div>
        </div>`;
        inboxContainer.innerHTML += card;
    });
}
