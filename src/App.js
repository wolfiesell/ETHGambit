import React, { useState } from 'react';  // Import useState from React
import { ethers, parseEther } from "ethers";
import { getContract } from './contract';  // Import getContract

function App() {
  const [bob, setBob] = useState("");       // Initialize state for bob
  const [alice, setAlice] = useState("");   // Initialize state for alice
  const [amount, setAmount] = useState(""); // Initialize state for amount

  const createAgreement = async () => {
    try {
      // Get the contract instance
      const contract = await getContract();

      // Convert the amount from Ether to Wei using parseEther
      const amountInWei = parseEther(amount);

      // Call the newAgreement function
      const tx = await contract.newAgreement(bob, alice, amountInWei);

      // Wait for the transaction to be mined
      await tx.wait();

      alert("Agreement created successfully!");
    } catch (err) {
      console.error("Error creating agreement: ", err);
      alert("Error creating agreement: " + err.message);
    }
  };

  return (
    <div>
      <h1>Create a New Agreement</h1>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await createAgreement();
        }}
      >
        <label>
          Bob's Address:
          <input
            type="text"
            value={bob}
            onChange={(e) => setBob(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Alice's Address:
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
        <button type="submit">Create Agreement</button>
      </form>
    </div>
  );
}

export default App;
