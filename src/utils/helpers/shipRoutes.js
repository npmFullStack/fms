// src/utils/helpers/shipRoutes.js
export const PH_PORTS = [
    { value: "Manila", label: "Manila", lat: 14.5995, lng: 120.9842 },
    { value: "Subic", label: "Subic", lat: 14.7946, lng: 120.271 },
    { value: "Batangas", label: "Batangas", lat: 13.7565, lng: 121.0583 },
    { value: "Cebu", label: "Cebu", lat: 10.3157, lng: 123.8854 },
    { value: "Iloilo", label: "Iloilo", lat: 10.7202, lng: 122.5621 },
    { value: "Bacolod", label: "Bacolod", lat: 10.6765, lng: 122.9511 },
    { value: "Davao", label: "Davao", lat: 7.1907, lng: 125.4553 },
    {
        value: "Cagayan-de-Oro",
        label: "Cagayan de Oro",
        lat: 8.4542,
        lng: 124.6319
    },
    {
        value: "General-Santos",
        label: "General Santos",
        lat: 6.1164,
        lng: 125.1716
    },
    { value: "Zamboanga", label: "Zamboanga", lat: 6.9214, lng: 122.079 }
];

export const getPortByValue = value => {
    return PH_PORTS.find(port => port.value === value);
};
