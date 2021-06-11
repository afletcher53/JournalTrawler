import { Job } from 'bull';
export declare const Article: any;
/**
 * Add Article Job to the redis queue
 * @param job from the queue calling it.
 */
declare const articleProcess: (job: Job) => Promise<void>;
export default articleProcess;
//# sourceMappingURL=article.process.d.ts.map