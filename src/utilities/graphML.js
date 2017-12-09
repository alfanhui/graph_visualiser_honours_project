import { PostQuery } from 'api/db';

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
	//create node statement
	let nodeParameters = {"props": jsonObj.nodes};
	console.log(nodeParameters);
	let nodeStatement = 'UNWIND {props} AS map CREATE (n) SET n = map';
	PostQuery([nodeStatement], [nodeParameters], "Creating nodes");
	//create edges

	let edgeParameters = {"rows": jsonObj.edges};
	let edgeStatement = 'UNWIND {rows} as row MATCH (n),(m) WHERE n.nodeID=e.fromId and m.nodeID=e.toID CREATE (n)-[:LINK]->(m) SET e = row';
  PostQuery([edgeStatement], [edgeParameters], "Creating edges");
	


	//locutions?
}
