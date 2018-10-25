define([
    'bluebird',
    'uuid',
    'kb_lib/workspaceUtils'
], function (
    Promise,
    Uuid,
    workspaceUtils
) {
    'use strict';

    // function def(value) {
    //     if (typeof value === 'undefined') {
    //         return false;
    //     }
    //     return true;
    // }

    // class Project {
    //     constructor({id, name, about, description, created, lastUpdated, narratives} = {}) {
    //         this.id = id || null;
    //         this.name = name || null;
    //         this.about = about || null;
    //         this.description = description || null;
    //         this.created = created || null;
    //         this.lastUpdated = lastUpdated || null;
    //         this.narratives = narratives || [];
    //     }

    //     update({name, about, description}) {
    //         let updated = false;
    //         if (def(name)) {
    //             this.name = name;
    //             updated = true;
    //         }
    //         if (def(about)) {
    //             this.about = about;
    //             updated = true;
    //         }
    //         if (def(description)) {
    //             this.description = description;
    //             updated = true;
    //         }
    //         if (updated) {
    //             this.lastUpdated = new Date();
    //         }
    //     }

    //     toJSON() {
    //         return {
    //             id: this.id,
    //             name: this.name,
    //             about: this.about,
    //             description: this.description,
    //             created: this.created,
    //             lastUpdated: this.lastUpdated,
    //             narratives: this.narratives
    //         };
    //     }

    //     fromJSON(data) {
    //         return new Project(data);
    //     }
    // }

    // class NarrativeIdentity {
    //     constructor({workspaceId, objectId}) {
    //         this.workspaceId = workspaceId;
    //         this.objectId = objectId;
    //     }
    // }

    // const fakeProjects = [
    //     new Project({
    //         id: '55fe2422-de31-42c7-99a2-074673910763',
    //         name: 'My Great Project',
    //         about: 'This is my great and awesome project',
    //         description: 'This will be some long markdown\n\nRight now it is **not**. ',
    //         created: new Date(),
    //         lastUpdated: new Date(),
    //         narratives: []
    //     }),
    //     new Project({
    //         id: 'b825f78f-b74c-47c4-b2d0-c15c16dc4488',
    //         name: 'My Other Great Project',
    //         about: 'This is my great and awesome project',
    //         description: 'All work and no play makes **Jack** a dull _boy_.\n\n' +
    //                      'All work and no play makes **Jack** a dull _boy_.\n\n' +
    //                      'All work and no play makes **Jack** a dull _boy_.\n\n' +
    //                      'All work and no play makes **Jack** a dull _boy_.\n\n' +
    //                      'All work and no play makes **Jack** a dull _boy_.\n\n' +
    //                      'All work and no play makes **Jack** a dull _boy_.\n\n' +
    //                      'All work and no play makes **Jack** a dull _boy_.\n\n' +
    //                      'All work and no play makes **Jack** a dull _boy_.\n\n' +
    //                      'All work and no play makes **Jack** a dull _boy_.\n\n' +
    //                      'All work and no play makes **Jack** a dull _boy_.\n\n' +
    //                      'All work and no play makes **Jack** a dull _boy_.\n\n' +
    //                      'All work and no play makes **Jack** a dull _boy_.\n\n',
    //         created: new Date(),
    //         lastUpdated: new Date(),
    //         narratives: [


    //         ]
    //     }),
    //     new Project({
    //         id: 'f7d0a273-4ee0-44c1-a6d0-faee5a8311f6',
    //         name: 'Amazing Public Narratives',
    //         about: 'When I find a notable public narrative, I add it here.',
    //         description: 'What it says',
    //         created: new Date(),
    //         lastUpdated: new Date(),
    //         narratives: [
    //             {
    //                 workspaceId: 35084,
    //                 objectId: 1,
    //                 added: new Date()
    //             }, {
    //                 workspaceId: 36842,
    //                 objectId: 1,
    //                 added: new Date()
    //             }, {
    //                 workspaceId: 36095,
    //                 objectId: 1,
    //                 added: new Date()
    //             }, {
    //                 workspaceId: 33859,
    //                 objectId: 1,
    //                 added: new Date()
    //             }, {
    //                 workspaceId: 36815,
    //                 objectId: 1,
    //                 added: new Date()
    //             }, {
    //                 workspaceId: 36800,
    //                 objectId: 1,
    //                 added: new Date()
    //             }, {
    //                 workspaceId: 36633,
    //                 objectId: 1,
    //                 added: new Date()
    //             }, {
    //                 workspaceId: 28852,
    //                 objectId: 1,
    //                 added: new Date()
    //             }, {
    //                 workspaceId: 1410,
    //                 objectId: 1,
    //                 added: new Date()
    //             }, {
    //                 workspaceId: 899,
    //                 objectId: 1,
    //                 added: new Date()
    //             }, {
    //                 workspaceId: 834,
    //                 objectId: 1,
    //                 added: new Date()
    //             }, {
    //                 workspaceId: 675,
    //                 objectId: 1,
    //                 added: new Date()
    //             }

    //         ]
    //     })
    // ];

    // class ProjectsSessionStorage {
    //     constructor({runtime}) {
    //         this.username = runtime.service('session').getUsername();
    //     }

    //     storageKey() {
    //         return this.username + ':projects';
    //     }

    //     fetch() {
    //         const raw = window.sessionStorage.getItem(this.storageKey());
    //         if (raw === null) {
    //             return {};
    //         }
    //         return JSON.parse(raw);
    //     }

    //     save(projects) {
    //         window.sessionStorage.setItem(this.storageKey(), JSON.stringify(projects));
    //     }

    //     clear() {
    //         window.sessionStorage.removeItem(this.storageKey());
    //     }

    //     get(projectId) {
    //         const projects = this.fetch();
    //         return new Project().fromJSON(projects[projectId]);
    //     }

    //     getAll() {
    //         const raw = this.fetch();
    //         return Object.entries(raw)
    //             .map(([, project]) => {
    //                 return new Project().fromJSON(project);
    //             });
    //     }

    //     add(project) {
    //         const projects = this.fetch() || {};
    //         projects[project.id] = project.toJSON();
    //         this.save(projects);
    //     }

    //     update(project) {
    //         const projects = this.fetch();
    //         projects[project.id] = project.toJSON();
    //         this.save(projects);
    //     }

    //     set(project) {
    //         const projects = this.fetch();
    //         projects[project.id] = project.toJSON();
    //         this.save(projects);
    //     }

    //     remove(projectId) {
    //         const projects = this.fetch();
    //         delete projects[projectId];
    //         this.save(projects);
    //     }
    // }

    // class Model {
    //     constructor({runtime}) {
    //         this.runtime = runtime;
    //         this.storage = new ProjectsSessionStorage({runtime: this.runtime});
    //     }

    //     getMyProjects() {
    //         return Promise.try(() => {
    //             const projects = this.storage.getAll();
    //             return projects;
    //         });
    //     }

    //     getProject(id) {
    //         return Promise.try(() => {
    //             return this.storage.get(id);
    //         });
    //     }

    //     getNarrativeWorkspaces(narrativeIds) {
    //         const workspaces = narrativeIds.map(({workspaceId}) => {
    //             return workspaceId;
    //         });
    //         if (workspaces.length === 0) {
    //             return [];
    //         }
    //         const workspace = this.runtime.service('rpc').makeClient({
    //             module: 'Workspace'
    //         });
    //         return Promise.all(workspaces.map((id) => {
    //             return workspace.callFunc('get_workspace_info', [{id: id}])
    //                 .spread((result) => {
    //                     const info = workspaceUtils.workspaceInfoToObject(result);
    //                     return {
    //                         workspaceId: info.id,
    //                         owner: info.owner,
    //                         lastUpdated: info.modDate
    //                     };
    //                 });
    //         }));
    //     }

    //     getCurrentNarrativeObject(narrativeIds) {
    //         const workspace = this.runtime.service('rpc').makeClient({
    //             module: 'Workspace'
    //         });
    //         const objectSpecs = narrativeIds.map(({workspaceId, objectId}) => {
    //             return {
    //                 wsid: workspaceId,
    //                 objid: objectId,
    //                 included: [
    //                     'metadata/creator',
    //                     'metadata/name'
    //                 ]
    //             };
    //         });
    //         if (objectSpecs.length === 0) {
    //             return [];
    //         }
    //         return workspace.callFunc('get_objects2', [{
    //             objects: objectSpecs,
    //             ignoreErrors: 1
    //         }])
    //             .spread((result) => {
    //                 return result.data
    //                     .map((object) => {
    //                         if (!object) {
    //                             return null;
    //                         }
    //                         object.info = workspaceUtils.objectInfoToObject(object.info);
    //                         return {
    //                             objectId: object.info.id,
    //                             title: object.data.metadata ? object.data.metadata.name : 'n/a',
    //                             creator: object.data.metadata ? object.data.metadata.creator : 'n/a'
    //                             // owner: {
    //                             //     realname: workspaceInfo.owner,
    //                             //     username: workspaceInfo.owner
    //                             // },
    //                             // created: workspaceInfo.saveDate,
    //                             // lastUpdated: workspaceInfo.saveDate
    //                         };
    //                     });
    //             });
    //     }

    //     getFirstNarrativeObject(narrativeIds) {
    //         const workspace = this.runtime.service('rpc').makeClient({
    //             module: 'Workspace'
    //         });
    //         const objectSpecs = narrativeIds.map(({workspaceId, objectId}) => {
    //             return {
    //                 wsid: workspaceId,
    //                 objid: objectId,
    //                 ver: 1
    //             };
    //         });
    //         if (objectSpecs.length === 0) {
    //             return [];
    //         }
    //         return workspace.callFunc('get_object_info3', [{
    //             objects: objectSpecs,
    //             includeMetadata: 1,
    //             ignoreErrors: 1
    //         }])
    //             .spread((result) => {
    //                 return result.infos
    //                     .map((info) => {
    //                         if (!info) {
    //                             return null;
    //                         }
    //                         const objectInfo = workspaceUtils.objectInfoToObject(info);
    //                         return {
    //                             created: objectInfo.saveDate
    //                         };
    //                     });
    //             });
    //     }

    //     getProjectNarratives(id) {
    //         const project = this.storage.get(id);

    //         return Promise.all([
    //             this.getNarrativeWorkspaces(project.narratives),
    //             this.getCurrentNarrativeObject(project.narratives),
    //             this.getFirstNarrativeObject(project.narratives)
    //         ])
    //             .spread((workspaceInfos, currentObjectInfos, firstObjectInfos) => {
    //                 const result = [];
    //                 for (let i = 0; i < workspaceInfos.length; i += 1) {
    //                     const workspaceInfo = workspaceInfos[i];
    //                     const currentObjectInfo = currentObjectInfos[i];
    //                     const firstObjectInfo = firstObjectInfos[i];
    //                     if (!workspaceInfo || !currentObjectInfo || !firstObjectInfo) {
    //                         console.warn('skipping null info!', i, workspaceInfo, currentObjectInfo, firstObjectInfo);
    //                         continue;
    //                     }
    //                     result.push(Object.assign(workspaceInfo, currentObjectInfo, firstObjectInfo));
    //                 }
    //                 return result;
    //             });
    //     }

    //     getNarrative2(narrativeId) {
    //         return Promise.all([
    //             this.getNarrativeWorkspaces([narrativeId]),
    //             this.getCurrentNarrativeObject([narrativeId]),
    //             this.getFirstNarrativeObject([narrativeId])
    //         ])
    //             .spread((workspaceInfos, currentObjectInfos, firstObjectInfos) => {
    //                 const result = [];
    //                 for (let i = 0; i < workspaceInfos.length; i += 1) {
    //                     const workspaceInfo = workspaceInfos[i];
    //                     const currentObjectInfo = currentObjectInfos[i];
    //                     const firstObjectInfo = firstObjectInfos[i];
    //                     if (!workspaceInfo || !currentObjectInfo || !firstObjectInfo) {
    //                         console.warn('skipping null info!', i, workspaceInfo, currentObjectInfo, firstObjectInfo);
    //                         continue;
    //                     }
    //                     result.push(Object.assign(workspaceInfo, currentObjectInfo, firstObjectInfo));
    //                 }
    //                 return result[0];
    //             });
    //     }

    //     recreateFakeData() {
    //         this.storage.clear();
    //         fakeProjects.forEach((project) => {
    //             this.storage.add(project);
    //         });
    //     }

    //     createProject(project) {
    //         return Promise.try(() => {
    //             // TODO: save project to storage -- this is the "creation" of the project.
    //             // FORNOW: fake it.
    //             project.id = new Uuid(4).format();
    //             project.created = new Date();
    //             project.lastUpdated = new Date();

    //             this.storage.add(project);

    //             // fakeProjects.push(project);

    //             return project;
    //         });
    //     }

    //     updateProject(projectUpdate) {
    //         return Promise.try(() => {
    //             const project = this.storage.get(projectUpdate.id);
    //             project.update(projectUpdate);
    //             this.storage.set(project);
    //         });
    //     }


    //     deleteProject(projectId) {
    //         return Promise.try(() => {
    //             this.storage.remove(projectId);
    //         });
    //     }

    //     removeProjectNarrative(projectId, workspaceId, objectId) {
    //         const project = this.storage.get(projectId);
    //         project.narratives = project.narratives.filter((narrative) => {
    //             return (!(narrative.workspaceId === workspaceId && narrative.objectId === objectId));
    //         });
    //         this.storage.set(project);
    //     }

    //     addProjectNarrative(projectId, narrativeId) {
    //         const project = this.storage.get(projectId);
    //         project.narratives.push({
    //             workspaceId: narrativeId.workspaceId,
    //             objectId: narrativeId.objectId,
    //             added: new Date()
    //         });
    //         this.storage.set(project);
    //     }

    //     getAccessibleNarratives() {
    //         const workspace = this.runtime.service('rpc').makeClient({
    //             module: 'Workspace'
    //         });

    //         return workspace.callFunc('list_workspace_info', [{
    //             perm: 'r'
    //         }])
    //             .spread((data) => {
    //                 var objects = data.map((workspaceInfo) => {
    //                     return workspaceUtils.workspaceInfoToObject(workspaceInfo);
    //                 });
    //                 return objects.filter((workpaceInfo) => {
    //                     if (workpaceInfo.metadata.narrative && (!isNaN(parseInt(workpaceInfo.metadata.narrative, 10))) &&
    //                         // don't keep the current narrative workspace.
    //                         workpaceInfo.metadata.narrative_nice_name &&
    //                         workpaceInfo.metadata.is_temporary && workpaceInfo.metadata.is_temporary !== 'true') {
    //                         return true;
    //                     }
    //                     return false;
    //                 });
    //             })
    //             .then((narratives) => {
    //                 const owners = Object.keys(narratives.reduce((owners, narrative) => {
    //                     owners[narrative.owner] = true;
    //                     return owners;
    //                 }, {}));
    //                 const userProfile = this.runtime.service('rpc').makeClient({
    //                     module: 'UserProfile'
    //                 });
    //                 return userProfile.callFunc('get_user_profile', [owners])
    //                     .spread((profiles) => {
    //                         const ownerProfiles = profiles.reduce((ownerProfiles, profile) => {
    //                             ownerProfiles[profile.user.username] = profile;
    //                             return ownerProfiles;
    //                         }, {});
    //                         narratives.forEach((narrative) => {
    //                             narrative.ownerRealName = ownerProfiles[narrative.owner].user.realname;
    //                         });
    //                         return narratives;
    //                     });
    //             });
    //     }

    //     getNarrative(ref) {
    //         const workspace = this.runtime.service('rpc').makeClient({
    //             module: 'Workspace'
    //         });

    //         return workspace.callFunc('get_object_info3', [{
    //             objects: [{
    //                 wsid: ref.workspaceId,
    //                 objid: ref.objectId
    //             }],
    //             ignoreErrors: 1
    //         }])
    //             .spread((result) => {
    //                 if (result.infos.length === 0) {
    //                     throw new Error('No Narrative found with reference ' + ref.workspaceId + '/' + ref.objectId);
    //                 }
    //                 if (result.infos.length > 1) {
    //                     throw new Error('Too many Narratives found with reference ' + ref.workspaceId + '/' + ref.objectId);
    //                 }
    //                 const objectInfo = workspaceUtils.objectInfoToObject(result.infos[0]);
    //                 return Promise.all([
    //                     objectInfo,
    //                     workspace.callFunc('get_workspace_info', [{
    //                         id: objectInfo.wsid
    //                     }])
    //                         .spread((info) => {
    //                             return info;
    //                         })
    //                 ]);
    //             })
    //             .spread((objectInfo, wsInfo) => {
    //                 return {
    //                     objectInfo: objectInfo,
    //                     workspaceInfo: workspaceUtils.workspaceInfoToObject(wsInfo)
    //                 };
    //             });
    //     }
    // }

    // return {Model, Project, NarrativeIdentity};

    class Model {
        constructor({runtime}) {
            this.runtime = runtime;
        }
    }

    return {Model};
});