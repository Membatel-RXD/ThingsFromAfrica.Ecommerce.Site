import React from "react";
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

const navigationItems: NavigationItem[] = [
  { path: "/profile", label: "Profile", icon: User },
  { path: "/profile/payments", label: "Payments", icon: CreditCard },
  { path: "/profile/user/addresses", label: "Addresses", icon: MapPinned },
  { path: "/profile/user/my-orders", label: "Orders", icon: Package },
  { path: "/profile/promotions", label: "Promotions", icon: Gift },
  { path: "/profile/shipments", label: "Shipments", icon: Truck },
  { path: "/profile/wishlist", label: "Wishlist", icon: Heart },
  { path: "/profile/notifications", label: "Notifications", icon: Bell },
  { path: "/profile/security", label: "Security", icon: Shield },
  { path: "/profile/settings", label: "Settings", icon: Settings },
];

type AccountSidebarProps = {
  activePath?: string; // pass current active path to highlight link
};

const AccountSidebar: React.FC<AccountSidebarProps> = ({ activePath }) => {
  return (
    <div className="w-64 flex-shrink-0">
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-black">Account Menu</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePath === item.path;

            return (
              <a
                key={item.path}
                href={item.path}
                className={`flex items-center w-full px-4 py-3 text-left rounded-lg transition-colors  ${
                  isActive ? "bg-black text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </a>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountSidebar;
