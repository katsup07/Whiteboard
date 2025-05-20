const fs = require('fs');

// Default config without polling
const baseConfig = {
  watch: ["src/"],
  ext: "js,ts,json",
  ignore: ["node_modules/", "logs/", "dist/"]
};

// Docker-specific config with polling, needed for Docker on Windows for live updates
const dockerConfig = {
  ...baseConfig,
  exec: "node --require ts-node/register src/main.ts",
  polling: true,
  legacyWatch: true,
  delay: 500
};

const config = process.env.DOCKER_ENVIRONMENT === 'true' ? dockerConfig : baseConfig;

fs.writeFileSync('nodemon.json', JSON.stringify(config, null, 2));

console.log(`Nodemon configured for ${process.env.DOCKER_ENVIRONMENT === 'true' ? 'Docker' : 'local'} environment`);