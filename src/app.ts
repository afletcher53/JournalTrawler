// load ENV file
require('dotenv').config();
import { systemLogger, mongoDBLogger } from './logger';
import express from 'express';
const app = express();
import db from './app/models';
import wipeall from './app/scripts/wipe-data';



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

db.mongoose.set('debug', true)
db.mongoose.set('debug', function (collectionName, method, query, doc) {
  console.log(`${collectionName}.${method}`, JSON.stringify(query), doc)
  query = collectionName + '.' + method + '(' + JSON.stringify(query) + ',' + JSON.stringify(doc) + ")";
  mongoDBLogger.info(query);  
});

// Main route
app.get('/', (req: express.Request, res: express.Response) => {
  res.json({"message": "Welcome to the server"})
});

app.get('/test', (req: express.Request, res: express.Response) => {
  wipeall()
});

// Other routes
require('./app/routes/journals.routes')(app);
require('./app/routes/articles.routes')(app);
require('./app/routes/integrities.routes')(app);
export default app