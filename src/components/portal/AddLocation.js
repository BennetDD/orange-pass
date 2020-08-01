import React, { useCallback, useState, useEffect } from "react";
import { db, auth } from "../../fb config/firebase";

import "../../styles/components/form.scss";

export default function AddLocation({ setLocations, setAdd, setDetails }) {
  const [errorMessage, setErrorMessage] = useState("");
  const [warningMessage, setWarningMessage] = useState("");

  const [admin, setAdmin] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [locationName, setLocationName] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (
      admin.trim() &&
      email.trim() &&
      password.trim() &&
      address.trim() &&
      locationName.trim()
    ) {
      setWarningMessage("");
    } else {
      setWarningMessage("fill in all fields");
    }
  }, [admin, email, password, address, locationName]);

  const handleRegister = useCallback(async (event) => {
    event.preventDefault();
    setErrorMessage("");

    try {
      let resp = await auth.createUserWithEmailAndPassword(email, password);
      uploadLocationData(resp.user.uid);
    } catch (error) {
      setErrorMessage(error.message);
    }
  });

  const uploadLocationData = (id) => {
    db.collection("locations")
      .doc(id)
      .set({
        admin,
        email,
        address,
        name: locationName,
        time: new Date(),
      })
      .catch((error) => {
        console.log(error.message);
      });

    db.collection("locations")
      .doc(id)
      .collection("questions")
      .add({
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
      })
      .catch((error) => {
        console.log(error.message);
      });

    db.collection("locations")
      .doc(id)
      .collection("rules")
      .add({
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
      })
      .catch((error) => {
        console.log(error.message);
      });

    db.collection("locations")
      .doc(id)
      .collection("inputs")
      .doc("input")
      .set({
        mobile: true,
        email: true,
        name: true,
        unit: true,
      })
      .catch((error) => {
        console.log(error.message);
      });

    db.collection("superuser")
      .doc(id)
      .set({
        admin,
        email,
        address,
        name: locationName,
        time: new Date(),
      })
      .catch((error) => {
        console.log(error.message);
      });

    db.collection("superuser")
      .doc(id)
      .collection("inputs")
      .doc("input")
      .set({
        mobile: true,
        email: true,
        name: true,
        unit: true,
      })
      .catch((error) => {
        console.log(error.message);
      });

    setLocations(true);
    setAdd(false);
    setDetails(false);
  };

  return (
    <div className="add-container">
      <form className="form" name="add" onSubmit={handleRegister}>
        <h2>Add a manager</h2>
        <div className="input-wraper">
          <input
            placeholder="Manager full name"
            type="text"
            id="admin"
            name="admin"
            autoComplete="off"
            onChange={(e) => setAdmin(e.target.value)}
            required
          />
        </div>

        <div className="input-wraper">
          <input
            placeholder="Location address"
            type="text"
            id="address"
            name="address"
            autoComplete="off"
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>

        <div className="input-wraper">
          <input
            placeholder="Location name"
            type="text"
            id="name"
            name="name"
            autoComplete="off"
            onChange={(e) => setLocationName(e.target.value)}
            required
          />
        </div>

        <div className="input-wraper">
          <input
            placeholder="Email"
            type="email"
            id="email"
            name="email"
            autoComplete="off"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-wraper">
          <input
            placeholder="Password"
            type="password"
            id="password"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <p className="warning-message">{warningMessage}</p>
        <p className="error-message">{errorMessage}</p>
        <button type="submit">Add</button>
      </form>
    </div>
  );
}
