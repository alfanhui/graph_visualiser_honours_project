import request from 'request';
import { httpUrlForTransaction } from 'constants/globalVar';

export function PostQuery(statement, parameters, operationText) {
    statement.map((s, index) => {
      request.post({
          uri: httpUrlForTransaction,
          json: { statements: [{ statement: s, parameters: parameters }] },
          auth: { //this will need moving to external source for security
              user: 'neo4j',
              pass: 'jazzyrice80'
          }
      },
      function (err, res, body) {
          if (err) {
              //let win = window.open(httpUrlForTransaction, '_blank'); //insecure response
              console.log(err , " when: " , operationText);
          } else {
              console.log(res , body);
          }
      })

    });
}
