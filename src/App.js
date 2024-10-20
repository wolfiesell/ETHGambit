import React, { useState } from 'react';
import { ethers, parseEther } from "ethers";
import { getContract } from './contract';

function App() {
  const [username, setUsername] = useState("");
  const [bob, setBob] = useState("");       
  const [alice, setAlice] = useState("");   
  const [gameResult, setGameResult] = useState(null); // State for game result
  const [error, setError] = useState(null); // State for error
  const [isDeposit, setIsDeposit] = useState(false); // State to toggle deposit form
  const [depositText, setDepoText] = useState('');
  const [walletAddress, setWalletAddress] = useState(null); // State for wallet address
  const [agreement_text, setAgrText] = useState('');
  const [ethAmount, setEthAmount] = useState(0);
  const [distributeText, setDistributeText] = useState('');
  const [refreshButton, setRefreshButton] = useState(false);
  const [isDistribute, setIsDistribute] = useState(false);


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
      const amountInWei = parseEther(ethAmount);
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
    const contract = await getContract();
    
    // Convert the amount to the appropriate format (Wei)
    const amountInWei = ethers.parseEther(ethAmount.toString());
    
    // Call the deposit function and include the value in the transaction
    const tx = await contract.deposit(0, {
      value: amountInWei // Send the value along with the transaction
    });
    setDepoText('Depositing Funds...');
    await tx.wait();
    setDepoText('Deposit Successful!');
    setRefreshButton(true);
  } catch (err) {
    console.error("Error depositing funds: ", err);
  }
};

const completeChallenge = async () => {
  try {
    const contract = await getContract();
    setDistributeText('Fetching Game Results...');

    if (!gameResult) {
      throw new Error("Game result is not available or invalid.");
    }

    const tx = await contract.complete(0, gameResult.Code); // Ensure gameResult.Code is valid
    setDistributeText('Distributing Funds...');
    await tx.wait();
    setDistributeText('Funds Distributed!');
  } catch (err) {
    console.error("Error completing challenge: ", err);
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
      setIsDistribute(true);
      setRefreshButton(false);
    } catch (err) {
      setError(err);
      setGameResult(null); // Clear previous game results
    }
  };

  const checkAgreement = async () => {
    try {
      const contract = await getContract();
      const agreement = await contract.lastAgreement(); // Access the last agreement
      if(agreement[0].toLowerCase() === bob && agreement[1].toLowerCase() === alice){
        fetchGameResult();
      }
    } catch (err) {
      console.error("Error fetching agreement: ", err);
    }
  };

  return (
    <div>
      <h1>ETHGambit</h1>
      <br></br>
      <h2>First Create a Challenge</h2>

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
          Wager Amount (POL):
          <input
            type="number"
            step="0.01"
            value={ethAmount}
            onChange={(e) => setEthAmount(e.target.value)}
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
          <button onClick={() => depositFunds()}>Deposit Funds</button>
        </div>
      )}

      <p>{depositText}</p>

      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error messages */}
      {refreshButton &&
        <div>
          <h2>Waiting For Game to End...</h2>
          <button onClick={()=>{checkAgreement()}}>Refresh Game Results</button>
        </div>
      }
      {gameResult && 
        <div>
            <h1 className="title">Game Results:</h1>
            <h1 className="White">{gameResult.White}</h1>
            <h2>vs</h2>
            <h1 className="Black">{gameResult.Black}</h1>
            <h1>{gameResult.Winner} Wins {ethAmount} POL</h1>
        </div>
      }

      {isDistribute && 
        <div>
          <h2>Funds Are Ready to Distribute!</h2>
          <button onClick={()=>{completeChallenge()}}>Distribute Funds</button>
          <p>{distributeText}</p>
        </div>
      }

    </div>
  );
}

export default App;
