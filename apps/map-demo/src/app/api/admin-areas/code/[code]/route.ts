import { NextRequest, NextResponse } from "next/server";

import { GetAdminAreaByCodeDocument } from "@/graphql/generated/graphql";
import { graphqlClient } from "@/lib/graphql-client";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ code: string }> },
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
      code: params.code,
      adminLevel: parseInt(adminLevel, 10),
      tolerance: tolerance ? parseFloat(tolerance) : 0,
    };

    const data = await graphqlClient.request(
      GetAdminAreaByCodeDocument,
      variables,
    );

    if (!data.adminAreaByCode) {
      return NextResponse.json(
        { error: "Admin area not found" },
        { status: 404 },
      );
    }

    // Transform to GeoJSON Feature
    const geojson = {
      type: "Feature",
      id: data.adminAreaByCode.id,
      properties: {
        id: data.adminAreaByCode.id,
        name: data.adminAreaByCode.name,
        isoCode: data.adminAreaByCode.isoCode,
        adminLevel: data.adminAreaByCode.adminLevel,
        parentCode: data.adminAreaByCode.parentCode,
      },
      geometry: data.adminAreaByCode.geometry,
    };

    return NextResponse.json(geojson);
  } catch (error) {
    console.error("Error fetching admin area by code:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin area" },
      { status: 500 },
    );
  }
}
