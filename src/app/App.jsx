import { useRoutes } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import { Suspense } from "react"; // ✅ EKLENDİ

import { MatxTheme } from "./components";
import SettingsProvider from "./contexts/SettingsContext";
import { AuthProvider } from "./contexts/JWTAuthContext";
import routes from "./routes";
import "../__api__";

export default function App() {
  const content = useRoutes(routes);

  return (
    <SettingsProvider>
      <AuthProvider>
        <MatxTheme>
          <CssBaseline />
          <Suspense fallback={
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <h2>Yükleniyor...</h2>
  </div>
}>
  {content}
          </Suspense>
        </MatxTheme>
      </AuthProvider>
    </SettingsProvider>
  );
}
