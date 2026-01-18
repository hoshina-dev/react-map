import { NextRequest } from "next/server";

import { GetChildrenByCodeDocument } from "@/graphql/generated/graphql";
import { graphqlClient } from "@/lib/graphql-client";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ parentCode: string }> },
) {
  try {
    // In Next.js 16+, params must be awaited
    const params = await context.params;

    const searchParams = request.nextUrl.searchParams;
    const childLevel = searchParams.get("childLevel");
    const tolerance = searchParams.get("tolerance");

    if (!childLevel) {
      return new Response(
        JSON.stringify({ error: "childLevel query parameter is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Validate parentCode
    if (!params.parentCode || params.parentCode.trim() === "") {
      return new Response(
        JSON.stringify({ error: "parentCode is required and cannot be empty" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const variables = {
      parentCode: params.parentCode,
      childLevel: parseInt(childLevel, 10),
      tolerance: tolerance ? parseFloat(tolerance) : 0,
    };

    const data = await graphqlClient.request(
      GetChildrenByCodeDocument,
      variables,
    );

    // Transform to GeoJSON FeatureCollection
    const geojson = {
      type: "FeatureCollection",
      features: data.childrenByCode.map((area) => ({
        type: "Feature",
        id: area.id,
        properties: {
          id: area.id,
          name: area.name,
          isoCode: area.isoCode,
          adminLevel: area.adminLevel,
          parentCode: area.parentCode,
        },
        geometry: area.geometry,
      })),
    };

    return new Response(JSON.stringify(geojson), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control":
          "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Failed to fetch children",
        details: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
