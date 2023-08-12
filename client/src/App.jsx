import Homepage from "./pages/Homepage";
import Booking from "./pages/Booking";
import useAppDataStore from "./store/appDataStore";
import "./App.css";

export default function App() {
  const {activeTab} = useAppDataStore()

  switch (activeTab) {
    case "home":
      return <Homepage />;
    case "booking":
      return <Booking />;

    default:
      return <Homepage />;
  }
}
