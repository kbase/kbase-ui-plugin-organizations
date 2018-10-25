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
        constructor({narrative}) {
            this.narrative = narrative;
        }
    }

    const t = html.tag,
        table = t('table'),
        tr = t('tr'),
        th = t('th'),
        td = t('td');

    const style = html.makeStyles({
        component: {
            css: {

            }
        },
        viewTable: {
            css: {

            },
            inner: {
                td: {
                    padding: '4px'
                }
            }
        }
    });

    function buildNarrative() {
        return table({
            class: style.classes.viewTable,
            dataBind: {
                with: 'narrative'
            }
        }, [
            tr([
                th('Name'),
                td({
                    dataBind: {
                        text: 'workspaceInfo.metadata.narrative_nice_name'
                    }
                })
            ]),
            tr([
                th('Ref'),
                td({
                    dataBind: {
                        text: 'objectInfo.ref'
                    }
                })
            ]),
            tr([
                th('Owner'),
                td({
                    dataBind: {
                        text: 'objectInfo.saved_by'
                    }
                })
            ]),
            tr([
                th('Modified'),
                td({
                    dataBind: {
                        typedText: {
                            value: 'objectInfo.saveDate',
                            type: '"date"',
                            format: '"MM/DD/YYYY"'
                        }
                    }
                })
            ])
        ]);
    }

    function template() {
        return buildNarrative();
    }

    function component() {
        return {
            viewModel: ViewModel,
            template: template(),
            stylesheet: style.sheet
        };
    }

    return reg.registerComponent(component);
});
