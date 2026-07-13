import { Button } from "@/components/ui/Button";
import { CTA } from "@/lib/config/site";

/**
 * Persistent thumb-zone conversion anchor (mobile only). The single most
 * important navigation element: the primary conversion is always one tap away
 * (UX Architecture §2.1). Hidden on desktop, where the header cluster serves.
 */
export function MobileActionBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-[100] sm:hidden">
      <div className="se-glass flex items-center gap-2 border-t border-[var(--se-line)] px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3">
        <Button href={CTA.roast.href} variant="primary" size="md" className="flex-1">
          {CTA.roast.label}
        </Button>
        <Button href={CTA.whatsapp.href} external variant="whatsapp" size="md" aria-label="WhatsApp us">
          WhatsApp
        </Button>
      </div>
    </div>
  );
}
