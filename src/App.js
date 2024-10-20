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
  const [walletAddress, setWalletAddress] = useState(null); // State for wallet address

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []); // Request account access
        setWalletAddress(accounts[0]); // Set the first account as the connected address
        setBob(accounts[0]); // Optionally, set the connected account as `bob` for convenience
      } catch (err) {
        console.error("Error connecting to MetaMask: ", err);
        alert("Error connecting to MetaMask: " + err.message);
      }
    } else {
      alert("MetaMask is not installed. Please install it to use this app.");
    }
  };

  const createAgreement = async () => {
    try {
      const contract = await getContract();
      const amountInWei = parseEther(amount);
      const tx = await contract.newAgreement(bob, alice, amountInWei);
      await tx.wait();
      alert("Agreement created successfully!");
      setIsDeposit(true); // Show deposit form after agreement creation
    } catch (err) {
      console.error("Error creating agreement: ", err);
      alert("Error creating agreement: " + err.message);
    }
  };

  const depositFunds = async () => {
    try {
      const contract = await getContract();
      const tx = await contract.deposit(0); // Deposit function
      await tx.wait();
      alert("Deposit successful!");
    } catch (err) {
      console.error("Error depositing funds: ", err);
      alert("Error depositing funds: " + err.message);
    }
  };

  const getAgreement = async () => {
    try {
      const contract = await getContract();
      const agreement = await contract.agreements(0); // Access the last agreement
      console.log(agreement);
      return agreement;
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
      <h1>Create Challenge</h1>

      {/* Button to connect MetaMask wallet */}
      <button onClick={connectWallet}>
        {walletAddress ? `Connected: ${walletAddress}` : "Connect Wallet"}
      </button>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          // First, create the agreement
          await createAgreement();
          
          // Then, fetch the game result
          // WAIT TO CALL UNTIL GAME IS OVER  
          // await fetchGameResult();
          
          if (gameResult) {
            alert(gameResult);
          } else if (error) {
            alert(error); // Alert any error if it exists
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
          Your Address:
          <input
            type="text"
            value={bob}
            onChange={(e) => setBob(e.target.value)}
            required
            disabled={walletAddress !== null} // Disable field if wallet is connected
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

      {/* Deposit Section */}
      {isDeposit && (
        <div>
          <h2>Deposit Funds</h2>
          <button onClick={() => depositFunds(bob)}>Deposit Funds</button>
        </div>
      )}

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
      <button onClick={()=>{
        getAgreement().then(agreement =>{
          console.log(agreement);
        })
      }}>Get Agreement</button>
    </div>
  );
}

export default App;
