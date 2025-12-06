import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { Layout } from "@/components/Layout";
import Home from "./pages/Home";
import Laws from "./pages/Laws";
import LawDetail from "./pages/LawDetail";
import Chat from "./pages/Chat";
import Lawyers from "./pages/Lawyers";
import LawyerDetail from "./pages/LawyerDetail";
import Uploads from "./pages/Uploads";
import EmergencyContacts from "./pages/EmergencyContacts";
import Login from "./pages/Login";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

const App = () => (
  <GoogleOAuthProvider clientId={googleClientId}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/laws" element={<Laws />} />
                  <Route path="/laws/:id" element={<LawDetail />} />
                  <Route path="/chat" element={<Chat />} />
                  <Route path="/lawyers" element={<Lawyers />} />
                  <Route path="/lawyers/:id" element={<LawyerDetail />} />
                  <Route path="/uploads" element={<Uploads />} />
                  <Route path="/emergency-contacts" element={<EmergencyContacts />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            </BrowserRouter>
          </AuthProvider>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </GoogleOAuthProvider>
);

export default App;
