// src/utils/helpers/shipRoutes.js

export const PH_PORTS = [
  { value: "manila", label: "Manila" },
  { value: "subic", label: "Subic" },
  { value: "batangas", label: "Batangas" },
  { value: "cebu", label: "Cebu" },
  { value: "iloilo", label: "Iloilo" },
  { value: "bacolod", label: "Bacolod" },
  { value: "davao", label: "Davao" },
  { value: "cagayan-de-oro", label: "Cagayan de Oro" },
  { value: "general-santos", label: "General Santos" },
  { value: "zamboanga", label: "Zamboanga" }
];

// Utility to map a value back to a port object
export const getPortByValue = (value) => {
  return PH_PORTS.find((port) => port.value === value);
};
