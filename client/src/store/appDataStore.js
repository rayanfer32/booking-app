import { create } from "zustand";
import zukeeper from "zukeeper";

const useAppDataStore = create(
  zukeeper((set) => ({
    services: [],
    setServices: (services) => set({ services }),
    selectedService: null,
    setSelectedService: (service) => set({ selectedService: service }),
    activeTab: "home",
    setActiveTab: (tab) => set({ activeTab: tab }),
  }))
);

window.store = useAppDataStore;

export default useAppDataStore;
