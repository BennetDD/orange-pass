import React, { useEffect, useState } from "react";
import { auth } from "./fb config/firebase";

export const AuthContext = React.createContext();

export default function Auth({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    auth.onAuthStateChanged(setCurrentUser);
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
}
