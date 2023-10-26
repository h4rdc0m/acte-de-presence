import { Group } from "@stricjs/router";
import { guard } from "@stricjs/utils";
import { badReq } from "../store/codes";

const check = guard.create({
    name: 'str',
    pass: 'str',
}),

// FIXME: Don't do this in production, replace with service :)
username = "adp",
password = '1234567890';

export default new Group().post('/login', c => {
    const q = check(c.data);

    // Input type validation
    if (q === null) {
        c.set = badReq;
        return 'Invalid data sent';
    }

    // Other validation
    if (q.name === username && q.pass === password)
        return 'Successfully logged in';

    c.set = badReq;

    return 'Invalid credentials';
}, {body: 'json', wrap: 'send'});
