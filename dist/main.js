function typer(scheme, obj) {
    if (typeof scheme != 'object' || Array.isArray(scheme))
        throw new Error("Scheme value in invalid");
    const objectCasted = obj;
    const schemeCasted = scheme;
    const ErrorMessages = [];
    Object.entries(scheme).forEach(async ([key, value]) => {
        const isRequired = (typeof value == 'object' && 'required' in value) ? value.required : true;
        if (key in obj) {
            if (typeof value == 'string') {
                if (typeof objectCasted[key] != value) {
                    ErrorMessages.push(`The value of the key '${key}' is not of type '${value}'.`);
                }
                return;
            }
            if (Array.isArray(value) && value[0] && typeof value[0] == 'object') {
                if (!Array.isArray(objectCasted[key])) {
                    ErrorMessages.push(`The value in the key '${key}' is not of type 'Array'.`);
                    return;
                }
                objectCasted[key].forEach((v, i) => {
                    const result = typer(value[0], v);
                    if (result.length > 0) {
                        ErrorMessages.push(`Error inside the array ${key} [${i}]: ${result}`);
                    }
                });
                return;
            }
            if (typeof value.type == 'object') {
                if (typeof objectCasted[key] != 'object') {
                    ErrorMessages.push(`The value of the key '${key}' is not of type 'object'`);
                }
                else {
                    const result = typer(value.type, objectCasted[key]);
                    if (result.length > 0) {
                        ErrorMessages.push({ path: key, errors: result });
                    }
                }
            }
            else {
                if (typeof objectCasted[key] != value.type) {
                    ErrorMessages.push(`The value of the key '${key}' is not of type '${value.type}'.`);
                }
                else if ('pre' in schemeCasted[key] && typeof 'function') {
                    let messageError;
                    const errorFunc = (s) => messageError = s;
                    const preCallback = schemeCasted[key]['pre'](objectCasted[key], errorFunc);
                    const preBoolean = (preCallback != true && preCallback != false) ? true : preCallback;
                    if (!preBoolean) {
                        if (messageError) {
                            ErrorMessages.push(messageError);
                        }
                        else {
                            ErrorMessages.push(`The value in the key '${key}' does not meet the parameters required in the function 'pre'.`);
                        }
                    }
                }
            }
        }
        else if (isRequired) {
            ErrorMessages.push(`The '${key}' key is missing`);
        }
    });
    return ErrorMessages;
}
;
function typerSync(scheme, obj) {
    return new Promise((resolve, reject) => {
        const errors = typer(scheme, obj);
        if (errors.length > 0) {
            reject(errors);
        }
        else {
            resolve(obj);
        }
    });
}
export { typerSync, typer };
//# sourceMappingURL=main.js.map