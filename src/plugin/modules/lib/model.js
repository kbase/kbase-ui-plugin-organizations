/*eslint {"strict": ["error", "global"]} */
'use strict';
define([
    'bluebird',
    './testData'
], function (
    Promise,
    {organizations}
) {
    class Model {
        constructor({runtime}) {
            this.runtime = runtime;

            this.organizations = organizations;

            this.orgDb = organizations.reduce((db, org) => {
                db[org.id] = org;
                return db;
            }, {});
        }

        getOrganizations() {
            return Promise.try(() => {
                return this.organizations;
            });
        }

        getOrganization({id}) {
            return Promise.try(() => {
                return this.orgDb[id];
            });
        }
    }

    return {Model};
});