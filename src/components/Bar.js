import React, { useContext } from "react";
import { AppContext } from "../AppContext";

export default function Bar() {
  const { progressBar } = useContext(AppContext);

  const barStyle = {
    width: `${(progressBar / 100) * 100}%`,
  };

  return <div style={barStyle} className="bar" />;
}
