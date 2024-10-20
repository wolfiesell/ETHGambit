import React, { useState } from 'react';
import { ethers, parseEther } from "ethers";
import { getContract } from './contract';

function App() {
  const [username, setUsername] = useState("");
  const [bob, setBob] = useState("");       
  const [alice, setAlice] = useState("");   
  const [amount, setAmount] = useState(""); 
  const [gameResult, setGameResult] = useState(null); // State for game result
  const [error, setError] = useState(null); // State for error
  const [isDeposit, setIsDeposit] = useState(false); // State to toggle deposit form
  const [depositText, setDepoText] = useState('');
  const [walletAddress, setWalletAddress] = useState(null); // State for wallet address
  const [agreement_text, setAgrText] = useState('');
  const [ethAmount, setEthAmount] = useState(0);


  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []); // Request account access
        setWalletAddress(accounts[0]); // Set the first account as the connected address
        setBob(accounts[0]); // Optionally, set the connected account as `bob` for convenience
      } catch (err) {
        console.error("Error connecting to MetaMask: ", err);
      }
    } else {
      alert("MetaMask is not installed. Please install it to use this app.");
    }
  };

  connectWallet();

  const createAgreement = async () => {
    try {
      const contract = await getContract();
      const amountInWei = parseEther(amount);
      const tx = await contract.newAgreement(bob, alice, amountInWei);
      setAgrText('Sending Challenge...')
      await tx.wait();
      setAgrText('Challenge Successfully Sent!')
      setIsDeposit(true); // Show deposit form after agreement creation
    } catch (err) {
      console.error("Error creating agreement: ", err);
    }
  };

  const depositFunds = async () => {
    try {
      const amountInWei = parseEther(amount);
      const contract = await getContract();
      const tx = await contract.deposit(0).send({
        from: walletAddress,
        value: amountInWei
      }); // Deposit function
      setDepoText('Depositing...');
      await tx.wait();
      setDepoText('Deposit Successful!');
    } catch (err) {
      console.error("Error depositing funds: ", err);
    }
  };

  const getAgreement = async () => {
    try {
      const contract = await getContract();
      const agreement = await contract.lastAgreement(); // Access the last agreement
      return await agreement;
    } catch (err) {
      console.error("Error fetching agreement: ", err);
    }
  };

  const fetchGameResult = async () => {
    if (!username) {
      setError("Please enter a username.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/get_game?username=${username}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setGameResult(result); // Update the state with the game result
      setError(null); // Clear any previous errors
    } catch (err) {
      setError(`Failed to fetch data: ${err.message}`);
      setGameResult(null); // Clear previous game results
    }
  };

  return (
    <div>
      <h1>First Create a Challenge</h1>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          // First, create the agreement
          try{
            await createAgreement();
          }
          catch (err){
            console.error(err);
          }
        }}
      >
        <label>
          Your Lichess Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Opponent's Address:
          <input
            type="text"
            value={alice}
            onChange={(e) => setAlice(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Amount (in Ether):
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit">Send Challenge!</button>
      </form>

      <p>{agreement_text}</p>

      {/* Deposit Section */}
      {isDeposit && (
        <div>
          <h2>Now Deposit Your Funds</h2>
          <button onClick={() => depositFunds(bob)}>Deposit Funds</button>
        </div>
      )}

      <p>{depositText}</p>

      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error messages */}
      {gameResult && 
        <div>
            <h1 className="title">Game Results:</h1>
            <h1 className="White">{gameResult.White}</h1>
            <h2>vs</h2>
            <h1 className="Black">{gameResult.Black}</h1>
            <h1>{gameResult.Winner} wins!</h1>
        </div>
      }

    </div>
  );
}

export default App;
