import { Injectable } from '@nestjs/common';

const cluster = require('cluster'); 
import * as process from 'node:process';
const numCPUs = require('os').cpus().length / 2;

@Injectable()
export class ClusterService {
    static clusterize(callback: Function): void {
      if (cluster.isMaster) {
        console.log(`MASTER SERVER (${process.pid}) IS RUNNING`);
  
        for (let i = 1; i < numCPUs; i++) {
          cluster.fork();
        }
  
        cluster.on('exit', (worker, code, signal) => {
          console.log(`Worker ${worker.process.pid} died`);
          cluster.fork();
        });
      } else {
        callback();
      }
    }
  }