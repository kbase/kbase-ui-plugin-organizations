/*eslint {"strict": ["error", "global"]} */
'use strict';
define([
    'knockout',
    'kb_knockout/registry',
    'kb_knockout/lib/generators',
    'kb_lib/html',
    'kb_lib/htmlBuilders',
    '../../lib/model',
    '../fields/projectLink'
], function (
    ko,
    reg,
    gen,
    html,
    build,
    {Model},
    ProjectLinkComponent,
) {
    class ViewModel {
        constructor({runtime, showNewProjectForm}) {
            this.runtime = runtime;
            this.model = new Model({runtime});

            this.showNewProjectForm = showNewProjectForm;

            this.projects = ko.observableArray();
            this.ready = ko.observable(false);

            this.loadProjects();
        }

        loadProjects() {
            this.ready(false);
            this.model.getMyProjects()
                .then((projects) => {
                    this.projects.removeAll();
                    this.projects(projects);
                    this.ready(true);
                });
        }

        doResetFakeData() {
            const model = new Model({runtime: this.runtime});
            model.recreateFakeData();
            this.loadProjects();
        }

        doShowNewProjectForm() {
            this.showNewProjectForm();
        }

        doDeleteProject(project) {
            const model = new Model({runtime: this.runtime});
            model.deleteProject(project.id)
                .then(() => {
                    this.projects.remove(project);
                })
                .catch((err) => {
                    console.error('error', err);
                });
        }
    }

    // VIEW

    const t = html.tag,
        span = t('span'),
        div = t('div'),
        table = t('table'),
        tbody = t('tbody'),
        tr = t('tr'),
        th = t('th'),
        td = t('td'),
        button = t('button');

    const style = html.makeStyles({
        component: {
            css: {
                flex: '1 1 0px',
                display: 'flex',
                flexDirection: 'column'
            }
        },
        narrativeList: {
            css: {
                flex: '1 1 0px',
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'auto'
            }
        },
        narrativeRow: {
            css: {
                flex: '0 0 auto',
                display: 'flex',
                flexDirection: 'column',
                margin: '4px 0',
                border: '2px rgba(150, 150, 150, 0.5) solid',
                padding: '4px'
            }
        },
        row: {
            css: {
                flex: '0 0 auto',
                display: 'flex',
                flexDirection: 'row'
            }
        },
        table: {
            css: {

            },
            inner: {
                'th': {
                    color: 'rgba(150,150,150, 1)',
                    whiteSpace: 'nowrap',
                    width: '10em'
                }
            }
        }
    });

    function buildNarrative() {
        return div({
            class: style.classes.narrativeRow
        }, [
            div({
                class: style.classes.row
            }, [
                div({
                    style: {
                        flex: '2.7 1 0px'
                    }
                }, [
                    div({
                        style: {
                            fontWeight: 'bold',
                            fontSize: '110%'
                        },
                        dataBind: {
                            component: {
                                name: ProjectLinkComponent.quotedName(),
                                params: {
                                    id: 'id',
                                    name: 'name'
                                }
                            }
                        }
                    }),
                    div({
                        dataBind: {
                            text: 'about'
                        }
                    })
                ]),
                div({
                    style: {
                        flex: '1 1 0px'
                    }
                }, [
                    table({
                        class: style.classes.table
                    }, tbody([
                        tr([
                            th('created'),
                            td(span({
                                dataBind: {
                                    typedText: {
                                        value: 'created',
                                        type: '"date"',
                                        format: '"MM/DD/YYYY"'
                                    }
                                }
                            }))
                        ]),
                        tr([
                            th('last updated'),
                            td(span({
                                dataBind: {
                                    typedText: {
                                        value: 'lastUpdated',
                                        type: '"date"',
                                        format: '"MM/DD/YYYY"'
                                    }
                                }
                            }))
                        ])
                    ]))
                ]),
                div({
                    style: {
                        flex: '0 0 30px',
                        textAlign: 'right'
                    }
                }, button({
                    class: 'btn btn-danger btn-xs kb-btn-lite',
                    dataBind: {
                        click: 'function(d){$component.doDeleteProject.call($component,d)}'
                    }
                }, span({
                    class: 'fa fa-trash'
                })))
            ])
        ]);
    }

    function buildProjectList() {
        return div({
            class: style.classes.narrativeList,
            dataBind: {
                foreach: 'projects'
            }
        }, buildNarrative());
    }

    function buildToolbar() {
        return div({
            class: 'btn-toolbar',
            style: {
                marginBottom: '10px'
            }
        }, [
            div({
                class: 'btn-group'
            }, [
                button({
                    class: 'btn btn-default',
                    dataBind: {
                        click: 'function (){$component.doShowNewProjectForm.call($component)}'
                    }
                }, [
                    span({
                        class: 'fa fa-plus text-success'
                    }),
                    ' Create New Project'
                ])
            ]),
            div({
                class: 'btn-group pull-right'
            }, [
                button({
                    class: 'btn btn-default',
                    dataBind: {
                        click: 'function (){$component.doResetFakeData.call($component)}'
                    }
                }, [
                    span({
                        class: 'fa fa-bug text-danger'
                    }),
                    ' Reset Projects DB and Recreate Fake Data'
                ])
            ])
        ]);
    }

    function buildNoProjects() {
        return div({
            class: 'alert alert-warning',
        }, 'You have no projects -- create your first!');
    }

    function buildProjects() {
        return [
            buildToolbar(),
            gen.if('projects().length > 0',
                buildProjectList(),
                buildNoProjects())
        ];
    }

    function buildWaiting() {
        return build.loading('Loading projects');
    }

    function template() {
        return div([
            gen.if('ready',
                buildProjects(),
                buildWaiting())
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