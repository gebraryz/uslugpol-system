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
    rental: "/samochody",
  },

  cleaning: {
    index: "/sprzatanie",
  },
};
