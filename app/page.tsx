"use client";

import { CloseIcon } from "@/components/CloseIcon";
import { NoAgentNotification } from "@/components/NoAgentNotification";
import TranscriptionView from "@/components/TranscriptionView";
import {
  BarVisualizer,
  DisconnectButton,
  RoomAudioRenderer,
  RoomContext,
  VoiceAssistantControlBar,
  useVoiceAssistant,
} from "@livekit/components-react";
import { useKrispNoiseFilter } from "@livekit/components-react/krisp";
import { AnimatePresence, motion } from "framer-motion";
import { Room, RoomEvent } from "livekit-client";
import { useCallback, useEffect, useState } from "react";
import type { ConnectionDetails } from "./api/connection-details/route";

export default function Page() {
  const [room] = useState(new Room());

  const onConnectButtonClicked = useCallback(async () => {
    // Generate room connection details, including:
    //   - A random Room name
    //   - A random Participant name
    //   - An Access Token to permit the participant to join the room
    //   - The URL of the LiveKit server to connect to
    //
    // In real-world application, you would likely allow the user to specify their
    // own participant name, and possibly to choose from existing rooms to join.

    const url = new URL(
      process.env.NEXT_PUBLIC_CONN_DETAILS_ENDPOINT ?? "/api/connection-details",
      window.location.origin
    );
    const response = await fetch(url.toString());
    const connectionDetailsData: ConnectionDetails = await response.json();

    await room.connect(connectionDetailsData.serverUrl, connectionDetailsData.participantToken);
    await room.localParticipant.setMicrophoneEnabled(true);
  }, [room]);

  useEffect(() => {
    room.on(RoomEvent.MediaDevicesError, onDeviceFailure);

    return () => {
      room.off(RoomEvent.MediaDevicesError, onDeviceFailure);
    };
  }, [room]);

  return (
    <main data-lk-theme="default" className="h-full w-full">
      <RoomContext.Provider value={room}>
        <div className="content-container">
          <SimpleVoiceAssistant onConnectButtonClicked={onConnectButtonClicked} />
        </div>
      </RoomContext.Provider>
    </main>
  );
}

function SimpleVoiceAssistant(props: { onConnectButtonClicked: () => void }) {
  const { state: agentState } = useVoiceAssistant();
  return (
    <>
      <div className="transcription-container">
        <div className="fixed top-4 bottom-40 w-[480px] left-1/2 -translate-x-1/2">
          <div className="h-full px-4 overflow-y-auto">
            <p className="text-white/90 text-base leading-relaxed pr-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              <br />
              <br />
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
              officia deserunt mollit anim id est laborum.
              <br />
              <br />
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
              laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi
              architecto beatae vitae dicta sunt explicabo.
              <br />
              <br />
              Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia
              consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
              <br />
              <br />
              Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci
              velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam
              aliquam quaerat voluptatem.
              <br />
              <br />
              Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit
              laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure
              reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.
              <br />
              <br />
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              <br />
              <br />
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
              officia deserunt mollit anim id est laborum.
              <br />
              <br />
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
              laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi
              architecto beatae vitae dicta sunt explicabo.
            </p>
          </div>
        </div>
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-10">
          <AnimatePresence>
            {agentState === "disconnected" && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, ease: [0.09, 1.04, 0.245, 1.055] }}
                className="nav-button rounded-md text-lg !max-w-[240px]"
                onClick={() => props.onConnectButtonClicked()}
              >
                Start a conversation
              </motion.button>
            )}
          </AnimatePresence>
        </div>
        <div className="w-3/4 lg:w-1/2 mx-auto">
          <TranscriptionView />
        </div>
      </div>

      <RoomAudioRenderer />
      <NoAgentNotification state={agentState} />
      <div className="fixed bottom-0 w-full px-4 py-2">
        <ControlBar />
      </div>

      <style jsx global>{`
        .transcription-container ::-webkit-scrollbar {
          width: 6px;
        }
        .transcription-container ::-webkit-scrollbar-track {
          background: transparent;
        }
        .transcription-container ::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.3);
          border-radius: 3px;
        }
        .transcription-container ::-webkit-scrollbar-thumb:hover {
          background-color: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </>
  );
}

function ControlBar() {
  /**
   * Use Krisp background noise reduction when available.
   * Note: This is only available on Scale plan, see {@link https://livekit.io/pricing | LiveKit Pricing} for more details.
   */
  const krisp = useKrispNoiseFilter();
  useEffect(() => {
    krisp.setNoiseFilterEnabled(true);
  }, []);

  const { state: agentState, audioTrack } = useVoiceAssistant();

  return (
    <div className="relative h-[100px]">
      <AnimatePresence>
        {agentState !== "disconnected" && agentState !== "connecting" && (
          <motion.div
            initial={{ opacity: 0, top: "10px" }}
            animate={{ opacity: 1, top: 0 }}
            exit={{ opacity: 0, top: "-10px" }}
            transition={{ duration: 0.4, ease: [0.09, 1.04, 0.245, 1.055] }}
            className="flex absolute w-full h-full justify-between px-8 sm:px-4"
          >
            <BarVisualizer
              state={agentState}
              barCount={5}
              trackRef={audioTrack}
              className="agent-visualizer w-24 gap-2"
              options={{ minHeight: 12 }}
            />
            <div className="flex items-center">
              <VoiceAssistantControlBar controls={{ leave: false }} />
              <DisconnectButton>
                <CloseIcon />
              </DisconnectButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function onDeviceFailure(error: Error) {
  console.error(error);
  alert(
    "Error acquiring camera or microphone permissions. Please make sure you grant the necessary permissions in your browser and reload the tab"
  );
}
