// load ENV file
require('dotenv').config();
import { systemLogger } from './logger';
import express from 'express';
const app = express();
import db from './app/models';
import { addArticle } from './app/queues/article.queue';
import { getJournalMetaData } from './app/validation/crossref.validation';
import { addJournal } from './app/queues/journal.queue';


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
  res.json({"message": "Welcome to the server"})
});

// // Main route
app.get('/add-journal', async (req, res) => {
 
  // add a job to the journal queue to add the journal. 
  const journal = {
    issn: req.body.issn,
  };
  console.log(journal)
  //  addJournal(journal)
  // await getDOIs(req.body.issn);
  res.send({status: 'ok'});

});


// Other routes
require('./app/routes/journals.routes')(app);
require('./app/routes/articles.routes')(app);

export default app