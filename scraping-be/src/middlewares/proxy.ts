import httpProxy from 'http-proxy';
import { Request, Response } from 'express';
import { HOST, PORT } from '../constants';

// Define the serverProxy function
export const serverProxy = (req: Request, res: Response) => {
  // Create a new instance of httpProxy
  const proxy = httpProxy.createProxyServer({});

  // Proxy the request to the target server
  proxy.web(req, res, {
    target: `${HOST}:${PORT}`,
  });
};
