import useCombinedTranscriptions from "@/hooks/useCombinedTranscriptions";
import * as React from "react";

export default function TranscriptionView() {
  const combinedTranscriptions = useCombinedTranscriptions();

  // scroll to bottom when new transcription is added
  React.useEffect(() => {
    const transcription = combinedTranscriptions[combinedTranscriptions.length - 1];
    if (transcription) {
      const transcriptionElement = document.getElementById(transcription.id);
      if (transcriptionElement) {
        transcriptionElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [combinedTranscriptions]);

  return (
    <div className="h-full flex flex-col gap-2 overflow-y-auto">
      {combinedTranscriptions.map((segment) => (
        <div
          id={segment.id}
          key={segment.id}
          className={
            segment.role === "assistant"
              ? "bg-card text-primary rounded-md p-2 self-start fit-content"
              : "bg-accent text-primary rounded-md p-2 self-end fit-content"
          }
        >
          {segment.text}
        </div>
      ))}
    </div>
  );
}
