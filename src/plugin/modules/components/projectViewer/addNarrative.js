/*eslint {"strict": ["error", "global"]} */
'use strict';
define([
    'knockout',
    'kb_knockout/registry',
    'kb_knockout/lib/generators',
    'kb_knockout/lib/viewModelBase',
    'kb_lib/html',
    '../../lib/ui',
    '../../lib/model',
    './narrativeSelector',
    './selectedNarrative'
], function (
    ko,
    reg,
    gen,
    ViewModelBase,
    html,
    {buildDialog},
    {Model, NarrativeIdentity},
    NarrativeSelectorComponent,
    SelectedNarrativeComponent
) {
    class ViewModel extends ViewModelBase {
        constructor(params, {$parent}) {
            super(params);
            const {projectId, runtime, addNarrative} = params;
            this.projectId = projectId;
            this.addNarrative = addNarrative;

            this.model = new Model({runtime});

            this.selectedNarrative = ko.observable();
            this.selectedNarrativeObject = ko.observable();

            this.parent = $parent;

            this.status = ko.observable();
            this.error = ko.observable();

            this.subscribe(this.selectedNarrative, (newValue) => {
                if (!newValue) {
                    this.selectedNarrativeObject(null);
                    this.status(null);
                    return;
                }
                const parts = newValue.split('/');
                const workspaceId = parts[0];
                const objectId = parts[1];
                this.model.getNarrative({
                    workspaceId: workspaceId,
                    objectId: objectId
                })
                    .then((narrative) => {
                        this.selectedNarrativeObject(narrative);
                    })
                    .catch(Error, (err) => {
                        console.error(err);
                        // this.errorMessage(err.message);
                    })
                    .catch((err) => {
                        console.error(err);
                        // this.errorMessage('unknown error');
                    });
            });
        }

        onClose() {
            this.parent.bus.send('close');
        }

        doAddNarrative() {
            this.addNarrative(new NarrativeIdentity({
                workspaceId: this.selectedNarrativeObject().workspaceInfo.id,
                objectId: this.selectedNarrativeObject().objectInfo.id
            }))
                .then(() => {
                    this.status('success');
                })
                .catch((err) => {
                    this.status('error');
                    this.error(err);
                });
        }
    }

    const t = html.tag,
        p = t('p'),
        button = t('button'),
        span = t('span'),
        div = t('div');

    const style = html.makeStyles({
        component: {
            css: {
                flex: '1 1 0px',
                // display: 'flex',
                // flexDirection: 'column'
            }
        },
        row: {
            css: {
                flex: '1 1 0px',
                display: 'flex',
                flexDirection: 'row'
            }
        }
    });

    function buildToolbar() {
        return div({
            style: {
                textAlign: 'center'
            }
        }, [
            button({
                class: 'btn btn-default',
                dataBind: {
                    click: 'function(d){$component.doAddNarrative.call($component, d)}'
                }
            }, [
                span({
                    class: 'fa fa-plus text-success'
                }),
                ' Add Narrative to Project'
            ])
        ]);
    }

    function buildSuccess() {
        return div({
            class: 'alert alert-success',
            style: {
                marginTop: '10px'
            }
        }, [
            p('Narrative successfully added to this project.'),
            p('You may add another or close this dialog')
        ]);
    }

    function buildResponseArea() {
        return gen.switch('status', [
            [
                '"success"', buildSuccess()
            ]
        ]);
    }

    function buildBody() {
        return div({
            class: style.classes.component
        }, [
            div({
                class: style.classes.row
            }, [
                p('Select a narrative to add to this project.')
            ]),
            div({
                class: style.classes.row
            }, [
                div({
                    style: {
                        flex: '1 1 0px',
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '4px'
                    }
                }, [
                    div({
                        class: style.classes.component,
                        dataBind: {
                            component: {
                                name: NarrativeSelectorComponent.quotedName(),
                                params: {
                                    selectedNarrative: 'selectedNarrative'
                                }
                            }
                        }
                    })
                ]),
                div({
                    style: {
                        flex: '1 1 0px'
                    }
                }, gen.if('selectedNarrativeObject()',
                    [
                        div({
                            style: {
                                fontWeight: 'bold',
                                fontSize: '110%',
                                textAlign: 'center',
                                padding: '4px'
                            }
                        }, 'Selected Narrative'),
                        div({
                            class: 'well',
                            dataBind: {
                                component: {
                                    name: SelectedNarrativeComponent.quotedName(),
                                    params: {
                                        narrative: 'selectedNarrativeObject'
                                    }
                                }
                            }
                        }),
                        buildToolbar(),
                        buildResponseArea()
                    ],
                    p({
                        style: {
                            fontStyle: 'italic',
                            textAlign: 'center'
                        }
                    }, 'Select a narrative from those available to you on the left.')))
            ])
        ]);
    }

    function template() {
        return buildDialog({
            title: 'Add Narrative to Project',
            body: buildBody()
        });
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