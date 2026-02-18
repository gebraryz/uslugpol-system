export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "scope-enum": [
      2,
      "always",
      ["core", "event-service", "car-service", "db", "docs", "shared"],
    ],
  },
};
