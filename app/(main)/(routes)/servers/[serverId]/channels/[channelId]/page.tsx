import { currentProfile } from "@/lib/current-profile";
import { auth } from "@clerk/nextjs/server";

import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";
import { ChannelType } from "@prisma/client";
import { MediaRoom } from "@/components/media-room";

interface ChannelIdPageProps {
  params: Promise<{
    serverId: string;
    channelId: string;
  }>;
}

const channelIdPage = async ({ params }: ChannelIdPageProps) => {
  const profile = await currentProfile();
  const { redirectToSignIn } = await auth();
  const { serverId, channelId } = await params;

  if (!profile) {
    return redirectToSignIn();
  }

  const channel = await db.channel.findUnique({
    where: {
      id: channelId,
    },
  });

  const member = await db.member.findFirst({
    where: {
      serverId: serverId,
      profileId: profile.id,
    },
  });

  if(!channel || !member) {
    redirect("/");
  }

  return ( 
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
        <ChatHeader 
            name={channel.name}
            serverId={channel.serverId}
            type="channel"
        />
        {channel.type === ChannelType.TEXT && (
          <>
            <ChatMessages
              member={member}
              name={channel.name}
              chatId={channel.id}
              type="channel"
              apiUrl="/api/messages"
              socketUrl="/api/socket/messages"
              socketQuery={{
                channelId: channel.id,
                serverId: channel.serverId,
              }}
              paramKey="channelId"
              paramValue={channel.id}
            />
            <ChatInput
              name={channel.name}
              type="channel"
              apiUrl="/api/socket/messages"
              query={{
                channelId: channel.id,
                serverId: channel.serverId,
              }}
            />
          </>
        )}
        {channel.type === ChannelType.AUDIO && (
          <MediaRoom
            chatId={channel.id}
            video={false}
            audio={true}
          />
        )}
        {channel.type === ChannelType.VIDEO && (
          <MediaRoom
            chatId={channel.id}
            video={true}
            audio={true}
          />
        )}
    </div> 
    );
};

export default channelIdPage;
