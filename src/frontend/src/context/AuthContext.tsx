import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export interface UserAccount {
  name: string;
  email: string;
  avatarInitials: string;
  avatarColor: string;
  joinDate: string;
}

interface AuthContextType {
  user: UserAccount | null;
  isLoggedIn: boolean;
  login: (name: string, email: string) => void;
  logout: () => void;
  savedAccounts: Omit<UserAccount, "joinDate">[];
}

const AVATAR_COLORS = [
  "linear-gradient(135deg, #a855f7, #26e6ff)",
  "linear-gradient(135deg, #26e6ff, #2ee59d)",
  "linear-gradient(135deg, #ff4fd8, #a855f7)",
  "linear-gradient(135deg, #5b8cff, #c84cff)",
  "linear-gradient(135deg, #ffd700, #ff8c00)",
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function pickColor(email: string): string {
  let hash = 0;
  for (let i = 0; i < email.length; i++) hash = email.charCodeAt(i) + hash * 31;
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

const DEFAULT_SAVED_ACCOUNTS: Omit<UserAccount, "joinDate">[] = [
  {
    name: "Alex Mercer",
    email: "alex.mercer@gmail.com",
    avatarInitials: "AM",
    avatarColor: AVATAR_COLORS[0],
  },
  {
    name: "Priya Sharma",
    email: "priya.sharma@gmail.com",
    avatarInitials: "PS",
    avatarColor: AVATAR_COLORS[2],
  },
];

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
  savedAccounts: [],
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem("predictx_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [savedAccounts, setSavedAccounts] = useState<
    Omit<UserAccount, "joinDate">[]
  >(() => {
    try {
      const saved = localStorage.getItem("predictx_accounts");
      return saved ? JSON.parse(saved) : DEFAULT_SAVED_ACCOUNTS;
    } catch {
      return DEFAULT_SAVED_ACCOUNTS;
    }
  });

  const login = useCallback((name: string, email: string) => {
    const newUser: UserAccount = {
      name,
      email,
      avatarInitials: getInitials(name),
      avatarColor: pickColor(email),
      joinDate: new Date().toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      }),
    };
    setUser(newUser);
    localStorage.setItem("predictx_user", JSON.stringify(newUser));

    setSavedAccounts((prev) => {
      const exists = prev.find((a) => a.email === email);
      if (exists) return prev;
      const updated = [
        {
          name,
          email,
          avatarInitials: newUser.avatarInitials,
          avatarColor: newUser.avatarColor,
        },
        ...prev,
      ].slice(0, 5);
      localStorage.setItem("predictx_accounts", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("predictx_user");
  }, []);

  useEffect(() => {
    localStorage.setItem("predictx_accounts", JSON.stringify(savedAccounts));
  }, [savedAccounts]);

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn: !!user, login, logout, savedAccounts }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
