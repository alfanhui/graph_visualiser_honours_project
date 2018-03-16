const maxLength = 30;
let regEx = /^[\s]*$/;

//for fontsize 10px, max char is 30.
export function wrapContextTextToArray(text) {
    let wrappedArray = [];
    if (text.length > maxLength) {
        while (text.length > 0) {
            let indexStart = regEx.test(text[0]) ? 1 : 0;
            let pushChecker = true;
            let remainingLength = text.length > maxLength ? maxLength : text.length;
            if (text.length >= maxLength) {
                if (!regEx.test(text[remainingLength])){//backtrack to next available space
                    pushChecker = false;
                    for (let i = (remainingLength-1); i > 1; i--) {
                        if (!regEx.test(text[i])) {
                            continue;
                        } else { //backtrack success
                            pushChecker = true;
                            wrappedArray.push(text.slice(indexStart, i));
                            text = text.slice(i);
                            break;
                        }
                    }
                    if(!pushChecker){
                        //console.log("Invalid text string"); // eslint-disable-line
                        wrappedArray.push(text.slice(indexStart, remainingLength));
                        text = text.slice(remainingLength);
                    }
                }else{ //text can split without backtracking
                    wrappedArray.push(text.slice(indexStart, remainingLength));
                    text = text.slice(remainingLength);
                }
            }else{ //text less than maxSize, so just push
                    wrappedArray.push(text.slice(indexStart, remainingLength));
                    text = text.slice(remainingLength);
            }
        }
    } else {
        return [text];
    }
    return wrappedArray;
}


export function wrapNonContextTextToArray(text){
    return(text.split(" "));
}