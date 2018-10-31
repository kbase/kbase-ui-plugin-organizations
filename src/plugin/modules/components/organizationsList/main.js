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
    ViewModelBase,
    html,
    build,
    {Model}
) {
    class ViewModel extends ViewModelBase {
        constructor(params, {$root}) {
            super(params);

            const {organizations, app} = params;

            this.organizations = organizations;
            this.app = app;

            this.$root = $root;
        }

        selectOrg({id}) {
            console.log('selecting org: ', id);
            this.app.navigate('organization', {id});
        }
    }

    // VIEW

    const t = html.tag,
        div = t('div'),
        a = t('a'),
        table = t('table'),
        tbody = t('tbody'),
        tr = t('tr'),
        th = t('th'),
        td = t('td');

    const style = html.makeStyles({
        component: {
            css: {
                flex: '1 1 0px',
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'auto'
            }
        },
        row: {
            css: {
                flex: '0 0 auto',
                border: '1px silver dashed',
                padding: '4px',
                margin: '4px 0',
                display: 'flex',
                flexDirection: 'row'
            }
        },
        col1: {
            css: {
                flex: '2 1 0px'
            }
        },
        col2: {
            css: {
                flex: '1 1 0px'
            }
        },
        orgName: {
            css: {
                fontWeight: 'bold',
                fontSize: '110%',
                cursor: 'pointer'
            },
            pseudo: {
                'hover': {
                    textDecoration: 'underline',
                    color: 'blue'
                }
            }
        },
        orgTable: {
            css: {

            },
            inner: {
                th: {
                    textAlign: 'left',
                    fontWeight: 'bold',
                    color: 'rgba(150, 150, 150, 1)',
                    padding: '2px'
                },
                td: {
                    padding: '2px'
                }
            }
        }
    });

    function buildRow() {
        return [
            div({
                class: style.classes.col1
            }, [
                div({
                    class: style.classes.orgName,
                    dataBind: {
                        text: 'name',
                        click: '(d)=>{$component.selectOrg.call($component,d)}'
                    }
                })
            ]),
            div({
                class: style.classes.col2
            }, [
                table({
                    class: style.classes.orgTable
                }, [
                    tbody([
                        tr([
                            th({
                                scope: 'row'
                            }, 'established'),
                            td({
                                dataBind: {
                                    typedText: {
                                        value: 'createdAt',
                                        type: '"date"',
                                        format: '"MMM, D YYYY"'
                                    }
                                }
                            })
                        ]),
                        tr([
                            th({
                                scope: 'row'
                            }, 'owner'),
                            td(a({
                                dataBind: {
                                    text: 'owner',
                                    attr: {
                                        href: '"/#people/" + owner'
                                    }
                                },
                                target: '_blank'
                            }))
                        ]),
                        tr([
                            th({
                                scope: 'row'
                            }, 'last updated'),
                            td({
                                dataBind: {
                                    typedText: {
                                        value: 'modifiedAt',
                                        type: '"date"',
                                        format: '"MMM, D YYYY"'
                                    }
                                }
                            })
                        ]),
                    ])
                ])
            ])
        ];
    }

    function buildTable() {
        return gen.foreach('organizations',
            gen.if('show()',
                div({
                    class: style.classes.row
                }, gen.with('organization', buildRow()))));
    }

    function template() {
        return div({
            class: style.classes.component
        }, [
            buildTable()
        ]);
    }

    function component() {
        return {
            viewModelWithContext: ViewModel,
            template: template(),
            stylesheet: style.sheet
        };
    }

    return reg.registerComponent(component);
});