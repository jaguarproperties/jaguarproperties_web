import React from "react";
import { ImageResponse } from "next/og";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { canAccessAdmin } from "@/lib/permissions";
import { buildHrmDocument, getHrmDocumentContext, isHrmDocumentType } from "@/lib/hrm";

export async function GET(
  request: Request,
  { params }: { params: { type: string } }
) {
  const session = await auth();

  if (!session?.user || !canAccessAdmin(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isHrmDocumentType(params.type)) {
    return NextResponse.json({ error: "Invalid document type" }, { status: 404 });
  }

  const searchParams = new URL(request.url).searchParams;
  const employeeId = searchParams.get("employeeId");

  if (!employeeId) {
    return NextResponse.json({ error: "Employee ID is required" }, { status: 400 });
  }

  try {
    const mode = searchParams.get("mode") === "download" ? "download" : "inline";
    const inputs = Object.fromEntries(searchParams.entries());

    if (params.type === "employee-id-card") {
      const { workspace, employee } = await getHrmDocumentContext(
        { id: session.user.id, role: session.user.role },
        params.type,
        employeeId
      );
      const initials = employee.name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join("");
      const validUntil = inputs.validUntil || new Date().toISOString().slice(0, 10);
      const bloodGroup = inputs.bloodGroup || "N/A";
      const emergencyContact = inputs.emergencyContact || "N/A";
      const fileName = `${employee.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-employee-id-card.png`;
      const h = React.createElement;

      const image = new ImageResponse(
        h(
          "div",
          {
            style: {
              width: "100%",
              height: "100%",
              display: "flex",
              background: "linear-gradient(180deg, #1b1713 0%, #090909 100%)",
              border: "8px solid #c79d4d",
              borderRadius: 32,
              overflow: "hidden",
              color: "#fff7e9",
              fontFamily: "Arial"
            }
          },
          h(
            "div",
            {
              style: {
                width: "100%",
                display: "flex",
                flexDirection: "column"
              }
            },
            h(
              "div",
              {
                style: {
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "30px 34px",
                  background: "linear-gradient(135deg, #dbb567 0%, #b98934 100%)",
                  color: "#24180c"
                }
              },
              h(
                "div",
                { style: { display: "flex", flexDirection: "column" } },
                h(
                  "div",
                  { style: { fontSize: 30, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase" } },
                  workspace.letterhead.companyName
                ),
                h(
                  "div",
                  { style: { fontSize: 14, letterSpacing: 4, textTransform: "uppercase", marginTop: 6 } },
                  "Employee Identity Card"
                )
              ),
              h(
                "div",
                {
                  style: {
                    display: "flex",
                    width: 82,
                    height: 82,
                    borderRadius: 20,
                    background: "#fff2cf",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#3a2a13",
                    fontWeight: 800,
                    fontSize: 22
                  }
                },
                "JP"
              )
            ),
            h(
              "div",
              {
                style: {
                  display: "flex",
                  flex: 1,
                  padding: "28px 30px 24px",
                  gap: 24
                }
              },
              h(
                "div",
                {
                  style: {
                    display: "flex",
                    width: 165,
                    minWidth: 165,
                    height: 210,
                    borderRadius: 24,
                    background: "linear-gradient(180deg, #f7dfaf 0%, #d3a85f 100%)",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#23190f",
                    fontSize: 54,
                    fontWeight: 800
                  }
                },
                initials || "JP"
              ),
              h(
                "div",
                { style: { display: "flex", flexDirection: "column", flex: 1 } },
                h("div", { style: { fontSize: 38, fontWeight: 800, lineHeight: 1.1 } }, employee.name),
                h(
                  "div",
                  {
                    style: {
                      fontSize: 16,
                      textTransform: "uppercase",
                      letterSpacing: 3,
                      color: "#d6c19a",
                      marginTop: 8
                    }
                  },
                  employee.role
                ),
                h(
                  "div",
                  {
                    style: {
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 14,
                      marginTop: 20
                    }
                  },
                  ...[
                    ["Employee ID", employee.employeeCode || "Pending"],
                    ["Department", employee.department ?? "Operations"],
                    ["Phone", employee.phone ?? "N/A"],
                    ["Valid Until", validUntil],
                    ["Blood Group", bloodGroup],
                    ["Emergency", emergencyContact]
                  ].map(([label, value]) =>
                    h(
                      "div",
                      {
                        key: label,
                        style: {
                          display: "flex",
                          flexDirection: "column",
                          padding: "12px 14px",
                          borderRadius: 18,
                          background: "rgba(255,255,255,0.06)",
                          border: "1px solid rgba(255,255,255,0.08)"
                        }
                      },
                      h(
                        "div",
                        {
                          style: {
                            fontSize: 10,
                            textTransform: "uppercase",
                            letterSpacing: 2.5,
                            color: "#cbb48d"
                          }
                        },
                        label
                      ),
                      h("div", { style: { fontSize: 18, fontWeight: 700, marginTop: 8 } }, value)
                    )
                  )
                )
              )
            ),
            h(
              "div",
              {
                style: {
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0 30px 20px",
                  fontSize: 12,
                  color: "#ccb893"
                }
              },
              h("div", { style: { display: "flex" } }, "Carry this card during official duty. Return on separation."),
              h("div", { style: { display: "flex", fontWeight: 700, color: "#f0d59c" } }, "Authorized by HR")
            )
          )
        ),
        {
          width: 856,
          height: 540
        }
      );

      return new NextResponse(image.body, {
        headers: {
          "Content-Type": "image/png",
          "Content-Disposition": `attachment; filename="${fileName}"`,
          "Cache-Control": "no-store"
        }
      });
    }

    const document = await buildHrmDocument(
      { id: session.user.id, role: session.user.role },
      params.type,
      employeeId,
      inputs
    );

    return new NextResponse(document.html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": `${mode === "download" ? "attachment" : "inline"}; filename="${document.fileName}"`,
        "Cache-Control": "no-store"
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Document generation failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
