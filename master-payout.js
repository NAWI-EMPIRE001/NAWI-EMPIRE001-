// THE MASTER'S FINAL AUTHORIZATION SCREEN
app.get('/api/master/pending-withdrawals', async (req, res) => {
    // Only shows users who have passed the "Overseer" reputation check
    const requests = await WithdrawalRequest.find({ status: 'AWAITING_MASTER_SIGNATURE' });
    
    // Sort by "Risk Level" so you see stubborn users first
    res.json(requests);
});

app.post('/api/master/authorize-payout', async (req, res) => {
    const { requestId, masterKey, action } = req.body;

    if (masterKey !== "THE_7_FINAL_SEAL") return res.status(403).send("ACCESS DENIED");

    const request = await WithdrawalRequest.findById(requestId);

    if (action === "APPROVE") {
        request.status = "DISBURSED";
        // Generate the "Evidence of Wealth" Receipt for the User
        await generateImperialReceipt(request.userId, request.amount); 
    } else {
        request.status = "REJECTED_UNDER_INVESTIGATION";
        // Freeze user's wallet until they prove the source of coins
        await User.findByIdAndUpdate(request.userId, { walletLocked: true });
    }

    await request.save();
    res.json({ message: `Master Action: ${action} Completed.` });
});
