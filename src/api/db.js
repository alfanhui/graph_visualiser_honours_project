import request from 'request';
import { httpUrlForTransaction } from 'constants/globalVar';

export function PostQuery(statement, parameters) {
    request.post({
        uri: httpUrlForTransaction,
        json: { statements: [{ statement: 'MATCH (ee:Person) WHERE ee.name = "Emil" RETURN ee', parameters: null }] },
        auth: {
            user: 'neo4j',
            pass: 'jazzyrice80'
        }
    },
    function (err, res, body) {
        if (err) {
            console.log(err);
        } else {
            console.log(body); //body.results[0].data[0].row[0]
        }
    })
  }
