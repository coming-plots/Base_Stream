# Base Stream (Built for Base)

Base Stream is a browser-first utility that connects a wallet through Coinbase Wallet SDK and continuously validates Base network state using read-only RPC queries. The project is designed as a clean reference for Base tooling, chain targeting, and account abstraction–compatible environments.

---

## Base ecosystem alignment

Built for Base.

Supported networks:
- Base Mainnet  
  chainId (decimal): 8453  
  Explorer: https://basescan.org  

- Base Sepolia  
  chainId (decimal): 84532  
  Explorer: https://sepolia.basescan.org  

The application explicitly targets Base networks and relies on official Base RPC endpoints.

---

## What the script does

The app.base-stream.ts script provides a small in-browser interface that:

1) Connects a wallet using Coinbase Wallet SDK  
2) Reads and validates the active chainId  
3) Fetches read-only Base network data:
   - latest block number  
   - ETH balance of the connected address  
4) Produces a block-level snapshot (timestamp, gas usage)  
5) Allows balance checks for arbitrary addresses  
6) Outputs Basescan links for verification  

No transactions are sent. All operations are read-only.

---

## Repository structure

- app.base-stream.ts  
  Browser-based script that connects to a wallet, toggles Base networks, and streams read-only onchain data.

- contracts/  
  Solidity contracts deployed to Base Sepolia for testnet validation:
  - inheritance.sol — minimal contract used to validate deployment and verification flow  
  - errors.sol — simple stateful contract for interaction testing  
  - imports.sol — lightweight contract used for read-only query validation  

- package.json  
  Dependency manifest including Coinbase SDKs and 2–5 repositories from the Base GitHub organization.

- README.md  
  Technical documentation, Base references, licensing, and testnet deployment records.

---

## Libraries used

- @coinbase/wallet-sdk  
  Wallet connection layer compatible with Coinbase and Base tooling.

- viem  
  RPC client used for Base reads (getBalance, getBlockNumber, getBlock).

- Base GitHub repositories  
  Included as dependencies to document linkage to the Base open-source ecosystem.

---

## Installation and execution

Install dependencies using Node.js.  
Serve the project with a modern frontend dev server and open the page in a browser.

Expected result:
- Connected address printed with Basescan link  
- Active chainId displayed (8453 or 84532)  
- Read-only Base network data fetched and displayed  
- Block snapshot generated on demand  

---

## License

MIT License

Copyright (c) 2025 YOUR_NAME

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

## Author

GitHub: https://github.com/coming-plots 
Email: coming-plots-0o@icloud.com 
Public contact: https://x.com/NikkiFoste20063

---

## Testnet Deployment (Base Sepolia)

As part of pre-production validation, one or more contracts may be deployed to the Base Sepolia test network to confirm correct behavior and tooling compatibility.

Network: Base Sepolia  
chainId (decimal): 84532  
Explorer: https://sepolia.basescan.org  

Contract #1 address:  
0xf0be941050Ed1F282350D68ED10E91BDeB9422B4

Deployment and verification:
- https://sepolia.basescan.org/address/0xf0be941050Ed1F282350D68ED10E91BDeB9422B4
- https://sepolia.basescan.org/0xf0be941050Ed1F282350D68ED10E91BDeB9422B4/0#code  

Contract #2 address:  
0x45BC7523f3227baFa1Ec8fE52A89c2dC9C7b9b37

Deployment and verification:
- https://sepolia.basescan.org/address/0x45BC7523f3227baFa1Ec8fE52A89c2dC9C7b9b37
- https://sepolia.basescan.org/0x45BC7523f3227baFa1Ec8fE52A89c2dC9C7b9b37/0#code  

Contract #3 address:  
0x4Af4f051Fc027dc024a7526c039682A66ACD4d38

Deployment and verification:
- https://sepolia.basescan.org/address/0x4Af4f051Fc027dc024a7526c039682A66ACD4d38
- https://sepolia.basescan.org/0x4Af4f051Fc027dc024a7526c039682A66ACD4d38/0#code  

These testnet deployments provide a controlled environment for validating Base tooling, account abstraction flows, and read-only onchain interactions prior to Base Mainnet usage.
