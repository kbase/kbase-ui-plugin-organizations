/*eslint {"strict": ["error", "global"]} */
'use strict';
define([
    'knockout',
    'kb_knockout/registry',
    'kb_knockout/lib/generators',
    'kb_lib/html',
    './project',
    './narratives',
    '../editProject/main'
], function (
    ko,
    reg,
    gen,
    html,
    ProjectComponent,
    NarrativesComponent,
    ProjectEditorComponent
) {
    class ViewModel {
        constructor({runtime, projectId}) {
            this.runtime = runtime;
            this.projectId = projectId;

            this.view = ko.observable('view');
            this.actions = {
                showEditForm: () => {
                    this.view('edit');
                },
                showProjectView: () => {
                    this.view('view');
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
                // padding: '10px'
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
                margin: '0 5px',
                // padding: '10px'
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

    function buildProject() {
        return gen.component2({
            name: ProjectComponent.quotedName(),
            params: {
                runtime: 'runtime',
                projectId: 'projectId',
                showEditForm: 'actions.showEditForm'
            }
        });
    }

    function buildNarratives() {
        return gen.component2({
            name: NarrativesComponent.quotedName(),
            params: {
                runtime: 'runtime',
                projectId: 'projectId'
            }
        });
    }


    function buildProjectViewer() {
        return div({
            class: style.classes.row
        }, [
            div({
                class: style.classes.col1
            }, [
                h3({
                    style: {
                        marginTop: '0px'
                    }
                }, 'Narratives'),
                buildNarratives()
            ]),
            div({
                class: style.classes.col1
            }, [
                h3({
                    style: {
                        marginTop: '0px'
                    }
                }, 'Project'),
                buildProject()
            ])
        ]);
    }

    function buildProjectEditor() {
        return gen.component({
            name: ProjectEditorComponent.name(),
            params: {
                runtime: 'runtime',
                projectId: 'projectId',
                actions: 'actions'
            }
        });
    }

    function template() {
        return div({
            class: style.classes.component
        }, gen.switch('view', [
            [
                '"view"', buildProjectViewer()
            ],
            [
                '"edit"', buildProjectEditor()
            ]
        ]));
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