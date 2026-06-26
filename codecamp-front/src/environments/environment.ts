// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  // Base URL of the API. Empty string means "same origin" (the built SPA is
  // served by the API itself from server/public). When running `ng serve` on
  // port 4200 during development, point this at the API host instead.
  apiBase: 'http://localhost:80'
};
