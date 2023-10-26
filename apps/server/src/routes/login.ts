// Copyright (c) 2023 Combat Jongerenmarketing en -communicatie B.V.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of
// this software and associated documentation files (the "Software"), to deal in
// the Software without restriction, including without limitation the rights to
// use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
// the Software, and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
// FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
// COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
// IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
// CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.



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
