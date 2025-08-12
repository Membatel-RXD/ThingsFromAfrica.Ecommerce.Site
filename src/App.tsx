import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
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
import Wishlist from "./pages/Wishlist";
import ProfileSettings from "./pages/ProfileSettings";
import { AppProvider } from "./contexts/AppContext";
import Sustainability from "./pages/sustainability";
import CSR from "./pages/csr";
import Addresses from "./pages/UserAddresses";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";
import Orders from "./pages/Orders";
import TrackOrder from "./pages/TrackOrder";
import ReviewProduct from "./pages/ReviewProduct";
import MessageCenter from "./pages/MessageCenter";
import { Coins } from "lucide-react";
import MyCoupons from "./pages/MyCoupons";
import Checkout from "./components/CheckoutPage";
import OrderSuccess from "./components/OrderSuccess";
import ReturnRefundPolicy from "./pages/ReturnRefundPolicy";
import { LanguageProvider } from "./contexts/LanguageContext";
import ArtisanDetail from './pages/ArtisanDetail'; // or wherever you place the component
import ProductDetail from "./pages/ProductView";
import GiftIdeas from './pages/GiftIdeas';

const queryClient = new QueryClient();

const App = () => {
  return (
    <LanguageProvider> {/* Add this wrapper */}

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
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/profile/wishlist" element={<Wishlist />} />
                  <Route path="/profile/settings" element={<ProfileSettings />} />
                  <Route path="/profile/user/addresses" element={<Addresses />} />
                  <Route path="/payment/success" element={<PaymentSuccess />} />
                  <Route path="/payment/cancel" element={<PaymentCancel />} />
                  <Route path="/profile/user/my-orders" element={<Orders />} />
                  <Route path="/track-order" element={<TrackOrder />} />
                  <Route path="/review-product/:productId" element={<ReviewProduct />} />
                  <Route path="/messages" element={<MessageCenter />} />
                  <Route path="/profile/user/my-coins" element={<Coins />} />
                  <Route path="/coupons" element={<MyCoupons />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/order-success" element={<OrderSuccess />} />
                  <Route path="/return-policy" element={<ReturnRefundPolicy />} />
                  <Route path="/stories/:id" element={<ArtisanDetail />} />
                  <Route path="/crafts/:slug" element={<ProductDetail />} />

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </AppProvider>
          </TooltipProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
};
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
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/profile/wishlist" element={<Wishlist />} />
            <Route path="/profile/settings" element={<ProfileSettings />} />
            <Route path="/profile/user/addresses" element={<Addresses />} />
            <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route path="/payment/cancel" element={<PaymentCancel />} />
            <Route path="/profile/user/my-orders" element={<Orders />} />
            <Route path="/track-order" element={<TrackOrder />} />
            <Route path="/review-product/:productId" element={<ReviewProduct />} />
            <Route path="/messages" element={<MessageCenter />} />
            <Route path="/profile/user/my-coins" element={<Coins />} />
            <Route path="/coupons" element={<MyCoupons />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/return-policy" element={ <ReturnRefundPolicy/>} />
            <Route path="/gifts" element={<GiftIdeas />} />
            <Route path="/stories/:id" element={<ArtisanDetail />} />
            <Route path="*" element={<NotFound />} />
            </Routes>
            </BrowserRouter>
          </AppProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
  </LanguageProvider>
);

export default App;