define([
    'knockout',
    'kb_knockout/registry',
    'kb_knockout/lib/generators',
    'kb_knockout/lib/viewModelBase',
    'kb_lib/html',
    'kb_lib/htmlBootstrapBuilders',
    'kb_lib/htmlBuilders',
    '../../lib/ui',
    '../../lib/model',
    './narrativeSelector',

    // for effect
    'select2'
], function (
    ko,
    reg,
    gen,
    ViewModelBase,
    html,
    BS,
    htmlBuilders,
    ui,
    model,
    NarrativeSelectorComponent
) {
    'use strict';

    // VIEWMODEL

    class ViewModel extends ViewModelBase {
        constructor(params, context) {
            super(params);
            this.runtime = context.$root.runtime;
            this.objectsToCopy = ko.unwrap(params.objectsToCopy);
            this.objectToView = ko.observable();

            this.copyMethod = ko.observable();
            this.selectedNarrative = ko.observable();
            this.selectedNarrativeObject = ko.observable();
            this.errorMessage = ko.observable();
            this.completionMessage = ko.observable();
            this.newNarrativeName = ko.observable();
            this.copyStatus = ko.observable('none');
            this.selectedObjects = ko.observableArray();
            this.title = 'Copy Object';

            this.messages = {
                removeObjectFromList: 'Remove this object from the list of selected objects to copy.',
                cannotRemoveLastObjectFromList: 'Sorry, cannot remove the last object from the list.'
            };

            this.model = new model.Model({
                runtime: this.runtime
            });

            this.canCopy = ko.pureComputed(() => {
                switch (this.copyStatus()) {
                case 'none':
                    switch (this.copyMethod()) {
                    case 'existing':
                        if (this.selectedNarrativeObject()) {
                            return true;
                        }
                        break;
                    case 'new':
                        if (this.newNarrativeName()) {
                            return true;
                        }
                    }
                    return false;

                case 'copying':
                    return false;
                case 'success':
                    return true;
                case 'error':
                    return false;
                default:
                    console.warn('Unknown copy status: ', this.copyStatus());
                    return false;
                }
            });

            // subscriptions

            this.subscribe(this.copyMethod, (newValue) => {
                switch (newValue) {
                case 'new':
                    this.selectedNarrative(null);
                    break;
                }
            });

            this.subscribe(this.selectedNarrative, (newValue) => {
                if (!newValue) {
                    this.copyMethod('new');
                } else {
                    this.copyMethod('existing');
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
                            this.copyStatus('error');
                            this.errorMessage(err.message);
                        })
                        .catch((err) => {
                            console.error(err);
                            this.copyStatus('error');
                            this.errorMessage('unknown error');
                        });
                }
            });

            // MAIN
            this.model.getObjectsInfo(this.objectsToCopy)
                .then((objectsInfo) => {
                    this.selectedObjects(objectsInfo.map((objectInfo) => {
                        return {
                            workspaceInfo: objectInfo.workspaceInfo,
                            objectInfo: objectInfo.objectInfo,
                            selected: ko.observable()
                        };
                    }));
                });
        }

        viewObject(ref) {
            this.model.getObjectInfo(ref)
                .then((objectInfo) => {
                    this.objectToView(objectInfo);
                });
        }

        doSelectObject(data) {
            if (data.selected()) {
                data.selected(false);
                this.objectToView(null);
            } else {
                this.selectedObjects().forEach((obj) => {
                    obj.selected(false);
                });
                data.selected(true);
                this.viewObject({
                    workspaceId: data.workspaceInfo.id,
                    objectId: data.objectInfo.id,
                    version: data.objectInfo.version
                });
            }
        }

        makeNarrativeUrl(path) {
            const base = this.runtime.config('services.narrative.url');
            return base + path;
        }

        // DATA CALLS

        copyIntoNarrative(arg) {
            return this.model.copyObjects({
                sourceObjectRefs: this.selectedObjects().map((object) => {
                    return object.objectInfo.ref;
                }),
                targetWorkspaceId: arg.workspaceId
            });
        }

        copyIntoNewNarrative(newNarrativeTitle) {
            return this.model.createNarrative({
                title: newNarrativeTitle
            })
                .then((newNarrative) => {
                    return this.model.copyObjects({
                        sourceObjectRefs: this.selectedObjects().map((object) => {
                            return object.objectInfo.ref;
                        }),
                        targetWorkspaceId: newNarrative.workspaceInfo.id
                    })
                        .then(() => {
                            return newNarrative;
                        });
                });
        }

        // ACTIONS

        doClose() {
            // TODO.
            this.send('close');
        }

        doCopy() {
            this.errorMessage('');
            this.copyStatus('copying');
            switch (this.copyMethod()) {
            case 'new':
                this.copyIntoNewNarrative(this.newNarrativeName())
                    .then((newNarrative) => {
                        const narrativeId = [
                            'ws',
                            newNarrative.workspaceInfo.id,
                            'obj',
                            newNarrative.objectInfo.id
                        ].join('.');
                        const narrativeUrl = this.makeNarrativeUrl('/narrative/' + narrativeId);
                        this.selectedNarrativeObject({
                            workspaceInfo: newNarrative.workspaceInfo,
                            objectInfo: newNarrative.objectInfo,
                            url: narrativeUrl
                        });
                        this.copyStatus('success');
                    })
                    .catch((err) => {
                        this.copyStatus('error');
                        this.errorMessage(err.message);
                    });
                break;
            case 'existing':
                if (this.selectedNarrativeObject()) {
                    const narrative = this.selectedNarrativeObject();
                    this.copyIntoNarrative({
                        workspaceId: narrative.workspaceInfo.id
                    })
                        .then(() => {
                            const narrativeId = [
                                'ws',
                                narrative.workspaceInfo.id,
                                'obj',
                                narrative.objectInfo.id
                            ].join('.');
                            const narrativeUrl = this.makeNarrativeUrl('/narrative/' + narrativeId);
                            this.selectedNarrativeObject({
                                workspaceInfo: narrative.workspaceInfo,
                                objectInfo: narrative.objectInfo,
                                url: narrativeUrl
                            });
                            this.copyStatus('success');
                        })
                        .catch((err) => {
                            console.error('ERROR copying objects into narrative', err);
                            this.copyStatus('error');
                            this.errorMessage(err.message);
                        });
                } else {
                    this.errorMessage('You must select a narrative before copying the data object into it.');
                }
                break;
            }
        }

        doRemoveObject(data) {
            if (data.selected()) {
                this.objectToView(null);
            }
            this.selectedObjects.remove(data);
        }
    }

    // VIEW

    const t = html.tag,
        a = t('a'),
        h3 = t('h3'),
        div = t('div'),
        span = t('span'),
        input = t('input'),
        button = t('button'),
        table = t('table'),
        thead = t('thead'),
        tbody = t('tbody'),
        tr = t('tr'), td = t('td'), th = t('th'),
        p = t('p'), b = t('b');

    var style = html.makeStyles({
        viewTable: {
            css: {
                width: '100%'
            },
            inner: {
                td: {
                    border: 'none',
                    padding: '3px',
                    verticalAlign: 'top'
                },
                th: {
                    border: 'none',
                    padding: '3px',
                    verticalAlign: 'top',
                    fontWeight: 'normal'
                },
                'td:nth-child(1)': {
                    width: '30%'
                },
                'th:nth-child(1)': {
                    width: '30%'
                }
            }
        },
        selectedObjectsTable: {
            css: {
                width: '100%'
            },
            inner: {
                'tbody tr:hover': {
                    backgroundColor: 'rgba(200,200,200,0.8)'
                },
                td: {
                    borderBottom: '1px solid rgba(200,200,200,0.8)',
                    padding: '3px',
                    verticalAlign: 'middle'
                },
                th: {
                    borderBottom: '1px solid rgba(200,200,200,0.8)',
                    padding: '3px',
                    verticalAlign: 'top',
                    fontWeight: 'normal',
                    fontStyle: 'italic'
                },
                'td:nth-child(1)': {
                    width: '30%'
                },
                'th:nth-child(1)': {
                    width: '30%'
                },
                'td:nth-child(3)': {
                    textAlign: 'center'
                },
                'th:nth-child(3)': {
                    textAlign: 'center'
                }
            }
        },
        selectableRow: {
            css: {},
            modifiers: {
                selected: {
                    backgroundColor: 'rgba(200,200,200,1)'
                }
            }
        }
    });

    function buildObjectView() {
        return table({
            class: style.classes.viewTable
        }, [
            tr([
                th('name'),
                td({
                    dataBind: {
                        text: 'objectInfo.name'
                    }
                })]),
            tr([
                th('modified'),
                td({
                    dataBind: {
                        typedText: {
                            value: 'objectInfo.saveDate',
                            type: '"date"',
                            format: '"MM/DD/YYYY"'
                        }
                    }
                })]),
            tr([
                th('by'),
                td({
                    dataBind: {
                        text: 'objectInfo.saved_by'
                    }
                })]),
            tr([
                th('type'),
                td({
                    dataBind: {
                        text: 'objectInfo.typeName'
                    }
                })]),
            tr([
                th('module'),
                td({
                    dataBind: {
                        text: 'objectInfo.typeModule'
                    }
                })]),
            tr([
                th('version'),
                td([
                    span({
                        dataBind: {
                            text: 'objectInfo.typeMajorVersion'
                        }
                    }),
                    '.',
                    span({
                        dataBind: {
                            text: 'objectInfo.typeMinorVersion'
                        }
                    })
                ])])
        ]);
    }

    function buildObjectList() {
        return div({class: 'container-fluid'}, [
            h3('Selected objects'),
            div({
                class: 'row'
            }, [
                div({
                    class: 'col-md-8'
                }, [
                    gen.ifnot('selectedObjects().length',
                        span('no objects selected'),
                        table({
                            class: style.classes.selectedObjectsTable
                        }, [
                            thead([
                                tr([
                                    th('type'),
                                    th('object name'),
                                    th('remove')
                                ])
                            ]),
                            tbody({
                                dataBind: {
                                    foreach: 'selectedObjects'
                                }
                            }, [
                                tr({
                                    class: [style.classes.selectableRow],
                                    style: {
                                        cursor: 'pointer'
                                    },
                                    dataBind: {
                                        click: 'function(d,e){$component.doSelectObject.call($component,d,e)}',
                                        class: 'selected() ? "' + style.scopes.selected + '" : false'
                                    }
                                }, [
                                    td({
                                        style: {
                                            width: '2em'
                                        },
                                        dataBind: {
                                            text: 'objectInfo.typeName'
                                        }
                                    }),
                                    td({
                                        dataBind: {
                                            text: 'objectInfo.name'
                                        }
                                    }),
                                    td({
                                        style: {
                                            textAlign: 'center'
                                        }
                                    }, button({
                                        type: 'button',
                                        class: 'btn btn-xs btn-danger btn-kb-flat',
                                        dataBind: {
                                            click: 'function(d,e){$component.doRemoveObject.call($component,d,e)}',
                                            enable: '$component.selectedObjects().length > 1',
                                            attr: {
                                                title: '$component.selectedObjects().length > 1 ? $component.messages.removeObjectFromList : $component.messages.cannotRemoveLastObjectFromList'
                                            }
                                        }
                                    }, span({
                                        class: 'fa fa-times'
                                    })))
                                ])
                            ])
                        ]))
                ]),
                div({
                    class: 'col-md-4'
                }, div({
                    class: 'panel panel-default',
                    style: {
                        width: '100%'
                    }
                }, [
                    div({
                        class: 'panel-heading'
                    }, [
                        div({
                            class: 'panel-title',
                            dataBind: {
                                style: {
                                    color: 'objectToView() ?  "black" : "gray"'
                                }
                            }
                        }, 'Inspect Selected Object')
                    ]),
                    div({
                        class: 'panel-body'
                    }, [
                        gen.if('objectToView',
                            gen.with('objectToView', buildObjectView()),
                            'If you click on an object listed on the left, its detail will show here')
                    ])
                ]))
            ])
        ]);
    }

    function buildIntro() {
        return  p([
            'You may use this  panel to copy the ', b('data object'),
            ' you are viewing into either a ', b('new Narrative'),
            ', which will be created on the fly, or an ', b('existing Narrartive'),
            ' which you may select from the list below.'
        ]);
    }

    function buildCopyForm() {
        return div({class: 'container-fluid'}, [
            h3('Select Narrative'),
            div({class: 'row'}, [
                div({class: 'col-md-8'}, [
                    div({
                        class: 'row'
                    }, [
                        div({
                            class: 'col-sm-2'
                        }, input({
                            type: 'radio',
                            name: 'copyMethod',
                            value: 'new',
                            dataBind: {
                                checked: 'copyMethod'
                            }
                        })),
                        div({
                            class: 'col-sm-10'
                        }, 'Copy into New Narrative')
                    ]),
                    gen.if('copyMethod() === "new"',
                        div({
                            class: 'row'
                        }, [
                            div({
                                class: 'col-sm-2'
                            }),
                            div({
                                class: 'col-sm-10'
                            }, div({
                                style: {
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center'
                                }
                            }, [
                                div({
                                    style: {
                                        flex: '0 0 auto',
                                        weight: 'bold',
                                        color: 'rgb(100,100,100)',
                                        marginRight: '4px'
                                    }
                                }, 'Name '),
                                div({
                                    style: {
                                        flex: '1'
                                    }
                                }, input({
                                    class: 'form-control',
                                    style: {
                                        width: '100%'
                                    },
                                    dataBind: {
                                        textInput: 'newNarrativeName'
                                    }
                                }))
                            ]))
                        ])),
                    div({
                        class: 'row'
                    }, [
                        div({
                            class: 'col-sm-2'
                        }),
                        div({
                            class: 'col-sm-10',
                            style: {
                                fontStyle: 'italic',
                                padding: '6px'
                            }
                        }, ' - or - ')
                    ]),

                    div({
                        class: 'row'
                    }, [
                        div({
                            class: 'col-sm-2'
                        }, input({
                            type: 'radio',
                            name: 'copyMethod',
                            value: 'existing',
                            dataBind: {
                                checked: 'copyMethod'
                            }
                        })),
                        div({
                            class: 'col-sm-10'
                        }, [
                            'Copy into an existing Narrative: ',
                            gen.ifnot('copyMethod() === "existing"',
                                div({
                                    style: {
                                        fontStyle: 'italic'
                                    }
                                }, 'select a writable narrative.'),
                                div({
                                    style: {
                                        marginBottom: '20px'
                                    },
                                    dataBind: {
                                        component: {
                                            name: NarrativeSelectorComponent.quotedName(),
                                            params: {
                                                selectedNarrative: 'selectedNarrative'
                                            }
                                        }
                                    }
                                })),
                        ])
                    ])
                ]),
                div({class: 'col-md-4'}, [

                    div({class: 'panel panel-default'}, [
                        div({class: 'panel-heading'}, [
                            div({
                                class: 'panel-title',
                                dataBind: {
                                    style: {
                                        color: 'selectedNarrativeObject() ? "black" : "gray"'
                                    }
                                }
                            }, [
                                'Selected Narrative'
                            ])
                        ]),
                        div({class: 'panel-body'}, [
                            gen.ifnot('copyMethod',
                                'When you have selected a narrative to copy into, details about it will be shown here'),

                            gen.if('copyMethod() === "existing"', [
                                p([
                                    'The data object will be copied into the following Narrative:'
                                ]),
                                gen.ifnot('selectedNarrativeObject()',
                                    p({
                                        style: {
                                            fontStyle: 'italic',
                                            textAlign: 'center'
                                        }
                                    }, 'Select a narrative from those available to you on the left.')),
                                gen.with('selectedNarrativeObject',
                                    table({
                                        class: style.classes.viewTable
                                    }, [

                                        tr([
                                            th('Name'),
                                            td({
                                                dataBind: {
                                                    text: 'workspaceInfo.metadata.narrative_nice_name'
                                                }
                                            })
                                        ]),
                                        tr([
                                            th('Ref'),
                                            td({
                                                dataBind: {
                                                    text: 'objectInfo.ref'
                                                }
                                            })
                                        ]),
                                        tr([
                                            th('Owner'),
                                            td({
                                                dataBind: {
                                                    text: 'objectInfo.saved_by'
                                                }
                                            })
                                        ]),
                                        tr([
                                            th('Modified'),
                                            td({
                                                dataBind: {
                                                    typedText: {
                                                        value: 'objectInfo.saveDate',
                                                        type: '"date"',
                                                        format: '"MM/DD/YYYY"'
                                                    }
                                                }
                                            })
                                        ])
                                    ]))
                            ]),

                            gen.if('copyMethod() === "new"',
                                p([
                                    'A new narrative will be created containing this data object.'
                                ]))
                        ])
                    ])
                ])
            ])
        ]);
    }

    function buildCopyButton() {
        return div({
            class: 'container-fluid'
        }, [
            div({
                class: 'row'
            }, [
                div({
                    class: 'col-md-8'
                }, [
                    gen.if('$component.selectedObjects().length === 0',
                        'No objects to copy!'),
                    gen.if('$component.selectedObjects().length > 0',
                        button({
                            type: 'button',
                            class: 'btn btn-primary',
                            dataBind: {
                                enable: 'canCopy',
                                click: 'doCopy'
                            }
                        }, [
                            'Copy Object',
                            gen.if('$component.selectedObjects().length > 1',
                                's'),
                            ' into Narrative'
                        ]))
                ]),
                div({
                    class: 'col-md-4'
                })
            ])
        ]);
    }

    function buildSuccessPanel() {
        return [
            gen.if('copyStatus() === "success"',
                BS.buildPanel({
                    type: 'success',
                    title: 'Successfully Copied',
                    body:  div([
                        p([
                            'Successfully copied this data object to the Narrative ',
                            span({
                                style: {
                                    fontWeight: 'bold'
                                },
                                dataBind: {
                                    text: 'selectedNarrativeObject().workspaceInfo.metadata.narrative_nice_name'
                                }
                            })
                        ]),
                        p([
                            span({
                                style: {
                                    fontStyle: 'italic'
                                }
                            }, a({
                                dataBind: {
                                    attr: {
                                        href: 'selectedNarrativeObject().url'
                                    }
                                },
                                class: 'btn btn-default',
                                target: '_blank'
                            }, 'Open this Narrative'))
                        ])
                    ])
                })),
        ];
    }

    function buildErrorPanel() {
        return [
            gen.if('copyStatus() === "error"',
                BS.buildPanel({
                    type: 'error',
                    title: 'Error',
                    body:  div([
                        p('An error occurred attempting to copy the data:'),
                        p({
                            dataBind: {
                                text: 'errorMessage'
                            }
                        })
                    ])
                }))
        ];
    }

    function buildInProgressPanel() {
        return [
            gen.if('copyStatus() === "copying"',
                BS.buildPanel({
                    type: 'info',
                    title: 'In Progress',
                    body:  div([
                        htmlBuilders.loading('Copying')
                    ])
                })),
        ];
    }

    function template() {
        return div([
            ui.buildDialog({
                title: span({dataBind: {text: 'title'}}),
                icon: 'clone',
                body: div({
                    class: 'container-fluid'
                }, [
                    buildIntro(),
                    buildObjectList(),
                    buildCopyForm(),
                    buildCopyButton(),
                    div({
                        style: {
                            marginTop: '12px'
                        }
                    }, [
                        buildSuccessPanel(),
                        buildInProgressPanel(),
                        buildErrorPanel()
                    ])
                ]),
                buttons: [
                    {
                        type: 'default',
                        label: 'Close',
                        onClick: 'doClose'
                    }
                ],
            })
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