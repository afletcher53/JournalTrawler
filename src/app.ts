// load ENV file
require('dotenv').config();
import express from 'express';
import db from './app/models';
import wipeall from './app/scripts/wipe-data';
import { mongoDBLogger, systemLogger } from './logger';
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

db.mongoose.set('debug', function (collectionName: string, method: string, query: string, doc: any) {
  console.log(`${collectionName}.${method}`, JSON.stringify(query), doc)
  query = JSON.stringify(collectionName + '.' + method + '(' + JSON.stringify(query) + ',' + JSON.stringify(doc) + ")");
  mongoDBLogger.info(query);  
});

// Main route
app.get('/', (req: express.Request, res: express.Response) => {
  res.json({"message": "Welcome to the server"})
});

// Nuclear wipe 
app.get('/nuclearwipe', (req: express.Request, res: express.Response) => {
  wipeall()
  res.json({"message": "Everything has been wipped"})
});

// 
// // app.get('/test', (req: express.Request, res: express.Response) => {
// //   const redis = new Redis();
// //   redis.on('ready',function(){
// //     res.json({"message" : redis.status})
// //     });
 
// // });


// Other routes
require('./app/routes/journals.routes')(app);
require('./app/routes/articles.routes')(app);
require('./app/routes/integrities.routes')(app);


export default app

