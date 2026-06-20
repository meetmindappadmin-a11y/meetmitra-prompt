import { Navigate, Route, Routes } from 'react-router-dom';
import { useApp } from './context/AppContext';
import { SafetyProvider } from './features/safety/SafetyProvider';
import { Layout } from './components/Layout';
import { MitraOnboarding } from './features/onboarding/MitraOnboarding';
import { TodayHome } from './features/today/TodayHome';
import { MitraChat } from './features/companion/MitraChat';
import { PrivateJournal } from './features/journal/PrivateJournal';
import { InsightsView } from './features/insights/InsightsView';
import { CalmView } from './features/exercises/CalmView';

export function App() {
  const { hasOnboarded } = useApp();

  return (
    <SafetyProvider>
      {hasOnboarded ? (
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<TodayHome />} />
            <Route path="/talk" element={<MitraChat />} />
            <Route path="/write" element={<PrivateJournal />} />
            <Route path="/insights" element={<InsightsView />} />
            <Route path="/calm" element={<CalmView />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      ) : (
        <Routes>
          <Route path="*" element={<MitraOnboarding />} />
        </Routes>
      )}
    </SafetyProvider>
  );
}
