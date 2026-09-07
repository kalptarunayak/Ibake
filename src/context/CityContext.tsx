import React, { createContext, useContext, useEffect, useState } from 'react';
import { cityApi } from '../api/cityApi';
import { City } from '../types';

interface CityContextType {
  selectedCity: string;
  selectedCityObj: City | null;
  cities: City[];
  activeCities: City[];
  isCityModalOpen: boolean;
  setCityModalOpen: (open: boolean) => void;
  selectCity: (cityName: string) => void;
  refreshCities: () => Promise<void>;
  loading: boolean;
}

const CITY_STORAGE_KEY = 'ibake_selected_city';

const CityContext = createContext<CityContextType | undefined>(undefined);

export const CityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedCity, setSelectedCity] = useState<string>(() => {
    return localStorage.getItem(CITY_STORAGE_KEY) || '';
  });
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isCityModalOpen, setCityModalOpen] = useState<boolean>(false);

  const fetchCities = async () => {
    setLoading(true);
    try {
      const data = await cityApi.getCities(false);
      setCities(data);

      // If user had no selected city or selected city is no longer active, open modal
      const savedCity = localStorage.getItem(CITY_STORAGE_KEY);
      const activeList = data.filter((c) => c.isActive);

      if (!savedCity) {
        setCityModalOpen(true);
      } else {
        const stillActive = activeList.some(
          (c) => c.name.toLowerCase() === savedCity.toLowerCase()
        );
        if (!stillActive && activeList.length > 0) {
          // Reset to first active city or open modal
          setCityModalOpen(true);
        }
      }
    } catch (err) {
      console.error('Failed to fetch cities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  const selectCity = (cityName: string) => {
    setSelectedCity(cityName);
    localStorage.setItem(CITY_STORAGE_KEY, cityName);
    setCityModalOpen(false);
  };

  const activeCities = cities.filter((c) => c.isActive);
  const selectedCityObj = cities.find((c) => c.name.toLowerCase() === selectedCity.toLowerCase()) || null;

  return (
    <CityContext.Provider
      value={{
        selectedCity,
        selectedCityObj,
        cities,
        activeCities,
        isCityModalOpen,
        setCityModalOpen,
        selectCity,
        refreshCities: fetchCities,
        loading,
      }}
    >
      {children}
    </CityContext.Provider>
  );
};

export const useCity = (): CityContextType => {
  const context = useContext(CityContext);
  if (!context) {
    throw new Error('useCity must be used within a CityProvider');
  }
  return context;
};
