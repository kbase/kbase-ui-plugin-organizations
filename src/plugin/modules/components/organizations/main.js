/*eslint {"strict": ["error", "global"]} */
'use strict';
define([
    'knockout',
    'marked',
    'kb_knockout/registry',
    'kb_knockout/lib/generators',
    'kb_knockout/lib/viewModelBase',
    'kb_knockout/components/overlayPanel',
    'kb_lib/html',
    '../organizationsList/main'
], function (
    ko,
    marked,
    reg,
    gen,
    ViewModelBase,
    OverlayPanelComponent,
    html,
    OrganizationsListComponent
) {
    class ViewModel extends ViewModelBase {
        constructor(params, {$root: {model}}) {
            super(params);

            this.runtime = params.runtime;
            this.app = params.app;

            console.log('app?',this.app);

            this.model = model;

            // overlay
            this.overlayComponent = ko.observable();


            // try this approach. We'll always load all available organizations (for now)
            // and "filter" by setting show to false, and directly sort the
            // observable array.
            this.ready = ko.observable(false);
            this.organizations = ko.observableArray();
            this.totalOrganizations = ko.observable();
            this.foundOrganizations = ko.observable();

            this.searching = ko.observable(false);
            this.searchControlValue = ko.observable();
            this.searchTerm = ko.pureComputed(() => {
                let term = this.searchControlValue();
                if (!term) {
                    return null;
                }
                term = term.trim();
                if (term.length === 0) {
                    return null;
                }
                return term;
            });

            this.subscribe(this.searchTerm, (newValue) => {
                const searchRegex = new RegExp(newValue, 'i');
                if (!newValue) {
                    this.organizations().forEach(({show}) => {
                        show(true);
                    });
                } else {
                    let found = 0;
                    this.organizations().forEach(({show, organization}) => {
                        if (searchRegex.test(organization.name)) {
                            show(true);
                            found += 1;
                        } else {
                            show(false);
                        }
                    });
                    this.foundOrganizations(found);
                }
            });

            this.sortBy = ko.observable('org');
            this.sortDirection = ko.observable('ascending');


            model.getOrganizations()
                .then((orgs) => {
                    this.organizations(orgs.map((org) => {
                        return {
                            organization: org,
                            show: ko.observable(true)
                        };
                    }));
                    this.totalOrganizations(orgs.length);
                    this.foundOrganizations(orgs.length);
                    this.ready(true);
                });
            // this.actions = {
            //     showOverlay: (component) => {
            //         this.overlayComponent(component);
            //     },
            //     return: () => {
            //         this.view('organizations');
            //     },
            //     showNewProjectForm: () => {
            //         this.view('neworganization');
            //     }
            // };
        }

        doCreateNewProject() {
            // this.view('neworganization');
        }

        doSortBy(field) {
            this.sortBy(field);
        }

        doSortDirection(direction) {
            this.sortDirection(direction);
        }
    }

    // VIEW

    const t = html.tag,
        p = t('p'),
        button = t('button'),
        span = t('span'),
        input = t('input'),
        div = t('div');

    const style = html.makeStyles({
        component: {
            css: {
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
        organizationsList: {
            css: {
                flex: '1 1 0px',
                display: 'flex',
                flexDirection: 'column'
            }
        },

        // First row takes up as much space as it needs. It contains the
        // search bar and options (buttons).
        // TODO: perhaps fixed height?
        row1: {
            css: {
                flex: '0 0 auto',
                display: 'flex',
                flexDirection: 'row',
                marginBottom: '10px'
            }
        },
        // In any case, the second row takes up the rest of the height -- it is for the display
        // of the organizations, which will stretch to fill it up.
        row2: {
            css: {
                flex: '1 1 0px',
                display: 'flex',
                flexDirection: 'row'
            }
        },
        // first column is of a set width; it holds the sort/filter controls
        col1: {
            css: {
                flex: '0 0 14em',
                margin: '0 5px'
            }
        },
        // second column fills the rest of the width -- it is for the search bar
        // and organizations list display.
        col2: {
            css: {
                flex: '1 1 0px',
                margin: '0 5px'
            }
        },
        columnHeader: {
            css: {
                fontWeight: 'bold',
                color: 'rgba(150, 150, 150, 1)',
                textAlign: 'center'
            }
        },
        // filter controls
        activeFilterInput: {
            backgroundColor: 'rgba(209, 226, 255, 1)',
            color: '#000'
        },
        modifiedFilterInput: {
            backgroundColor: 'rgba(255, 245, 158, 1)',
            color: '#000'
        },
        addonButton: {
            css: {
                color: 'black',
                cursor: 'pointer'
            },
            pseudo: {
                hover: {
                    backgroundColor: 'silver'
                },
                active: {
                    backgroundColor: 'gray',
                    color: 'white'
                }
            }
        },
        addonButtonDisabled: {
            css: {
                color: 'gray',
                cursor: 'normal'
            }
        },
        columnGroup: {
            css: {
                border: '1px rgba(200,200,200,0.5) solid',
                // padding: '4px',
                marginBottom: '14px',
                padding: '4px',
                borderRadius: '8px'
            }
        },
        fieldGroupLabel: {
            fontWeight: 'bold',
            color: 'gray',
            // marginTop: '8px',
            // marginRight: '4px'
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '1.5em',
            marginBottom: '8px'
        },
        // yuck, big honking definition of the
        filterTable: {
            css: {
                width: '100%',
                backgroundColor: '#FFF',
            },
            inner: {
                '.-header': {
                    fontStyle: 'italic',
                    color: 'rgba(0, 0, 0, 0.7)',
                    padding: '4px',
                    borderBottom: '1px silver solid',
                },
                '.-header > .-cell': {
                    display: 'inline-block'
                },
                '.-header > .-cell:nth-child(1)': {
                    width: '10%'
                },
                '.-header > .-cell:nth-child(2)': {
                    width: '90%'
                },
                '.-body-container': {
                    backgroundColor: 'rgba(255,255,255,1)',
                },
                '.-body > .-row': {
                    padding: '4px',
                    cursor: 'pointer',
                    height: '2em'
                },
                '.-body > .-row > .-cell': {
                    display: 'inline-block'
                },
                '.-body > .-row > .-cell:nth-child(1)': {
                    width: '10%'
                },
                '.-body > .-row > .-cell:nth-child(2)': {
                    width: '90%'
                }
            }
        },
    });

    function buildSearchControls() {
        return div({
            class: 'form-inline'
        }, [
            // search input
            div({
                class: 'input-group'
            }, [
                input({
                    class: ['form-control'],
                    style: {
                        width: '20em'
                    },
                    dataBind: {
                        textInput: 'searchControlValue',
                        hasFocus: true,
                        // css: 'searchInputClass',
                        // event: {
                        //     keyup: 'doKeyUp'
                        // }
                    },
                    placeholder: 'Search Organizations',
                    title: 'Search Organizations'
                }),
                // search button
                div({
                    class: ['input-group-addon ', style.classes.addonButton],
                    // dataBind: {
                    //     click: 'doSearch'
                    // },
                    title: 'Search',
                }, span({
                    class: 'fa',
                    style: {
                        fontSize: '100%',
                    },
                    dataBind: {
                        css: {
                            'fa-search': '!$component.searching()',
                            'fa-spinner fa-pulse': '$component.searching()'
                        }
                    }
                }))
            ]),
            p({
                class: 'form-control-static',
                style: {
                    marginLeft: '6px'
                }
            }, [
                'Showing ',
                gen.if('foundOrganizations() === totalOrganizations()',
                    span({
                        dataBind: {
                            text: 'foundOrganizations'
                        }
                    }),
                    [
                        span({
                            dataBind: {
                                text: 'foundOrganizations'
                            }
                        }),
                        ' of ',
                        span({
                            dataBind: {
                                text: 'totalOrganizations'
                            }
                        })
                    ]),
                ' organizations'
            ])
        ]);

    }

    function buildButtons() {
        return [
            button({
                class: 'btn btn-default',
                style: {
                    marginLeft: '20px'
                }
            }, [
                span({
                    class: 'fa fa-plus',
                    style: {
                        color: 'green'
                    }
                }),
                ' Create a New Organization'
            ])
        ];
    }

    function buildToolbar() {
        return div({
            style: {
                display: 'flex',
                flexDirection: 'row',
            }
        }, [
            div({
                style: {
                    flex: '2 1 0px'
                }
            }, buildSearchControls()),

            div({
                style: {
                    flex: '1 1 0px',
                    textAlign: 'right'
                }
            }, buildButtons())
        ]);

    }

    function buildRadioButton() {
        return div({
            class: '-row',
            dataBind: {
                css: {
                    [style.classes.activeFilterInput]: 'selector(field)'
                },
                click: '() => {$component[toggler].call($component, field)}'
            }
        }, [
            div({
                class: '-cell'
            },
            span({
                class: 'fa',
                dataBind: {
                    css: {
                        'fa-check-circle-o': 'selector(field)',
                        'fa-circle-o': '!selector(field)'
                    }
                }
            })
            ),
            div({
                class: '-cell',
                dataBind: {
                    text: 'label'
                }
            })
        ]);
    }

    function buildSortTable() {
        return div({
            class: style.classes.filterTable
        }, [
            div({
                class: '-body-container'
            }, div({
                class: '-body'
            }, [
                gen.let({
                    selector: '(field) => {return sortBy() === field}',
                    toggler: '"doSortBy"'
                }, [
                    gen.let({
                        field: '"org"',
                        label: '"Org name"'
                    }, buildRadioButton()),
                    gen.let({
                        field: '"createdAt"',
                        label: '"Created"'
                    }, buildRadioButton()),
                    gen.let({
                        field: '"modifiedAt"',
                        label: '"Last Updated"'
                    }, buildRadioButton()),
                    gen.let({
                        field: '"owner"',
                        label: '"Owner"'
                    }, buildRadioButton())
                ]),

                div({
                    style: {
                        marginTop: '10px'
                    }
                }),
                gen.let({
                    selector: '(field) => {return sortDirection() === field}',
                    toggler: '"doSortDirection"'
                }, [
                    gen.let({
                        field: '"ascending"',
                        label: '"Ascending"'
                    }, buildRadioButton()),
                    gen.let({
                        field: '"descending"',
                        label: '"Descending"'
                    }, buildRadioButton())
                ])
            ]))
        ]);
    }

    function buildFilterTable() {
        return div({
            class: style.classes.filterTable
        }, [
            div({
                class: '-body-container'
            }, div({
                class: '-body'
            }, [
                div({
                    class: '-row',
                    // dataBind: {
                    //     css: {
                    //         [style.classes.activeFilterInput]: 'withPrivateData()'
                    //     },
                    //     click: 'function(d,e){$component.togglePrivateData.call($component,d,e);}'
                    // }
                }, [
                    div({
                        class: '-cell'
                    },
                    span({
                        class: 'fa fa-square-o',
                        // dataBind: {
                        //     style: {
                        //         color: 'withPublicData() && authorized() ? "#000" : "#AAA"'
                        //     },
                        //     css: {
                        //         'fa-check-square-o': 'withPrivateData()',
                        //         'fa-square-o': '!withPrivateData()'
                        //     }
                        // }
                    })
                    ),
                    div({
                        class: '-cell'
                    }, 'Your orgs')
                ])
            ]))
        ]);
    }

    function buildOrganizationsList() {
        return div({
            class: style.classes.organizationsList
        },[
            div({
                class: style.classes.row1
            }, [
                div({
                    class: style.classes.col1
                }),
                div({
                    class: style.classes.col2
                }, buildToolbar())
            ]),
            div({
                class: style.classes.row2
            }, [
                div({
                    class: style.classes.col1
                }, [
                    div({
                        class: style.classes.columnGroup
                    }, [
                        div({
                            class: style.classes.columnHeader
                        }, 'sort'),
                        buildSortTable()
                    ]),
                    // div({
                    //     class: style.classes.columnHeader,
                    //     // title: text.getTooltip('FILTERS_HEADER')
                    // }, span({
                    //     // class: commonStyle.classes.tooltipLight
                    // }, 'Filters')),
                    // div({
                    //     class: style.classes.columnGroup
                    // }, [
                    //     // div({
                    //     //     class: style.classes.fieldGroupLabel
                    //     // }, span({
                    //     //     // class: commonStyle.classes.tooltipDark,
                    //     //     // title: text.getTooltip('DATA_PRIVACY_HEADER')
                    //     // }, 'Data Privacy')),
                    //     // gen.component({
                    //     //     name: DataPrivacyComponent.name(),
                    //     //     params: {
                    //     //         withPrivateData: 'withPrivateData',
                    //     //         withPublicData: 'withPublicData'
                    //     //     }
                    //     // })
                    // ]),
                    div({
                        class: style.classes.columnGroup,
                        style: {
                            marginTop: '20px'
                        }
                    }, [
                        div({
                            class: style.classes.columnHeader
                        }, 'filter'),
                        buildFilterTable()
                    ])
                ]),
                div({
                    class: style.classes.col2,
                    style: {
                        display: 'flex',
                        flexDirection: 'column'
                    }
                }, [
                    // h3({
                    //     style: {
                    //         marginTop: '0px'
                    //     }
                    // }, 'Organizations'),
                    gen.component({
                        name: OrganizationsListComponent.name(),
                        params: ['runtime', 'app', 'searchTerm', 'organizations']
                    })
                ])
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
            gen.if('ready',
                buildOrganizationsList(),
                'loading...')
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