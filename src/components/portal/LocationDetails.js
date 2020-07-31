import React, { useState, useContext, useEffect } from "react";
import { db } from "../../fb config/firebase";
import { AppContext } from "../../AppContext";

export default function LocationDetails() {
  const { chosenLocationId } = useContext(AppContext);

  const [LocationDetails, setLocationDetails] = useState([]);

  useEffect(() => {
    if (chosenLocationId !== "") {
      db.collection("superuser")
        .doc(chosenLocationId)
        .get()
        .then((snapshot) => {
          setLocationDetails(snapshot.data());
          passwordEdit(snapshot.data());
        })
        .catch((error) => {
          console.log(error.message);
        });
    }
  }, [chosenLocationId]);

  const passwordEdit = (data) => {
    console.log(data.password);
  };

  return (
    <div className="details-action-container">
      <div>
        <button className="edit-btn">Edit</button>
        <button className="delete-btn">Delete</button>
      </div>

      <div className="location-details-container">
        <div>
          <div className="location-detail">
            <p className="location-title">Manager name:</p>
            <p>{LocationDetails.admin}</p>
          </div>
          <div className="location-detail">
            <p className="location-title">Location name:</p>
            <p>{LocationDetails.name}</p>
          </div>
          <div className="location-detail">
            <p className="location-title">Location address:</p>
            <p>{LocationDetails.address}</p>
          </div>
          <div className="location-detail">
            <p className="location-title">Login email:</p>
            <p>{LocationDetails.email}</p>
          </div>
          <div className="location-detail">
            <p className="location-title">Login password:</p>
            <p>{LocationDetails.password}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
