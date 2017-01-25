var spawn = require("child_process").spawn,
	ls=spawn('ls',['-A1'],{
		cwd:'../docs'
	});
var fs = require('fs');
var es=require('elasticsearch');

var client = new es.Client(
	{
		host:'localhost:9200',
		log:'trace'
	}
);

var Regex = require("regex");

var fieldMapping={
	"id":"id",
	"name":"n",
	"district":"d",
	"place":"pl",
	"panchayat":"pan",
	"nearby city":"nc",
	"how to reach":"htr",
	"main deity":"md",
	"deity features":"df",
	"other deity description":"odd",
	"sub deity":"sd",
	"pooja":"p",
	"deity facing":"dfa",
	"rituals":"r",
	"about temple":"at",
	"nearby temples":"nt",
	"management":"m",
	"tantram":"t",
	"festival":"f",
	"original management":"om",
	"history":"h"};

var fieldMappingMal={
	"id":"id",
	"Name":"n",
	"District":"d",
	"Place":"pl",
	"Panchayat":"pan",
	"Nearby City":"nc",
	"How To Reach":"htr",
	"Main Deity":"md",
	"Deity Features":"df",
	"Other Deity Description":"odd",
	"Sub Deity":"sd",
	"Pooja":"p",
	"Deity Facing":"dfa",
	"Rituals":"r",
	"About Temple":"at",
	"Nearby Temples":"nt",
	"Management":"m",
	"Tantram":"t",
	"Festival":"f",
	"Original Management":"om",
	"History":"h"};
///users/vishnu/apps/temple/docs/
///users/vishnu/apps/temple/docs/
fs.readdir('/users/vishnu/apps/temple/docs/', (err, files) => {
  files.forEach(file => {
    
		if (!file.match(/NOT-COMPLETE/) && file.match(/(.txt)$/)) {
			var id=parseInt(file);
			if (id != NaN) {
					fs.readFile('/users/vishnu/apps/temple/docs/'+file, 'utf8', function(err, data){
					var lines=data.split('\r\n');//split data by lines
					var keys=Object.keys(fieldMapping);
					var item = {};
					for(var i=0;i<keys.length;i++){
						item[fieldMapping[keys[i]]]=null;
					}
					
					item["id"]=id;
					
					for(var j=0;j<lines.length;j++){
				
						var linePair=lines[j].split(':');
						
						if (linePair.length>1){
							var key = linePair[0].trim().toLowerCase();
							var value = linePair[1].trim();
							
							if (typeof fieldMapping[key] !== 'undefined' && fieldMapping[key]!==''){
								if (fieldMapping[key]=='p'){
									var match = value.match(/(-?[0-9]+)/g);
									if (match !== null && parseInt(match[0]) !== NaN ) {
										item[fieldMapping[key]]=parseInt(match[0]);
									}
									continue;
								}
								item[fieldMapping[key]]=value;
							}
						}
					}
					//console.log(item);
					//console.log(es.Client);
					
					client.index({
						index: 'temple_doc_index',
						size:100,
						type:'temple_doc',
						body: item
						}, function (error, response) {
							console.log(error);
					});
				});
			}
			else {
				console.log("Incorrect file name, skipping:" + idValue);
			}	;	
			
		}
  });
})




