import { Job } from 'bull';
export declare const Article: any;
export declare const Journal: any;
/**
 * Add Article Job to the redis queue
 * @param job from the queue calling it.
 * NB job.data.code refers to the type of integrity check that you need, 1 = Missing DOIs, 2 = Percentage incomplete fields
 */
declare const integrityProcess: (job: Job) => Promise<void>;
export default integrityProcess;
export declare function convert(obj: {
    [x: string]: number;
    _id?: number;
    crossref_url?: number;
    journal_issn_electronic?: number;
    journal_issn_print?: number;
    publisher?: number;
    reference_count?: number;
    is_referenced_by_count?: number;
    published_online?: number;
    published_print?: number;
    type?: number;
    abstract?: number;
    title?: number;
    url?: number;
    doi?: number;
    license?: number;
    cr_parsed?: number;
    journal?: number;
    createdAt?: number;
    updatedAt?: number;
}, articleCount: number): {
    name: string;
    value: number;
    percentage: number;
}[];
//# sourceMappingURL=integrity.process.d.ts.map