// app.base-stream.ts
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import { createPublicClient, http, formatEther, isAddress } from "viem";
import { base, baseSepolia } from "viem/chains";

type Network = {
  chain: typeof base;
  chainId: number;
  rpc: string;
  explorer: string;
  label: string;
};

const NETWORKS: Network[] = [
  {
    chain: base,
    chainId: 8453,
    rpc: "https://mainnet.base.org",
    explorer: "https://basescan.org",
    label: "Base Mainnet",
  },
  {
    chain: baseSepolia,
    chainId: 84532,
    rpc: "https://sepolia.base.org",
    explorer: "https://sepolia.basescan.org",
    label: "Base Sepolia",
  },
];

let active: Network = NETWORKS[1];

const APP = {
  name: "Base Stream (Built for Base)",
  logo: "https://base.org/favicon.ico",
};

function render(lines: string[]) {
  output.textContent = lines.join("\n");
}

const output = document.createElement("pre");
output.style.whiteSpace = "pre-wrap";
output.style.wordBreak = "break-word";
output.style.background = "#0b0f1a";
output.style.color = "#dbe7ff";
output.style.padding = "14px";
output.style.borderRadius = "14px";
output.style.border = "1px solid rgba(255,255,255,0.12)";
output.style.minHeight = "320px";

function client() {
  return createPublicClient({
    chain: active.chain,
    transport: http(active.rpc),
  });
}

async function connect() {
  const sdk = new CoinbaseWalletSDK({
    appName: APP.name,
    appLogoUrl: APP.logo,
  });

  const provider = sdk.makeWeb3Provider(active.rpc, active.chainId);
  const accounts = (await provider.request({ method: "eth_requestAccounts" })) as string[];
  const address = accounts?.[0];
  if (!address) throw new Error("Wallet returned no address");

  const chainIdHex = (await provider.request({ method: "eth_chainId" })) as string;

  return {
    provider,
    address,
    chainId: parseInt(chainIdHex, 16),
  };
}

async function readOverview(address: string) {
  const c = client();
  const [block, balance] = await Promise.all([
    c.getBlockNumber(),
    c.getBalance({ address: address as `0x${string}` }),
  ]);

  return { block, balance };
}

async function readBlockSnapshot() {
  const c = client();
  const block = await c.getBlock();
  return {
    number: block.number,
    timestamp: block.timestamp,
    gasUsed: block.gasUsed,
  };
}

async function readAddress(address: string) {
  if (!isAddress(address)) throw new Error("Invalid address");
  const bal = await client().getBalance({ address: address as `0x${string}` });
  return bal;
}

let session: { address: string; chainId: number } | null = null;

function mount() {
  const root = document.createElement("div");
  root.style.maxWidth = "1100px";
  root.style.margin = "28px auto";
  root.style.fontFamily = "ui-sans-serif, system-ui";

  const title = document.createElement("h1");
  title.textContent = APP.name;
  title.style.marginBottom = "4px";

  const subtitle = document.createElement("div");
  subtitle.textContent =
    "Wallet connect + Base chain validation + read-only stream of onchain data.";
  subtitle.style.opacity = "0.8";

  const controls = document.createElement("div");
  controls.style.display = "flex";
  controls.style.flexWrap = "wrap";
  controls.style.gap = "10px";
  controls.style.margin = "14px 0";

  const btnConnect = document.createElement("button");
  btnConnect.textContent = "Connect Wallet";

  const btnToggle = document.createElement("button");
  btnToggle.textContent = "Toggle Network";

  const btnSnapshot = document.createElement("button");
  btnSnapshot.textContent = "Block Snapshot";
  btnSnapshot.disabled = true;

  const addrInput = document.createElement("input");
  addrInput.placeholder = "0x… address";
  addrInput.style.minWidth = "260px";

  const btnAddr = document.createElement("button");
  btnAddr.textContent = "Read Address Balance";
  btnAddr.disabled = true;

  btnToggle.onclick = () => {
    active = active.chainId === 84532 ? NETWORKS[0] : NETWORKS[1];
    session = null;
    btnSnapshot.disabled = true;
    btnAddr.disabled = true;
    render([`Network switched to ${active.label}. Connect again.`]);
  };

  btnConnect.onclick = async () => {
    try {
      render(["Connecting wallet…"]);
      session = await connect();
      const info = await readOverview(session.address);

      btnSnapshot.disabled = false;
      btnAddr.disabled = false;

      render([
        "Connected",
        `Network: ${active.label}`,
        `chainId: ${session.chainId}`,
        `Address: ${session.address}`,
        `ETH balance: ${formatEther(info.balance)} ETH`,
        `Latest block: ${info.block}`,
        `Explorer: ${active.explorer}/address/${session.address}`,
      ]);
    } catch (e: any) {
      render([`Error: ${e?.message ?? String(e)}`]);
    }
  };

  btnSnapshot.onclick = async () => {
    try {
      if (!session) throw new Error("Connect first");
      render(["Fetching block snapshot…"]);
      const snap = await readBlockSnapshot();
      render([
        "Block Snapshot",
        `Network: ${active.label}`,
        `chainId: ${active.chainId}`,
        `Block: ${snap.number}`,
        `Timestamp: ${snap.timestamp}`,
        `Gas used: ${snap.gasUsed}`,
        `Explorer: ${active.explorer}/block/${snap.number}`,
      ]);
    } catch (e: any) {
      render([`Error: ${e?.message ?? String(e)}`]);
    }
  };

  btnAddr.onclick = async () => {
    try {
      const target = addrInput.value || session?.address;
      if (!target) throw new Error("No address provided");
      render(["Reading balance…"]);
      const bal = await readAddress(target);
      render([
        "Address Balance",
        `Network: ${active.label}`,
        `Address: ${target}`,
        `ETH balance: ${formatEther(bal)} ETH`,
        `Explorer: ${active.explorer}/address/${target}`,
      ]);
    } catch (e: any) {
      render([`Error: ${e?.message ?? String(e)}`]);
    }
  };

  [btnConnect, btnToggle, btnSnapshot, addrInput, btnAddr].forEach((el) => {
    el.style.padding = "8px 10px";
    controls.appendChild(el);
  });

  root.append(title, subtitle, controls, output);
  document.body.appendChild(root);

  render([
    "Ready.",
    `Active network: ${active.label} (chainId ${active.chainId})`,
    "Connect wallet to begin.",
  ]);
}

mount();
