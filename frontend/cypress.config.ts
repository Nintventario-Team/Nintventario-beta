import { defineConfig } from "cypress";
import { addCucumberPreprocessorPlugin } from '@badeball/cypress-cucumber-preprocessor';
import createBundler from '@bahmutov/cypress-esbuild-preprocessor';
import createEsbuildPlugin from '@badeball/cypress-cucumber-preprocessor/esbuild';

export default defineConfig({
  component: {
    devServer: {
      framework: "angular",
      bundler: "webpack",
    },
    specPattern: "**/*.cy.ts",
  },
  e2e: {
    async setupNodeEvents(on, config) {
      // Implement node event listeners here
      await addCucumberPreprocessorPlugin(on, config);

      on(
        "file:preprocessor",
        createBundler({
          plugins: [createEsbuildPlugin(config)],
        })
      );

      return config;
    },
    specPattern: "cypress/e2e/**/*.feature",  // Asegúrate de que el specPattern esté configurado para buscar archivos .feature
    baseUrl: "http://localhost:4200",         // Ajusta la URL base para que coincida con tu entorno de desarrollo
    supportFile: false,
    




  },
});
