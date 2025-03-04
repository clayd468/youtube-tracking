import cluster from 'cluster';
import os from 'os';

const totalCores = Math.floor(os.cpus().length / 2);

if (cluster.isPrimary) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers
  for (let i = 0; i < totalCores; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
    console.log('Starting a new worker');
    cluster.fork();
  });
} else {
  console.log(`Worker ${process.pid} started`);
  // Include the worker script to process jobs
  require('./utils/queue'); // Ensure this path correctly points to your worker script
}
