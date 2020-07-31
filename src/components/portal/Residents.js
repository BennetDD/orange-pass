import React, { useState, useContext, useEffect } from "react";
import { AppContext } from "../../AppContext";
import { db } from "../../fb config/firebase";
import moment from "moment";

export default function Residents() {
  const [residents, setResidents] = useState([]);

  const { chosenLocationId } = useContext(AppContext);
  const { chosenLocationName } = useContext(AppContext);

  useEffect(() => {
    if (chosenLocationId !== "") {
      db.collection("locations")
        .doc(chosenLocationId)
        .collection("residents")
        .get()
        .then((snapshot) => {
          setResidents(
            snapshot.docs.map((doc) => {
              return doc.data();
            })
          );
        })
        .catch((error) => {
          console.log(error.message);
        });
    }
  }, [chosenLocationId]);

  return (
    <React.Fragment>
      <div className="components-container">
        <div>
          <h2>Review residents</h2>
          <p>
            Chosen location:
            <span className="location-name">{chosenLocationName}</span>
          </p>
        </div>
        <div>
          <button className="portal-btn">Export CSV</button>
        </div>
      </div>

      <div className="resident-container">
        <div className="resident-title">
          <p>Name</p>
          <p>Unit</p>
          <p>Mobile</p>
          <p>Email</p>
          <p>Answer</p>
          <p>Time</p>
        </div>
        {residents.map((resident, index) => (
          <div key={index} className="resident-data">
            <p>{resident.fullname}</p>
            <p>{resident.unit}</p>
            <p>{resident.mobile}</p>
            <p>{resident.email}</p>
            <p>{resident.answer}</p>
            <p className="data-time">
              {moment(resident.time.toDate()).format("lll")}
            </p>
          </div>
        ))}
      </div>
    </React.Fragment>
  );
}
