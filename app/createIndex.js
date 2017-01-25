var es=require('elasticsearch');
var client = new es.Client(
	{
		host:'localhost:9200',
		log:'trace'
	}
);


client.indices.create({
    index: "temple_doc_index",
    body: {
	"mappings": {
		"templeDoc": {
		    "properties": {
			"id": { "type": "integer", "index": "not_analyzed" },
			"d": { "type": "string", "index": "not_analyzed" },
			"pl": { "type": "string", "index": "not_analyzed" },
			"pan": { "type": "string", "index": "not_analyzed" },
			"nc": { "type": "string", "index": "analyzed" },
			"htr": { "type": "string", "index": "analyzed" },
			"md": { "type": "string", "index": "not_analyzed" },
			"df": { "type": "string", "index": "analyzed" },
			"odd": { "type": "string", "index": "analyzed" },
			"sd": { "type": "string", "index": "analyzed" },
			"p": { "type": "integer", "index": "not_analyzed" },
			"dfa": { "type": "string", "index": "not_analyzed" },
			"r": { "type": "string", "index": "analyzed" },
			"nt": { "type": "string", "index": "analyzed" },
			"m": { "type": "string", "index": "not_analyzed" },
			"t": { "type": "string", "index": "not_analyzed" },
			"f": { "type": "string", "index": "analyzed" },
			"om": { "type": "string", "index": "analyzed" },
			"h": { "type": "string", "index": "analyzed" }
		    }
		}
	}
    }
}, function(err,resp,respcode){
    console.log(err,resp,respcode);
});
