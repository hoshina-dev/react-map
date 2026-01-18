/* eslint-disable */
import * as types from "./graphql";
import type { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
  "query GetAdminArea($id: ID!, $adminLevel: Int!, $tolerance: Float) {\n  adminArea(id: $id, adminLevel: $adminLevel, tolerance: $tolerance) {\n    id\n    name\n    isoCode\n    geometry\n    adminLevel\n    parentCode\n  }\n}": typeof types.GetAdminAreaDocument;
  "query GetAdminAreaByCode($code: String!, $adminLevel: Int!, $tolerance: Float) {\n  adminAreaByCode(code: $code, adminLevel: $adminLevel, tolerance: $tolerance) {\n    id\n    name\n    isoCode\n    geometry\n    adminLevel\n    parentCode\n  }\n}": typeof types.GetAdminAreaByCodeDocument;
  "query GetAdminAreas($adminLevel: Int!, $tolerance: Float) {\n  adminAreas(adminLevel: $adminLevel, tolerance: $tolerance) {\n    id\n    name\n    isoCode\n    geometry\n    adminLevel\n    parentCode\n  }\n}": typeof types.GetAdminAreasDocument;
  "query GetChildrenByCode($parentCode: String!, $childLevel: Int!, $tolerance: Float) {\n  childrenByCode(\n    parentCode: $parentCode\n    childLevel: $childLevel\n    tolerance: $tolerance\n  ) {\n    id\n    name\n    isoCode\n    geometry\n    adminLevel\n    parentCode\n  }\n}": typeof types.GetChildrenByCodeDocument;
};
const documents: Documents = {
  "query GetAdminArea($id: ID!, $adminLevel: Int!, $tolerance: Float) {\n  adminArea(id: $id, adminLevel: $adminLevel, tolerance: $tolerance) {\n    id\n    name\n    isoCode\n    geometry\n    adminLevel\n    parentCode\n  }\n}":
    types.GetAdminAreaDocument,
  "query GetAdminAreaByCode($code: String!, $adminLevel: Int!, $tolerance: Float) {\n  adminAreaByCode(code: $code, adminLevel: $adminLevel, tolerance: $tolerance) {\n    id\n    name\n    isoCode\n    geometry\n    adminLevel\n    parentCode\n  }\n}":
    types.GetAdminAreaByCodeDocument,
  "query GetAdminAreas($adminLevel: Int!, $tolerance: Float) {\n  adminAreas(adminLevel: $adminLevel, tolerance: $tolerance) {\n    id\n    name\n    isoCode\n    geometry\n    adminLevel\n    parentCode\n  }\n}":
    types.GetAdminAreasDocument,
  "query GetChildrenByCode($parentCode: String!, $childLevel: Int!, $tolerance: Float) {\n  childrenByCode(\n    parentCode: $parentCode\n    childLevel: $childLevel\n    tolerance: $tolerance\n  ) {\n    id\n    name\n    isoCode\n    geometry\n    adminLevel\n    parentCode\n  }\n}":
    types.GetChildrenByCodeDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "query GetAdminArea($id: ID!, $adminLevel: Int!, $tolerance: Float) {\n  adminArea(id: $id, adminLevel: $adminLevel, tolerance: $tolerance) {\n    id\n    name\n    isoCode\n    geometry\n    adminLevel\n    parentCode\n  }\n}",
): (typeof documents)["query GetAdminArea($id: ID!, $adminLevel: Int!, $tolerance: Float) {\n  adminArea(id: $id, adminLevel: $adminLevel, tolerance: $tolerance) {\n    id\n    name\n    isoCode\n    geometry\n    adminLevel\n    parentCode\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "query GetAdminAreaByCode($code: String!, $adminLevel: Int!, $tolerance: Float) {\n  adminAreaByCode(code: $code, adminLevel: $adminLevel, tolerance: $tolerance) {\n    id\n    name\n    isoCode\n    geometry\n    adminLevel\n    parentCode\n  }\n}",
): (typeof documents)["query GetAdminAreaByCode($code: String!, $adminLevel: Int!, $tolerance: Float) {\n  adminAreaByCode(code: $code, adminLevel: $adminLevel, tolerance: $tolerance) {\n    id\n    name\n    isoCode\n    geometry\n    adminLevel\n    parentCode\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "query GetAdminAreas($adminLevel: Int!, $tolerance: Float) {\n  adminAreas(adminLevel: $adminLevel, tolerance: $tolerance) {\n    id\n    name\n    isoCode\n    geometry\n    adminLevel\n    parentCode\n  }\n}",
): (typeof documents)["query GetAdminAreas($adminLevel: Int!, $tolerance: Float) {\n  adminAreas(adminLevel: $adminLevel, tolerance: $tolerance) {\n    id\n    name\n    isoCode\n    geometry\n    adminLevel\n    parentCode\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "query GetChildrenByCode($parentCode: String!, $childLevel: Int!, $tolerance: Float) {\n  childrenByCode(\n    parentCode: $parentCode\n    childLevel: $childLevel\n    tolerance: $tolerance\n  ) {\n    id\n    name\n    isoCode\n    geometry\n    adminLevel\n    parentCode\n  }\n}",
): (typeof documents)["query GetChildrenByCode($parentCode: String!, $childLevel: Int!, $tolerance: Float) {\n  childrenByCode(\n    parentCode: $parentCode\n    childLevel: $childLevel\n    tolerance: $tolerance\n  ) {\n    id\n    name\n    isoCode\n    geometry\n    adminLevel\n    parentCode\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
  TDocumentNode extends DocumentNode<infer TType, any> ? TType : never;
