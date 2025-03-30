// Initialize Web3
let web3;
let bottleCoin;
let userAccount;

// Initialize the application
window.addEventListener('load', function() {
    // Check if Web3 is available
    if (typeof window.ethereum !== 'undefined') {
        initializeWeb3();
    } else {
        console.log('Please install MetaMask!');
        document.getElementById('loader').style.display = 'block';
        document.getElementById('content').style.display = 'none';
    }
});

async function initializeWeb3() {
    try {
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        userAccount = accounts[0];
        
        // Initialize Web3
        web3 = new Web3(window.ethereum);
        
        // Load the contract
        const response = await fetch('/contracts/BottleCoin.json');
        const contractData = await response.json();
        
        // Initialize contract
        bottleCoin = new TruffleContract(contractData);
        bottleCoin.setProvider(web3.currentProvider);
        
        // Get contract instance
        const instance = await bottleCoin.deployed();
        
        // Update UI with contract data
        updateTokenInfo(instance);
        updateAccountInfo(instance);
        
        // Show content
        document.getElementById('loader').style.display = 'none';
        document.getElementById('content').style.display = 'block';
        
        // Set up event listeners
        setupEventListeners(instance);
        
    } catch (error) {
        console.error('Error initializing Web3:', error);
        document.getElementById('loader').style.display = 'block';
        document.getElementById('content').style.display = 'none';
    }
}

async function updateTokenInfo(instance) {
    try {
        const name = await instance.name();
        const symbol = await instance.symbol();
        const totalSupply = await instance.totalSupply();
        const weiPerToken = await instance.weiPerToken();
        
        document.getElementById('tokenSymbol').textContent = symbol;
        document.getElementById('totalSupply').textContent = totalSupply.toString();
        document.getElementById('exchangeRate').textContent = web3.utils.fromWei(weiPerToken.toString(), 'ether') + ' ETH';
    } catch (error) {
        console.error('Error updating token info:', error);
    }
}

async function updateAccountInfo(instance) {
    try {
        const balance = await instance.balanceOf(userAccount);
        document.getElementById('accountAddress').textContent = `Address: ${userAccount}`;
        document.getElementById('tokenBalance').textContent = balance.toString();
    } catch (error) {
        console.error('Error updating account info:', error);
    }
}

function setupEventListeners(instance) {
    // Transfer form
    document.getElementById('transferButton').addEventListener('click', async function() {
        const recipient = document.getElementById('recipientAddress').value;
        const amount = document.getElementById('transferAmount').value;
        
        try {
            await instance.transfer(recipient, amount);
            document.getElementById('transferStatus').innerHTML = '<div class="alert alert-success">Transfer successful!</div>';
            updateAccountInfo(instance);
        } catch (error) {
            document.getElementById('transferStatus').innerHTML = '<div class="alert alert-danger">Transfer failed: ' + error.message + '</div>';
        }
    });
    
    // Receive form
    document.getElementById('receiveButton').addEventListener('click', async function() {
        const receiver = document.getElementById('receiverAddress').value;
        
        try {
            await instance.receiveTokens(receiver);
            document.getElementById('receiveStatus').innerHTML = '<div class="alert alert-success">Tokens received successfully!</div>';
            updateAccountInfo(instance);
        } catch (error) {
            document.getElementById('receiveStatus').innerHTML = '<div class="alert alert-danger">Failed to receive tokens: ' + error.message + '</div>';
        }
    });
}

// Handle account changes
if (window.ethereum) {
    window.ethereum.on('accountsChanged', function(accounts) {
        userAccount = accounts[0];
        updateAccountInfo(bottleCoin);
    });
}
