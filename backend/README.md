# BottleCoin - Blockchain Recycling Initiative

BottleCoin is an Ethereum-based token project that incentivizes recycling by rewarding users with tokens. This project includes a smart contract for the ERC-20 token and a web interface for token management.

## Project Overview

BottleCoin implements a standard ERC-20 token with additional functionality for token distribution as rewards for recycling. The project includes:

- Solidity smart contracts for the token
- Web interface for interacting with the token
- Truffle development environment configuration

## Prerequisites

Before you can run this project, you need to have the following software installed:

- [Node.js](https://nodejs.org/) (v10.x or later)
- [npm](https://www.npmjs.com/) (v6.x or later, comes with Node.js)
- [Truffle](https://www.trufflesuite.com/truffle) (v5.x or later)
- [Ganache](https://www.trufflesuite.com/ganache) - A local Ethereum blockchain for development
- [MetaMask](https://metamask.io/) - Browser extension for interacting with Ethereum dApps

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/BottleCoin.git
   cd BottleCoin
   ```

2. Install dependencies:
   ```
   npm install
   ```

## Configuration

### Truffle Configuration

The project includes a `truffle.js` (or `truffle-config.js`) file configured to connect to a local Ganache instance running on port 7545. If your Ganache instance uses a different port, update the configuration file accordingly.

### MetaMask Configuration

1. Install MetaMask browser extension
2. Create or import an account
3. Connect MetaMask to your local Ganache blockchain:
   - Open MetaMask and go to Networks
   - Add Network
   - Set Network Name: "Ganache"
   - New RPC URL: http://127.0.0.1:7545
   - Chain ID: 1337
   - Currency Symbol: ETH
   - Save

4. Import a Ganache account into MetaMask:
   - In Ganache, click on the key icon next to any account
   - Copy the private key
   - In MetaMask, click on your account icon > Import Account
   - Paste the private key and click Import

## Running the Project

1. Start Ganache:
   - Open Ganache and start a new workspace
   - Ensure it's running on port 7545 (default)

2. Compile and migrate the smart contracts:
   ```
   truffle compile
   truffle migrate
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Smart Contracts

The main contract file is `BottleCoin.sol` which implements:
- Standard ERC-20 functionality
- Owner privileged operations
- Token minting capabilities
- Safe mathematical operations

## Project Structure

```
BottleCoin/
├── build/            # Compiled contract artifacts
├── contracts/        # Smart contract source files
│   ├── BottleCoin.sol # Main token contract
│   └── Migrations.sol # Truffle migrations contract
├── migrations/       # Migration scripts for deployment
├── node_modules/     # Node.js dependencies
├── src/              # Frontend source files
│   ├── css/          # Stylesheets
│   ├── js/           # JavaScript files
│   └── index.html    # Main web interface
├── test/             # Test scripts for contracts
├── package.json      # Project dependencies
└── truffle.js        # Truffle configuration
```

## Deployment to Public Networks

To deploy to Ethereum public networks (Ropsten, Rinkeby, Mainnet):

1. Update `truffle.js` with network configurations
2. Ensure you have ETH in your deployment account
3. Run the migration with the network flag:
   ```
   truffle migrate --network ropsten
   ```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the ISC License - see the `package.json` file for details.

## Acknowledgments

- [Truffle Suite](https://www.trufflesuite.com/)
- [OpenZeppelin](https://openzeppelin.com/) - Secure smart contract libraries
- [Web3.js](https://web3js.readthedocs.io/) - Ethereum JavaScript API
