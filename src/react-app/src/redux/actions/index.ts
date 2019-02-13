export enum ActionFlag {
    APP = 1,
    APP_START,
    APP_SUCCESS,
    // APP_SUCCESS_IFRAME,
    // APP_SUCCESS_SOLO,
    APP_ERROR,

    BROWSE_ORGS_LOAD,
    BROWSE_ORGS_LOAD_START,
    BROWSE_ORGS_LOAD_SUCCESS,
    BROWSE_ORGS_LOAD_ERROR,
    BROWSE_ORGS_UNLOAD,

    BROWSE_ORGS_SORT,
    BROWSE_ORGS_SORT_START,
    BROWSE_ORGS_SORT_SUCCESS,
    BROWSE_ORGS_SORT_ERROR,

    BROWSE_ORGS_FILTER,
    BROWSE_ORGS_FILTER_START,
    BROWSE_ORGS_FILTER_SUCCESS,
    BROWSE_ORGS_FILTER_ERROR,

    BROWSE_ORGS_SEARCH,
    BROWSE_ORGS_SEARCH_START,
    BROWSE_ORGS_SEARCH_SUCCESS,
    BROWSE_ORGS_SEARCH_ERROR,

    UPDATE_ORG,
    UPDATE_ORG_START,
    UPDATE_ORG_SUCCESS,
    UPDATE_ORG_ERROR,

    // viewing org
    VIEW_ORG_LOAD,
    VIEW_ORG_LOAD_START,
    VIEW_ORG_LOAD_SUCCESS,
    VIEW_ORG_LOAD_ERROR,
    VIEW_ORG_UNLOAD,
    VIEW_ORG_RELOAD,

    VIEW_ORG_LOAD_INACCESSIBLE_PRIVATE_SUCCESS,
    VIEW_ORG_LOAD_NORMAL_SUCCESS,

    // Requests

    VIEW_ORG_JOIN_REQUEST,
    VIEW_ORG_JOIN_REQUEST_START,
    VIEW_ORG_JOIN_REQUEST_SUCCESS,
    VIEW_ORG_JOIN_REQUEST_ERROR,

    VIEW_ORG_CANCEL_JOIN_REQUEST,
    VIEW_ORG_CANCEL_JOIN_REQUEST_START,
    VIEW_ORG_CANCEL_JOIN_REQUEST_SUCCESS,
    VIEW_ORG_CANCEL_JOIN_REQUEST_ERROR,

    VIEW_ORG_ACCEPT_JOIN_INVITATION,
    VIEW_ORG_ACCEPT_JOIN_INVITATION_START,
    VIEW_ORG_ACCEPT_JOIN_INVITATION_SUCCESS,
    VIEW_ORG_ACCEPT_JOIN_INVITATION_ERROR,

    VIEW_ORG_ACCEPT_INBOX_REQUEST,
    VIEW_ORG_ACCEPT_INBOX_REQUEST_START,
    VIEW_ORG_ACCEPT_INBOX_REQUEST_SUCCESS,
    VIEW_ORG_ACCEPT_INBOX_REQUEST_ERROR,

    VIEW_ORG_REJECT_INBOX_REQUEST,
    VIEW_ORG_REJECT_INBOX_REQUEST_START,
    VIEW_ORG_REJECT_INBOX_REQUEST_SUCCESS,
    VIEW_ORG_REJECT_INBOX_REQUEST_ERROR,

    VIEW_ORG_REJECT_JOIN_INVITATION,
    VIEW_ORG_REJECT_JOIN_INVITATION_START,
    VIEW_ORG_REJECT_JOIN_INVITATION_SUCCESS,
    VIEW_ORG_REJECT_JOIN_INVITATION_ERROR,

    VIEW_ORG_REMOVE_NARRATIVE,
    VIEW_ORG_REMOVE_NARRATIVE_START,
    VIEW_ORG_REMOVE_NARRATIVE_SUCCESS,
    VIEW_ORG_REMOVE_NARRATIVE_ERROR,

    VIEW_ORG_ACCESS_NARRATIVE,
    VIEW_ORG_ACCESS_NARRATIVE_START,
    VIEW_ORG_ACCESS_NARRATIVE_SUCCESS,
    VIEW_ORG_ACCESS_NARRATIVE_ERROR,

    VIEW_ORG_SORT_NARRATIVES,
    VIEW_ORG_SORT_NARRATIVES_START,
    VIEW_ORG_SORT_NARRATIVES_SUCCESS,
    VIEW_ORG_SORT_NARRATIVES_ERROR,

    VIEW_ORG_SEARCH_NARRATIVES,
    VIEW_ORG_SEARCH_NARRATIVES_START,
    VIEW_ORG_SEARCH_NARRATIVES_SUCCESS,
    VIEW_ORG_SEARCH_NARRATIVES_ERROR,

    VIEW_ORG_SORT_MEMBERS,
    VIEW_ORG_SORT_MEMBERS_START,
    VIEW_ORG_SORT_MEMBERS_SUCCESS,
    VIEW_ORG_SORT_MEMBERS_ERROR,

    VIEW_ORG_SEARCH_MEMBERS,
    VIEW_ORG_SEARCH_MEMBERS_START,
    VIEW_ORG_SEARCH_MEMBERS_SUCCESS,
    VIEW_ORG_SEARCH_MEMBERS_ERROR,

    VIEW_ORG_MANAGE_RELATED_ORGANIZATIONS_LOAD,
    VIEW_ORG_MANAGE_RELATED_ORGANIZATIONS_LOAD_START,
    VIEW_ORG_MANAGE_RELATED_ORGANIZATIONS_LOAD_SUCCESS,
    VIEW_ORG_MANAGE_RELATED_ORGANIZATIONS_LOAD_ERROR,
    VIEW_ORG_MANAGE_RELATED_ORGANIZATIONS_UNLOAD,
    // keep these ones simple...
    VIEW_ORG_MANAGE_RELATED_ORGANIZATIONS_SELECT_ORGANIZATION,
    VIEW_ORG_MANAGE_RELATED_ORGANIZATIONS_ADD_ORGANIZATION,
    VIEW_ORG_MANAGE_RELATED_ORGANIZATIONS_ADD_ORGANIZATION_START,
    VIEW_ORG_MANAGE_RELATED_ORGANIZATIONS_ADD_ORGANIZATION_SUCCESS,
    VIEW_ORG_MANAGE_RELATED_ORGANIZATIONS_ADD_ORGANIZATION_ERROR,

    VIEW_ORG_MANAGE_RELATED_ORGANIZATIONS_REMOVE_ORGANIZATION,
    VIEW_ORG_MANAGE_RELATED_ORGANIZATIONS_REMOVE_ORGANIZATION_START,
    VIEW_ORG_MANAGE_RELATED_ORGANIZATIONS_REMOVE_ORGANIZATION_SUCCESS,
    VIEW_ORG_MANAGE_RELATED_ORGANIZATIONS_REMOVE_ORGANIZATION_ERROR,

    VIEW_ORG_RELATED_ORGANIZATIONS_REMOVE_ORGANIZATION,
    VIEW_ORG_RELATED_ORGANIZATIONS_REMOVE_ORGANIZATION_START,
    VIEW_ORG_RELATED_ORGANIZATIONS_REMOVE_ORGANIZATION_SUCCESS,
    VIEW_ORG_RELATED_ORGANIZATIONS_REMOVE_ORGANIZATION_ERROR,

    // PRIVATE ORG

    VIEW_PRIVATE_ORG_JOIN_REQUEST,
    VIEW_PRIVATE_ORG_JOIN_REQUEST_START,
    VIEW_PRIVATE_ORG_JOIN_REQUEST_SUCCESS,
    VIEW_PRIVATE_ORG_JOIN_REQUEST_ERROR,

    // MEMBERS

    VIEW_ORG_VIEW_MEMBERS_LOAD,
    VIEW_ORG_VIEW_MEMBERS_LOAD_START,
    VIEW_ORG_VIEW_MEMBERS_LOAD_SUCCESS,
    VIEW_ORG_VIEW_MEMBERS_LOAD_ERROR,
    VIEW_ORG_VIEW_MEMBERS_UNLOAD,

    VIEW_ORG_VIEW_MEMBERS_REMOVE_MEMBER,
    VIEW_ORG_VIEW_MEMBERS_REMOVE_MEMBER_START,
    VIEW_ORG_VIEW_MEMBERS_REMOVE_MEMBER_SUCCESS,
    VIEW_ORG_VIEW_MEMBERS_REMOVE_MEMBER_ERROR,

    VIEW_ORG_VIEW_MEMBERS_PROMOTE_TO_ADMIN,
    VIEW_ORG_VIEW_MEMBERS_PROMOTE_TO_ADMIN_START,
    VIEW_ORG_VIEW_MEMBERS_PROMOTE_TO_ADMIN_SUCCESS,
    VIEW_ORG_VIEW_MEMBERS_PROMOTE_TO_ADMIN_ERROR,

    VIEW_ORG_VIEW_MEMBERS_DEMOTE_TO_MEMBER,
    VIEW_ORG_VIEW_MEMBERS_DEMOTE_TO_MEMBER_START,
    VIEW_ORG_VIEW_MEMBERS_DEMOTE_TO_MEMBER_SUCCESS,
    VIEW_ORG_VIEW_MEMBERS_DEMOTE_TO_MEMBER_ERROR,

    // add org fields

    ADD_ORG_LOAD,
    ADD_ORG_LOAD_START,
    ADD_ORG_LOAD_SUCCESS,
    ADD_ORG_LOAD_ERROR,
    ADD_ORG_UNLOAD,

    ADD_ORG_UPDATE_NAME,
    ADD_ORG_UPDATE_NAME_SUCCESS,
    ADD_ORG_UPDATE_NAME_ERROR,

    ADD_ORG_UPDATE_LOGO_URL,
    ADD_ORG_UPDATE_LOGO_URL_SUCCESS,
    ADD_ORG_UPDATE_LOGO_URL_ERROR,

    ADD_ORG_UPDATE_ID,
    ADD_ORG_UPDATE_ID_SUCCESS,
    ADD_ORG_UPDATE_ID_ERROR,
    ADD_ORG_UPDATE_ID_PASS,
    ADD_ORG_EVALUATE_ID,

    ADD_ORG_UPDATE_DESCRIPTION,
    ADD_ORG_UPDATE_DESCRIPTION_SUCCESS,
    ADD_ORG_UPDATE_DESCRIPTION_ERROR,

    ADD_ORG_UPDATE_IS_PRIVATE,
    ADD_ORG_UPDATE_IS_PRIVATE_SUCCESS,
    ADD_ORG_UPDATE_IS_PRIVATE_ERROR,

    ADD_ORG_UPDATE_HOME_URL,
    ADD_ORG_UPDATE_HOME_URL_SUCCESS,
    ADD_ORG_UPDATE_HOME_URL_ERROR,

    ADD_ORG_UPDATE_RESEARCH_INTERESTS,
    ADD_ORG_UPDATE_RESEARCH_INTERESTS_SUCCESS,
    ADD_ORG_UPDATE_RESEARCH_INTERESTS_ERROR,

    ADD_ORG_EVALUATE,
    ADD_ORG_EVALUATE_OK,
    ADD_ORG_EVALUATE_ERRORS,

    ADD_ORG_SAVE,
    ADD_ORG_SAVE_START,
    ADD_ORG_SAVE_SUCCESS,
    ADD_ORG_SAVE_ERROR,


    // editing org
    EDIT_ORG_LOAD,
    EDIT_ORG_LOAD_START,
    EDIT_ORG_LOAD_SUCCESS,
    EDIT_ORG_LOAD_ERROR,
    EDIT_ORG_UNLOAD,

    EDIT_ORG_SAVE,
    EDIT_ORG_SAVE_START,
    EDIT_ORG_SAVE_SUCCESS,
    EDIT_ORG_SAVE_ERROR,

    // edit org, field level updates
    EDIT_ORG_UPDATE_NAME,
    EDIT_ORG_UPDATE_NAME_SUCCESS,
    EDIT_ORG_UPDATE_NAME_ERROR,

    EDIT_ORG_UPDATE_LOGO_URL,
    EDIT_ORG_UPDATE_LOGO_URL_SUCCESS,
    EDIT_ORG_UPDATE_LOGO_URL_ERROR,

    EDIT_ORG_UPDATE_DESCRIPTION,
    EDIT_ORG_UPDATE_DESCRIPTION_SUCCESS,
    EDIT_ORG_UPDATE_DESCRIPTION_ERROR,

    EDIT_ORG_UPDATE_IS_PRIVATE,
    EDIT_ORG_UPDATE_IS_PRIVATE_SUCCESS,
    EDIT_ORG_UPDATE_IS_PRIVATE_ERROR,

    EDIT_ORG_UPDATE_HOME_URL,
    EDIT_ORG_UPDATE_HOME_URL_SUCCESS,
    EDIT_ORG_UPDATE_HOME_URL_ERROR,

    EDIT_ORG_UPDATE_RESEARCH_INTERESTS,
    EDIT_ORG_UPDATE_RESEARCH_INTERESTS_SUCCESS,
    EDIT_ORG_UPDATE_RESEARCH_INTERESTS_ERROR,

    EDIT_ORG_EVALUATE,
    EDIT_ORG_EVALUATE_OK,
    EDIT_ORG_EVALUATE_ERRORS,

    // Auth
    AUTH_CHECK,
    AUTH_CHECK_START,
    AUTH_CHECK_ERROR,
    AUTH_AUTHORIZED,
    AUTH_UNAUTHORIZED,
    AUTH_REMOVE_AUTHORIZATION,
    AUTH_ADD_AUTHORIZATION,
    AUTH_ADD_AUTHORIZATION_ERROR,

    ADMIN_MANAGE_REQUESTS_LOAD,
    ADMIN_MANAGE_REQUESTS_LOAD_START,
    ADMIN_MANAGE_REQUESTS_LOAD_SUCCESS,
    ADMIN_MANAGE_REQUESTS_LOAD_ERROR,
    ADMIN_MANAGE_REQUESTS_UNLOAD,

    ADMIN_MANAGE_REQUESTS_ACCEPT_JOIN_REQUEST,
    ADMIN_MANAGE_REQUESTS_ACCEPT_JOIN_REQUEST_START,
    ADMIN_MANAGE_REQUESTS_ACCEPT_JOIN_REQUEST_SUCCESS,
    ADMIN_MANAGE_REQUESTS_ACCEPT_JOIN_REQUEST_ERROR,

    ADMIN_MANAGE_REQUESTS_DENY_JOIN_REQUEST,
    ADMIN_MANAGE_REQUESTS_DENY_JOIN_REQUEST_START,
    ADMIN_MANAGE_REQUESTS_DENY_JOIN_REQUEST_SUCCESS,
    ADMIN_MANAGE_REQUESTS_DENY_JOIN_REQUEST_ERROR,

    ADMIN_MANAGE_REQUESTS_CANCEL_JOIN_INVITATION,
    ADMIN_MANAGE_REQUESTS_CANCEL_JOIN_INVITATION_START,
    ADMIN_MANAGE_REQUESTS_CANCEL_JOIN_INVITATION_SUCCESS,
    ADMIN_MANAGE_REQUESTS_CANCEL_JOIN_INVITATION_ERROR,

    ADMIN_MANAGE_REQUESTS_GET_VIEW_ACCESS,
    ADMIN_MANAGE_REQUESTS_GET_VIEW_ACCESS_START,
    ADMIN_MANAGE_REQUESTS_GET_VIEW_ACCESS_SUCCESS,
    ADMIN_MANAGE_REQUESTS_GET_VIEW_ACCESS_ERROR,

    // MEMBERS
    VIEW_MEMBERS_LOAD,
    VIEW_MEMBERS_LOAD_START,
    VIEW_MEMBERS_LOAD_SUCCESS,
    VIEW_MEMBERS_LOAD_ERROR,
    VIEW_MEMBERS_UNLOAD,

    VIEW_MEMBERS_REMOVE_MEMBER,
    VIEW_MEMBERS_REMOVE_MEMBER_START,
    VIEW_MEMBERS_REMOVE_MEMBER_SUCCESS,
    VIEW_MEMBERS_REMOVE_MEMBER_ERROR,

    VIEW_MEMBERS_PROMOTE_TO_ADMIN,
    VIEW_MEMBERS_PROMOTE_TO_ADMIN_START,
    VIEW_MEMBERS_PROMOTE_TO_ADMIN_SUCCESS,
    VIEW_MEMBERS_PROMOTE_TO_ADMIN_ERROR,

    VIEW_MEMBERS_DEMOTE_TO_MEMBER,
    VIEW_MEMBERS_DEMOTE_TO_MEMBER_START,
    VIEW_MEMBERS_DEMOTE_TO_MEMBER_SUCCESS,
    VIEW_MEMBERS_DEMOTE_TO_MEMBER_ERROR,

    // INVITE USER
    INVITE_USER_LOAD,
    INVITE_USER_LOAD_START,
    INVITE_USER_LOAD_SUCCESS,
    INVITE_USER_LOAD_ERROR,
    INVITE_USER_UNLOAD,

    INVITE_USER_SEARCH_USERS,
    INVITE_USER_SEARCH_USERS_START,
    INVITE_USER_SEARCH_USERS_SUCCESS,
    INVITE_USER_SEARCH_USERS_ERROR,

    INVITE_USER_SELECT_USER,
    INVITE_USER_SELECT_USER_START,
    INVITE_USER_SELECT_USER_SUCCESS,
    INVITE_USER_SELECT_USER_ERROR,

    INVITE_USER_SEND_INVITATION,
    INVITE_USER_SEND_INVITATION_START,
    INVITE_USER_SEND_INVITATION_SUCCESS,
    INVITE_USER_SEND_INVITATION_ERROR,

    // Manage Membership
    MANAGE_MEMBERSHIP_LOAD,
    MANAGE_MEMBERSHIP_LOAD_START,
    MANAGE_MEMBERSHIP_LOAD_SUCCESS,
    MANAGE_MEMBERSHIP_LOAD_ERROR,
    MANAGE_MEMBERSHIP_UNLOAD,

    MANAGE_MEMBERSHIP_LEAVE_ORG,
    MANAGE_MEMBERSHIP_LEAVE_ORG_CONFIRMED,
    MANAGE_MEMBERSHIP_LEAVE_ORG_START,
    MANAGE_MEMBERSHIP_LEAVE_ORG_SUCCESS,
    MANAGE_MEMBERSHIP_LEAVE_ORG_ERROR,

    MANAGE_MEMBERSHIP_UPDATE_TITLE,
    MANAGE_MEMBERSHIP_UPDATE_TITLE_START,
    MANAGE_MEMBERSHIP_UPDATE_TITLE_SUCCESS,
    MANAGE_MEMBERSHIP_UPDATE_TITLE_ERROR,

    MANAGE_MEMBERSHIP_SAVE,
    MANAGE_MEMBERSHIP_SAVE_START,
    MANAGE_MEMBERSHIP_SAVE_SUCCESS,
    MANAGE_MEMBERSHIP_SAVE_ERROR,

    MANAGE_MEMBERSHIP_EVALUATE,
    MANAGE_MEMBERSHIP_EVALUATE_SUCCESS,
    MANAGE_MEMBERSHIP_EVALUATE_ERROR,

    // Narrative add requests
    REQUEST_ADD_NARRATIVE_LOAD,
    REQUEST_ADD_NARRATIVE_LOAD_START,
    REQUEST_ADD_NARRATIVE_LOAD_SUCCESS,
    REQUEST_ADD_NARRATIVE_LOAD_ERROR,
    REQUEST_ADD_NARRATIVE_UNLOAD,

    REQUEST_ADD_NARRATIVE_SEND,
    REQUEST_ADD_NARRATIVE_SEND_START,
    REQUEST_ADD_NARRATIVE_SEND_SUCCESS,
    REQUEST_ADD_NARRATIVE_SEND_ERROR,

    REQUEST_ADD_NARRATIVE_SELECT_NARRATIVE,
    REQUEST_ADD_NARRATIVE_SELECT_NARRATIVE_START,
    REQUEST_ADD_NARRATIVE_SELECT_NARRATIVE_SUCCESS,
    REQUEST_ADD_NARRATIVE_SELECT_NARRATIVE_ERROR,

    REQUEST_ADD_NARRATIVE_SORT,
    REQUEST_ADD_NARRATIVE_SORT_START,
    REQUEST_ADD_NARRATIVE_SORT_SUCCESS,
    REQUEST_ADD_NARRATIVE_SORT_ERROR,

    // VIEWS

    ORGANIZATION_CENTRIC_VIEW_LOAD,
    ORGANIZATION_CENTRIC_VIEW_LOAD_START,
    ORGANIZATION_CENTRIC_VIEW_LOAD_SUCCESS,
    ORGANIZATION_CENTRIC_VIEW_LOAD_ERROR,
    ORGANIZATION_CENTRIC_VIEW_UNLOAD,

    // ENTITIES

    ENTITY_USER_LOADER,
    ENTITY_USER_LOADER_START,
    ENTITY_USER_LOADER_SUCCESS,
    ENTITY_USER_LOADER_ERROR,

    ENTITY_ORGANIZATION_LOADER,
    ENTITY_ORGANIZATION_LOADER_START,
    ENTITY_ORGANIZATION_LOADER_SUCCESS,
    ENTITY_ORGANIZATION_LOADER_ERROR,

    ENTITY_NARRATIVE_LOAD,
    ENTITY_NARRATIVE_LOAD_START,
    ENTITY_NARRATIVE_LOAD_SUCCESS,
    ENTITY_NARRATIVE_LOAD_ERROR,

    ENTITY_ORGANIZATION_LOAD,
    ENTITY_ORGANIZATION_LOAD_START,
    ENTITY_ORGANIZATION_LOAD_SUCCESS,
    ENTITY_ORGANIZATION_LOAD_ERROR,

    // GLOBAL ACTIONS
    GLOBAL_ACCESS_NARRATIVE,
    GLOBAL_ACCESS_NARRATIVE_START,
    GLOBAL_ACCESS_NARRATIVE_SUCCESS,
    GLOBAL_ACCESS_NARRATIVE_ERROR,

    // NOTIFICATIONS
    NOTIFICATIONS_LOAD,
    NOTIFICATIONS_LOAD_START,
    NOTIFICATIONS_LOAD_SUCCESS,
    NOTIFICATIONS_LOAD_ERROR,
    NOTIFICATIONS_UNLOAD,

    NOTIFICATIONS_READ,
    NOTIFICATIONS_READ_START,
    NOTIFICATIONS_READ_SUCCESS,
    NOTIFICATIONS_READ_ERROR,

    // USER PROFILE
    DATA_SERVICE_LOAD,
    DATA_SERVICE_LOAD_START,
    DATA_SERVICE_LOAD_SUCCESS,
    DATA_SERVICE_LOAD_ERROR,
    DATA_SERVICE_UNLOAD,

    DATA_SERVICE_LOAD_REFRESH,
    DATA_SERVICE_LOAD_REFRESH_START,
    DATA_SERVICE_LOAD_REFRESH_SUCCESS,
    DATA_SERVICE_LOAD_REFRESH_ERROR
}
