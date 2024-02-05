import generateAliasesResolver from 'esm-module-alias';

const aliases = {
  "config": "./src/config",
  "controllers": ".src/controllers",
  "database": "./src/database" ,
  "modules": "./src/modules" ,
  "types": "./src/types/",
  "middlewares": "./src/middlewares",
  "routes": "./src/routes",
  "services": "./src/services" ,
};

export const resolve = generateAliasesResolver(aliases);
