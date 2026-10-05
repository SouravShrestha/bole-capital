import { WhatsappLogoIcon } from "@/icons/WhatsappLogoIcon";

const WHATSAPP_URL = "https://wa.me/917827301069";

export function WhatsappFab() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-4 right-4 z-50 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl hover:cursor-pointer sm:bottom-8 sm:right-8"
    >
      <WhatsappLogoIcon className="h-12 w-12" />
    </a>
  );
}
