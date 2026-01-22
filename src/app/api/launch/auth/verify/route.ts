import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { token } = await req.json();

        const response = await fetch(`${process.env.CRM_API_URL}/site-customers/verify/${token}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { error: data.detail || "Verification failed" },
                { status: response.status }
            );
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error("Verify Email Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
