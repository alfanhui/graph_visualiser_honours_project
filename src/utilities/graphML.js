import { PostQuery } from 'api/db';

/* Rich (KryptoniteDove) suggested this function to parse JSON objects correctly.
*  https://codepen.io/KryptoniteDove/post/load-json-file-locally-using-pure-javascript
*/
export function loadJSON(callback) {   
	let xobj = new XMLHttpRequest();
	xobj.overrideMimeType("application/json");
	xobj.open('GET', 'utilities/1238.json', true);
	xobj.onreadystatechange = function () {
		if (xobj.readyState == 4 && xobj.status == "200") {
			// Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
			callback(xobj.responseText);
		}
	};
	xobj.send(null);  
}

export function graphMLtoCypher(jsonObj){
    //create node statement
    

    let nodeParameters = { "props": jsonObj.nodes };
    let edgeParameters = { "rows": jsonObj.edges };
    let edgeBackup = { "rows": jsonObj.edges };
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

    edgeParameters.rows.map((item) => {
        item["toType"] = hashMap[item.toID];
        item["fromType"] = hashMap[item.fromID];
        if (hashMap[item.toID].scheme) {
            item["type"] = hashMap[item.toID].type;
        } else {
            item["type"] = "to";
        }
    });

    //Create node and relationships at the same time.
    let nodeStatement = [];
    edgeParameters.rows.map((item, index) => {

        let fromType = '';
        for (var p in item.fromType) {
            if (item.fromType.hasOwnProperty(p)) {
                fromType += p + ':\"' + item.fromType[p] + '\",';
            }
        }
        fromType = fromType.slice(0, fromType.length - 1);

        let toType = '';
        for (var p in item.toType) {
            if (item.toType.hasOwnProperty(p)) {
                toType += p + ':\"' + item.toType[p] + '\",';
            }
        }
        toType = toType.slice(0, toType.length - 1);

        let edge = '';
        for (var p in edgeBackup.rows[index]) {
            if (edgeBackup.rows[index].hasOwnProperty(p)) {
                edge += p + ':\"' + edgeBackup.rows[index][p] + '\",';
            }
        }
        edge = edge.slice(0, edge.length - 1);

        console.log(index);
        nodeStatement.push('MERGE (n:' + item.fromType.type + '{' + fromType + '})-[r:'+ item.fromType.type + '{' + edge + '}]->(m:' + item.toType.type + '{' + toType + '})');
        PostQuery(nodeStatement, null, "Creating nodes");
    });

    /*
    //create indexes
    for (let nodeType in dictionary) {
    PostQuery(['CREATE INDEX ON :' + nodeType + '(nodeID)'], null, "Creating index");
    } 


    /*

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
        PostQuery(['CREATE INDEX ON :' + nodeType + '(nodeID)'], null, "Creating index");//create index
    }


	  //create edges
    let edgeParameters = { "rows": jsonObj.edges };
    edgeParameters.rows.map((item) => {
        item["toType"] = hashMap[item.toID].type;
        item["fromType"] = hashMap[item.fromID].type;
        if (hashMap[item.toID].scheme) {
            item["type"] = hashMap[item.toID].type;
        } else {
            item["type"] = "to";
        }
    });
    console.log(edgeParameters);

    let edgeStatements = []
    edgeParameters.rows.map((edge) => {
        edgeStatements.push('MATCH (n:' + edge.fromType + '{nodeID:' + edge.fromID + '}) WITH n MATCH(m:' + edge.toType + '{nodeID:' + edge.toID + '}) CREATE (n)-[r:' + edge.type + ']->(m)');
        console.log('MATCH (n:' + edge.fromType + '{nodeID:' + edge.fromID + '}) WITH n MATCH(m:' + edge.toType + '{nodeID:' + edge.toID + '}) CREATE (n)-[r:' + edge.type + ']->(m)');
    });
    PostQuery(edgeStatements, null, "Creating edge");
    */

	//locutions?
}
