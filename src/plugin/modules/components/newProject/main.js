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
    './editor',
    './viewer'
], function (
    ko,
    reg,
    gen,
    ViewModelBase,
    html,
    build,
    {Model, Project},
    ProjectEditorComponent,
    ProjectViewComponent
) {
    class ViewModel extends ViewModelBase {
        constructor(params) {
            super(params);

            this.runtime = params.runtime;

            this.model = new Model({runtime: params.runtime});
            const project = new Project({});

            this.project = {
                id: project.id,
                name: ko.observable(),
                about: ko.observable(),
                description: ko.observable()
            };

            this.actions = {
                return: () => {
                    params.actions.return();
                }
            };
        }
    }

    // VIEW

    const t = html.tag,
        h3 = t('h3'),
        div = t('div');

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
        project: {
            css: {
                flex: '1 1 0px',
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

    function buildProjectEditor() {
        return gen.component2({
            name: ProjectEditorComponent.quotedName(),
            params: {
                runtime: 'runtime',
                project: 'project',
                actions: 'actions'
            }
        });
    }

    function buildProjectView() {
        return div({
            style: {
                border: '1px rgba(150, 150, 150, 1) solid',
                padding: '4px'
            },
            dataBind: {
                component: {
                    name: ProjectViewComponent.quotedName(),
                    params: {
                        runtime: 'runtime',
                        project: 'project'
                    }
                }
            }
        });
    }

    function template() {
        return div({
            class: style.classes.row
        }, [
            div({
                class: style.classes.col1
            }, [
                h3('New Project Editor'),
                buildProjectEditor()
            ]),
            div({
                class: style.classes.col1
            }, [
                h3('Preview'),
                buildProjectView()
            ])
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