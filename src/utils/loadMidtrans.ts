export const loadMidtransScript = (clientKey: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (document.getElementById("snap-script")) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute("data-client-key", clientKey);
    script.id = "snap-script";
    script.async = true;

    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Gagal memuat Midtrans Snap"));

    document.body.appendChild(script);
  });
};
