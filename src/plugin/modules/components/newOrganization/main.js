
define([
    'knockout',
    'kb_knockout/registry',
    'kb_knockout/lib/generators',
    'kb_knockout/components/overlayPanel',
    'kb_lib/html',
    '../organization',
    '../info'
], function (
    ko,
    reg,
    gen,
    OverlayPanelComponent,
    html,
    OrganizationDescriptionComponent,
    OrganizationInfoComponent
) {
    'use strict';

    class ViewModel {
        constructor({runtime, organization}) {
            this.runtime = runtime;
            this.organization = organization;

            this.overlayComponent = ko.observable();

            this.actions = {
                showOverlay: (component) => {
                    this.overlayComponent(component);
                }
            };
        }
    }

    // VIEW

    const t = html.tag,
        span =  t('span'),
        button = t('button'),
        a = t('a'),
        div = t('div');

    const style = html.makeStyles({
        component: {
            css: {
                flex: '1 1 0px',
                display: 'flex',
                flexDirection: 'column'
            }
        },
        row1: {
            css: {
                flex: '0 0 auto'
            }
        },
        row2: {
            css: {
                flex: '1 1 0px',
                display: 'flex',
                flexDirection: 'row',
                marginTop: '10px'
            }
        },
    });

    function buildToolbar() {
        return div({
            class: 'btn-toolbar'
        }, [
            div({
                class: 'btn-group'
            }, [
                button({
                    class: 'btn btn-default'
                }, [
                    span({
                        class: 'fa fa-pencil'
                    }),
                    ' Edit this Organization'
                ])
            ]),
            div({
                class: 'btn-group'
            }, [
                a({
                    class: 'btn btn-default',
                    href: '/#organizations'
                }, [
                    span({
                        class: 'fa fa-reply'
                    }),
                    ' Return to Organizations List'
                ])
            ]),
        ]);
    }

    function buildSubLayout() {
        return div({
            class: style.classes.component
        }, [
            div({
                class: style.classes.row1
            }, buildToolbar()),
            div({
                class: style.classes.row2
            }, [
                div({
                    style: {
                        flex: '2 1 0px',
                        display: 'flex',
                        flexDirection: 'column'
                    }
                }, div({
                    class: style.classes.component,
                    dataBind: {
                        component: {
                            name: OrganizationDescriptionComponent.quotedName(),
                            params: {
                                organization: 'organization',
                            }
                        }
                    }
                })),
                div({
                    style: {
                        flex: '1 1 0px',
                        display: 'flex',
                        flexDirection: 'column'
                    }
                }, div({
                    class: style.classes.component,
                    dataBind: {
                        component: {
                            name: OrganizationInfoComponent.quotedName(),
                            params: {
                                organization: 'organization',
                            }
                        }
                    }
                }))
            ])
        ]);
    }

    function template() {
        return div({
            class: style.classes.component,
            dataBind: {
                let: {
                    showOverlay: 'actions.showOverlay'
                }
            }
        }, [
            buildSubLayout(),
            gen.component({
                name: OverlayPanelComponent.name(),
                params: {
                    component: 'overlayComponent'
                }
            })
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