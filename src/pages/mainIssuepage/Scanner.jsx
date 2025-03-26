import React, { useState } from "react";

function FingerprintAuth() {
  const [userName, setUserName] = useState("");
  const [fingerprintData, setFingerprintData] = useState(null);
  const [matchedUser, setMatchedUser] = useState(null);

  // Simulated fingerprint API integration
  const captureFingerprint = () => {
    // This is a placeholder. Replace this with actual scanner API code.
    return Math.random().toString(36).substring(2, 15); // Simulates a unique fingerprint hash
  };

  const compareFingerprints = (scanned, stored) => {
    // Simulates fingerprint matching (returns a percentage similarity)
    let matchPercentage = 0;
    for (let i = 0; i < Math.min(scanned.length, stored.length); i++) {
      if (scanned[i] === stored[i]) matchPercentage += 100 / scanned.length;
    }
    return matchPercentage;
  };

  const handleAddUser = () => {
    if (!userName) {
      alert("Please enter a user name!");
      return;
    }
    const newFingerprint = captureFingerprint();
    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");

    // Add new user to local storage
    const newUser = { name: userName, fingerprint: newFingerprint };
    existingUsers.push(newUser);
    localStorage.setItem("users", JSON.stringify(existingUsers));

    alert(`User ${userName} added successfully!`);
    setUserName(""); // Reset name input
  };

  const handleAuthenticate = () => {
    const scannedFingerprint = captureFingerprint();
    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");

    for (const user of existingUsers) {
      const matchPercentage = compareFingerprints(
        scannedFingerprint,
        user.fingerprint
      );
      if (matchPercentage >= 50) {
        setMatchedUser(user);
        return;
      }
    }

    alert("No matching user found!");
    setMatchedUser(null);
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Fingerprint Authentication</h1>

      {/* Add User Section */}
      <div style={{ marginBottom: "30px" }}>
        <h2>Add New User</h2>
        <input
          type="text"
          placeholder="Enter user name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          style={{ padding: "10px", width: "200px", marginBottom: "10px" }}
        />
        <br />
        <button onClick={handleAddUser} style={{ padding: "10px 20px" }}>
          Add User
        </button>
      </div>

      {/* Authenticate Section */}
      <div style={{ marginBottom: "30px" }}>
        <h2>Authenticate User</h2>
        <button onClick={handleAuthenticate} style={{ padding: "10px 20px" }}>
          Scan Fingerprint
        </button>
      </div>

      {/* Matched User Info */}
      {matchedUser && (
        <div style={{ marginTop: "20px" }}>
          <h3>Matched User:</h3>
          <p>Name: {matchedUser.name}</p>
        </div>
      )}
    </div>
  );
}

export default FingerprintAuth;
