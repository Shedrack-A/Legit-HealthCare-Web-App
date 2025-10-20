import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the shape of the context data
interface GlobalFilterContextType {
  companySection: string;
  setCompanySection: (company: string) => void;
  screeningYear: number;
  setScreeningYear: (year: number) => void;
}

// Create the context with a default value
export const GlobalFilterContext = createContext<
  GlobalFilterContextType | undefined
>(undefined);

// Create a provider component
interface GlobalFilterProviderProps {
  children: ReactNode;
}

const generateYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = currentYear - 5; year <= currentYear + 10; year++) {
    years.push(year);
  }
  return years;
};

export const GlobalFilterProvider: React.FC<GlobalFilterProviderProps> = ({
  children,
}) => {
  const [companySection, setCompanySection] = useState('DCP');
  const [screeningYear, setScreeningYear] = useState(new Date().getFullYear());

  const value = {
    companySection,
    setCompanySection,
    screeningYear,
    setScreeningYear,
  };

  return (
    <GlobalFilterContext.Provider value={value}>
      {children}
    </GlobalFilterContext.Provider>
  );
};

// Create a custom hook to use the context
export const useGlobalFilter = () => {
  const context = useContext(GlobalFilterContext);
  if (context === undefined) {
    throw new Error(
      'useGlobalFilter must be used within a GlobalFilterProvider'
    );
  }
  return context;
};

// Export years array for use in dropdowns
export const screeningYears = generateYears();
