import React, { useContext, useEffect } from "react";
import { db, analytics } from "../../fb config/firebase";
import { AppContext } from "../../AppContext";

export default function LocationDetails({
  setDetails,
  setEdit,
  setLocations,
  setAdd,
}) {
  const { chosenLocationId } = useContext(AppContext);
  const { LocationDetails, setLocationDetails } = useContext(AppContext);

  useEffect(() => {
    db.collection("superuser")
      .doc(chosenLocationId)
      .get()
      .then((snapshot) => {
        setLocationDetails(snapshot.data());
      })
      .catch((error) => {
        analytics.logEvent("exception", { description: `${error.message}` });
      });
  }, [chosenLocationId, setLocationDetails]);

  const toggleComponent = () => {
    setEdit(true);
    setAdd(false);
    setDetails(false);
    setLocations(false);
  };

  const handleDelete = () => {
    db.collection("superuser")
      .doc(chosenLocationId)
      .delete()
      .catch((error) => {
        analytics.logEvent("exception", { description: `${error.message}` });
      });

    db.collection("superuser")
      .doc(chosenLocationId)
      .collection("inputs")
      .doc("input")
      .delete()
      .catch((error) => {
        analytics.logEvent("exception", { description: `${error.message}` });
      });

    setDetails(false);
  };

  return (
    <React.Fragment>
      <div className="details-action-container">
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
              <p className="location-title">Application link:</p>
              <p>www.orangesafepass.com/{LocationDetails.url}/pass</p>
            </div>
          </div>
        </div>
      </div>
      <div className="details-btn-container">
        <button className="edit-btn" onClick={() => toggleComponent()}>
          Edit
        </button>
        <button
          className="delete-btn"
          onClick={() => {
            if (
              window.confirm(
                "This action will delete the location from the portal, are you sure?"
              )
            )
              handleDelete();
          }}
        >
          Delete
        </button>
      </div>
    </React.Fragment>
  );
}
