/*eslint {"strict": ["error", "global"]} */
'use strict';
define([
    'knockout',
    'kb_knockout/registry',
    'kb_knockout/lib/generators',
    'kb_lib/html',
    'kb_lib/htmlBuilders',
    '../../lib/model'
], function (
    ko,
    reg,
    gen,
    html,
    build,
    {Model}
) {
    class ViewModel {
        constructor({runtime, projectId, showEditForm}) {
            this.runtime = runtime;
            this.projectId = projectId;
            this.showEditForm = showEditForm;

            this.model = new Model({runtime});

            this.project = null;

            this.ready = ko.observable(false);

            this.model.getProject(projectId)
                .then((project) => {
                    this.project = project;
                    this.ready(true);
                });
        }

        doEdit() {
            this.showEditForm();
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
        row: {
            css: {
                flex: '1 1 0px',
                display: 'flex',
                flexDirection: 'row'
            }
        },
        col1: {
            css: {
                flex: '1 1 0px',
                display: 'flex',
                flexDirection: 'column',
                padding: '10px'
            }
        },
        table: {
            css: {
                // flex: '1 1 0px',
                display: 'flex',
                flexDirection: 'column',
                padding: '10px',
                border: '1px rgba(150, 150, 150, 1) solid',
                borderRadius: '4px',
                marginBottom: '20px'
            }
        },
        field: {
            css: {
                // flex: '0 0 30px',
                minHeight: '30px',
                display: 'flex',
                flexDirection: 'row'
            }
        },
        labelCol: {
            css: {
                flex: '0 0 8em',
                fontWeight: 'bold',
                color: 'rgba(150, 150, 150, 1)'
            }
        },
        contentCol: {
            css: {
                flex: '1 1 0px',
                display: 'flex',
                flexDirection: 'column'
            }
        },
        description: {
            css: {
                maxHeight: '20em',
                overflowY: 'auto'
            }
        }
    });

    function buildProjectTable() {
        return div({
            class: style.classes.table,
            dataBind: {
                with: 'project'
            }
        }, [
            div({
                class: style.classes.field
            }, [
                div({
                    class: style.classes.labelCol
                }, 'name'),
                div({
                    class: style.classes.contentCol,
                    dataBind: {
                        text: 'name'
                    }
                })]),
            // div({
            //     class: style.classes.field
            // }, [
            //     div({
            //         class: style.classes.labelCol
            //     }, 'id'),
            //     div({
            //         class: style.classes.contentCol,
            //         dataBind: {
            //             text: 'id'
            //         }
            //     })]),
            div({
                class: style.classes.field
            }, [
                div({
                    class: style.classes.labelCol
                }, 'about'),
                div({
                    class: style.classes.contentCol,
                    dataBind: {
                        text: 'about'
                    }
                })]),
            div({
                class: style.classes.field
            }, [
                div({
                    class: style.classes.labelCol
                }, 'description'),
                div({
                    class: style.classes.contentCol,
                }, div({
                    class: style.classes.description,
                    dataBind: {
                        htmlMarkdown: 'description'
                    }
                }))])
        ]);
    }

    function buildProjectStat() {
        return div({
            class: style.classes.table,
            dataBind: {
                with: 'project'
            }
        }, [
            div({
                class: style.classes.field
            }, [
                div({
                    class: style.classes.labelCol
                }, 'created'),
                div({
                    class: style.classes.contentCol,
                    dataBind: {
                        typedText: {
                            value: 'created',
                            type: '"date"',
                            format: '"MMM DD, YYYY @ hh:mm a"'
                        }
                    }
                })]),
            div({
                class: style.classes.field
            }, [
                div({
                    class: style.classes.labelCol
                }, 'last updated'),
                div({
                    class: style.classes.contentCol,
                    dataBind: {
                        typedText: {
                            value: 'lastUpdated',
                            type: '"date"',
                            format: '"MMM DD, YYYY @ hh:mm a"'
                        }
                    }
                })])
        ]);
    }

    function buildToolbar() {
        return div({
            class: 'btn-toolbar',
            style: {
                marginBottom: '10px'
            }
        }, [
            div({
                class: 'btn-group pull-right'
            }, [
                div({
                    class: 'btn btn-default',
                    dataBind: {
                        click: 'function(){$component.doEdit.call($component)}'
                    }
                }, [
                    span({
                        class: 'fa fa-pencil'
                    }),
                    ' Edit Project'
                ])
            ]),
            // div({
            //     class: 'btn-group'
            // }, [
            //     div({
            //         class: 'btn btn-default'
            //     }, 'Create New Project')
            // ]),
            // div({
            //     class: 'btn-group'
            // }, [
            //     div({
            //         class: 'btn btn-default'
            //     }, 'Duplicate Project')
            // ])
        ]);
    }

    function buildProject() {
        return [
            buildToolbar(),
            buildProjectTable(),
            buildProjectStat()
        ];
    }

    function buildWaiting() {
        return build.loading('Loading projects');
    }

    function template() {
        return div({
            class: style.classes.component
        }, [
            gen.if('ready',
                buildProject(),
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