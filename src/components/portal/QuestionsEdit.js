import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../../AppContext";
import { db, analytics } from "../../fb config/firebase";
import loadingGif from "../../assets/Loading.png";
import uid from "uid";

export default function QuestionsEdit() {
  const [questions, setQuestions] = useState([]);
  const [edit, setEdit] = useState("");
  const [message, setMessage] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [warningEdit, setWarningEdit] = useState("");

  const { chosenLocationId } = useContext(AppContext);
  const { chosenLocationName } = useContext(AppContext);

  useEffect(() => {
    if (chosenLocationId !== "") {
      setLoading(true);

      db.collection("locations")
        .doc(chosenLocationId)
        .collection("questions")
        .get()
        .then((snapshot) => {
          setQuestions(
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

      db.collection("locations")
        .doc(chosenLocationId)
        .collection("warning")
        .get()
        .then((snapshot) => {
          let message = snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          setMessage(message);
          setWarningEdit(message[0].content);

          setIsButtonDisabled(false);
          setLoading(false);
        })
        .catch((error) => {
          analytics.logEvent("exception", { description: `${error.message}` });
        });
    }
  }, [chosenLocationId]);

  const handleQuestion = (value, id) => {
    setEdit(
      questions.map((question) => {
        if (question.id === id) {
          question.content = value;
        }
      })
    );
  };

  const handleWarning = (value, id) => {
    setEdit(
      message.map((message) => {
        if (message.id === id) {
          message.content = value;
          setWarningEdit(message.content);
        }
      })
    );
  };

  const handleUpload = () => {
    if (warningEdit.length > 0) {
      setWarningMessage("");
      uploadData();
    } else {
      setWarningMessage("You must provide a warning message");
    }
  };

  const uploadData = () => {
    setLoading(true);

    questions.forEach((question) => {
      db.collection("locations")
        .doc(chosenLocationId)
        .collection("questions")
        .doc(question.id)
        .set({
          content: question.content,
        })
        .catch((error) => {
          analytics.logEvent("exception", {
            description: `${error.message}`,
          });
        });
    });

    message.forEach((message) => {
      db.collection("locations")
        .doc(chosenLocationId)
        .collection("warning")
        .doc(message.id)
        .set({
          content: message.content,
        })
        .catch((error) => {
          analytics.logEvent("exception", {
            description: `${error.message}`,
          });
        });
    });

    setTimeout(function () {
      setLoading(false);
    }, 1000);
  };

  const handleDelete = (id) => {
    setQuestions(
      questions.filter((question) => {
        return question.id !== id;
      })
    );

    db.collection("locations")
      .doc(chosenLocationId)
      .collection("questions")
      .doc(id)
      .delete()
      .catch((error) => {
        analytics.logEvent("exception", { description: `${error.message}` });
      });
  };

  const createEditBox = () => {
    setQuestions([
      ...questions,
      {
        content: "",
        id: uid(20),
      },
    ]);
  };

  return (
    <React.Fragment>
      <div className="components-container">
        <div>
          <h2>Review questions and warning message</h2>
          <p>
            Location:
            <span className="location-name">{chosenLocationName}</span>
          </p>
        </div>
        {loading ? (
          <img className="loading" src={loadingGif} alt="Loading is here" />
        ) : null}
        <div className="btnQ-container">
          <button
            className="save-btn"
            onClick={() => handleUpload()}
            disabled={isButtonDisabled}
          >
            Save
          </button>
        </div>
      </div>
      <p className="warning-message">{warningMessage}</p>
      <p>Edit warning message</p>
      <div className="edit-container">
        {message.map((message, index) => (
          <div key={index} className="textarea-container">
            <textarea
              placeholder="type the warning and click save"
              name="message"
              value={message.content}
              onChange={(e) => handleWarning(e.target.value, message.id)}
              required
            ></textarea>
          </div>
        ))}
      </div>
      <p>Add and edit questions</p>
      <div className="btnQ-container">
        <button
          className="add-btn"
          onClick={() => createEditBox()}
          disabled={isButtonDisabled}
        >
          Add
        </button>
      </div>
      <div className="edit-container">
        {questions.map((question, index) => (
          <div key={index} className="textarea-container">
            <textarea
              placeholder="type the question and click save"
              name="question"
              value={question.content}
              onChange={(e) => handleQuestion(e.target.value, question.id)}
            ></textarea>
            <div>
              <button
                className="delete-btn"
                onClick={() => {
                  if (window.confirm("Are you sure to delete this question?"))
                    handleDelete(question.id);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </React.Fragment>
  );
}
