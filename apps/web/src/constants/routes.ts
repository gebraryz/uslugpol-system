export const ROUTES = {
  core: {
    leads: "/",
    leadDetails: (leadId: string) => `/${leadId}`,
  },

  events: {
    leads: "/wydarzenia",
    leadDetails: (leadId: string) => `/wydarzenia/${leadId}`,
  },

  vehicles: {
    index: "/samochody",
    leads: "/samochody/leady",
    recommendations: "/samochody/rekomendacje",
  },

  cleaning: {
    index: "/sprzatanie",
  },
};
