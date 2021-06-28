
import express from 'express';
import systemLogger from './app/loggers/system.logger';
import db from './app/models';
import articleRoutes from './app/routes/articles.routes';
import journalRoutes from './app/routes/journals.routes';
import integrityRoutes from './app/routes/integrities.routes';
import scriptsRoutes from './app/routes/scripts.routes';
import getActualRequestDurationInMilliseconds from './middleware/functions/getActualRequestDurationInMilliseconds';

const app = express();

// Middlewares
app.use(require('./middleware'));

db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    systemLogger.info('Connected to the database!');
  })
  .catch((err: Error) => {
    systemLogger.error('Cannot connect to the database!', err);
    process.exit();
  });

// Main route
app.get('/', (req: express.Request, res: express.Response) => {
  res.json({ 'message': 'Welcome to the server' });
});

articleRoutes(app);
integrityRoutes(app);
journalRoutes(app);
scriptsRoutes(app);

console.log(process.hrtime())
console.log(getActualRequestDurationInMilliseconds(process.hrtime()))
export default app;

