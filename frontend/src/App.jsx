import { useState } from "react";
import { ethers } from "ethers";
import "./App.css";

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const abi = [
  "function mintCertificate(address student,string studentName,string courseName,string ipfsHash)"
];

function App() {
  const [wallet, setWallet] = useState("");
  const [student, setStudent] = useState("");
  const [studentName, setStudentName] = useState("");
  const [courseName, setCourseName] = useState("");
  const [ipfsHash, setIpfsHash] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const [metadata, setMetadata] = useState({});

  async function connectWallet() {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      setWallet(accounts[0]);
      setMessage("Wallet connected");
      setSuccess(true);
    } catch {
      setMessage("Wallet connection failed");
      setSuccess(false);
    }
  }

  async function issueCertificate() {
    try {
      setLoading(true);
      setSuccess(false);

      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();

      const contract = new ethers.Contract(
        contractAddress,
        abi,
        signer
      );

      setMessage("Waiting for confirmation...");

      const tx = await contract.mintCertificate(
        student,
        studentName,
        courseName,
        ipfsHash
      );

      setMessage("Transaction sent...");

      const receipt = await tx.wait();

      if (receipt.status === 1) {
        setSuccess(true);
        setMessage("Certificate Minted Successfully ");

        setMetadata({
          student,
          studentName,
          courseName,
          date: new Date().toLocaleDateString(),
        });

        setStudent("");
        setStudentName("");
        setCourseName("");
        setIpfsHash("");
      }
    } catch (err) {
      setSuccess(false);
      setMessage(err.message || "Transaction failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg">
      <div className="glass-container">

        {/* HEADER */}
        <div className="header">
          <h1> NFT Certificate System</h1>
          <p>Secure blockchain certificate issuance</p>

          <button className="wallet-btn" onClick={connectWallet}>
            {wallet
              ? wallet.slice(0, 6) + "..." + wallet.slice(-4)
              : "Connect Wallet"}
          </button>
        </div>

        {/* STATUS */}
        {message && (
          <div className={`status ${success ? "ok" : "bad"}`}>
            {message}
          </div>
        )}

        {/* GRID */}
        <div className="grid">

          {/* FORM CARD */}
          <div className="card">
            <h2>Mint Certificate</h2>

            <input
              placeholder="Student Wallet"
              value={student}
              onChange={(e) => setStudent(e.target.value)}
            />

            <input
              placeholder="Student Name"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
            />

            <input
              placeholder="Course Name"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
            />

            <input
              placeholder="IPFS Hash"
              value={ipfsHash}
              onChange={(e) => setIpfsHash(e.target.value)}
            />

            <button
              className="mint-btn"
              onClick={issueCertificate}
              disabled={loading}
            >
              {loading ? "Minting..." : "Mint Certificate"}
            </button>
          </div>

          {/* PREVIEW CARD */}
          <div className="card preview">
            <h2>Certificate Preview</h2>

            <div className="cert-box">
              <h3>BLOCKCHAIN CERTIFICATE</h3>

              <p><b>Name:</b> {metadata.studentName || "—"}</p>
              <p><b>Course:</b> {metadata.courseName || "—"}</p>
              <p><b>Wallet:</b> {metadata.student || "—"}</p>
              <p><b>Date:</b> {metadata.date || "—"}</p>
            </div>
          </div>

        </div>

        {/* FOOTER */}
        <div className="footer">
          <div>Network: Hardhat Local</div>
          <div>Status: {wallet ? "Connected" : "Disconnected"}</div>
          <div>ERC-721 NFT</div>
        </div>

      </div>
    </div>
  );
}

export default App;