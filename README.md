# typer-js
TyperJS is a tool for validating object schemas.


## Example

```js

import { typerSync } from "../dist/main.js";


const Scheme = {
    name: 'string',
    years: {
        type: 'number',
        pre(value, cancel) {

            if(value < 18) {
                cancel("You must be of legal age");
                return false;
            }

        }
    }
}

typerSync(Scheme, {
    name: 'Pablo',
    years: 12
})
.then((obj) => {
    console.log(`Hello ${obj.name} !`);
})
.catch((errors) => {
    console.error("Errors", errors);
});


```
