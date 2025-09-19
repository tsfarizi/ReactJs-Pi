import { debug, info, warn, error, mask } from "./logger";

export const loadMidtransScript = (clientKey: string): Promise<void> => {
  info("midtrans:script", "Loading Snap script", { clientKey: mask(clientKey) });
  return new Promise((resolve, reject) => {
    const existing = document.getElementById("snap-script");
    if (existing) {
      debug("midtrans:script", "Snap script already present");
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute("data-client-key", clientKey);
    script.id = "snap-script";
    script.async = true;

    script.onload = () => {
      // @ts-ignore
      const available = !!(window.snap && typeof window.snap.pay === "function");
      info("midtrans:script", "Snap script loaded", { available });
      resolve();
    };
    script.onerror = () => {
      error("midtrans:script", "Failed to load Snap script");
      reject(new Error("Gagal memuat Midtrans Snap"));
    };

    document.body.appendChild(script);
  });
};
