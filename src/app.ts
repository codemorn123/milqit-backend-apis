import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import { config } from './config';
import { logger } from './config/logger';
import pinoHttp from 'pino-http';
import morgan from 'morgan';
import { RegisterRoutes } from '../build/routes';
import adminCategoryRoutes from './routes/admin/category.routes';
import adminProductRoutes from './routes/admin/productRoutes';

import cookieParser from 'cookie-parser';
import { getPresentableError, PresentableError } from './error/clientErrorHelper';
// import { errorHandler } from './utils/errorHandler';
import errorHandler from './middleware/error';
const app = express();

// Set up logging middleware
app.use(pinoHttp({
  logger,
  autoLogging: {
    ignore: req => req.url === '/health'
  }
}));

// Security and utility middleware
app.use(helmet({
  // Allow Swagger UI to function properly
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:"]
    }
  }
}));

app.use(cors({
  origin: config.cors.origin,
  credentials: true
}));

app.use(compression());
app.use(bodyParser.json({ limit: '1mb' }));
// app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }));

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));



const stream = {
	write: (message: string) => logger.info(message.trim() + '\n')
};
app.use(morgan('combined', { stream }));

// enable cors
app.use(
	cors({
		origin: '*',
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
		credentials: true
	})
);

// parse cookies
app.use(cookieParser());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));
app.use(pinoHttp({ logger }));
// app.use(errorHandler);
app.use(errorHandler);
// timezone
// app.use(timezone);
// app.use(expressErrorHandler);
// Health check endpoint
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: config.env,
    version: process.env.npm_package_version || '1.0.0'
  });
});










// Middleware


const v1Router = express.Router();
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/v1/admin/categories', adminCategoryRoutes);
app.use('/v1/admin/products', adminProductRoutes);
RegisterRoutes(v1Router);
app.use('/v1', v1Router); 





  const swaggerOptions = {
  swaggerOptions: {
    persistAuthorization: true,
    securityDefinitions: {
      jwt: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header'
      }
    }
  }
};
app.use('/docs', swaggerUi.serve, async (_req, res) => {
  return res.send(
    swaggerUi.generateHTML(await import('../build/swagger.json'),swaggerOptions)
  );
});

// Admin Swagger (separate documentation)
app.use('/admin-docs', swaggerUi.serve, async (_req, res) => {
  const swaggerDoc = await import('../build/swagger.json');
  // Filter only admin routes
  const adminSwagger = {
    ...swaggerDoc,
    paths: Object.keys(swaggerDoc.paths)
      .filter(path => path.startsWith('/admin'))
      .reduce((obj, key) => {
        obj[key] = swaggerDoc.paths[key];
        return obj;
      }, {})
  };
  
  return res.send(swaggerUi.generateHTML(adminSwagger));
});

// Mobile Swagger (separate documentation)
app.use('/mobile-docs', swaggerUi.serve, async (_req, res) => {
  const swaggerDoc = await import('../build/swagger.json');
  // Filter only mobile routes
  const mobileSwagger = {
    ...swaggerDoc,
    paths: Object.keys(swaggerDoc.paths)
      .filter(path => path.startsWith('/mobile'))
      .reduce((obj, key) => {
        obj[key] = swaggerDoc.paths[key];
        return obj;
      }, {})
  };
  
  return res.send(swaggerUi.generateHTML(mobileSwagger));
});

export { app };