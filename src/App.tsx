import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import NotFound from "./pages/NotFound";
import Contact from "./pages/Contact";
import Stories from "./pages/Stories";
import About from "./pages/About";
import OurCrafts from "./pages/OurCrafts";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import VerifyEmail from "./pages/VerifyEmail";
import EmailVerificationInfo from "./pages/EmailVerificationInfo";
import Profile from "./pages/Profile";
import Cart from "./pages/Cart";
import { AppProvider } from "./contexts/AppContext";
import Sustainability from "./pages/sustainability";
import CSR from "./pages/csr";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="light">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppProvider>
          <BrowserRouter>
            <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/crafts" element={<OurCrafts />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/stories" element={<Stories />} />
            <Route path="/sustainability" element={<Sustainability />} />
            <Route path="/corporate-social-responsibility" element={<CSR />} />
            <Route path="/artisan-stories" element={<Stories />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/email-verification" element={<EmailVerificationInfo />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AppProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;