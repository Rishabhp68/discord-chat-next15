"use client";

import { useEffect, useState } from "react";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

interface MediaRoomProps {
  chatId: string;
  video: boolean;
  audio: boolean;
}

function toShortCode(input: string): string {
    const parts = input.split("_");
    if (parts.length < 2 || parts[1].length < 5) {
      throw new Error("Invalid input format or too short");
    }
    return `${parts[1].slice(0, 5)}`;
}

export const MediaRoom = ({ chatId, video, audio }: MediaRoomProps) => {
  const { user, isLoaded } = useUser();
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded || !user) return;

    const name =
      user.firstName && user.lastName
        ? `${user.firstName} ${user.lastName} ${toShortCode(user.id)}`
        : user.id || "Anonymous";

    const fetchToken = async () => {
      try {
        const resp = await fetch(
          `/api/livekit?room=${chatId}&username=${encodeURIComponent(name)}`
        );
        const data = await resp.json();
        if (data.token) {
          setToken(data.token);
        } else {
          throw new Error("Token not received");
        }
      } catch (err: any) {
        console.error("Failed to fetch LiveKit token:", err);
        setError("Failed to connect to LiveKit");
      }
    };

    fetchToken();
  }, [isLoaded, user, chatId]);

  const serverUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;

  if (!serverUrl) {
    return (
      <div className="text-red-500">
        Error: NEXT_PUBLIC_LIVEKIT_URL is not set in your environment.
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-sm">
        {error}
      </div>
    );
  }

  if (!token) {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Connecting to room...</p>
      </div>
    );
  }

  return (
    <LiveKitRoom
      data-lk-theme="default"
      serverUrl={serverUrl}
      token={token}
      connect={true}
      video={video}
      audio={audio}
    >
      <VideoConference />
    </LiveKitRoom>
  );
};
