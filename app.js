const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const projectRouter = require('./routes/projectRoutes');
const userRouter = require('./routes/userRoutes');
const notifRouter = require('./routes/notifRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 1) MIDDLEWARE
// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

//Set security HTTP Headers
app.use(helmet());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit number of request per hour
const limiter = rateLimit({
  max: 600,
  windowMS: 60 * 60 * 1000,
  message: 'Too many request fomr this IP, please try again in an hour',
});

app.use('/api', limiter);

// Body parser
app.use(express.json({ limit: '10Mb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization agaisnt xss
app.use(xss());

//Prevent parameter pollution
app.use(
  hpp({
    whitelist: ['material'],
  })
);

app.use(compression());

// 3) ROUTES

app.use('/', viewRouter);
app.use('/api/v1/projects', projectRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/notifications', notifRouter);

// 4) HANDLING INEXISTENT ROUTES
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find the requested page on this server!`, 404));
});

// 5) ERROR HANDLING MIDDLEWARE
app.use(globalErrorHandler);

module.exports = app;
