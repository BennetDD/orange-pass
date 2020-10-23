import React, { useState, useContext, useEffect } from "react";
import { db, analytics } from "../../fb config/firebase";
import { AppContext } from "../../AppContext";

import AddLocation from "./AddLocation";
import EditLocation from "./EditLocation";

import LocationDetails from "./LocationDetails";

export default function Locations() {
  const [locations, setLocations] = useState(true);
  const [add, setAdd] = useState(false);
  const [edit, setEdit] = useState(false);
  const [details, setDetails] = useState(false);

  const [allLocations, setAllLocations] = useState([]);

  const { setChosenLocationId } = useContext(AppContext);
  const { setChosenLocationName } = useContext(AppContext);
  const { setInputsTable } = useContext(AppContext);

  const toggleComponent = () => {
    setLocations(false);
    setAdd(true);
    setDetails(false);
  };

  useEffect(() => {
    db.collection("superuser")
      .orderBy("name")
      .get()
      .then((snapshot) => {
        setAllLocations(
          snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }))
        );
      })
      .catch((error) => {
        analytics.logEvent("exception", { description: `${error.message}` });
      });
  }, []);

  const chosenLocation = (id) => {
    setChosenLocationId(id);
    fetchInputsData(id);
    allLocations.forEach((location) => {
      if (location.id === id) {
        setChosenLocationName(location.name);
      }
    });
    setDetails(true);
  };

  const fetchInputsData = (id) => {
    db.collection("superuser")
      .doc(id)
      .collection("inputs")
      .doc("input")
      .get()
      .then((snapshot) => {
        setInputsTable(snapshot.data());
      })
      .catch((error) => {
        analytics.logEvent("exception", { description: `${error.message}` });
      });
  };

  return (
    <React.Fragment>
      {locations ? (
        <div className="components-container">
          <select
            defaultValue={"default"}
            onChange={(e) => chosenLocation(e.target.value)}
          >
            <option value="default" disabled>
              Choose location
            </option>
            {allLocations !== undefined && allLocations.length > 0
              ? allLocations.map((location) => {
                  return (
                    <option key={location.id} value={location.id}>
                      {location.name}
                    </option>
                  );
                })
              : null}
          </select>
          <div>
            <button
              className="portal-btn-addlocation"
              onClick={() => toggleComponent()}
            >
              Add location
            </button>
          </div>
        </div>
      ) : null}

      {add ? (
        <AddLocation
          setLocations={setLocations}
          setAdd={setAdd}
          setDetails={setDetails}
        />
      ) : null}

      {edit ? (
        <EditLocation
          setLocations={setLocations}
          setAdd={setAdd}
          setDetails={setDetails}
          setEdit={setEdit}
        />
      ) : null}

      {details ? (
        <LocationDetails
          setDetails={setDetails}
          setEdit={setEdit}
          setLocations={setLocations}
          setAdd={setAdd}
        />
      ) : null}
    </React.Fragment>
  );
}
