/*eslint {"strict": ["error", "global"]} */
'use strict';
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
    class ViewModel {
        constructor(params) {
            const {organization} = params;

            this.organization = organization;
        }
    }

    // VIEW

    const t = html.tag,
        a = t('a'),
        span = t('span'),
        div = t('div');

    const style = html.makeStyles({
        component: {
            css: {
                flex: '1 1 0px',
                display: 'flex',
                flexDirection: 'column'
            }
        },
        orgTable: {
            css: {
                flex: '1 1 0px',
                display: 'flex',
                flexDirection: 'column',
            }
        },
        orgTableRow: {
            css: {
                flex: '0 0 30px',
                display: 'flex',
                flexDirection: 'row',
            }
        },
        orgTableCol1: {
            css: {
                flex: '0 0 8em',
                // display: 'flex',
                // flexDirection: 'column',
                fontWeight: 'bold',
                color: 'rgba(150, 150, 150, 1)'
            }
        },
        orgTableCol2: {
            css: {
                flex: '1 1 0px'
            }
        }
    });

    function buildInfo() {
        return div({
            class: style.classes.orgTable
        }, [
            div({
                class: style.classes.orgTableRow
            }, [
                div({
                    class: style.classes.orgTableCol1
                }, 'created'),
                div({
                    class: style.classes.orgTableCol2
                }, span({
                    dataBind: {
                        typedText: {
                            value: 'createdAt',
                            type: '"date"',
                            format: '"MMM D, YYYY"'
                        }
                    }
                }))
            ]),
            div({
                class: style.classes.orgTableRow
            }, [
                div({
                    class: style.classes.orgTableCol1
                }, 'owner'),
                div({
                    class: style.classes.orgTableCol2
                }, [
                    a({
                        dataBind: {
                            text: 'owner',
                            attr: {
                                href: '"/#people/" + owner'
                            }
                        },
                        target: '_blank'
                    })
                ])
            ]),
            div({
                class: style.classes.orgTableRow
            }, [
                div({
                    class: style.classes.orgTableCol1
                }, 'last updated'),
                div({
                    class: style.classes.orgTableCol2
                }, span({
                    dataBind: {
                        typedText: {
                            value: 'modifiedAt',
                            type: '"date"',
                            format: '"MMM D, YYYY"'
                        }
                    }
                }))
            ])
        ]);
    }

    function template() {
        return div({
            class: style.classes.component
        }, [
            gen.with('organization', buildInfo())
        ]);
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