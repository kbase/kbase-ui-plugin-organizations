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
    {Model, Project}
) {
    class ViewModel {
        constructor({runtime, project, actions}) {
            this.runtime = runtime;
            this.project = project;
            this.actions = actions;

            this.model = new Model({runtime});

            // this.name = null;
            // this.id = null;
            // this.slug = null;
            // this.shortDescription = null;
            // this.description = null;
            // this.owner = null;
            // this.created = null;
            // this.lastUpdated = null;

            this.ready = ko.observable(true);

            // this.model.getProject(projectId)
            //     .then((project) => {
            //         this.name = project.name;
            //         this.id = project.id;
            //         this.slug = project.slug;
            //         this.shortDescription = project.shortDescription;
            //         this.description = project.description;
            //         this.owner = project.owner;
            //         this.created = project.created;
            //         this.lastUpdated = project.lastUpdated;

            //         this.ready(true);
            //     });
        }

        doSave() {
            this.model.createProject(new Project({
                name: this.project.name(),
                about: this.project.about(),
                description: this.project.description()
            }))
                .then(() => {
                    this.actions.return();
                });
        }

        doCancel() {
            this.actions.return();
        }
    }

    // VIEW

    const t = html.tag,
        div = t('div'),
        button = t('button'),
        input = t('input'),
        textarea = t('textarea');

    const style = html.makeStyles({
        component: {
            css: {
                flex: '1 1 0px',
                display: 'flex',
                flexDirection: 'column',
                padding: '10px'
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
                flexDirection: 'column'
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
                flex: '1 1 0px'
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
                    class: style.classes.contentCol
                }, input({
                    class: 'form-control',
                    dataBind: {
                        textInput: 'name'
                    }
                }))]),
            div({
                class: style.classes.field
            }, [
                div({
                    class: style.classes.labelCol
                }, 'about'),
                div({
                    class: style.classes.contentCol
                }, input({
                    class: 'form-control',
                    dataBind: {
                        textInput: 'about'
                    }
                }))]),
            div({
                class: style.classes.field
            }, [
                div({
                    class: style.classes.labelCol
                }, 'description'),
                div({
                    class: style.classes.contentCol
                }, textarea({
                    class: 'form-control',
                    style: {
                        height: '20em'
                    },
                    dataBind: {
                        textInput: 'description'
                    }
                }))]),
        ]);
    }

    function buildToolbar() {
        return div({
            style: {
                textAlign: 'center',
                marginTop: '20px'
            }
        }, [
            button({
                class: 'btn btn-primary',
                style: {
                    padding: 'margin: px'
                },
                dataBind: {
                    click: 'doSave'
                }
            }, 'Save'),
            button({
                class: 'btn btn-danger',
                style: {
                    margin: '4px'
                },
                dataBind: {
                    click: 'doCancel'
                }
            }, 'Cancel')
        ]);
    }

    function buildProject() {
        return [
            buildProjectTable(),
            buildToolbar()
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