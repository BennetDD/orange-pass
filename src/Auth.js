import React, { useEffect, useState } from "react";
import { auth } from "./fb config/firebase";

export const AuthContext = React.createContext();

export default function Auth({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    auth.onAuthStateChanged(setCurrentUser);

    auth.onAuthStateChanged((authUser) => {
      if (authUser.email === process.env.REACT_APP_SUPERUSER) {
        authUser
          ? localStorage.setItem("authUser", JSON.stringify(authUser))
          : localStorage.removeItem("authUser");
      }
    });
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
}
