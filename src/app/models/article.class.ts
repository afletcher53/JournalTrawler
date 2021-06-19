
import { mongoArticleFindWhere } from "../requests/mongoose.service";


export default class Article {
    [x: string]: any;
    doi: string;

    constructor(doi: string){
        this.doi = doi
        this.init()        
    }

    async init() {
       const result = await mongoArticleFindWhere({doi: this.doi})
       this.id = result
    }   
    store() {
        
    }

    update(){

    }

    async get() {
        return this.id
    }

    delete(){

    }

    async checkExistsInDatabase() {
        var result = await mongoArticleFindWhere({doi: this.doi})
        return (result.length > 0 ? true : false)
    }
}
