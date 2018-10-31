/*eslint {"strict": ["error", "global"]} */
'use strict';
define([
    'knockout',
    'kb_knockout/lib/generators',
    './components/main',
    './lib/model'
], function (
    ko,
    gen,
    MainComponent,
    {Model}
) {
    class RootViewModel {
        constructor({runtime}) {
            this.runtime = runtime;

            this.model = new Model({runtime});
        }

        setTitle(title) {
            this.runtime.send('ui', 'setTitle', title);
        }
    }

    class Panel {
        constructor({runtime}) {
            this.runtime = runtime;

            this.hostNode = null;
            this.container = null;
            this.viewModel = new RootViewModel({runtime});
        }

        // VIEW
        render() {
            return gen.component({
                name: MainComponent.name(),
                params: ['runtime']
            }).join('');
        }

        // API

        attach(node) {
            this.hostNode = node;
            this.container = node.appendChild(document.createElement('div'));
            this.container.style.flex = '1 1 0px';
            this.container.style.display = 'flex';
            this.container.style.flexDirection = 'column';
            this.container.style.padding = '0 10px';
        }

        start() {
            this.container.innerHTML = this.render();
            this.runtime.send('ui', 'setTitle', 'Organizations');
            ko.applyBindings(this.viewModel, this.container);
        }

        stop() {

        }

        detach() {

        }
    }

    return Panel;
});