import { AppException } from "../../redux/store/types";

export const MAX_GROUPS_PER_LIST_REQUEST = 100;

export interface GroupsServiceInfo {
  servname: string;
  version: string;
  servertime: number;
  gitcommithash: string;
}

export type Username = string;
export type GroupID = string;

export interface Member {
  name: Username;
  joined: number;
  lastvisit: number | null;
  custom: {
    title: string;
  };
}

export interface Resource {
  rid: string;
  added: number | null;
}

export interface WorkspaceInfo extends Resource {
  name: string;
  narrname: string;
  narrcreate: number;
  public: boolean;
  perm: string;
  description: string;
  moddate: number;
}

export interface AppInfo extends Resource {}

export type Role = "None" | "Member" | "Admin" | "Owner";

export interface GroupCustomFields {
  logourl?: string;
  description?: string;
  researchinterests?: string;
  homeurl?: string;
  relatedgroups?: string;
}

export interface BriefGroup {
  id: GroupID;
  name: string;
  createdate: number;
  moddate: number;
  lastvisit: number | null;
  private: boolean;
  role: Role;

  custom: GroupCustomFields;
  // owner: Member
  owner: Username;

  memcount: number;
  rescount: {
    workspace: number;
  };
}

export interface InaccessiblePrivateGroup {
  id: GroupID;
  private: boolean;
  role: Role;
}

export interface Group {
  id: GroupID;
  private: boolean;
  privatemembers: boolean;
  name: string;
  role: Role;
  owner: Member;
  admins: Array<Member>;
  members: Array<Member>;
  memcount: number;
  createdate: number;
  moddate: number;
  lastvisit: number;
  resources: {
    workspace: Array<WorkspaceInfo>;
    catalogmethod: Array<AppInfo>;
  };
  rescount: {
    workspace: number;
    catalogmethod: number;
  };
  custom: GroupCustomFields;
}

export interface NewGroup {
  id: string;
  name: string;
  logoUrl: string | null;
  homeUrl: string | null;
  researchInterests: string;
  description: string;
  isPrivate: boolean;
}

export interface GroupUpdate {
  name: string;
  logoUrl: string | null;
  homeUrl: string | null;
  researchInterests: string;
  description: string;
  private: boolean;
}

export interface Request {
  id: string;
  groupid: string;
  requester: Username;
  type: string;
  status: string;
  resource: string;
  resourcetype: string;
  createdate: number;
  expiredate: number;
  moddate: number;
}

export interface RequestWithCompletion extends Request {
  complete: false;
}

export interface Completion {
  complete: true;
}

export interface ErrorInfo {
  appcode: number;
  apperror: string;
  callid: string;
  httpcode: number;
  httpstatus: string;
  message: string;
  time: number;
}

export interface ErrorResult {
  error: ErrorInfo;
}

// Error types: (appcode)
// 10000	Authentication failed
// 10010	No authentication token
// 10020	Invalid token
// 20000	Unauthorized
// 30000	Missing input parameter
// 30001	Illegal input parameter
// 30010	Illegal user name
// 40000	Group already exists
// 40010	Request already exists
// 40020	User already group member
// 40030	Workspace already in group
// 50000	No such group
// 50010	No such request
// 50020	No such user
// 50030	No such workspace
// 60000	Unsupported operation

export interface GroupExists {
  exists: boolean;
}

// export interface GroupRequest {
//     id: string,
//     groupid: string,
//     requester: Username,
//     type: string,
//     status: string,
//     resource: string
//     resourcetype: string
//     createdate: number,
//     expiredate: number,
//     moddate: number
// }

export enum SortDirection {
  ASCENDING = 0,
  DESCENDING,
}

export interface GetRequestsParams {
  includeClosed?: boolean;
  sortDirection?: SortDirection;
  startAt?: Date;
}

export interface RequestMemebershipParams {
  groupId: string;
}

export interface RequestNarrativeParams {
  workspaceId: number;
  groupId: string;
}

export interface RequestResourceParams {
  type: string;
  resourceId: string;
  groupId: string;
}

// function promiseTry<T>(fun: () => Promise<T>): Promise<T> {
//     return new Promise<T>((resolve, reject) => {
//         try {
//             return resolve(fun());
//         } catch (ex: any) {
//             reject(ex: any);
//         }
//     });
// }

export interface GroupError {
  httpcode: number;
  httpstatus: string;
  appcode: number;
  apperror: string;
  message: string;
  callid: string;
  time: number;
}

export class Exception extends Error {}

export class GroupException extends AppException {
  originalError: GroupError;
  constructor(error: GroupError) {
    super({
      code: "group-exception",
      message: error.apperror,
      detail: error.message,
      info: new Map<string, any>([
        ["httpcode", error.httpcode],
        ["httpstatus", error.httpstatus],
        ["appcode", error.appcode],
        ["apperror", error.apperror],
        ["message", error.message],
        ["callid", error.callid],
        ["time", error.time],
      ]),
    });
    this.name = "GroupException";
    this.originalError = error;
  }
}

export interface RequestStatus {
  new: "None" | "New" | "Old";
}

export class ServerException extends AppException {
  constructor(detail: string) {
    super({
      code: "server-exception",
      message: "Server Exception",
      detail: detail,
    });
    this.name = "ServerException";
  }
}

export interface ListGroupsOptions {
  excludeUpTo?: string;
}

export class GroupsClient {
  token: string;
  url: string;

  constructor({ token, url }: { token: string; url: string }) {
    this.token = token;
    this.url = url;
  }

  getInfo(): Promise<GroupsServiceInfo> {
    return fetch(this.url + "/", {
      headers: {
        Authorization: this.token,
        Accept: "application/json",
      },
      mode: "cors",
    })
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        return result as GroupsServiceInfo;
      });
  }

  groupExists(id: string): Promise<GroupExists> {
    return fetch(this.url + "/group/" + id + "/exists")
      .then((response) => {
        return response.json();
      })
      .then((exists) => {
        return exists as GroupExists;
      });
  }

  // getGroups(): Promise<GroupList> {
  //     return fetch(this.url + '/group', {
  //         headers: {
  //             Authorization: this.token,
  //             Accept: 'application/json'
  //         },
  //         mode: 'cors'
  //     })
  //         .then((response) => {
  //             return response.json()
  //         })
  //         .then((result: GroupList) => {
  //             return result.filter(({ type }) => type === 'Organization')
  //         })
  // }

  async listGroups(options?: ListGroupsOptions): Promise<Array<BriefGroup>> {
    const urlParams: { [key: string]: string } = {};
    options = options || {};
    if (typeof options.excludeUpTo !== "undefined") {
      urlParams.excludeupto = options.excludeUpTo;
    }
    const urlSearch = Object.entries(urlParams)
      .map(([key, value]) => {
        return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
      })
      .join("&");
    const response = await fetch(`${this.url}/group?${urlSearch}`, {
      headers: {
        Authorization: this.token,
        Accept: "application/json",
      },
      mode: "cors",
    });
    if (response.status !== 200) {
      console.error(`Error fetching groups: ${response.status}`, response);
      throw new Error(`Error fetching groups: ${response.status}`);
    }
    return await response.json();
  }

  getGroupById(id: string): Promise<Group | InaccessiblePrivateGroup> {
    return fetch(this.url + "/group/" + id, {
      headers: {
        Authorization: this.token,
        Accept: "application/json",
      },
      mode: "cors",
    })
      .then((response) => {
        if (response.status === 404) {
          throw new Error('Organization "' + id + '" not found');
        }
        return response.json();
      })
      .then((result) => {
        return result as Group;
      });
  }

  put<T>(path: Array<string>, body: any): Promise<T> {
    const url = [this.url].concat(path).join("/");
    return fetch(url, {
      headers: {
        Authorization: this.token,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      mode: "cors",
      method: "PUT",
      body: JSON.stringify(body),
    }).then((response) => {
      if (response.status === 500) {
        switch (response.headers.get("Content-Type")) {
          case "application/json":
            return response.json().then((result) => {
              throw new GroupException(result);
            });
          case "text/plain":
            return response.text().then((result) => {
              throw new ServerException(result);
            });
          default:
            throw new Error(
              "Unexpected content type: " + response.headers.get("Content-Type")
            );
        }
      } else if (response.status === 200) {
        return response.json().then((result) => {
          return result as T;
        });
      } else if (response.status === 204) {
        const result = null as unknown;
        return result as T;
      } else {
        throw new Error(
          "Unexpected response: " +
            response.status +
            " : " +
            response.statusText
        );
      }
    });
  }

  async post<T>(path: Array<string>, body: any): Promise<T | null> {
    const url = [this.url].concat(path).join("/");
    const response = await fetch(url, {
      headers: {
        Authorization: this.token,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      mode: "cors",
      method: "POST",
      body: body ? JSON.stringify(body) : "",
    });

    if (response.status === 500) {
      switch (response.headers.get("Content-Type")) {
        case "application/json":
          const result = await response.json();
          throw new GroupException(result);
        case "text/plain":
          const errorText = await response.text();
          throw new ServerException(errorText);
        default:
          throw new Error(
            "Unexpected content type: " + response.headers.get("Content-Type")
          );
      }
    } else if (response.status === 200) {
      return (await response.json()) as T;
    } else if (response.status === 204) {
      return null;
    } else {
      throw new Error(
        "Unexpected response: " + response.status + " : " + response.statusText
      );
    }
  }

  async get<T>(path: Array<string>): Promise<T> {
    const url = [this.url].concat(path).join("/");
    const response = await fetch(url, {
      headers: {
        Authorization: this.token,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      mode: "cors",
      method: "GET",
    });

    if (response.status === 500) {
      switch (response.headers.get("Content-Type")) {
        case "application/json":
          const result = await response.json();
          throw new GroupException(result);
        case "text/plain":
          const errorText = await response.text();
          throw new ServerException(errorText);
        default:
          throw new Error(
            "Unexpected content type: " + response.headers.get("Content-Type")
          );
      }
    } else if (response.status === 200) {
      return (await response.json()) as T;
    } else {
      throw new Error(
        "Unexpected response: " + response.status + " : " + response.statusText
      );
    }
  }

  createGroup(newGroup: NewGroup): Promise<Group> {
    // argh!! description should be mandatory, but now it is a custom
    // field and it is not yet defined in the service.
    // TODO: we need the groups service to have default custom fields.
    // At that point, what IS the point of custom fields ... oh, I know that
    // there are internal reasons for this due to re-using "group" for
    // organization, project, etc., but that should not leak through the
    // api.

    // mandatory fields.
    const payload: any = {
      name: newGroup.name,
      private: newGroup.isPrivate,
      custom: {
        logourl: newGroup.logoUrl,
        researchinterests: newGroup.researchInterests,
        homeurl: newGroup.homeUrl,
      },
    };

    // optional fields
    if (newGroup.description.length > 0) {
      payload.custom.description = newGroup.description;
    }

    return this.put<Group>(["group", newGroup.id], payload);
  }

  updateGroup(id: string, groupUpdate: GroupUpdate): Promise<void> {
    const payload: any = {
      name: groupUpdate.name,
      custom: {
        logourl: groupUpdate.logoUrl,
        homeurl: groupUpdate.homeUrl,
        researchinterests: groupUpdate.researchInterests,
      },
      private: groupUpdate.private,
    };
    // TODO: remove this when we have descriptions restored to the
    // groups service.
    if (groupUpdate.description) {
      payload.custom.description = groupUpdate.description;
    }
    return fetch(this.url + "/group/" + id + "/update", {
      headers: {
        Authorization: this.token,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      mode: "cors",
      method: "PUT",

      // TODO: build more intelligently
      body: JSON.stringify(payload),
    }).then((response) => {
      // response is an empty body.
      if (response.status === 204) {
        return;
      }
      throw new Error(
        "Unexpected response: " + response.status + " : " + response.statusText
      );
    });
  }

  async addRelatedGroup(
    groupId: GroupID,
    relatedGroupId: GroupID
  ): Promise<string> {
    // get the existing related groups
    const group = await this.get<Group>(["group", groupId]);

    // split into list
    let relatedGroups: Array<GroupID>;
    if (group.custom.relatedgroups) {
      relatedGroups = group.custom.relatedgroups.split(",");
    } else {
      relatedGroups = [];
    }

    // ensure that this one is not already there
    if (relatedGroups.includes(relatedGroupId)) {
      return relatedGroupId;
    }

    // append it
    relatedGroups.push(relatedGroupId);

    // join back into string
    const update = {
      custom: {
        relatedgroups: relatedGroups.join(","),
      },
    };

    // save as the relatedgroups property
    await this.put<void>(["group", groupId, "update"], update);

    return relatedGroupId;
  }

  async removeRelatedGroup(
    groupId: GroupID,
    relatedGroupId: GroupID
  ): Promise<string> {
    // get the existing related groups
    const group = await this.get<Group>(["group", groupId]);

    // split into list
    let relatedGroups: Array<GroupID>;
    if (group.custom.relatedgroups) {
      relatedGroups = group.custom.relatedgroups.split(",");
    } else {
      relatedGroups = [];
    }

    // ensure that this one is already there
    if (!relatedGroups.includes(relatedGroupId)) {
      return relatedGroupId;
    }

    // append it
    relatedGroups.push(relatedGroupId);

    const newRelatedGroups = relatedGroups.filter((groupId) => {
      return groupId !== relatedGroupId;
    });

    // join back into string
    const update = {
      custom: {
        relatedgroups: newRelatedGroups.join(","),
      },
    };

    // save as the relatedgroups property
    await this.put<void>(["group", groupId, "update"], update);

    return relatedGroupId;
  }

  async getRequest(requestId: string): Promise<Request> {
    const path = ["request", "id", requestId];
    return await this.get<Request>(path);
  }

  getGroupRequests(
    groupId: string,
    params: GetRequestsParams
  ): Promise<Array<Request>> {
    const query = new URLSearchParams();
    if (params.includeClosed) {
      query.append("closed", "closed");
    }
    if (params.sortDirection) {
      if (params.sortDirection === SortDirection.DESCENDING) {
        query.append("order", "desc");
      } else {
        query.append("order", "asc");
      }
    }
    if (params.startAt) {
      query.append("excludeupto", String(params.startAt.getTime()));
    }

    return fetch(
      this.url + "/group/" + groupId + "/requests?" + query.toString(),
      {
        headers: {
          Authorization: this.token,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        mode: "cors",
        method: "GET",
      }
    ).then((response) => {
      if (response.status !== 200) {
        throw new Error(
          "Unexpected response: " +
            response.status +
            " : " +
            response.statusText
        );
      }
      return response.json();
    });
  }

  getTargetedRequests(params: GetRequestsParams): Promise<Array<Request>> {
    const query = new URLSearchParams();
    if (params.includeClosed) {
      query.append("closed", "closed");
    }
    if (params.sortDirection) {
      if (params.sortDirection === SortDirection.DESCENDING) {
        query.append("order", "desc");
      } else {
        query.append("order", "asc");
      }
    }
    if (params.startAt) {
      query.append("excludeupto", String(params.startAt.getTime()));
    }
    return fetch(this.url + "/request/targeted?" + query.toString(), {
      headers: {
        Authorization: this.token,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      mode: "cors",
      method: "GET",
    }).then((response) => {
      if (response.status !== 200) {
        throw new Error(
          "Unexpected response: " +
            response.status +
            " : " +
            response.statusText
        );
      }
      return response.json();
    });
  }

  getCreatedRequests(params: GetRequestsParams): Promise<Array<Request>> {
    const query = new URLSearchParams();
    if (params.includeClosed) {
      query.append("closed", "closed");
    }
    if (params.sortDirection) {
      if (params.sortDirection === SortDirection.DESCENDING) {
        query.append("order", "desc");
      } else {
        query.append("order", "asc");
      }
    }
    if (params.startAt) {
      query.append("excludeupto", String(params.startAt.getTime()));
    }
    return fetch(this.url + "/request/created?" + query.toString(), {
      headers: {
        Authorization: this.token,
        Accept: "application/json",
        "Content-Type": "appcliation/json",
      },
      mode: "cors",
      method: "GET",
    }).then((response) => {
      if (response.status !== 200) {
        throw new Error(
          "Unexpected response: " +
            response.status +
            " : " +
            response.statusText
        );
      }
      return response.json();
    });
  }

  addOrRequestNarrative(
    params: RequestNarrativeParams
  ): Promise<RequestWithCompletion | Completion> {
    const url = [
      this.url,
      "group",
      params.groupId,
      "resource",
      "workspace",
      String(params.workspaceId),
    ].join("/");
    return fetch(url, {
      headers: {
        Authorization: this.token,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      mode: "cors",
      method: "POST",
    })
      .then((response) => {
        if (response.status !== 200) {
          throw new Error(
            "Unexpected response: " +
              response.status +
              " : " +
              response.statusText
          );
        }
        return response.json();
      })
      .then((result) => {
        if (result.complete === false) {
          return result as RequestWithCompletion;
        } else {
          return result as Completion;
        }
      });
  }

  addOrRequestResource(
    params: RequestResourceParams
  ): Promise<RequestWithCompletion | Completion> {
    const url = [
      this.url,
      "group",
      params.groupId,
      "resource",
      params.type,
      params.resourceId,
    ].join("/");
    return fetch(url, {
      headers: {
        Authorization: this.token,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      mode: "cors",
      method: "POST",
    })
      .then((response) => {
        if (response.status !== 200) {
          throw new Error(
            "Unexpected response: " +
              response.status +
              " : " +
              response.statusText
          );
        }
        return response.json();
      })
      .then((result) => {
        if (result.complete === false) {
          return result as RequestWithCompletion;
        } else {
          return result as Completion;
        }
      });
  }

  async grantResourceAccess(
    groupId: string,
    resourceType: string,
    resourceId: string
  ): Promise<null> {
    const path = [
      "group",
      groupId,
      "resource",
      resourceType,
      resourceId,
      "getperm",
    ];
    return this.post<null>(path, null);
  }

  deleteResource(
    groupId: string,
    resourceType: string,
    resourceId: string
  ): Promise<void> {
    const url = [
      this.url,
      "group",
      groupId,
      "resource",
      resourceType,
      resourceId,
    ].join("/");
    return fetch(url, {
      headers: {
        Authorization: this.token,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      mode: "cors",
      method: "DELETE",
    }).then((response) => {
      if (response.status !== 204) {
        throw new Error(
          "Unexpected response: " +
            response.status +
            " : " +
            response.statusText
        );
      }
    });
  }

  cancelRequest({ requestId }: { requestId: string }): Promise<Request> {
    return fetch(this.url + "/request/id/" + requestId + "/cancel", {
      headers: {
        Authorization: this.token,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      mode: "cors",
      method: "PUT",
    })
      .then((response) => {
        if (response.status !== 200) {
          throw new Error("Unexpected response: " + response.status);
        }
        return response.json();
      })
      .then((result) => {
        return result as Request;
      });
  }

  acceptRequest({ requestId }: { requestId: string }): Promise<Request> {
    return fetch(this.url + "/request/id/" + requestId + "/accept", {
      headers: {
        Authorization: this.token,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      mode: "cors",
      method: "PUT",
    })
      .then((response) => {
        if (response.status !== 200) {
          throw new Error("Unexpected response: " + response.status);
        }
        return response.json();
      })
      .then((result) => {
        return result as Request;
      });
  }

  grantReadAccessToRequestedResource({
    requestId,
  }: {
    requestId: string;
  }): Promise<null> {
    const path = ["request", "id", requestId, "getperm"];
    return this.post<null>(path, null);
  }

  denyRequest({ requestId }: { requestId: string }): Promise<Request> {
    return fetch(this.url + "/request/id/" + requestId + "/deny", {
      headers: {
        Authorization: this.token,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      mode: "cors",
      method: "PUT",
    })
      .then((response) => {
        if (response.status !== 200) {
          throw new Error("Unexpected response: " + response.status);
        }
        return response.json();
      })
      .then((result) => {
        return result as Request;
      });
  }

  memberToAdmin({
    groupId,
    member,
  }: {
    groupId: string;
    member: string;
  }): Promise<void> {
    const url = [this.url, "group", groupId, "user", member, "admin"].join("/");
    return fetch(url, {
      headers: {
        Authorization: this.token,
        Accept: "application/json",
      },
      mode: "cors",
      method: "PUT",
    }).then((response) => {
      if (response.status !== 204) {
        throw new Error(
          "Unexpected response: " + response.status + ":" + response.statusText
        );
      }
    });
  }

  adminToMember({
    groupId,
    member,
  }: {
    groupId: string;
    member: string;
  }): Promise<void> {
    const url = [this.url, "group", groupId, "user", member, "admin"].join("/");
    return fetch(url, {
      headers: {
        Authorization: this.token,
        Accept: "application/json",
      },
      mode: "cors",
      method: "DELETE",
    }).then((response) => {
      if (response.status !== 204) {
        throw new Error(
          "Unexpected response: " + response.status + ":" + response.statusText
        );
      }
    });
  }

  updateMember({
    groupId,
    memberUsername,
    update,
  }: {
    groupId: string;
    memberUsername: string;
    update: any;
  }): Promise<void> {
    const path = ["group", groupId, "user", memberUsername, "update"];

    return this.put<void>(path, { custom: update });
  }

  removeMember({
    groupId,
    member,
  }: {
    groupId: string;
    member: string;
  }): Promise<void> {
    const url = [this.url, "group", groupId, "user", member].join("/");
    return fetch(url, {
      headers: {
        Authorization: this.token,
        Accept: "application/json",
      },
      mode: "cors",
      method: "DELETE",
    }).then((response) => {
      if (response.status !== 204) {
        throw new Error(
          "Unexpected response: " + response.status + ":" + response.statusText
        );
      }
    });
  }

  requestMembership(params: RequestMemebershipParams): Promise<Request> {
    return fetch(this.url + "/group/" + params.groupId + "/requestmembership", {
      headers: {
        Authorization: this.token,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      mode: "cors",
      method: "POST",
    })
      .then((response) => {
        if (response.status !== 200) {
          throw new Error(
            "Unexpected response: " +
              response.status +
              " : " +
              response.statusText
          );
        }
        return response.json();
      })
      .then((result) => {
        return result as Request;
      });
  }

  inviteUserToGroup({
    groupId,
    username,
  }: {
    groupId: string;
    username: string;
  }): Promise<Request> {
    const url = [this.url, "group", groupId, "user", username].join("/");
    return fetch(url, {
      headers: {
        Authorization: this.token,
        Accept: "application/json",
      },
      mode: "cors",
      method: "POST",
    })
      .then((response) => {
        if (response.status !== 200) {
          throw new Error(
            "Unexpected response: " +
              response.status +
              ":" +
              response.statusText
          );
        }
        return response.json();
      })
      .then((result) => {
        return result as Request;
      });
  }

  async visitGroup({ groupId }: { groupId: string }): Promise<void> {
    const path = ["group", groupId, "visit"];
    return this.put<void>(path, null);
  }

  async getOpenRequests({
    groupIds,
  }: {
    groupIds: Array<string>;
  }): Promise<Map<GroupID, RequestStatus>> {
    const path = ["request", "groups", groupIds.join(","), "new"];
    const result = await this.get<any>(path);
    const requestStatuses = new Map<GroupID, RequestStatus>();
    for (const [groupId, requestStatus] of Object.entries(result)) {
      requestStatuses.set(groupId, requestStatus as RequestStatus);
    }
    return requestStatuses;
  }
}
