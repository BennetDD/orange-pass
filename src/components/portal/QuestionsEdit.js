import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../../AppContext";
import { db } from "../../fb config/firebase";
import uid from "uid";

export default function QuestionsEdit() {
  const [questions, setQuestions] = useState([]);
  const [saved, setSaved] = useState(false);
  const [edit, setEdit] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const { chosenLocationId } = useContext(AppContext);
  const { chosenLocationName } = useContext(AppContext);

  useEffect(() => {
    if (chosenLocationId !== "") {
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
        })
        .catch((error) => {
          console.log(error.message);
        });
    }
  }, [chosenLocationId]);

  const handleChange = (value, id) => {
    setEdit(
      questions.map((question) => {
        if (question.id === id) {
          question.content = value;
        }
      })
    );
  };

  const handleUpload = () => {
    questions.forEach((question) => {
      db.collection("locations")
        .doc(chosenLocationId)
        .collection("questions")
        .doc(question.id)
        .set({
          content: question.content,
        })
        .catch((error) => {
          console.log(error.message);
        });
    });
    setSaved(true);
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
        console.log(error.message);
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
          <h2>Review questions</h2>
          <p>
            Location:
            <span className="location-name">{chosenLocationName}</span>
          </p>
        </div>
        {saved ? <p className="update-message">changes saved</p> : null}
        <div>
          <button className="add-btn" onClick={() => createEditBox()}>
            Add
          </button>
          <button
            className="save-btn"
            onClick={() => handleUpload()}
            disabled={isButtonDisabled}
          >
            Save
          </button>
        </div>
      </div>

      <div className="edit-container">
        {questions.map((question, index) => (
          <div key={index} className="textarea-container">
            <textarea
              placeholder="type the question and click save"
              name="question"
              value={question.content}
              onChange={(e) => handleChange(e.target.value, question.id)}
            ></textarea>
            <div>
              <button
                className="delete-btn"
                onClick={() => {
                  if (
                    window.confirm(
                      "This action will delete the rule from database, are you sure?"
                    )
                  )
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
