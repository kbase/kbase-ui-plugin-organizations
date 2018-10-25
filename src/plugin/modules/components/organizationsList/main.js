/*eslint {"strict": ["error", "global"]} */
'use strict';
define([
    'knockout',
    'kb_knockout/registry',
    'kb_knockout/lib/generators',
    'kb_knockout/lib/viewModelBase',
    'kb_lib/html',
    'kb_lib/htmlBuilders',
    '../../lib/model',
], function (
    ko,
    reg,
    gen,
    viewModelBase,
    html,
    build,
    {Model}
) {
    class ViewModel {
        constructor() {

        }
    }

    // VIEW

    const t = html.tag,
        div = t('div');

    const style = html.makeStyles({
        component: {
            css: {
                flex: '1 1 0px',
                display: 'flex',
                flexDirection: 'column'
            }
        }
    });

    function template() {
        return div({
            class: style.classes.component
        }, [
            'organizations list'
        ]);
    }

    function component() {
        return {
            viewModel: ViewModel,
            template: template()
        };
    }

    return reg.registerComponent(component);
});