define([], function () {
    'use strict';

    const organizations = [];

    organizations.push({
        id: 'my_org_id',
        name: 'My Organization',
        owner: 'eapearson',
        members: ['eaptest30'],
        type: 'Organization',
        description: `
This is a great organization

It is **really** great!

_Try it_, you'll **really** like it.
`,
        createdAt: new Date(1538410313000),
        modifiedAt: new Date(1538496713000)
    });



    for (let i = 0; i < 100; i += 1) {
        organizations.push({
            id: 'my_org_id_' + i,
            name: 'My Organization ' + i,
            owner: 'eapearson',
            members: ['eaptest30'],
            type: 'Organization',
            description: `
    This is a great organization

    It is **really** great!

    _Try it_, you'll **really** like it.
    `,
            createdAt: new Date(1538410313000),
            modifiedAt: new Date(1538496713000)
        });
    }

    return {organizations};

});