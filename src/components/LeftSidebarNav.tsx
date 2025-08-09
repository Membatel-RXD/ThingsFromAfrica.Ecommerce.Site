import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { User, CreditCard, MapPinned, Package, Gift, Truck, Heart, Bell, Shield, Settings } from "lucide-react";

type NavigationItem = {
  path: string;
  label: string;
  icon: React.ElementType;
  isActive?: boolean;
};
const NavigationLink = ({ path, label, icon: Icon, isActive = false }) => (
    <button
      onClick={() => navigate(path)}
      className={`flex items-center w-full px-4 py-3 text-left rounded-lg transition-colors ${
        isActive
          ? 'bg-black text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      <Icon className="h-5 w-5 mr-3" />
      {label}
    </button>
  );

const getNavigationItems = (t: any): NavigationItem[] => [
  { path: "/profile", label: t('pages.profile.sidebar.profile'), icon: User },
  { path: "/profile/payments", label: t('pages.profile.sidebar.payments'), icon: CreditCard },
  { path: "/profile/user/addresses", label: t('pages.profile.sidebar.addresses'), icon: MapPinned },
  { path: "/profile/user/my-orders", label: t('pages.profile.sidebar.orders'), icon: Package },
  { path: "/coupons", label: t('pages.profile.sidebar.promotions'), icon: Gift },
  { path: "/profile/shipments", label: t('pages.profile.sidebar.shipments'), icon: Truck },
  { path: "/profile/wishlist", label: t('pages.profile.sidebar.wishlist'), icon: Heart },
  { path: "/profile/settings", label: t('pages.profile.sidebar.settings'), icon: Settings },
];

type AccountSidebarProps = {
  activePath?: string; // pass current active path to highlight link
};

const AccountSidebar: React.FC<AccountSidebarProps> = ({ activePath }) => {
  const { t } = useTranslation();
  const navigationItems = getNavigationItems(t);
  
  return (
    <div className="w-64 flex-shrink-0">
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-black">{t('pages.profile.sidebar.accountMenu')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePath === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center w-full px-4 py-3 text-left rounded-lg transition-colors  ${
                  isActive ? "bg-black text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountSidebar;
