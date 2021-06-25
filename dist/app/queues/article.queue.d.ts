import Bull from "bull";
declare const articleQueue: Bull.Queue<any>;
declare const addArticle: (data: any) => Promise<Bull.Job<any>>;
export { addArticle, articleQueue };
//# sourceMappingURL=article.queue.d.ts.map