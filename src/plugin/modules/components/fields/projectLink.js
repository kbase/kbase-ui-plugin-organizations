define([
    'knockout',
    'kb_knockout/registry',
    'kb_knockout/lib/generators',
    'kb_lib/html'
], function (
    ko,
    reg,
    gen,
    html
) {
    'use strict';

    class ViewModel {
        constructor({id, name}) {
            this.id = id;
            this.name = name;
        }
    }

    // VIEW

    const t = html.tag,
        a = t('a');

    function template() {
        return a({
            dataBind: {
                attr: {
                    href: '"#organizations/" + id'
                },
                text: 'name'
            },
            target: '_blank'
        });
    }

    function component() {
        return {
            viewModel: ViewModel,
            template: template()
        };
    }

    return reg.registerComponent(component);
});