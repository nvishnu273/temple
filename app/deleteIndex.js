var es=require('elasticsearch');
var client = new es.Client(
	{
		host:'localhost:9200',
		log:'trace'
	}
);

client.indices.delete({
    index: 'temple_doc_index'
}, function(err, res) {

    if (err) {
        console.error(err.message);
    } else {
        console.log('Indexes have been deleted!');
    }
});

