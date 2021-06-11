// load ENV file
require('dotenv').config();
import express from 'express';
import { systemLogger } from './app/loggers/logger';
import db from './app/models';
import wipeall from './app/scripts/wipe-data';
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

db.mongoose.set('debug', true);

// Main route
app.get('/', (req: express.Request, res: express.Response) => {
  res.json({"message": "Welcome to the server"})
});

// Nuclear wipe 
app.get('/nuclearwipe', (req: express.Request, res: express.Response) => {
  wipeall()
  res.json({"message": "Everything has been wipped"})
});



// Other routes
require('./app/routes/journals.routes')(app);
require('./app/routes/articles.routes')(app);
require('./app/routes/integrities.routes')(app);


export default app

