import express, { Request, Response, urlencoded, json } from 'express';
import cron from 'node-cron';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import { config } from './config';
import { logger } from './config/logger';
import pinoHttp from 'pino-http';
import morgan from 'morgan';
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
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}));

app.use(compression());
app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }));

const stream = {
  write: (message: string) => logger.info(message.trim() + '\n')
};
app.use(morgan('combined', { stream }));


app.use(cookieParser());
app.use(express.json());
app.use(urlencoded({ extended: true }));

app.use(pinoHttp({ logger }));
app.use(errorHandler);
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: config.env,
    version: process.env.npm_package_version || '1.0.0'
  });
});



// Cron jobs are now initialized in server.ts

const v1Router = express.Router();
app.use('/uploads', express.static('uploads'));



app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
RegisterRoutes(v1Router);


app.use('/v1', apiRateLimiter, v1Router);




app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('❌ Global Error Handler:', {
    error: error.message,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    url: req.url,
    method: req.method,
    contentType: req.get('Content-Type')
  });

  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File too large. Maximum size is 10MB.'
    });
  }

  if (error.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      success: false,
      message: 'Unexpected file field. Expected field name: "file"'
    });
  }

  const statusCode = error.statusCode || error.status || 500;

  res.status(statusCode).json({
    success: false,
    message: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && {
      stack: error.stack,
      details: error
    })
  });
});




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


export { app };


