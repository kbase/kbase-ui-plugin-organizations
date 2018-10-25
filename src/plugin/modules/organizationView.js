/*eslint {"strict": ["error", "global"]} */
'use strict';
define([
    'knockout',
    'kb_knockout/lib/generators',
    'kb_lib/html',
    './components/organization/main',
    './lib/model'
], function (
    ko,
    gen,
    html,
    MainComponent,
    {Model}
) {
    const t = html.tag,
        div = t('div');

    class Panel {
        constructor({runtime}) {
            this.runtime = runtime;
            this.hostNode = null;
            this.container = null;
            this.model = new Model({runtime});
        }

        // VIEW
        render() {
            return gen.component2({
                name: MainComponent.quotedName(),
                params: {
                    runtime: 'runtime',
                    projectId: 'projectId'
                }
            }).join('');
        }

        // API

        attach(node) {
            this.hostNode = node;
            this.container = node.appendChild(document.createElement('div'));
            this.container.style.flex = '1 1 0px';
            this.container.style.display = 'flex';
            this.container.style.flexDirection = 'column';
            this.container.style.margin = '0 10px';
        }

        start({organizationId}) {
            this.container.innerHTML = this.render();
            this.model.getOrganization(organizationId)
                .then((organization) => {
                    this.runtime.send('ui', 'setTitle', organization.name);
                });

            ko.applyBindings({
                runtime: this.runtime,
                organizationId: organizationId
            }, this.container);
        }

        stop() {

        }

        detach() {

        }
    }

    return Panel;
});