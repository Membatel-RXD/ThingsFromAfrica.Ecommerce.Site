import { MapPin } from "lucide-react";

function LocationWidget() {
  // Static location - no API calls
  const city = "Blantyre";

  return (
    <div className="hidden md:flex items-center space-x-1 hover:bg-gray-800 px-2 py-1 rounded cursor-pointer">
      <MapPin className="h-4 w-4" />
      <div className="text-xs">
        <div className="text-gray-300">Deliver to</div>
        <div className="font-medium">{city} 265</div>
      </div>
    </div>
  );
}

export default LocationWidget;