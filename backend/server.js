const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

// Enable CORS for all routes
app.use(cors());

// Serve static files from the src directory
app.use(express.static(path.join(__dirname, 'src')));

// Parse JSON bodies
app.use(express.json());

// API endpoint for token redemption
app.post('/api/redeem-token', async (req, res) => {
    try {
        const { token } = req.body;
        console.log('Received token for redemption:', token);
        
        // TODO: Add blockchain interaction here
        // For now, just send a success response
        res.json({ 
            success: true, 
            message: 'Token redeemed successfully',
            token: token
        });
    } catch (error) {
        console.error('Error redeeming token:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to redeem token',
            error: error.message 
        });
    }
});

// API endpoint to get contract address
app.get('/api/contract-address', (req, res) => {
    // TODO: Get this from your deployed contract
    const contractAddress = process.env.CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';
    res.json({ address: contractAddress });
});

// Serve the main page for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Access the application at http://localhost:${PORT}`);
}); 