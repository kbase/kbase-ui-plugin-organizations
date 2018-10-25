
define([
    'knockout',
    'kb_knockout/registry',
    'kb_knockout/lib/generators',
    'kb_knockout/components/overlayPanel',
    'kb_lib/html',
    '../projectViewer/main',
], function (
    ko,
    reg,
    gen,
    OverlayPanelComponent,
    html,
    ProjectViewerComponent
) {
    'use strict';

    class ViewModel {
        constructor({runtime, projectId}) {
            this.runtime = runtime;
            this.projectId = projectId;

            this.overlayComponent = ko.observable();

            this.actions = {
                showOverlay: (component) => {
                    this.overlayComponent(component);
                }
            };
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
        }
    });

    function template() {
        return div({
            class: style.classes.component,
            dataBind: {
                let: {
                    showOverlay: 'actions.showOverlay'
                }
            }
        }, [
            div({
                class: style.classes.component,
                dataBind: {
                    component: {
                        name: ProjectViewerComponent.quotedName(),
                        params: {
                            runtime: 'runtime',
                            projectId: 'projectId',
                        }
                    }
                }
            }),
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