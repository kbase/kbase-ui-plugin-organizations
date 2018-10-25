/*eslint {"strict": ["error", "global"]} */
'use strict';
define([
    'knockout',
    'marked',
    'kb_knockout/registry',
    'kb_knockout/lib/generators',
    'kb_knockout/components/overlayPanel',
    'kb_lib/html',
    '../organizationsList',
    '../../lib/model'
], function (
    ko,
    marked,
    reg,
    gen,
    OverlayPanelComponent,
    html,
    OrganizationsListComponent,
    {Model}
) {
    class ViewModel {
        constructor({runtime}) {
            this.runtime = runtime;

            // overlay
            this.overlayComponent = ko.observable();

            this.actions = {
                showOverlay: (component) => {
                    this.overlayComponent(component);
                },
                return: () => {
                    this.view('organizations');
                },
                showNewProjectForm: () => {
                    this.view('neworganization');
                }
            };
        }

        doCreateNewProject() {
            this.view('neworganization');
        }
    }

    // VIEW

    const t = html.tag,
        h3 = t('h3'),
        h4 = t('h4'),
        div = t('div');

    const style = html.makeStyles({
        component: {
            css: {
                // margin: '10px',
                flex: '1 1 0px',
                display: 'flex',
                flexDirection: 'column'
            }
        },
        view: {
            css: {
                margin: '10px',
                flex: '1 1 0px',
                display: 'flex',
                flexDirection: 'column'
            }
        },
        row: {
            css: {
                margin: '0 10px',
                flex: '1 1 0px',
                display: 'flex',
                flexDirection: 'row'
            }
        },
        col1: {
            css: {
                flex: '1 1 0px',
                margin: '0 5px'
            }
        },
        col2: {
            css: {
                flex: '2 1 0px',
                margin: '0 5px'
            }
        }
    });

    function buildOrganizationsList() {
        return div({
            class: style.classes.row
        },[
            div({
                class: style.classes.col1
            }, [
                h4('Filters and Stuff')
            ]),
            div({
                class: style.classes.col2
            }, [
                h3({
                    style: {
                        marginTop: '0px'
                    }
                }, 'Organizations'),
                div({
                    dataBind: {
                        component: {
                            name: OrganizationsListComponent.quotedName(),
                            params: {
                                runtime: 'runtime',
                                showNewProjectForm: 'actions.showNewProjectForm'
                            }
                        }
                    }
                })
            ])
        ]);
    }

    // function buildNewProject() {
    //     return div({
    //         class: style.classes.view,
    //         dataBind: {
    //             component: {
    //                 name: NewProjectComponent.quotedName(),
    //                 params: {
    //                     runtime: 'runtime',
    //                     actions: 'actions'
    //                 }
    //             }
    //         }
    //     });
    // }

    function template() {
        return div({
            class: style.classes.component
        }, [
            gen.switch('view', [
                // [
                //     '"myprojects"', buildMyProjects()
                // ],
                [
                    '"newproject"', buildOrganizationsList()
                ]
            ]),
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