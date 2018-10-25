/*eslint {"strict": ["error", "global"]} */
'use strict';
define([
    'knockout',
    'kb_knockout/registry',
    'kb_knockout/lib/generators',
    'kb_lib/html',
    'kb_lib/htmlBuilders',
    '../../lib/model',
    '../table/main',
    '../table/types',
    '../fields/projectLink',
    '../fields/userLink'
], function (
    ko,
    reg,
    gen,
    html,
    build,
    {Model},
    TableComponent,
    {Table, Column, Row},
    ProjectLinkComponent,
    UserLinkComponent
) {
    class ViewModel {
        constructor({runtime, projectId}) {
            this.runtime = runtime;
            this.model = new Model({runtime});
            this.projectId = projectId;

            this.narratives = ko.observableArray();

            this.narrativesTable = new Table({
                terms: {
                    rowSynonym: ['narrative', 'narratives']
                },
                sort: {
                    column: 'title',
                    direction: 'desc'
                },
                columns: [
                    new Column({
                        name: 'title',
                        label: 'Title',
                        width: 1,
                        sort: true,
                        // component: ProjectLinkComponent.name()
                    }),
                    new Column({
                        name: 'owner',
                        label: 'Owner',
                        width: 1,
                        sort: true,
                        component: UserLinkComponent.name()
                    }),
                    new Column({
                        name: 'created',
                        label: 'Created',
                        type: 'date',
                        format: 'MMM DD, YYYY',
                        width: 1,
                        sort: true
                    }),
                    new Column({
                        name: 'lastUpdated',
                        label: 'Last updated',
                        type: 'date',
                        format: 'MMM DD, YYYY',
                        width: 1,
                        sort: true
                    })
                ]
            });

            this.messages = {
                none: 'no active search',
                notfound: 'sorry, not found',
                loading: 'loading...',
                error: 'error!'
            };

            this.ready = ko.observable(false);
            this.model.getProjectNarratives(projectId)
                .then((narratives) => {
                    // fixup owner for now...
                    // narratives = narratives.map((narrative) => {
                    //     narrative.owner = {
                    //         username: narrative.owner,
                    //         realname: narrative.owner
                    //     };
                    //     return narrative;
                    // });
                    this.narratives(narratives);

                    // narratives.forEach((narrative) => {
                    //     // project.link = {
                    //     //     id: project.id,
                    //     //     slug: project.slug,
                    //     //     name: project.name
                    //     // },
                    //     this.narrativesTable.addRow(new Row({
                    //         data: narrative
                    //     }));
                    // });

                    this.ready(true);
                });
        }
    }

    // VIEW

    const t = html.tag,
        p = t('p'),
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
        narrativeList: {
            css: {
                flex: '1 1 0px',
                display: 'flex',
                flexDirection: 'row'
            }
        },
        narrativeRow: {
            css: {
                flex: '0 0 auto',
                display: 'flex',
                flexDirection: 'column',
                margin: '4px',
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
                        flex: '3 1 0px'
                    },
                    dataBind: {
                        text: 'title'
                    }
                }),
                div({
                    style: {
                        flex: '1 1 0px'
                    }
                }, [
                    span({
                        class: style.classes.label
                    }, 'created'),
                    span({
                        dataBind: {
                            typedText: {
                                value: 'created',
                                type: '"date"',
                                format: '"MMM DD,YYYY"'
                            }
                        }
                    })
                ])
            ]),
            div({
                class: style.classes.row
            }, [
                div({
                    style: {
                        flex: '3 1 0px'
                    },
                    dataBind: {
                        text: 'owner'
                    }
                }),
                div({
                    style: {
                        flex: '1 1 0px'
                    }
                }, [
                    span({
                        class: style.classes.label
                    }, 'last saved'),
                    span({
                        dataBind: {
                            typedText: {
                                value: 'lastUpdated',
                                type: '"date"',
                                format: '"MMM DD,YYYY"'
                            }
                        }
                    })
                ])
            ])
        ]);
    }

    function buildNarrativesList() {
        return gen.foreach('narratives',
            buildNarrative());
    }

    // function buildNarrativesTable() {
    //     return div({
    //         style: {
    //             flex: '1 1 0px',
    //             display: 'flex',
    //             flexDirection: 'column'
    //         },
    //         dataBind: {
    //             component: {
    //                 name: TableComponent.quotedName(),
    //                 params: {
    //                     table: 'narrativesTable',
    //                     messages: 'messages'
    //                 }
    //             }
    //         }
    //     });
    // }

    function buildSearchBar() {
        return div({
            class: 'btn-toolbar'
        }, [
            div({
                class: 'btn-group'
            }, [
                div({
                    class: 'btn btn-default'
                }, 'Add Narrative to Project')
            ]),
            div({
                class: 'btn-group'
            }, [
                div({
                    class: 'btn btn-default'
                }, 'Create Narrative in this Project')
            ])
        ]);
    }

    // function buildToolbar() {
    //     return div({
    //         class: 'btn-toolbar'
    //     }, [
    //         div({
    //             class: 'btn-group'
    //         }, [
    //             div({
    //                 class: 'btn btn-default'
    //             }, 'Add Narrative to Project')
    //         ]),
    //         div({
    //             class: 'btn-group'
    //         }, [
    //             div({
    //                 class: 'btn btn-default'
    //             }, 'Create Narrative in this Project')
    //         ])
    //     ]);
    // }

    function buildNarratives() {
        return [
            buildSearchBar(),
            buildNarrativesList()
        ];
    }

    function buildWaiting() {
        return build.loading('Loading narratives');
    }

    function template() {
        return div({
            class: style.classes.component
        }, [
            gen.if('ready',
                buildNarratives(),
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