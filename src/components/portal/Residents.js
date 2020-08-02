import React, { useState, useContext, useEffect } from "react";
import { AppContext } from "../../AppContext";
import { db } from "../../fb config/firebase";
import moment from "moment";

export default function Residents() {
  const [residents, setResidents] = useState([]);

  const { chosenLocationId } = useContext(AppContext);
  const { chosenLocationName } = useContext(AppContext);
  const { inputsTable } = useContext(AppContext);

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
            Location:
            <span className="location-name">{chosenLocationName}</span>
          </p>
        </div>
        <div>
          <button className="portal-btn">Export CSV</button>
        </div>
      </div>

      <div className="resident-container">
        <div className="resident-title">
          {inputsTable.name ? <p>Name</p> : null}
          {inputsTable.unit ? <p>Unit</p> : null}
          {inputsTable.mobile ? <p>Mobile</p> : null}
          {inputsTable.email ? <p>Email</p> : null}
          <p>Answer</p>
          <p>Time</p>
        </div>
        {residents.map((resident, index) => (
          <div key={index} className="resident-data">
            {inputsTable.name ? <p>{resident.fullname}</p> : null}
            {inputsTable.unit ? <p>{resident.unit}</p> : null}
            {inputsTable.mobile ? <p>{resident.mobile}</p> : null}
            {inputsTable.email ? <p>{resident.email}</p> : null}
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
