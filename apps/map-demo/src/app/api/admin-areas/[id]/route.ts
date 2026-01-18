import { NextRequest, NextResponse } from "next/server";

import { GetAdminAreaDocument } from "@/graphql/generated/graphql";
import { graphqlClient } from "@/lib/graphql-client";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    // In Next.js 16+, params must be awaited
    const params = await context.params;

    const searchParams = request.nextUrl.searchParams;
    const adminLevel = searchParams.get("adminLevel");
    const tolerance = searchParams.get("tolerance");

    if (!adminLevel) {
      return NextResponse.json(
        { error: "adminLevel query parameter is required" },
        { status: 400 },
      );
    }

    const variables = {
      id: params.id,
      adminLevel: parseInt(adminLevel, 10),
      tolerance: tolerance ? parseFloat(tolerance) : 0,
    };

    const data = await graphqlClient.request(GetAdminAreaDocument, variables);

    if (!data.adminArea) {
      return NextResponse.json(
        { error: "Admin area not found" },
        { status: 404 },
      );
    }

    // Transform to GeoJSON Feature
    const geojson = {
      type: "Feature",
      id: data.adminArea.id,
      properties: {
        id: data.adminArea.id,
        name: data.adminArea.name,
        isoCode: data.adminArea.isoCode,
        adminLevel: data.adminArea.adminLevel,
        parentCode: data.adminArea.parentCode,
      },
      geometry: data.adminArea.geometry,
    };

    return NextResponse.json(geojson);
  } catch (error) {
    console.error("Error fetching admin area:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin area" },
      { status: 500 },
    );
  }
}
