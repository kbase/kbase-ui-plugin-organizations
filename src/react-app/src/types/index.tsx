
/* Types from the organization service (approximately) */

/*
    Organization
*/

export interface OrganizationUpdate {
    id: string,
    name: string,
    description: string;
}

export interface NewOrganization {
    id: string,
    name: string,
    description: string;
}

export interface Organization extends NewOrganization {
    owner: string
    createdAt: Date,
    modifiedAt: Date
}

/*
    Collection of organizations
*/

export type Organizations = Array<Organization>


/* REDUX */

export interface AuthState {
    username: string,
    realname: string,
    roles: Array<string>
}

export enum Filter {
    All = 1,
    Yours
}


export interface StoreState  {
    rawOrganizations: Organizations,
    organizations: Organizations,
    totalCount: number,
    filteredCount: number,
    sortBy: string,
    sortDescending: boolean,
    filter: Filter,
    searchTerms: Array<string>,
    selectedOrganizationId: string | null,
    auth: AuthState,
}

/* COMPONENT PROPS */
export interface OrganizationsProps {
    organizations: Organizations
}

export interface OrganizationsState {
    searchTerms: Array<string>
}

export interface OrganizationsBrowserProps {
    onSearchOrgs: (searchTerms: Array<string>) => void;
    onSortOrgs: (sortBy: string, sortDescending: boolean) => void;
    totalCount: number;
    filteredCount: number;
    sortBy: string;
    sortDescending: boolean;
}

export interface OrganizationsBrowserState {
    // ok super cheesy, need an enum
    sortBy: string,
    sortDescending: boolean,
    showAll: boolean,
    filterYourOrgs: boolean
}

// ADD ORG

export interface NewOrganizationProps {
    onAddOrg: (newOrg: NewOrganization) => void
}   

export interface ViewOrganizationProps {
    organization: Organization
}

export interface EditOrganizationProps {
    organization: Organization,
    onUpdateOrg: (editedOrg: OrganizationUpdate) => void
}