import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import multer from 'multer';

const NODE_ENV = process.env.NODE_ENV || 'development';

function buildCorsOrigins() {
  return [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    process.env.REACT_NATIVE_URL || 'http://localhost:8081',
    'http://localhost:19006',
    'http://127.0.0.1:8081',
    'http://127.0.0.1:19006',
    'http://127.0.0.1:5173',
  ].filter(Boolean);
}

function isDevLocalOrigin(origin) {
  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
}

function createCorsMiddleware() {
  const frontendOrigins = buildCorsOrigins();

  return cors({
    origin(origin, callback) {
      if (!origin) {
        return callback(null, true);
      }
      if (frontendOrigins.includes(origin)) {
        return callback(null, true);
      }
      if (NODE_ENV !== 'production' && isDevLocalOrigin(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  });
}

function createApiLimiter() {
  return rateLimit({
    windowMs: 10 * 60 * 1000,
    max: NODE_ENV === 'production' ? 100 : 500,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, error: 'Too many requests from this IP, please try again later.' },
  });
}

function createAuthLimiter() {
  return rateLimit({
    windowMs: 5 * 60 * 1000,
    max: NODE_ENV === 'production' ? 5 : 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, error: 'Too many login/signup attempts from this IP, please try again later.' },
  });
}

/**
 * Body parsers, cookies, logging, static assets, CORS, and rate limits.
 * Must run before route registration. CORS runs before rate limiting
 * so error responses still include CORS headers.
 */
export function applyGlobalMiddleware(app) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  if (NODE_ENV === 'production') {
    app.use(express.static('public'));
    app.use(helmet());
    app.use(morgan('combined'));
  } else {
    app.use(morgan('dev'));
  }

  app.use(createCorsMiddleware());

  const apiLimiter = createApiLimiter();
  const authLimiter = createAuthLimiter();
  app.use('/api', apiLimiter);
  app.use('/api/user/login', authLimiter);
  app.use('/api/user/signup', authLimiter);
}

/**
 * Central error handler (must be registered after all routes).
 */
export function applyErrorMiddleware(app) {
  app.use((err, req, res, _next) => {
    if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'Image size must be 10 MB or less.',
      });
    }

    if (err?.status === 400) {
      return res.status(400).json({
        success: false,
        error: err.message,
      });
    }

    const { status = 500, message = 'some error' } = err;
    return res.status(status).json({
      success: false,
      error: message,
    });
  });
}
