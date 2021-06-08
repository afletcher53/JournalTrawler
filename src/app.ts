// load ENV file
require('dotenv').config();
import { systemLogger } from './logger';
import express from 'express';
const app = express();
import db from './app/models';
import { fetchDOIsFromISSN } from './app/requests/crossref.service';


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

const Article = db.articles;
const Integrity = db.integrity;
app.get('/test', async (req: express.Request, res: express.Response) => {
  let issn: string = "1939-1676"
  const crossrefDOISfromISSN = await fetchDOIsFromISSN(encodeURI(issn))
  let crossrefISSNDOIlist = []
  crossrefDOISfromISSN.forEach((e)=> {
    crossrefISSNDOIlist.push(e['DOI'])
  })
  
  console.log(crossrefISSNDOIlist)

  const missingDOIs = await generateMissingDOIList(crossrefISSNDOIlist)
  let obj = {
    data: missingDOIs, 
    issn: issn
  }
  if(missingDOIs.length > 0){
  const integrity = new Integrity({
    code: 1,
    message: "There are " + missingDOIs.length + " DOIS missing for ISSN: " + issn,
    data: obj,
  });

  integrity.save(integrity)
  } else {
    const integrity = new Integrity({
      code: 2,
      message: "There are no missing DOIS missing for ISSN: " + issn,
      data: null,
    });
  
    integrity.save(integrity)
  }
});

const generateMissingDOIList = async (listtoCheck: Array<string>): Promise<string[]> => {
  let doesntExist: Array<string> = []

  for (let i = 0; i <= listtoCheck.length-1; i++) {
    const docCount: number = await Article.countDocuments({ doi: listtoCheck[i] }).exec();
    if (docCount != 1) doesntExist.push(listtoCheck[i])
  }
  // listtoCheck.forEach(async (e) => {
  //   const docCount: number = await Article.countDocuments({ doi: e }).exec();
  //   if (docCount != 1) doesntExist.push(e)
  // })
  return doesntExist
}

// Other routes
require('./app/routes/journals.routes')(app);
require('./app/routes/articles.routes')(app);
require('./app/routes/integrities.routes')(app);
export default app