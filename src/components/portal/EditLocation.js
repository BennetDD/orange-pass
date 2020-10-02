import React, { useState, useEffect, useContext } from "react";
import { db, analytics } from "../../fb config/firebase";
import { AppContext } from "../../AppContext";
import loadingGif from "../../assets/Loading.png";

import "../../styles/components/form.scss";

export default function AddLocation({
  setLocations,
  setAdd,
  setDetails,
  setEdit,
}) {
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [admin, setAdmin] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [locationName, setLocationName] = useState("");

  const [fulNameInput, setFullnameInput] = useState(null);
  const [unitInput, setUnitInput] = useState(null);
  const [emailInput, setEmailInput] = useState(null);
  const [mobileInput, setMobileInput] = useState(null);

  const { LocationDetails } = useContext(AppContext);
  const { chosenLocationId } = useContext(AppContext);
  const { inputsTable } = useContext(AppContext);

  useEffect(() => {
    setAdmin(LocationDetails.admin);
    setEmail(LocationDetails.email);
    setAddress(LocationDetails.address);
    setLocationName(LocationDetails.name);

    if (inputsTable.name) {
      document.getElementById("nameShow").checked = true;
      setFullnameInput(true);
    } else {
      document.getElementById("nameHide").checked = true;
      setFullnameInput(false);
    }

    if (inputsTable.unit) {
      document.getElementById("unitShow").checked = true;
      setUnitInput(true);
    } else {
      document.getElementById("unitHide").checked = true;
      setUnitInput(false);
    }

    if (inputsTable.email) {
      document.getElementById("emailShow").checked = true;
      setEmailInput(true);
    } else {
      document.getElementById("emailHide").checked = true;
      setEmailInput(false);
    }

    if (inputsTable.mobile) {
      document.getElementById("mobileShow").checked = true;
      setMobileInput(true);
    } else {
      document.getElementById("mobileHide").checked = true;
      setMobileInput(false);
    }
  }, [LocationDetails, inputsTable]);

  const handleEdit = (event) => {
    event.preventDefault();
    setErrorMessage("");
    setLoading(true);

    db.collection("locations")
      .doc(chosenLocationId)
      .set(
        {
          admin,
          email,
          address,
          name: locationName,
          url: locationName.split(" ").join("").toLowerCase(),
          time: new Date(),
        },
        { merge: true }
      )
      .catch((error) => {
        analytics.logEvent("exception", { description: `${error.message}` });
      });

    db.collection("locations")
      .doc(chosenLocationId)
      .collection("inputs")
      .doc("input")
      .set({
        mobile: mobileInput,
        email: emailInput,
        name: fulNameInput,
        unit: unitInput,
      })
      .catch((error) => {
        analytics.logEvent("exception", { description: `${error.message}` });
      });

    db.collection("superuser")
      .doc(chosenLocationId)
      .set({
        admin,
        email,
        address,
        name: locationName,
        url: locationName.split(" ").join("").toLowerCase(),
        time: new Date(),
      })
      .catch((error) => {
        analytics.logEvent("exception", { description: `${error.message}` });
      });

    db.collection("superuser")
      .doc(chosenLocationId)
      .collection("inputs")
      .doc("input")
      .set({
        mobile: mobileInput,
        email: emailInput,
        name: fulNameInput,
        unit: unitInput,
      })
      .catch((error) => {
        analytics.logEvent("exception", { description: `${error.message}` });
      });

    setLocations(true);
    setAdd(false);
    setDetails(false);
    setEdit(false);
  };

  return (
    <React.Fragment>
      <div className="add-container">
        <button
          className="back-btn"
          onClick={() => {
            setLocations(true);
            setAdd(false);
            setDetails(false);
            setEdit(false);
          }}
        >
          Back
        </button>
        <form className="form" name="add" onSubmit={handleEdit}>
          <h2>Edit location details</h2>
          <div className="input-wraper">
            <input
              placeholder="Manager full name"
              value={admin}
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
              value={address}
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
              value={locationName}
              type="text"
              id="name"
              name="name"
              autoComplete="off"
              onChange={(e) => setLocationName(e.target.value)}
              required
            />
          </div>

          <div className="inputs-details-container">
            <p>Choose which inputs to display:</p>
            <div>
              <p>Full name</p>
              <div>
                <input
                  id="nameShow"
                  name="name"
                  type="radio"
                  onChange={() => {
                    setFullnameInput(true);
                  }}
                  required
                />
                <label htmlFor="name">Show</label>
                <input
                  id="nameHide"
                  name="name"
                  type="radio"
                  onChange={() => {
                    setFullnameInput(false);
                  }}
                  required
                />
                <label htmlFor="name">Hide</label>
              </div>
            </div>

            <div>
              <p>Unit No</p>
              <div>
                <input
                  id="unitShow"
                  name="unit"
                  type="radio"
                  onChange={() => {
                    setUnitInput(true);
                  }}
                  required
                />
                <label htmlFor="unit">Show</label>
                <input
                  id="unitHide"
                  name="unit"
                  type="radio"
                  onChange={() => {
                    setUnitInput(false);
                  }}
                  required
                />
                <label htmlFor="unit">Hide</label>
              </div>
            </div>

            <div>
              <p>Email</p>
              <div>
                <input
                  id="emailShow"
                  name="email"
                  type="radio"
                  onChange={() => {
                    setEmailInput(true);
                  }}
                  required
                />
                <label htmlFor="email">Show</label>
                <input
                  id="emailHide"
                  name="email"
                  type="radio"
                  onChange={() => {
                    setEmailInput(false);
                  }}
                  required
                />
                <label htmlFor="email">Hide</label>
              </div>
            </div>

            <div>
              <p>Mobile</p>
              <div>
                <input
                  id="mobileShow"
                  name="mobile"
                  type="radio"
                  onChange={() => {
                    setMobileInput(true);
                  }}
                  required
                />
                <label htmlFor="mobile">Show</label>
                <input
                  id="mobileHide"
                  name="mobile"
                  type="radio"
                  onChange={() => {
                    setMobileInput(false);
                  }}
                  required
                />
                <label htmlFor="mobile">Hide</label>
              </div>
            </div>
          </div>
          {loading ? (
            <img className="loading" src={loadingGif} alt="Loading is here" />
          ) : null}
          <p className="error-message">{errorMessage}</p>
          <button type="submit">Edit</button>
        </form>
      </div>
    </React.Fragment>
  );
}
