import { NextRequest } from "next/server";

import { GetAdminAreasDocument } from "@/graphql/generated/graphql";
import { graphqlClient } from "@/lib/graphql-client";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const adminLevel = searchParams.get("adminLevel");
    const tolerance = searchParams.get("tolerance");

    if (!adminLevel) {
      return new Response(
        JSON.stringify({ error: "adminLevel query parameter is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const variables = {
      adminLevel: parseInt(adminLevel, 10),
      tolerance: tolerance ? parseFloat(tolerance) : 0,
    };

    const data = await graphqlClient.request(GetAdminAreasDocument, variables);

    // Transform to GeoJSON FeatureCollection
    const geojson = {
      type: "FeatureCollection",
      features: data.adminAreas.map((area) => ({
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

    // Use Response instead of NextResponse to avoid extra serialization
    // Add aggressive caching headers
    return new Response(JSON.stringify(geojson), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control":
          "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Error fetching admin areas:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch admin areas" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
