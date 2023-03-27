import { createContext, useState } from "react";

type User = {
  user: string;
};

type UserContext = [User, React.Dispatch<React.SetStateAction<User>>];

export const UserContext = createContext<UserContext>([
  { user: "" },
  () => null,
]);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState({ user: "" });

  return (
    <UserContext.Provider value={[user, setUser]}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
