# Recyto - Blockchain Recycling Initiative

A decentralized application (DApp) for managing recycling tokens on the blockchain. The project consists of a frontend web application with QR code scanning functionality and a backend server for token management.

## Project Demo
Watch our project demo video to see Recyto in action:

Uploading Recyto.mp4…


## Project Structure

```
├── frontend/
│   ├── front-page.html    # Landing page
│   ├── index.html         # Main portal page
│   ├── qr-scan.html       # QR code scanning page
│   ├── front-page.css     # Landing page styles
│   └── front-page.js      # Landing page scripts
│
└── backend/
    ├── src/
    │   ├── index.html     # Recyto management page
    │   ├── css/
    │   │   └── custom-dark-theme.css
    │   └── js/
    │       └── app.js
    ├── server.js
    └── package.json
```

## Prerequisites

- Node.js (v14.x or higher)
- npm (v6.x or higher)
- MetaMask browser extension
- Live Server extension for VS Code (for frontend development)
- Ganache (v7.x or higher) for local blockchain development

## Blockchain Setup

1. Download and install Ganache from [https://trufflesuite.com/ganache/](https://trufflesuite.com/ganache/)
2. Launch Ganache and create a new workspace
3. Configure MetaMask:
   - Open MetaMask
   - Click on the network dropdown
   - Select "Add Network"
   - Enter the following details:
     - Network Name: Ganache
     - New RPC URL: http://127.0.0.1:7545
     - Chain ID: 1337
     - Currency Symbol: ETH
   - Click "Save"
4. Import an account from Ganache to MetaMask:
   - In Ganache, click on the key icon next to any account
   - Copy the private key
   - In MetaMask, click the account icon
   - Select "Import Account"
   - Paste the private key and click "Import"

## Frontend Setup

1. Open the project in VS Code
2. Install the "Live Server" extension if not already installed
3. Right-click on `frontend/front-page.html` and select "Open with Live Server"
4. The Recyto frontend will be available at `http://127.0.0.1:5500/frontend/front-page.html`

### Frontend Dependencies
- Bootstrap 5.1.3
- Web3.js 1.5.2
- Truffle Contract 4.4.0

## Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The Recyto backend server will be running at `http://localhost:3000`

### Backend Dependencies
```json
{
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.17.1",
    "web3": "^1.5.2",
    "truffle-contract": "^4.4.0"
  },
  "devDependencies": {
    "nodemon": "^2.0.15"
  }
}
```

## Features

### Frontend
- Modern, responsive UI with dark theme
- QR code scanning functionality
- Token redemption interface
- Money animation effects
- Live server for development

### Backend
- Express server for API endpoints
- Web3 integration for blockchain interaction
- Token management system
- Transaction history tracking
- CORS enabled for cross-origin requests

## API Endpoints

### Backend API
- `POST /api/redeem-token`: Redeem a Recyto token
- `GET /api/contract-address`: Get the deployed Recyto contract address

## Development

### Frontend Development
- Use Live Server for development
- All frontend files are served statically
- No build process required

### Backend Development
- Uses nodemon for auto-reloading during development
- Express server handles API requests
- Web3 integration for blockchain interaction

## Browser Requirements
- Modern web browser with JavaScript enabled
- MetaMask extension installed and configured
- Web3 provider (MetaMask) connected to the appropriate network
- Ganache running locally for blockchain interactions

## Troubleshooting

### Common Issues
1. If the backend server fails to start:
   - Check if port 3000 is already in use
   - Ensure all dependencies are installed correctly
   - Check Node.js version compatibility

2. If the frontend fails to connect to the backend:
   - Verify the backend server is running
   - Check CORS settings
   - Ensure MetaMask is connected to the correct network

3. If blockchain interactions fail:
   - Verify MetaMask is installed and connected
   - Check if the Recyto contract is deployed to the correct network
   - Ensure sufficient funds for gas fees
   - Verify Ganache is running and accessible
   - Check if MetaMask is connected to the Ganache network

4. If Ganache connection fails:
   - Ensure Ganache is running
   - Verify the RPC URL in MetaMask matches Ganache's URL
   - Check if the Chain ID matches (should be 1337 for Ganache)
   - Try restarting Ganache and MetaMask

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details. 
