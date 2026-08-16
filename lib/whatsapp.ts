// -----------------------------------------------------------------------------
// WhatsApp deep links — shared by the nav, the hero and the gallery.
//
// Plain wa.me links: no WhatsApp Business API, no backend, no API keys.
// Opens the native app on mobile and WhatsApp Web on desktop.
//
// The number must be digits only — international dialling code, no '+',
// no spaces, no leading zero.   +61 415 664 319  ->  61415664319
// -----------------------------------------------------------------------------

export const WHATSAPP_NUMBER = "61415664319";
export const WHATSAPP_DISPLAY = "+61 415 664 319";

export function waLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/** Generic "start a conversation" link used by the nav. */
export const generalChatLink = waLink(
  "Hi Paint & Chill! I'd like to know more about your painting sessions in Melbourne."
);
