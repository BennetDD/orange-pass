import React, { useState, useContext, useEffect } from "react";
import { AppContext } from "../../AppContext";
import { db, analytics } from "../../fb config/firebase";
import { CSVLink } from "react-csv";
import moment from "moment";
import loadingGif from "../../assets/Loading.png";

export default function Residents() {
  const [residents, setResidents] = useState([]);
  const [CSVdata, setCSVdata] = useState([]);
  const [loading, setLoading] = useState(false);

  const { chosenLocationId } = useContext(AppContext);
  const { chosenLocationName } = useContext(AppContext);
  const { inputsTable } = useContext(AppContext);

  useEffect(() => {
    if (chosenLocationId !== "") {
      setLoading(true);
      getData(50);
    }
  }, [chosenLocationId]);

  const fetchData = (number) => {
    getData(+number);
  };

  const getData = (number) => {
    setLoading(true);

    if (number >= 400) {
      db.collection("locations")
        .doc(chosenLocationId)
        .collection("residents")
        .orderBy("time", "desc")
        .get()
        .then((snapshot) => {
          let residents = snapshot.docs.map((doc) => ({
            fullname: doc.data().fullname,
            unit: doc.data().unit,
            mobile: doc.data().mobile,
            email: doc.data().email,
            answer: doc.data().answer,
            time: moment(doc.data().time.toDate()).format("lll"),
          }));
          setResidents(residents);
          setCSVdata(residents);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error.message);
          analytics.logEvent("exception", { description: `${error.message}` });
        });
    } else {
      db.collection("locations")
        .doc(chosenLocationId)
        .collection("residents")
        .orderBy("time", "desc")
        .limit(number)
        .get()
        .then((snapshot) => {
          let residents = snapshot.docs.map((doc) => ({
            fullname: doc.data().fullname,
            unit: doc.data().unit,
            mobile: doc.data().mobile,
            email: doc.data().email,
            answer: doc.data().answer,
            time: moment(doc.data().time.toDate()).format("lll"),
          }));
          setResidents(residents);
          setCSVdata(residents);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error.message);
          analytics.logEvent("exception", { description: `${error.message}` });
        });
    }
  };

  return (
    <React.Fragment>
      <div className="components-container">
        <div>
          <h2>Review patrons</h2>
          <p>
            Location:
            <span className="location-name">{chosenLocationName}</span>
          </p>
        </div>
        {loading ? (
          <img className="loading" src={loadingGif} alt="Loading is here" />
        ) : null}
        <div className="csv-container">
          <select
            defaultValue={"default"}
            onChange={(e) => fetchData(e.target.value)}
          >
            <option value="default" disabled>
              50
            </option>
            <option value="100">100</option>
            <option value="200">200</option>
            <option value="300">300</option>
            <option value="400">400+</option>
          </select>
          <div>
            <CSVLink className="portal-btn-csv" data={CSVdata}>
              Export CSV
            </CSVLink>
          </div>
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
            <p className="data-time">{resident.time}</p>
          </div>
        ))}
      </div>
    </React.Fragment>
  );
}
