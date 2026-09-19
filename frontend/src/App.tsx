import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "./context/AuthContext";
import { ChatbotProvider } from "./context/ChatbotContext";
import { useChatbotContext } from "./hooks/useChatbotContext";
import { hasCompletedOnboarding } from "./lib/supabase";
import AppShell from "./components/AppShell";
import ContextAwareChatbot from "./components/ContextAwareChatbot";

// Auth Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// Onboarding Pages (Old journey flow moved here)
import LanguageSelector from "./pages/LanguageSelector";
import NeedSelector from "./pages/NeedSelector";
import RequirementInput from "./pages/RequirementInput";
import ProfileConfirmation from "./pages/ProfileConfirmation";
import PlaceholderPage from "./pages/PlaceholderPage";
import HomeWorkflow from "./pages/HomeWorkflow";
import EMICalculator from "./pages/EMICalculator";

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-accent-200 border-t-accent-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function EntryRoute() {
  const { user } = useAuth();
  const [destination, setDestination] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    const resolveDestination = async () => {
      const storageKey = `udyamsetu:onboarding-complete:${user.id}`;
      const locallyComplete = localStorage.getItem(storageKey) === "true";

      if (locallyComplete || (await hasCompletedOnboarding(user.id))) {
        localStorage.setItem(storageKey, "true");
        setDestination("/home");
      } else {
        setDestination("/onboarding/language");
      }
    };

    resolveDestination().catch((error) => {
      console.error("Could not resolve onboarding state:", error);
      setDestination("/onboarding/language");
    });
  }, [user]);

  if (!destination) {
    return <div className="min-h-screen bg-neutral-50" />;
  }

  return <Navigate to={destination} replace />;
}

function ShellRoute({ title }: { title: string }) {
  return (
    <AppShell>
      <PlaceholderPage title={title} />
    </AppShell>
  );
}

function HomeRoute({ activeStep }: { activeStep?: number }) {
  return (
    <AppShell>
      <HomeWorkflow activeStep={activeStep} />
    </AppShell>
  );
}

function AppContent() {
  const { session } = useAuth();
  useChatbotContext();

  return (
    <>
      <ContextAwareChatbot />
      <Routes>
        {/* Auth Routes */}
        <Route
          path="/login"
          element={session ? <Navigate to="/entry" /> : <Login />}
        />
        <Route
          path="/signup"
          element={session ? <Navigate to="/entry" /> : <Signup />}
        />

        <Route
          path="/entry"
          element={
            <ProtectedRoute>
              <EntryRoute />
            </ProtectedRoute>
          }
        />

        {/* Dashboard & Profile */}
        <Route path="/dashboard" element={<Navigate to="/entry" replace />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomeRoute />
            </ProtectedRoute>
          }
        />
        <Route
          path="/home/scheme-recommendations"
          element={
            <ProtectedRoute>
              <HomeRoute activeStep={5} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/home/scheme-details"
          element={
            <ProtectedRoute>
              <HomeRoute activeStep={6} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/home/emi-calculator"
          element={
            <ProtectedRoute>
              <AppShell>
                <EMICalculator />
              </AppShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/home/partner-locator"
          element={
            <ProtectedRoute>
              <HomeRoute activeStep={8} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/home/partner-eligibility"
          element={
            <ProtectedRoute>
              <HomeRoute activeStep={9} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/home/official-action"
          element={
            <ProtectedRoute>
              <HomeRoute activeStep={10} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/applied-schemes"
          element={
            <ProtectedRoute>
              <ShellRoute title="Applied Schemes" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <AppShell>
                <PlaceholderPage title="Profile" />
              </AppShell>
            </ProtectedRoute>
          }
        />

        {/* Onboarding Flow (Protected) */}
        <Route
          path="/onboarding/language"
          element={
            <ProtectedRoute>
              <LanguageSelector onSelectLanguage={() => {}} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/onboarding/need"
          element={
            <ProtectedRoute>
              <NeedSelector language="en" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/onboarding/requirement"
          element={
            <ProtectedRoute>
              <RequirementInput language="en" setUserProfile={() => {}} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/onboarding/profile"
          element={
            <ProtectedRoute>
              <ProfileConfirmation language="en" profile={null} />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route
          path="/"
          element={<Navigate to={session ? "/entry" : "/login"} replace />}
        />
      </Routes>
    </>
  );
}

function App() {
  const { loading } = useAuth();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!loading) {
      setIsReady(true);
    }
  }, [loading]);

  if (!isReady) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-accent-200 border-t-accent-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <ChatbotProvider>
      <AppContent />
    </ChatbotProvider>
  );
}

export default App;
