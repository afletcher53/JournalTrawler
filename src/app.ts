// load ENV file
require('dotenv').config();
import express from 'express';
import systemLogger from './app/loggers/system.logger';
import db from './app/models';
import exportData from './app/utils/export-data';
import sendEmail from './app/utils/send-email';
import wipeall from './app/utils/wipe-data';
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

// db.mongoose.set('debug', true);

// Main route
app.get('/', (req: express.Request, res: express.Response) => {
  res.json({"message": "Welcome to the server"})
});

// Nuclear wipe 
app.get('/nuclearwipe', (req: express.Request, res: express.Response) => {
  wipeall()
  res.json({"message": "Everything has been wipped"})
});

// Nuclear wipe 
app.get('/backup', (req: express.Request, res: express.Response) => {
  exportData()
  sendEmail()
  res.json({"message": "Backups are being prepared"})
});



// Other routes
require('./app/routes/journals.routes')(app);
require('./app/routes/articles.routes')(app);
require('./app/routes/integrities.routes')(app);


export default app

