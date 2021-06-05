import { Job } from 'bull';
import { Article } from './article.process';

export function addArticle(job: Job<any>) {
  return new Article({
    publisher: job.data.publisher ? job.data.publisher : 0,
    reference_count: job.data['reference-count'] ? job.data['reference-count'] : 0,
    is_referenced_by_count: job.data['is-referenced-by-count'] ? job.data['is-referenced-by-count'] : null,
    published_online: job.data['published-online']['date-parts'] ? job.data['published-online']['date-parts'] : null,
    type: job.data.type ? job.data.type : null,
    abstract: job.data.abstract ? job.data.abstract : null,
    title: job.data.title ? String(job.data.title) : null,
    url: job.data['URL'] ? job.data['URL'] : null,
    doi: job.data['DOI'] ? job.data['DOI'] : null,
  });
}
