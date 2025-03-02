module.exports = {
  extends: [
    "./base.js",
    "plugin:@next/next/core-web-vitals",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ],
  settings: {
    react: {
      version: "detect"
    }
  },
  rules: {
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "@next/next/no-html-link-for-pages": "off",
    "react/no-unknown-property": ["error", { ignore: ["css"] }]
  },
  overrides: [
    {
      files: ["app/**/*.ts?(x)", "pages/**/*.ts?(x)"],
      rules: {
        "import/no-default-export": "off"
      }
    }
  ]
}
