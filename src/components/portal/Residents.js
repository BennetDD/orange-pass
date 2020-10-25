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
  const [year, setYear] = useState("");
  const [warningMessage, setWarningMessage] = useState("");

  const { chosenLocationId } = useContext(AppContext);
  const { chosenLocationName } = useContext(AppContext);
  const { inputsTable } = useContext(AppContext);

  useEffect(() => {
    if (chosenLocationId !== "") {
      setLoading(true);
      getData(50);
    }
  }, [chosenLocationId]);

  const createDate = (date) => {
    if (year === "") {
      setWarningMessage("Enter year");
    } else {
      let startTime = new Date(`${date} 01 ${year}`);
      let endTime = new Date(`${date} 31 ${year}`);
      setWarningMessage("");

      filterData(startTime, endTime);
    }
  };

  const fetchData = (number) => {
    getData(+number);
  };

  const filterData = (startTime, endTime) => {
    setLoading(true);

    if (chosenLocationId !== "") {
      db.collection("locations")
        .doc(chosenLocationId)
        .collection("residents")
        .orderBy("time", "desc")
        .where("time", ">=", startTime)
        .where("time", "<=", endTime)
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

  const getData = (number) => {
    setLoading(true);

    if (chosenLocationId !== "") {
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
            analytics.logEvent("exception", {
              description: `${error.message}`,
            });
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
            analytics.logEvent("exception", {
              description: `${error.message}`,
            });
          });
      }
    }
  };

  return (
    <React.Fragment>
      <div className="components-container">
        <div className="csv-container">
          <div>
            <h2>review patrons</h2>
            <p>
              Location:
              <span className="location-name">{chosenLocationName}</span>
            </p>
          </div>
          {loading ? (
            <img className="loading" src={loadingGif} alt="Loading is here" />
          ) : null}

          <div>
            <CSVLink className="portal-btn-csv" data={CSVdata}>
              Export CSV
            </CSVLink>
          </div>
        </div>

        <div className="filter-container">
          <div className="search-container">
            <p className="warning-message">{warningMessage}</p>
            <div className="input-wraper">
              <input
                placeholder="Year"
                type="number"
                id="year"
                name="year"
                onChange={(e) => setYear(e.target.value)}
                required
              />
            </div>

            <select
              className="month"
              defaultValue={"default"}
              onChange={(e) => createDate(e.target.value)}
            >
              <option value="default" disabled>
                Month
              </option>
              <option value="January">January</option>
              <option value="February">February</option>
              <option value="March">March</option>
              <option value="April">April</option>
              <option value="May">May</option>
              <option value="June">June</option>
              <option value="July">July</option>
              <option value="August">August</option>
              <option value="September">September</option>
              <option value="October">October</option>
              <option value="November">November</option>
              <option value="December">December</option>
            </select>
          </div>

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
            <option value="400">All</option>
          </select>
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
            {inputsTable.name ? (
              <p className="data-name">{resident.fullname}</p>
            ) : null}
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
