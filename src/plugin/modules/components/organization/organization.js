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

    function buildOrganization() {
        return div({
            class: style.classes.orgTable
        }, [
            div({
                class: style.classes.orgTableRow
            }, [
                div({
                    class: style.classes.orgTableCol1
                }, 'name'),
                div({
                    class: style.classes.orgTableCol2
                }, span({
                    dataBind: {
                        text: 'name'
                    }
                }))
            ]),
            div({
                class: style.classes.orgTableRow
            }, [
                div({
                    class: style.classes.orgTableCol1
                }, 'permalink'),
                div({
                    class: style.classes.orgTableCol2
                }, [
                    'https://narrative.kbase.us#org/',
                    span({
                        dataBind: {
                            text: 'id'
                        }
                    })
                ])
            ]),
            // div({
            //     class: style.classes.row
            // }, [
            //     div({
            //         class: style.classes.col1
            //     }, 'about'),
            //     div({
            //         class: style.classes.col2
            //     }, 'This is a really great organization; this brief bit describes it in one sentence')
            // ]),
            div({
                class: style.classes.orgTableRow
            }, [
                div({
                    class: style.classes.orgTableCol1
                }, 'description'),
                div({
                    class: style.classes.orgTableCol2
                }, div({
                    dataBind: {
                        htmlMarkdown: 'description'
                    }
                }))
            ])
        ]);
    }

    function template() {
        return div({
            class: style.classes.component
        }, [
            gen.with('organization', buildOrganization())
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