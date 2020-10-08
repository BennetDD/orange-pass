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

  const deactivate = () => {
    db.collection("locations")
      .doc(chosenLocationId)
      .set(
        {
          url: "",
          status: false,
        },
        { merge: true }
      )
      .catch((error) => {
        analytics.logEvent("exception", { description: `${error.message}` });
      });

    db.collection("superuser")
      .doc(chosenLocationId)
      .set(
        {
          url: "",
          status: false,
        },
        { merge: true }
      )
      .catch((error) => {
        analytics.logEvent("exception", { description: `${error.message}` });
      });

    setDetails(false);

    setTimeout(function () {
      window.location.reload();
    }, 500);
  };

  const activate = () => {
    db.collection("locations")
      .doc(chosenLocationId)
      .set(
        {
          url: LocationDetails.backUpUrl,
          status: true,
        },
        { merge: true }
      )
      .catch((error) => {
        analytics.logEvent("exception", { description: `${error.message}` });
      });

    db.collection("superuser")
      .doc(chosenLocationId)
      .set(
        {
          url: LocationDetails.backUpUrl,
          status: true,
        },
        { merge: true }
      )
      .catch((error) => {
        analytics.logEvent("exception", { description: `${error.message}` });
      });

    setDetails(false);

    setTimeout(function () {
      window.location.reload();
    }, 500);
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
    deactivate();
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
              <p className="location-title">Location status:</p>
              {LocationDetails.status ? <p>Active</p> : <p>Deactive</p>}
            </div>
            <div className="location-detail">
              <p className="location-title">Application link:</p>
              <p>www.orangesafepass.com/{LocationDetails.backUpUrl}/pass</p>
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
            if (window.confirm("Are you sure to delete this location?"))
              handleDelete();
          }}
        >
          Delete
        </button>
        <button
          className="deactive-btn"
          onClick={() => {
            if (window.confirm("Are you sure to deactivate this location?"))
              deactivate();
          }}
        >
          Deactivate
        </button>
        <button
          className="active-btn"
          onClick={() => {
            if (window.confirm("Are you sure to activate this location?"))
              activate();
          }}
        >
          Activate
        </button>
      </div>
    </React.Fragment>
  );
}
