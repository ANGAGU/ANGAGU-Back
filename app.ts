import express, { Request, Response } from 'express';
import path from 'path';
import createError from 'http-errors';
import session from 'express-session';
import indexRouter from './routes/index';
import usersRouter from './routes/users';
import customerRouter from './routes/customer';
import companyRouter from './routes/company';
import adminRouter from './routes/admin';

export default class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.app.use(session({
      secret: 'asadlfkj!@#!@#dfgasdg',
      resave: false,
      saveUninitialized: true,
    }));
    this.app.set('views', path.join(__dirname, 'views'));
    this.app.set('view engine', 'jade');

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(express.static(path.join(__dirname, 'public')));
    this.router();
    // catch 404 and forward to error handler
    this.app.use((req, res, next) => {
      next(createError(404));
    });

    // error handler
    this.app.use((err:any, req:Request, res:Response) => {
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};

      // render the error page
      res.status(err.status || 500);
      res.render('error');
    });
  }

  private router() {
    this.app.use('/', indexRouter);
    this.app.use('/users', usersRouter);
    this.app.use('/customer', customerRouter);
    this.app.use('/company', companyRouter);
    this.app.use('/admin', adminRouter);
  }
}
