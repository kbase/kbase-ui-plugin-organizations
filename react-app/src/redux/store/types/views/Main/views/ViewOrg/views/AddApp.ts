import * as appModel from '../../../../../../../../data/models/apps';

export interface SelectableApp {
    app: appModel.AppBriefInfo;
    selected: boolean;
    relation: ResourceRelationToOrg,
    appId: string; // according to groups (module.method, not module/method)
}

export enum ResourceRelationToOrg {
    NONE = 0,
    ASSOCIATED,
    ASSOCIATION_PENDING
}

export type AddAppViewModel = {
    rawApps: Array<SelectableApp>;
    selectedApp: SelectableApp | null;
    searchBy: string;
    sortBy: string;
    apps: Array<SelectableApp>;
};


// export type AddAppsView = View<AddAppsViewModel>;

// export default AddAppsView;