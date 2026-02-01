import express, { Request, Response, urlencoded, json } from 'express';
import cron from 'node-cron';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import swaggerUi from 'swagger-ui-express';
import { config } from './config';
import { logger } from './config/logger';
import pinoHttp from 'pino-http';

import { RegisterRoutes } from './generated/routes';
import cookieParser from 'cookie-parser';
import errorHandler from './middleware/error';
import path from 'path';
import upload from './utils/upload';
import { apiRateLimiter } from './middleware/rate-limiter';
import { createServer } from 'http';
const app = express();

const httpServer = createServer(app);

app.use(pinoHttp({
  logger,
  autoLogging: {
    ignore: req => req.url === '/health'
  }
}));

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:"]
    }
  }
}));

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://www.localhost:3000',
  'http://www.localhost:3001',
  'https://admin.milqit.com',
  'https://www.milqit.com',
  config.cors.origin
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1 || config.cors.origin === '*') {
      callback(null, true);
    } else {
      const error = new Error('Not allowed by CORS');
      (error as any).statusCode = 403;
      callback(error);
    }
  },
  credentials: true,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  optionsSuccessStatus: 204,
  maxAge: 86400 // 24 hours
}));

app.use(compression());

// morgan removed in favor of pino-http

// Import timeout middleware
import { requestTimeout, enhancedHealthCheck } from './middleware/timeout';

// Add request timeout (30 seconds) to prevent indefinite hangs
app.use(requestTimeout(30000));

app.use(cookieParser());
app.use(express.json());
app.use(urlencoded({ extended: true }));


// Enhanced health check with database status
app.get('/health', enhancedHealthCheck);



// Cron jobs are now initialized in server.ts

const v1Router = express.Router();




app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
RegisterRoutes(v1Router);


app.use('/v1', apiRateLimiter, v1Router);









app.use('/docs', swaggerUi.serve, async (_req: Request, res: Response) => {
  const swaggerDocument = await import('../build/swagger.json');

  const isDevelopment = false

  const customSwagger = {
    ...swaggerDocument,
    servers: [
      {
        url: isDevelopment ? 'http://localhost:5001/v1' : 'https://api.milqit.com/v1',
        description: isDevelopment ? 'Local Development Server' : 'Production Server'
      },
      // Include both servers for easy switching
      {
        url: isDevelopment ? 'https://api.milqit.com/v1' : 'http://localhost:5001/v1',
        description: isDevelopment ? 'Production Server' : 'Local Development Server'
      }
    ]
  };

  return res.send(swaggerUi.generateHTML(customSwagger));
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: 'Resource not found'
    }
  });
});

// Error handler should be last
app.use(errorHandler);

export { app };


