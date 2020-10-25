import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../../AppContext";
import { db, analytics } from "../../fb config/firebase";
import loadingGif from "../../assets/Loading.png";

export default function Message() {
  const [message, setMessage] = useState([]);
  const [edit, setEdit] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const { chosenLocationId } = useContext(AppContext);
  const { chosenLocationName } = useContext(AppContext);

  useEffect(() => {
    if (chosenLocationId !== "") {
      setLoading(true);

      db.collection("locations")
        .doc(chosenLocationId)
        .collection("message")
        .get()
        .then((snapshot) => {
          setMessage(
            snapshot.docs.map((doc) => ({
              ...doc.data(),
              id: doc.id,
            }))
          );
          setIsButtonDisabled(false);
          setLoading(false);
        })
        .catch((error) => {
          analytics.logEvent("exception", { description: `${error.message}` });
        });
    }
  }, [chosenLocationId]);

  const handleChange = (value, id) => {
    setEdit(
      message.map((question) => {
        if (question.id === id) {
          question.content = value;
        }
      })
    );
  };

  const handleUpload = () => {
    message.forEach((message) => {
      db.collection("locations")
        .doc(chosenLocationId)
        .collection("message")
        .doc(message.id)
        .set({
          content: message.content,
        })
        .catch((error) => {
          analytics.logEvent("exception", { description: `${error.message}` });
        });
    });
    setLoading(true);

    setTimeout(function () {
      setLoading(false);
    }, 1000);
  };

  return (
    <React.Fragment>
      <div className="components-container">
        <div className="csv-container">
          <div>
            <h2>review message</h2>
            <p>
              Location:
              <span className="location-name">{chosenLocationName}</span>
            </p>
          </div>
          {loading ? (
            <img className="loading" src={loadingGif} alt="Loading is here" />
          ) : null}
          <div>
            <button
              className="save-btn"
              onClick={() => handleUpload()}
              disabled={isButtonDisabled}
            >
              Save
            </button>
          </div>
        </div>
      </div>

      <div className="edit-container">
        {message.map((message, index) => (
          <div key={index} className="textarea-container">
            <textarea
              placeholder="type the message and click save"
              name="message"
              value={message.content}
              onChange={(e) => handleChange(e.target.value, message.id)}
            ></textarea>
          </div>
        ))}
      </div>
    </React.Fragment>
  );
}
