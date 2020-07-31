import React from "react";

import "../styles/components/bar.scss";

export default function Bar({ progressBar }) {
  const barStyle = {
    width: `${(33 / 100) * 100}%`,
  };

  return <div style={barStyle} className="bar" />;
}
