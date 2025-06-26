import { auth } from "@clerk/nextjs/server";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { ServerSidebar } from "@/components/server/server-sidebar";

const ServerIdLayout = async ({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ serverId: string }>;
}) => {
    const profile = await currentProfile();
    const {serverId} = await params;
    const {redirectToSignIn } = await auth();

    if(!profile) {
        return redirectToSignIn();
    }

    const server = await db.server.findUnique({
        where: {
            id: serverId,
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    });

    if(!server) {
        return redirect("/");
    }

    return (
        <div className="h-full">
            <div className="hidden md:flex h-full w-60 z-20 flex-col fixed insert-y-0">
                <ServerSidebar serverId={serverId}/>
            </div>
            <main className="h-full md:pl-60">
                {children} 
            </main>
            
        </div>
    )
}

export default ServerIdLayout;