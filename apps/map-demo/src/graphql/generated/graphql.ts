/* eslint-disable */
import type { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  Map: { input: any; output: any };
};

export type AdminArea = {
  __typename?: "AdminArea";
  adminLevel: Scalars["Int"]["output"];
  geometry: Scalars["Map"]["output"];
  id: Scalars["ID"]["output"];
  isoCode: Scalars["String"]["output"];
  name: Scalars["String"]["output"];
  parentCode?: Maybe<Scalars["String"]["output"]>;
};

export type Query = {
  __typename?: "Query";
  adminArea?: Maybe<AdminArea>;
  adminAreaByCode?: Maybe<AdminArea>;
  adminAreas: Array<AdminArea>;
  childrenByCode: Array<AdminArea>;
};

export type QueryAdminAreaArgs = {
  adminLevel: Scalars["Int"]["input"];
  id: Scalars["ID"]["input"];
  tolerance?: InputMaybe<Scalars["Float"]["input"]>;
};

export type QueryAdminAreaByCodeArgs = {
  adminLevel: Scalars["Int"]["input"];
  code: Scalars["String"]["input"];
  tolerance?: InputMaybe<Scalars["Float"]["input"]>;
};

export type QueryAdminAreasArgs = {
  adminLevel: Scalars["Int"]["input"];
  tolerance?: InputMaybe<Scalars["Float"]["input"]>;
};

export type QueryChildrenByCodeArgs = {
  childLevel: Scalars["Int"]["input"];
  parentCode: Scalars["String"]["input"];
  tolerance?: InputMaybe<Scalars["Float"]["input"]>;
};

export type GetAdminAreaQueryVariables = Exact<{
  id: Scalars["ID"]["input"];
  adminLevel: Scalars["Int"]["input"];
  tolerance?: InputMaybe<Scalars["Float"]["input"]>;
}>;

export type GetAdminAreaQuery = {
  __typename?: "Query";
  adminArea?: {
    __typename?: "AdminArea";
    id: string;
    name: string;
    isoCode: string;
    geometry: any;
    adminLevel: number;
    parentCode?: string | null;
  } | null;
};

export type GetAdminAreaByCodeQueryVariables = Exact<{
  code: Scalars["String"]["input"];
  adminLevel: Scalars["Int"]["input"];
  tolerance?: InputMaybe<Scalars["Float"]["input"]>;
}>;

export type GetAdminAreaByCodeQuery = {
  __typename?: "Query";
  adminAreaByCode?: {
    __typename?: "AdminArea";
    id: string;
    name: string;
    isoCode: string;
    geometry: any;
    adminLevel: number;
    parentCode?: string | null;
  } | null;
};

export type GetAdminAreasQueryVariables = Exact<{
  adminLevel: Scalars["Int"]["input"];
  tolerance?: InputMaybe<Scalars["Float"]["input"]>;
}>;

export type GetAdminAreasQuery = {
  __typename?: "Query";
  adminAreas: Array<{
    __typename?: "AdminArea";
    id: string;
    name: string;
    isoCode: string;
    geometry: any;
    adminLevel: number;
    parentCode?: string | null;
  }>;
};

export type GetChildrenByCodeQueryVariables = Exact<{
  parentCode: Scalars["String"]["input"];
  childLevel: Scalars["Int"]["input"];
  tolerance?: InputMaybe<Scalars["Float"]["input"]>;
}>;

export type GetChildrenByCodeQuery = {
  __typename?: "Query";
  childrenByCode: Array<{
    __typename?: "AdminArea";
    id: string;
    name: string;
    isoCode: string;
    geometry: any;
    adminLevel: number;
    parentCode?: string | null;
  }>;
};

export const GetAdminAreaDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetAdminArea" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "adminLevel" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "tolerance" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "Float" } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "adminArea" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "id" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "adminLevel" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "adminLevel" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "tolerance" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "tolerance" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "isoCode" } },
                { kind: "Field", name: { kind: "Name", value: "geometry" } },
                { kind: "Field", name: { kind: "Name", value: "adminLevel" } },
                { kind: "Field", name: { kind: "Name", value: "parentCode" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetAdminAreaQuery, GetAdminAreaQueryVariables>;
export const GetAdminAreaByCodeDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetAdminAreaByCode" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "code" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "adminLevel" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "tolerance" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "Float" } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "adminAreaByCode" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "code" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "code" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "adminLevel" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "adminLevel" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "tolerance" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "tolerance" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "isoCode" } },
                { kind: "Field", name: { kind: "Name", value: "geometry" } },
                { kind: "Field", name: { kind: "Name", value: "adminLevel" } },
                { kind: "Field", name: { kind: "Name", value: "parentCode" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetAdminAreaByCodeQuery,
  GetAdminAreaByCodeQueryVariables
>;
export const GetAdminAreasDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetAdminAreas" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "adminLevel" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "tolerance" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "Float" } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "adminAreas" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "adminLevel" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "adminLevel" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "tolerance" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "tolerance" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "isoCode" } },
                { kind: "Field", name: { kind: "Name", value: "geometry" } },
                { kind: "Field", name: { kind: "Name", value: "adminLevel" } },
                { kind: "Field", name: { kind: "Name", value: "parentCode" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetAdminAreasQuery, GetAdminAreasQueryVariables>;
export const GetChildrenByCodeDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetChildrenByCode" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "parentCode" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "childLevel" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "tolerance" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "Float" } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "childrenByCode" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "parentCode" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "parentCode" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "childLevel" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "childLevel" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "tolerance" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "tolerance" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "isoCode" } },
                { kind: "Field", name: { kind: "Name", value: "geometry" } },
                { kind: "Field", name: { kind: "Name", value: "adminLevel" } },
                { kind: "Field", name: { kind: "Name", value: "parentCode" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetChildrenByCodeQuery,
  GetChildrenByCodeQueryVariables
>;
