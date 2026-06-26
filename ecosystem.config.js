module.exports = {
  apps: [
    {
      name: "sos-venezuela",
      cwd: "/var/www/sos-venezuela",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3010",
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};
