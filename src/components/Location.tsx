import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";

function LocationWidget() {
  const [city, setCity] = useState("Loading...");

  useEffect(() => {
    // Get user’s coordinates
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          // Call reverse geocoding API to get city
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          const cityName =
            data.address.city ||
            data.address.town ||
            data.address.village ||
            data.address.county;

          setCity(cityName || "Unknown location");
        },
        (error) => {
          console.error("Geolocation error:", error);
          setCity("Unknown location");
        }
      );
    } else {
      setCity("Geolocation not supported");
    }
  }, []);

  return (
    <div className="hidden md:flex items-center space-x-1 hover:bg-gray-800 px-2 py-1 rounded cursor-pointer">
      <MapPin className="h-4 w-4" />
      <div className="text-xs">
        <div className="text-gray-300">Deliver to</div>
        <div className="font-medium">{city}</div>
      </div>
    </div>
  );
}

export default LocationWidget;
