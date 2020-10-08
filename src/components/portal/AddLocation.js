import React, { useState, useEffect } from "react";
import { db, auth, analytics, storage } from "../../fb config/firebase";
import loadingGif from "../../assets/Loading.png";

import "../../styles/components/form.scss";

export default function AddLocation({ setLocations, setAdd, setDetails }) {
  const [errorMessage, setErrorMessage] = useState("");
  const [warningMessage, setWarningMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [admin, setAdmin] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [locationName, setLocationName] = useState("");
  const [password, setPassword] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [logoLoading, setLogoLoading] = useState(false);

  useEffect(() => {
    if (
      admin.trim() &&
      email.trim() &&
      password.trim() &&
      address.trim() &&
      locationName.trim() &&
      imageUrl.length > 0
    ) {
      setWarningMessage("");
    } else {
      setWarningMessage("fill in all fields, logo is optional");
    }
  }, [admin, email, password, address, locationName, imageUrl]);

  const handleRegister = (event) => {
    event.preventDefault();
    setErrorMessage("");
    setLoading(true);

    let lowercaseEmail = email.toLowerCase();
    auth
      .createUserWithEmailAndPassword(lowercaseEmail, password)
      .then((resp) => {
        uploadLocationData(resp.user.uid);
        resp.user.sendEmailVerification();
        analytics.logEvent("sign_up", { method: `${resp.user.email}` });
      })
      .catch((error) => {
        analytics.logEvent("exception", { description: `${error.message}` });
        setErrorMessage(error.message);
        setLoading(false);
      });

    auth
      .sendSignInLinkToEmail(lowercaseEmail)
      .then(function () {
        window.localStorage.setItem("emailForSignIn", email);
      })
      .catch((error) => {
        analytics.logEvent("exception", { description: `${error.message}` });
      });
  };

  const uploadImage = async (e) => {
    setLogoLoading(true);
    const image = e.target.files[0];
    const sotrageRef = storage.ref();
    const fileRef = sotrageRef.child(locationName);
    await fileRef.put(image);
    setImageUrl(await fileRef.getDownloadURL());
    setLogoLoading(false);
  };

  const uploadLocationData = (id) => {
    db.collection("locations")
      .doc(id)
      .set({
        admin,
        email: email.toLowerCase(),
        address,
        name: locationName,
        url: locationName.split(" ").join("").toLowerCase(),
        backUpUrl: locationName.split(" ").join("").toLowerCase(),
        time: new Date(),
        status: true,
        logo: imageUrl,
      })
      .catch((error) => {
        analytics.logEvent("exception", { description: `${error.message}` });
        setErrorMessage(error.message);
      });

    db.collection("locations")
      .doc(id)
      .collection("questions")
      .add({
        content: "",
      })
      .catch((error) => {
        analytics.logEvent("exception", { description: `${error.message}` });
      });

    db.collection("locations")
      .doc(id)
      .collection("rules")
      .add({
        content: "",
      })
      .catch((error) => {
        analytics.logEvent("exception", { description: `${error.message}` });
      });

    db.collection("locations")
      .doc(id)
      .collection("message")
      .add({
        content: "",
      })
      .catch((error) => {
        analytics.logEvent("exception", { description: `${error.message}` });
      });

    db.collection("locations")
      .doc(id)
      .collection("warning")
      .add({
        content: "",
      })
      .catch((error) => {
        analytics.logEvent("exception", { description: `${error.message}` });
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
        analytics.logEvent("exception", { description: `${error.message}` });
      });

    db.collection("superuser")
      .doc(id)
      .set({
        admin,
        email: email.toLowerCase(),
        address,
        name: locationName,
        url: locationName.split(" ").join("").toLowerCase(),
        backUpUrl: locationName.split(" ").join("").toLowerCase(),
        status: true,
        time: new Date(),
      })
      .catch((error) => {
        analytics.logEvent("exception", { description: `${error.message}` });
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
        analytics.logEvent("exception", { description: `${error.message}` });
      });

    setLocations(true);
    setAdd(false);
    setDetails(false);

    setTimeout(function () {
      window.location.reload();
    }, 500);
  };

  const style = {
    marginBottom: "10px",
  };

  return (
    <div className="add-container">
      <button
        className="back-btn"
        onClick={() => {
          setAdd(false);
          setLocations(true);
        }}
      >
        Back
      </button>
      <form className="form" name="add" onSubmit={handleRegister}>
        <h2>Add new location</h2>
        <div className="input-wraper">
          <input
            placeholder="Manager full name"
            type="text"
            id="admin"
            name="admin"
            onChange={(e) => setAdmin(e.target.value)}
            autoComplete="off"
            required
          />
        </div>

        <div className="input-wraper">
          <input
            placeholder="Location address"
            type="text"
            id="address"
            name="address"
            onChange={(e) => setAddress(e.target.value)}
            autoComplete="off"
            required
          />
        </div>

        <div className="input-wraper">
          <input
            placeholder="Location name"
            type="text"
            id="name"
            name="name"
            onChange={(e) => setLocationName(e.target.value)}
            autoComplete="off"
            required
          />
        </div>

        <div className="input-wraper">
          <input
            placeholder="Email"
            type="email"
            id="email"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="off"
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
            autoComplete="off"
            required
          />
        </div>

        <div className="input-wraper">
          <input
            className="input"
            type="file"
            id="file"
            name="file"
            onChange={uploadImage}
            autoComplete="off"
          />
          <label className="file-label" htmlFor="file">
            Upload logo
          </label>
        </div>
        {logoLoading ? (
          <img className="loading" src={loadingGif} alt="Loading is here" />
        ) : null}
        {loading ? (
          <img
            style={style}
            className="loading"
            src={loadingGif}
            alt="Loading is here"
          />
        ) : null}
        <p className="warning-message">{warningMessage}</p>
        <p className="error-message">{errorMessage}</p>
        <button type="submit">Add</button>
      </form>
    </div>
  );
}
