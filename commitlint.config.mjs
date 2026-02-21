export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "scope-enum": [
      2,
      "always",
      [
        "web",
        "core",
        "event-service",
        "car-service",
        "db",
        "docs",
        "shared",
        "config",
      ],
    ],
  },
};
