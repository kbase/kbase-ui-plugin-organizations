define([
    'knockout',
    'kb_knockout/registry',
    'kb_knockout/lib/generators',
    'kb_lib/html',
    'kb_knockout/components/overlayPanel',
    './organizations/main',
    './organization/main'
], function (
    ko,
    reg,
    gen,
    html,
    OverlayPanelComponent,
    OrganizationsComponent,
    OrganizationComponent
) {
    'use strict';

    class NavItem{
        constructor({slug, title, params}) {
            this.slug = slug;
            this.title = title;
            this.params = params;
        }
    }

    class NavSelection {
        constructor(slug, params) {
            this.slug = slug;
            this.rawParams = params;
            this.params = this.genParams(params);
        }

        genParams() {
            return JSON.stringify(this.params);
            // this.params.entries.map(([key, value]) => {
            //     return '{' + key + ': ' + JSON.stringify(value) + '}';
            // }).join('');
        }
    }

    const menu = [
        new NavItem({
            slug: 'organizations',
            title: 'Organizations',
            params: {}
        }),
        new NavItem({
            slug: 'organization',
            title: 'Organization',
            params: ['id']
        })
    ];

    const menuMap = menu.reduce((map, item) => {
        map[item.slug] = item;
        return map;
    }, {});

    class ViewModel {
        constructor() {
            this.defaultView = new NavSelection('organizations');

            this.view = ko.observable(this.defaultView);

            this.overlayComponent = ko.observable();

            this.selectedOrganizationId = ko.observable();

            this.app = {
                navigate: (slug, params) => {
                    this.navigate(slug, params);
                }
            };
        }

        navigate(slug, params) {
            const item = menuMap[slug];
            if (!item) {
                return;
            }
            this.view(new NavSelection(slug, params));
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
    });

    function buildNavbar() {
        return div({
            style: {
                height: '30px',
                backgroundColor: 'rgba(200,200,200,0.5)',
                marginBottom: '10px',
                display: 'flex',
                flexDirection: 'row',
                padding: '4px 4px 4px 10px',
                alignItems: 'center'
            }
        }, [
            span([
                span({
                    class: 'fa fa-users'
                }),
                ' Orgs'
            ])
        ]);
    }

    function buildNoView() {
        return div({}, [
            'Sorry, no view for ',
            span({
                dataBind: {
                    text: 'slug'
                }
            })
        ]);
    }

    function genComponent({name, params}) {
        const p = Object.assign({}, params, {app: 'app'});
        const paramObjectAsString = '{' + Object.entries(p).map(([key, value]) => {
            return key + ': ' + String(value);
        }).join(', ') + '}';
        console.log('param string', paramObjectAsString);
        const componentValue = '{name: "' + name + '", params: ' + paramObjectAsString  +'}';
        return [
            '<!-- ko component: ', componentValue, '-->',
            '<!-- /ko -->'
        ];
    }

    function template() {
        return div({
            class: style.classes.component
        }, [
            buildNavbar(),
            gen.switch('view().slug', [
                [
                    '"organizations"', genComponent({
                        name: OrganizationsComponent.name(),
                        params: {}
                    })
                ],
                [
                    '"organization"', genComponent({
                        name: OrganizationComponent.name(),
                        params: {
                            selectedOrganizationId: 'selectedOrganizationId'
                        }
                    })
                ],
                [
                    '$default', buildNoView()
                ]
            ]),
            gen.component({
                name: OverlayPanelComponent.name(),
                params: {
                    component: 'overlayComponent'
                }
            })
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