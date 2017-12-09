import request from 'request';
import { httpUrlForTransaction } from 'constants/globalVar';

export function PostQuery(statement, parameters, operationText) {
    statement.map((s, index) => {
        try {
            request.post({
                uri: httpUrlForTransaction,
                json: { statements: [{ statement: s, parameters: parameters[index] }] },
                auth: { //this will need moving to external source for security
                    user: 'neo4j',
                    pass: 'jazzyrice80'
                }
            },
                function (err, res, body) {
                    if (err) {
                        console.log(err + "when: " + operationText);
                    } else {
                        console.log(body);
                    }
                })
        } catch (e) {
            //check for net::ERR_INSECURE_RESPONSE
            console.log(e);
        }
     });
}
