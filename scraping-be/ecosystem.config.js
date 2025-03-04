const path = require('path');
module.exports = {
  apps: [
    {
      name: 'worker',
      script: './src/worker.ts',
      instances: 2, // Run only one instance of the worker
      exec_mode: 'fork', // Use 'fork' mode since the script manages clustering
      autorestart: true, // Automatically restart the worker if it crashes
      watch: false, // Disable file watching
      max_memory_restart: '1G', // Restart the worker if it exceeds 1GB memory usage
      interpreter: path.join(__dirname, 'node_modules', '.bin', 'ts-node'),
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
