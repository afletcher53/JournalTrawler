import JSONAPISerializer from 'json-api-serializer';
const Serializer = new JSONAPISerializer();
Serializer.register('article', {
  id: 'id', // The attributes to use as the reference. Default = 'id'.
  whitelist: ['doi', 'title', 'journal', 'abstract', 'license', 'journal'],
  links: {
    // An object or a function that describes links.
    self: function(data) {
      // Can be a function or a string value ex: { self: '/articles/1'}
      return '/api/articles/' + data.id;
    },
  },
  topLevelMeta: function(data, extraData) {
    // An object or a function that describes top level meta.
    return {
      count: extraData.count,
      total: data.length,
    };
  },
  topLevelLinks: {
    // An object or a function that describes top level links.
    self: '/api/articles',
  },
});

Serializer.register('integrity', {
  id: 'id', // The attributes to use as the reference. Default = 'id'.
  whitelist: ['data', 'issn', 'message', 'journal', 'createdAt', 'updatedAt'],
  links: {
    // An object or a function that describes links.
    self: function(data) {
      // Can be a function or a string value ex: { self: '/articles/1'}
      return '/api/integrities/' + data.id;
    },
  },
  topLevelMeta: function(data, extraData) {
    // An object or a function that describes top level meta.
    return {
      count: extraData.count,
      total: data.length,
    };
  },
  topLevelLinks: {
    // An object or a function that describes top level links.
    self: '/api/integrities',
  },
});

Serializer.register('journal', {
  id: 'id', // The attributes to use as the reference. Default = 'id'.
  whitelist: ['title', 'journal',
    'issn', 'issn_electronic', 'issn_print', 'publisher', 'subject',
    'asjc', 'counts_totaldois', 'counts_currentdois', 'counts_backfiledois',
    'createdAt', 'updatedAt', 'cr_parsed', 'articles', 'totalArticles'],
  links: {
    // An object or a function that describes links.
    self: function(data) {
      // Can be a function or a string value ex: { self: '/articles/1'}
      return '/api/journals/' + data.id;
    },
  },
  topLevelMeta: function(data, extraData) {
    // An object or a function that describes top level meta.
    return {
      count: extraData.count,
      total: data.length,
    };
  },
  topLevelLinks: {
    // An object or a function that describes top level links.
    self: '/api/journals',
  },
});

export default Serializer
module.exports= Serializer;

