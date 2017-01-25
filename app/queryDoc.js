var es=require('elasticsearch');
var client = new es.Client(
	{
		host:'localhost:9200',
		log:'trace'
	}
);

const search = function search(index, body) {
  return client.search({index: index, body: body});
};

let body = {
    size: 20,
    from: 0,
    query: {
      match_all: {}
    }
  };

search('temple_doc_index', body)
  .then(results => {
    console.log(`found ${results.hits.total} items in ${results.took}ms`);
    console.log(`returned items:`);
    results.hits.hits.forEach(
      (hit, index) => console.log(
        //`\t${body.from + ++index} - ${hit._source}`
        //hit._source
        hit
      )
    )
  })
  .catch(console.error);