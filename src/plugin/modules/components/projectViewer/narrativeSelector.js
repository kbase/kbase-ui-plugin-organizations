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
    htmlBuilders,
    model
) {
    'use strict';

    const t = html.tag,
        div = t('div'),
        span = t('span'),
        input = t('input'),
        select = t('select');

    class ViewModel {
        constructor(params, context) {
            this.runtime = context.$root.runtime;

            this.model = new model.Model({
                runtime: this.runtime
            });

            this.selectedNarrative = ko.observable();
            this.selectedNarrative.syncWith(params.selectedNarrative);

            this.sortOptions = [
                {
                    label: 'Title',
                    value: 'title',
                    selected: ko.observable(false)
                },
                {
                    label: 'Date',
                    value: 'date',
                    selected: ko.observable(false)
                },
            ];
            this.sortOption = ko.observable('date');

            this.sortDirection = ko.observable('descending');

            // TODO: a ready() flag so we can disable the control until data is loaded.

            this.ready = ko.observable(false);
            this.narratives = ko.observableArray([]);
            this.error = ko.observable();

            this.inputValue = ko.observable().extend({rateLimit: 150});

            this.loading = ko.observable(false);

            this.searchExpression = ko.pureComputed(() => {
                if (!this.inputValue() || this.inputValue().length < 2) {
                    return null;
                }
                return this.inputValue();
            });

            function cmp(a, b) {
                if (a < b) {
                    return -1;
                } else if (a > b) {
                    return 1;
                }
                return 0;
            }

            this.sortDir = ko.pureComputed(() => {
                if (this.sortDirection() === 'ascending') {
                    return 1;
                } else {
                    return -1;
                }
            });

            this.narrativesFiltered = ko.pureComputed(() => {
                const search = this.searchExpression();

                let nar;
                if (!search) {
                    nar = this.narratives();
                } else {
                    const searchString = search.toLowerCase();
                    nar = this.narratives()
                        .filter((narrative) => {
                            return Object.keys(narrative.searchable).some((key) => {
                                return (narrative.searchable[key].indexOf(searchString) >= 0);
                            });
                        });
                }

                const sortField = this.sortOption();

                return nar
                    .sort((a, b) => {
                        var dir = this.sortDir();
                        switch (sortField) {
                        case 'title':
                            return dir * cmp(a.sortable.title, b.sortable.title);
                        case 'username':
                            return dir * cmp(a.sortable.username, b.sortable.username);
                        case 'date':
                        default:
                            return dir * cmp(a.sortable.date, b.sortable.date);
                        }
                    });
            });

            this.totalCount = ko.pureComputed(() => {
                return this.narratives().length;
            });

            this.tooManyResults = ko.observable(false);
            this.searchCount = ko.observable();
            this.isSearching = ko.observable(false);

            // MAIN


            this.model.getAccessibleNarratives()
                .then((writableNarratives) => {
                    writableNarratives.forEach((narrative) => {
                        this.narratives.push({
                            title: narrative.metadata.narrative_nice_name,
                            ref: [String(narrative.id), narrative.metadata.narrative].join('/'),
                            owner: narrative.owner,
                            realName: narrative.ownerRealName,
                            date: narrative.modDate,
                            searchable: {
                                title: narrative.metadata.narrative_nice_name.toLowerCase(),
                                owner: narrative.owner,
                                realName: narrative.ownerRealName.toLowerCase()
                            },
                            sortable: {
                                title: narrative.metadata.narrative_nice_name.toLowerCase(),
                                owner: narrative.owner,
                                date: narrative.modDate.getTime()
                            },
                            active: ko.observable(false),
                            selected: ko.observable(false)
                        });
                    });
                    this.ready(true);
                })
                .catch((err) => {
                    this.error(err);
                });
        }

        doSelectValue(selected) {
            if (selected.selected()) {
                selected.selected(false);
                this.selectedNarrative(null);
                return;
            }
            this.narrativesFiltered().forEach((narrative) => {
                narrative.selected(false);
            });
            this.selectedNarrative(selected.ref);
            selected.selected(true);
        }

        doActivate(selected) {
            selected.active(true);
        }

        doDeactivate(selected) {
            selected.active(false);
        }

        doClearSearch() {
            this.inputValue('');
        }

        doToggleSort() {
            this.sortDirection(this.sortDirection() === 'descending' ? 'ascending' : 'descending');
        }
    }

    var styles = html.makeStyles({
        component: {
            css: {
            },
            inner: {
                '.-row.-active': {
                    css: {
                        backgroundColor: 'silver'
                    }
                }
            }
        },
        container: {
            css: {
            }
        },
        selectedRow: {
            css: {
                backgroundColor: 'silver'
            }
        },
        hoverRow: {
            css: {
                backgroundColor: 'silver'
            }
        },
        addonButton: {
            css: {

            },
            pseudoClasses: {
                hover: {
                    backgroundColor: 'rgba(200,200,200,0.5)'
                },
                active: {
                    backgroundColor: 'rgba(200,200,200,1)'
                }
            }
        }
    });

    function buildNarrativeList() {
        return [
            div({
                style: {
                    borderTop: '1px silver solid',
                    borderLeft: '1px silver solid',
                    borderRight: '1px silver solid',
                    backgroundColor: '#EEE',
                    zIndex: '100',
                    padding: '4px',
                    width: '100%',
                    flex: '0 0 auto'
                }
            }, [
                div({
                    style: {
                        flex: '0 0 auto'
                    }
                }, [
                    'Showing ',
                    gen.if('narrativesFiltered().length === totalCount()',
                        span([
                            'all ',
                            span({
                                dataBind: {
                                    typedText: {
                                        value: 'totalCount',
                                        type: '"number"',
                                        format: '"0,0"'
                                    }
                                }
                            }),
                            ' writable narratives'
                        ]),
                        span([
                            span({
                                dataBind: {
                                    text: 'narrativesFiltered().length'
                                }
                            }),
                            ' out of ',
                            span({
                                dataBind: {
                                    text: 'totalCount'
                                }
                            }),
                            ' writable narratives'
                        ]))
                ])
            ]),
            div({
                dataBind: {
                    foreach: {
                        data: 'narrativesFiltered',
                        includeDestroyed: 'false'
                    }
                },
                style: {
                    border: '1px silver solid',
                    backgroundColor: 'white',
                    zIndex: '100',
                    width: '100%',
                    overflow: 'auto',
                    flex: '1'
                }
            }, div({
                class: '-row',
                style: {
                    padding: '4px',
                    cursor: 'pointer',
                    borderBottom: '1px silver solid'
                },
                dataBind: {
                    click: '(d) => {$parent.doSelectValue(d)}',
                    class: '[($data && $data.active && active() ? "' + styles.classes.hoverRow + '" : ""), ($data && $data.selected && selected() ? "' + styles.classes.selectedRow + '" : "")].join(" ")',
                    event: {
                        mouseover: '$parent.doActivate',
                        mouseout: '$parent.doDeactivate'
                    }
                }
            }, [
                div({
                    style: {
                        fontWeight: 'bold'
                    },
                    dataBind: {
                        text:  'title'
                    }
                }),
                div({
                    style: {
                        display: 'flex',
                        flexDirection: 'row'
                    }
                }, [
                    div({
                        style: {
                            flex: '2'
                        },
                        dataBind: {
                            text: 'realName'
                        }
                    }),
                    div({
                        style: {
                            flex: '1'
                        },
                        dataBind: {
                            text: 'owner'
                        }
                    }),
                    div({
                        style: {
                            flex: '1'
                        },
                        dataBind: {
                            typedText: {
                                value: 'date',
                                type: '"date"',
                                format: '"MM/DD/YYYY"'
                            }
                        }
                    })
                ])
            ]))
        ];
    }

    function buildInputBar() {
        return [
            input({
                class: 'form-control',
                style: {
                    flex: '1'
                },
                dataBind: {
                    value: 'inputValue',
                    valueUpdate: '"input"'
                }
            }),
            div({
                style: {
                    flex: '0 0 auto'
                }
            }, select({
                class: 'form-control',
                style: {
                    flex: '0 0 auto'
                },
                dataBind: {
                    value: 'sortOption',
                    options: 'sortOptions',
                    optionsValue: '"value"',
                    optionsText: '"label"'
                }
            })),
            span({
                class: ['input-group-addon', 'fa', styles.classes.addonButton],
                style: {
                    display: 'block',
                    flex: '0 0 auto',
                    width: 'auto'
                },
                dataBind: {
                    class: 'sortDirection() === "ascending" ? "fa-sort-asc" : "fa-sort-desc"',
                    click: 'doToggleSort'
                }
            }),

            span({
                class: ['input-group-addon', 'fa', 'fa-times', styles.classes.addonButton],
                style: {
                    cursor: 'pointer',
                    width: 'auto'
                },
                dataBind: {
                    click: 'doClearSearch',
                    enable: 'inputValue'
                }
            })
        ];
    }

    function template() {
        return div({
            style: {},
            class: styles.classes.component
        }, div({
            class: styles.classes.container
        }, [
            div({
                dataBind: {
                    if: 'loading()'
                }
            }, htmlBuilders.loading()),
            div({
                dataBind: {
                    ifnot: 'loading()'
                }
            }, [
                div({
                    width: '100%'
                }, div({
                    style: {
                        display: 'flex',
                        flexDirection: 'row'
                    }
                }, buildInputBar())),
                div({
                    style: {
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        height: '20em'
                    }
                }, [
                    gen.if('ready',
                        buildNarrativeList(),
                        div({
                            style: {
                                textAlign: 'center',
                                margin: '20px'
                            }
                        }, htmlBuilders.loading('Loading data'))),
                ]),
                div({
                    class: 'text-warning',
                    style: {
                        fontStyle: 'italic'
                    },
                    dataBind: {
                        if: 'tooManyResults()'
                    }
                }, [
                    'Too many matches (',
                    span({ dataBind: { text: 'searchCount' } }),
                    ') to display -- please enter more in order to narrow your results.'
                ]),
                div({
                    style: {
                        fontStyle: 'italic'
                    },
                    dataBind: {
                        if: '!tooManyResults() && narrativesFiltered().length === 0 && inputValue() && inputValue().length < 2'
                    }
                }, [
                    'Please enter two or more letters above to search for your research or educational organization. '
                ]),
                div({
                    style: {
                        fontStyle: 'italic'
                    },
                    dataBind: {
                        if: '!tooManyResults() && narrativesFiltered().length === 0 && inputValue() && inputValue().length >= 2'
                    }
                }, [
                    'Nothing matched your entry. You may leave it as is to use this value in your profile, ',
                    'or try different text to match your organization.'
                ])
            ])
        ]));
    }

    function component() {
        return {
            viewModelWithContext: ViewModel,
            template: template(),
            stylesheet: styles.sheet
        };
    }
    return reg.registerComponent(component);
});