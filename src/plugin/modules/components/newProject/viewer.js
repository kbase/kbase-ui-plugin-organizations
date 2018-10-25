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
        constructor({runtime, project}) {
            this.runtime = runtime;
            this.project = project;

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
    }

    // VIEW

    const t = html.tag,
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
                    class: style.classes.contentCol,
                    dataBind: {
                        text: 'name'
                    }
                })]),
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

    function buildProject() {
        return [
            buildProjectTable()
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