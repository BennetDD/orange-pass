import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../../AppContext";
import { db } from "../../fb config/firebase";

export default function QuestionsEdit() {
  const [questions, setQuestions] = useState([]);

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
          <h2>Review questions</h2>
          <p>
            Chosen location:
            <span className="location-name">{chosenLocationName}</span>
          </p>
        </div>
        <div>
          <button className="add-btn">Add</button>
          <button className="save-btn">Save</button>
        </div>
      </div>

      <div className="edit-container">
        {questions.map((rule, index) => (
          <div key={index} className="textarea-container">
            <textarea name="rule" value={rule.content}></textarea>
            <div>
              <button className="delete-btn">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </React.Fragment>
  );
}
