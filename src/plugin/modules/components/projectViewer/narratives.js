/*eslint {"strict": ["error", "global"]} */
'use strict';
define([
    'knockout',
    'kb_knockout/registry',
    'kb_knockout/lib/generators',
    'kb_lib/html',
    'kb_lib/htmlBuilders',
    '../../lib/model',
    '../fields/projectLink',
    './userLink',
    './addNarrative'
], function (
    ko,
    reg,
    gen,
    html,
    build,
    {Model},
    ProjectLinkComponent,
    UserLinkComponent,
    AddNarrativeComponent
) {
    class ViewModel {
        constructor({runtime, projectId, actions}, {showOverlay}) {
            this.runtime = runtime;
            this.model = new Model({runtime});
            this.projectId = projectId;

            this.narratives = ko.observableArray();

            this.ready = ko.observable(false);
            this.model.getProjectNarratives(projectId)
                .then((narratives) => {
                    this.narratives(narratives);
                    this.ready(true);
                });

            this.showOverlay = showOverlay;

            this.actions = {
                addNarrative: (narrativeId) => {
                    this.model.addProjectNarrative(this.projectId, narrativeId);
                    return this.model.getNarrative2(narrativeId)
                        .then((narrative) => {
                            this.narratives.push(narrative);
                        });
                }
            };
        }

        doRemoveNarrative(narrative) {
            this.model.removeProjectNarrative(this.projectId, narrative.workspaceId, narrative.objectId);
            this.narratives.remove(narrative);
        }

        doAddNarrative() {
            this.showOverlay({
                name: AddNarrativeComponent.name(),
                viewModel: {
                    runtime: this.runtime,
                    projectId: this.projectId,
                    addNarrative: this.actions.addNarrative
                }
            });
        }
    }

    // VIEW

    const t = html.tag,
        a = t('a'),
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
                margin: '0 0 10px 0',
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
                    div(a({
                        style: {
                            fontWeight: 'bold',
                            fontSize: '110%'
                        },
                        target: '_blank',
                        dataBind: {
                            text: 'title',
                            attr: {
                                href: '"/narrative/ws." + workspaceId + ".obj." + objectId'
                            }
                        }
                    })),
                    div({
                        dataBind: {
                            component: {
                                name: UserLinkComponent.quotedName(),
                                params: {
                                    username: 'owner'
                                }
                            }
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
                        click: 'function(d){$component.doRemoveNarrative.call($component,d)}'
                    }
                }, span({
                    class: 'fa fa-trash'
                })))
            ])
        ]);
    }

    function buildNarrativesList() {
        return div({
            class: style.classes.narrativeList,
            dataBind: {
                foreach: 'narratives'
            }
        }, buildNarrative());
    }

    function buildSearchBar() {
        return div({
            class: 'btn-toolbar',
            style: {
                marginBottom: '10px'
            }
        }, [
            div({
                class: 'btn-group pull-right',
                dataBind: {
                    click: 'function(){$component.doAddNarrative.call($component)}'
                }
            }, [
                div({
                    class: 'btn btn-default'
                }, [
                    span({
                        class: 'fa fa-plus'
                    }),
                    ' Add Narrative to Project'
                ])
            ])
        ]);
    }

    function buildNarratives() {
        return [
            buildSearchBar(),
            buildNarrativesList()
        ];
    }

    function buildWaiting() {
        return build.loading('Loading narratives');
    }

    function buildNoNarratives() {
        return [
            buildSearchBar(),
            div({
                class: 'well'
            }, 'Sorry, no narratives.')
        ];
    }

    function template() {
        return div({
            class: style.classes.component
        }, [
            gen.if('ready',
                gen.if('narratives().length > 0',
                    buildNarratives(),
                    buildNoNarratives()),
                buildWaiting())
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