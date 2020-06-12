import * as orgModel from '../data/models/organization/model';
import { AppError } from "@kbase/ui-components";

export enum SortDirection {
    ASCENDING = 'asc',
    DESCENDING = 'desc'
}

export enum ComponentLoadingState {
    NONE = 0,
    LOADING,
    SUCCESS,
    ERROR
}

export enum EditState {
    NONE = 'NONE',
    UNEDITED = 'UNEDITED',
    EDITED = 'EDITED'
}

// TODO: or CLEAN to replace new and saved
export enum SaveState {
    NONE = 'NONE',
    NEW = 'NEW',
    READY = 'READY',
    SAVING = 'SAVING',
    SAVED = 'SAVED',
    SAVE_ERROR = 'SAVE_ERROR'
}


export enum ValidationErrorType {
    OK = 0,
    ERROR,
    REQUIRED_MISSING
}

export interface ValidationStateBase {
    type: ValidationErrorType;
    validatedAt: Date;
}

export interface ValidationStateOk extends ValidationStateBase {
    type: ValidationErrorType.OK;
}

export interface ValidationStateError extends ValidationStateBase {
    type: ValidationErrorType.ERROR;
    message: string;
}

export interface ValidationStateRequiredMissing extends ValidationStateBase {
    type: ValidationErrorType.REQUIRED_MISSING;
    message: string;
}

// export interface ValidationStateAsyncError extends ValidationStateBase {
//     type: ValidationErrorType.ASYNC_ERROR
//     message: string
//     
// }

export type ValidationState = ValidationStateOk | ValidationStateError | ValidationStateRequiredMissing;


export enum SyncState {
    NONE = 0,
    NEW,
    DIRTY,
    CLEAN
}

export interface Editable {
    value: any;
    remoteValue: any;
    syncState: SyncState;
    // editState: EditState
    // validationState: ValidationState
    validationState: ValidationState;
    // validatedAt: Date | null
    // error: UIError
}
export interface EditableString extends Editable {
    value: string,
    remoteValue: string | null;
}

export interface EditableNullableString extends Editable {
    value: string | null;
    remoteValue: string | null;
}

export interface EditableBoolean extends Editable {
    value: boolean;
    remoteValue: boolean | null;
}

export interface EditableOrganization {
    id: EditableString;
    name: EditableString;
    description: EditableString;
    isPrivate: EditableBoolean;
    logoUrl: EditableNullableString;
    homeUrl: EditableNullableString;
    researchInterests: EditableString;
}


export enum ViewState {
    NONE = 0,
    LOADING,
    OK,
    ERROR
}


export interface OrganizationUser {
    username: string;
    realname: string;
    relation: orgModel.UserRelationToOrganization;
}

export interface User {
    username: string;
    realname: string;
    title: string | null;
    organization: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    avatarOption: string | null;
    gravatarHash: string | null;
    gravatarDefault: string | null;
}

export enum SelectionState {
    NONE = 0,
    SELECTING,
    SELECTED
}

export enum MemberType {
    MEMBER = 0,
    ADMIN,
    OWNER
}

export interface Member {
    user: User,
    type: MemberType;
}

export enum AsyncModelState {
    NONE,
    LOADING,
    SUCCESS,
    ERROR
}

// View Support
export interface ModelBase {
    loadingState: AsyncModelState;
}

export interface ModelNone extends ModelBase {
    loadingState: AsyncModelState.NONE;
}

export interface ModelLoading extends ModelBase {
    loadingState: AsyncModelState.LOADING;
}

export interface ModelLoaded<T> extends ModelBase {
    loadingState: AsyncModelState.SUCCESS,
    value: T;
}

export interface ModelError extends ModelBase {
    loadingState: AsyncModelState.ERROR;
    error: AppError;
}

export type AsyncModel<T> = ModelNone | ModelLoading | ModelLoaded<T> | ModelError;

export interface View<K, M> {
    kind: K;
    model: M;
}
