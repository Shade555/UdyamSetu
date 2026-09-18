import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { House, LogOut, Menu, Moon, Sun, UserRound, X } from "lucide-react";
import { useState } from "react";

const navigation = [
  { label: "Home", to: "/home", icon: House },
  { label: "Applied Schemes", to: "/applied-schemes", icon: House },
  { label: "Profile", to: "/profile", icon: UserRound },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(
    () => localStorage.getItem("udyamsetu-theme") !== "light",
  );

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const toggleTheme = () => {
    const nextIsDark = !isDark;
    setIsDark(nextIsDark);
    localStorage.setItem("udyamsetu-theme", nextIsDark ? "dark" : "light");
  };

  return (
    <div
      className={`app-shell min-h-screen bg-neutral-50 text-neutral-900 ${isDark ? "dark" : "light"}`}
    >
      <button
        type="button"
        aria-label="Open navigation"
        className="fixed left-4 top-4 z-40 rounded-lg bg-white p-2 shadow-sm lg:hidden"
        onClick={() => setIsOpen(true)}
      >
        <Menu size={20} />
      </button>

      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-neutral-900/30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-neutral-200 bg-white px-4 py-6 transition-transform lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-8 flex items-center justify-between px-2">
          <button
            type="button"
            className="text-left"
            onClick={() => navigate("/home")}
          >
            <span className="block text-xl font-bold text-accent-700">
              UdyamSetu
            </span>
            <span className="text-xs text-neutral-500">
              Your official next step
            </span>
          </button>
          <button
            type="button"
            aria-label={
              isDark ? "Switch to light theme" : "Switch to dark theme"
            }
            title={isDark ? "Switch to light theme" : "Switch to dark theme"}
            className="rounded-lg p-2 text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
            onClick={toggleTheme}
          >
            {isDark ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <button
            type="button"
            aria-label="Close navigation"
            className="rounded-lg p-2 lg:hidden"
            onClick={() => setIsOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-1">
          {navigation.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-accent-50 text-accent-700"
                    : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          onClick={handleSignOut}
          className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
        >
          <LogOut size={18} />
          Sign out
        </button>
      </aside>

      <main className="min-h-screen lg:pl-64">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-10 lg:py-10">
          {children}
        </div>
      </main>
    </div>
  );
}
