"use client";

import Image from "next/image";
import Link from "next/link";

export default function OnboardingPage() {
  return (
    <div className="flex flex-col h-full justify-between p-6">
      {/* Top content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
        <div className="w-32 h-32 relative mb-8">
          <Image src="/clock-icon.svg" alt="Clock Icon" layout="fill" objectFit="contain" />
        </div>

        <h1 className="text-3xl font-bold text-white">Encourage Consistency with Reminders</h1>

        <p className="text-white/90 max-w-md">
          Habit is a powerful ally in emotional mindfulness. Schedule reminders to suit your routine
          and foster regular mood logging.
        </p>

        <div className="bg-white rounded-xl p-4 w-full max-w-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-primary">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
              </svg>
            </span>
            <span className="text-gray-900">20:00</span>
          </div>
          <button className="text-primary font-medium">Change</button>
        </div>

        <p className="text-white/80 text-sm">You can add more reminders later in the app.</p>
      </div>

      {/* Bottom navigation */}
      <div className="flex justify-between items-center mt-8">
        <button className="text-white font-medium">Back</button>
        <Link
          href="/next-step"
          className="bg-accent text-black font-medium py-4 px-12 rounded-full w-[200px] text-center"
        >
          Next
        </Link>
      </div>
    </div>
  );
}
