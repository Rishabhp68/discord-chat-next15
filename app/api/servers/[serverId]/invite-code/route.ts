import { v4 as uuidv4 } from "uuid";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request, 
    { params }: { params: Promise<{serverId: string }> }
) {
    try {
        const profile = await currentProfile();
        const { serverId } = await params;
        if(!profile) {
            return new NextResponse("Unauthorised", { status: 400 });
        }

        if(!serverId) {
            return new NextResponse("Server Id Missing", { status: 400 });
        }

        const server = await db.server.update({
            where: {
                id: serverId,
                profileId: profile.id,
            },
            data: {
                inviteCode: uuidv4(),
            }
        })
     
        return NextResponse.json(server);
    } catch(error) {
        console.log("[SERVER_ID]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}