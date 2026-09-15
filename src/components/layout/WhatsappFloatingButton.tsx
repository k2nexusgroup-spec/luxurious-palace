"use client";

import WhatsappIcon from "@/components/ui/WhatsappIcon";

export default function WhatsappFloatingButton({ whatsappLink }: { whatsappLink: string }) {
  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Commander sur WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-green-900/20 transition-transform hover:scale-110 active:scale-95 sm:bottom-7 sm:right-7"
    >
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-40" />
      <WhatsappIcon className="relative h-7 w-7" />
    </a>
  );
}
