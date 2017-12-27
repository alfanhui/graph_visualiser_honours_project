import { PostQuery } from 'api/dbConnection';

/* Rich (KryptoniteDove) suggested this function to parse JSON objects correctly.
*  https://codepen.io/KryptoniteDove/post/load-json-file-locally-using-pure-javascript
*/
export function loadJSON(callback) {
	let xobj = new XMLHttpRequest();
	xobj.overrideMimeType("application/json");
    xobj.open('GET', 'utilities/10808.json', true);
	xobj.onreadystatechange = function () {
		if (xobj.readyState == 4 && xobj.status == "200") {
			// Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
			callback(xobj.responseText);
		}
	};
	xobj.send(null);
}

export function graphMLtoCypher(jsonObj){
    let nodeParameters = { "props": jsonObj.nodes };
    console.log(nodeParameters);
    //Sort by type
    let dictionary = {};
    let hashMap = {};
    nodeParameters.props.map((item) => {
        if (!dictionary[item.type]) {
            dictionary[item.type] = [item];
        } else {
            dictionary[item.type].push(item);
        }
        hashMap[item.nodeID] = item; //aid in creating edges
    });

    for (let nodeType in dictionary) {
        let nodeStatement = 'UNWIND {' + nodeType + '} AS map CREATE (n:' + nodeType + ') SET n = map';
        PostQuery([nodeStatement], dictionary, "Creating nodes");
        PostQuery(['CREATE INDEX ON :' + nodeType + '(nodeID)'], null, "Creating index"); //create index
    }

	  //create edges
    let edgeParameters = { "rows": jsonObj.edges };
    edgeParameters.rows.map((item) => {
        item["toType"] = hashMap[item.toID].type;
        item["fromType"] = hashMap[item.fromID].type;
    });
    let edgeStatements = [];
    edgeParameters.rows.map((edge) => {
        edgeStatements.push('MATCH (n:' + edge.fromType + '),(m:' + edge.toType + ') WHERE n.nodeID=\'' + edge.fromID + '\' AND m.nodeID=\'' + edge.toID + '\' CREATE (n)-[r:LINK]->(m)');
        //console.log('MATCH (n:' + edge.fromType + '),(m:' + edge.toType + ') WHERE n.nodeID=\'' + edge.fromID + '\' AND m.nodeID=\'' + edge.toID + '\' CREATE (n)-[r:LINK]->(m)');
    });
    PostQuery(edgeStatements, null, "Creating edges");

  	//locutions?
}
