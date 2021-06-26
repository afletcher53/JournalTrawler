import JSONAPISerializer from 'json-api-serializer';
const Serializer = new JSONAPISerializer();

Serializer.register('article', {
  id: 'id',
  whitelist: ['doi', 'title', 'journal', 'abstract', 'license', 'journal'],
  links: {

    self: (data) => {
      return '/api/articles/' + data.id;
    },
  },
  topLevelMeta: (data, extraData) => {
    return {
      count: extraData.count,
      total: data.length,
    };
  },
  topLevelLinks: {
    self: '/api/articles',
  },
});

Serializer.register('integrity', {
  id: 'id',
  whitelist: ['data', 'issn', 'message', 'journal', 'createdAt', 'updatedAt'],
  links: {
    self: (data) => {
      return '/api/integrities/' + data.id;
    },
  },
  topLevelMeta: (data, extraData) => {
    return {
      count: extraData.count,
      total: data.length,
    };
  },
  topLevelLinks: {
    self: '/api/integrities',
  },
});

Serializer.register('journal', {
  id: 'id',
  whitelist: ['title', 'journal',
    'issn', 'issn_electronic', 'issn_print', 'publisher', 'subject',
    'asjc', 'counts_totaldois', 'counts_currentdois', 'counts_backfiledois',
    'createdAt', 'updatedAt', 'cr_parsed', 'articles', 'totalArticles'],
  links: {
    self: (data) => {
      return '/api/journals/' + data.id;
    },
  },
  topLevelMeta: (data, extraData) => {
    return {
      count: extraData.count,
      total: data.length,
    };
  },
  topLevelLinks: {
    self: '/api/journals',
  },
});

export default Serializer;


