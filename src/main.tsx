import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { loadMidtransScript } from "./utils/loadMidtrans.ts";
import { BrowserRouter } from "react-router-dom";

loadMidtransScript(import.meta.env.VITE_MIDTRANS_CLIENT_KEY);

createRoot(document.getElementById("root")!).render(
  <BrowserRouter basename={import.meta.env.BASE_URL}>
    <App />
  </BrowserRouter>
);