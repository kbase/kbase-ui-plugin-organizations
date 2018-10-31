import { Organization, Organizations } from '../types/index';

export const organizations: Organizations = [];

const dayMS = 1000 * 60 * 60 * 24;


for (let i = 0; i < 5; i += 1) {
    const randomDaysMS = Math.round(Math.random() * 20 * dayMS);
    organizations.push({
        id: 'my_org_id_' + i,
        name: 'My Organization ' + i,
        owner: 'eaptest30',
        description: `
This is a great organization

It is **really** great!

_Try it_, you'll **really** like it.
    `,
        createdAt: new Date(1538410313000 + i * dayMS),
        modifiedAt: new Date(1538496713000 + i * dayMS + randomDaysMS)
    });
}
