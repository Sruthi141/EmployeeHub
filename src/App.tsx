import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import ErrorBoundary from "@/components/ErrorBoundary";
import Navbar from "@/components/Navbar";
import PageTransition from "@/components/PageTransition";
import LoginPage from "@/pages/LoginPage";
import ListPage from "@/pages/ListPage";
import DetailsPage from "@/pages/DetailsPage";
import PhotoResultPage from "@/pages/PhotoResultPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const AuthRedirect = () => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/list" replace />;
  return <LoginPage />;
};

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <Navbar />
              <PageTransition>
                <Routes>
                  <Route path="/" element={<AuthRedirect />} />
                  <Route path="/login" element={<Navigate to="/" replace />} />
                  <Route path="/list" element={<ProtectedRoute><ListPage /></ProtectedRoute>} />
                  <Route path="/details/:id" element={<ProtectedRoute><DetailsPage /></ProtectedRoute>} />
                  <Route path="/photo" element={<ProtectedRoute><PhotoResultPage /></ProtectedRoute>} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </PageTransition>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
