import React, { useState, useEffect, useRef } from "react";
import supabase from "../utils/supabase";

interface Message {
  text: string;
  sender: "bot" | "user";
  options?: string[];
}

interface Gallery {
  id: number;
  image_path: string;
}

interface PackageWithGallery {
  id: number;
  name: string;
  image_path: string;
  description: string;
  price: number;
  package_gallery: {
    gallery: Gallery;
  }[];
}

const BotChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [availablePackages, setAvailablePackages] = useState<
    PackageWithGallery[]
  >([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const lastHandledIndexRef = useRef<number>(-1);
  const [lastSelectedPackage, setLastSelectedPackage] =
    useState<PackageWithGallery | null>(null);

  const addMessage = (
    text: string,
    sender: "bot" | "user",
    options?: string[]
  ) => {
    setMessages((prev) => [...prev, { text, sender, options }]);
  };

  const fetchPackagesWithGallery = async (
    category: string
  ): Promise<PackageWithGallery[]> => {
    const { data, error } = await supabase
      .from("package")
      .select(
        `id, name, image_path, description, price, package_gallery (gallery (id, image_path))`
      )
      .eq("category", category);

    if (error) {
      console.error("Error fetching packages:", error);
      return [];
    }

    return data as unknown as PackageWithGallery[];
  };

  const handleCategoryResponse = async (response: string) => {
    const packages = await fetchPackagesWithGallery(response.toLowerCase());
    setAvailablePackages(packages);

    const intro =
      response.toLowerCase() === "wedding"
        ? "Wah, selamat ya! 🎊<br />Berikut daftar <strong>Wedding Decoration Packages</strong> kami:"
        : "Wah, selamat ya! 🎊<br />Berikut daftar <strong>Engagement Decoration Packages</strong> kami:";

    addMessage(intro, "bot");

    const options = packages.map(
      (pkg, i) => `${String.fromCharCode(65 + i)}. ${pkg.name}`
    );
    addMessage(
      "Silakan pilih paket yang ingin kamu lihat lebih lanjut 😊",
      "bot",
      options
    );
  };

  const handleUserPackageChoice = (text: string) => {
    const match = text.match(/^([A-Z])\.*/i);
    if (!match) return;
    const index = match[1].toUpperCase().charCodeAt(0) - 65;
    const selected = availablePackages[index];
    if (selected) handlePackageSelection(selected);
  };

  const handlePackageSelection = (pkg: PackageWithGallery) => {
    setLastSelectedPackage(pkg);

    addMessage(`<strong>Kamu memilih ${pkg.name}!</strong>`, "bot");
    addMessage(
      `<strong>Harga mulai dari:</strong> Rp ${pkg.price.toLocaleString()}<br /><strong>Detail:</strong> ${
        pkg.description
      }`,
      "bot"
    );

    if (pkg.package_gallery.length > 0) {
      const galleryHtml = `
                <div class="relative">
                <div class="overflow-x-auto no-scrollbar flex gap-4 scroll-smooth snap-x" id="carousel">
                    ${pkg.package_gallery
                      .map(
                        (galleryItem, galleryIndex) => `
                    <div
                        class="flex-shrink-0 w-[200px] h-[120px] relative rounded-lg overflow-hidden shadow-md cursor-pointer snap-start"
                        onclick="window.dispatchEvent(new CustomEvent('imageClicked', { detail: ${JSON.stringify(
                          galleryItem
                        ).replace(/"/g, "&quot;")} }))"
                    >
                        <img
                        src="${galleryItem.gallery.image_path}"
                        alt="Gallery ${galleryIndex + 1}"
                        class="absolute top-0 left-0 w-full h-full object-cover"
                        />
                    </div>`
                      )
                      .join("")}
                </div>

                <button onclick="document.getElementById('carousel').scrollBy({ left: -220, behavior: 'smooth' })"
                    class="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full w-8 h-8 flex items-center justify-center z-10">
                    ◀
                </button>

                <button onclick="document.getElementById('carousel').scrollBy({ left: 220, behavior: 'smooth' })"
                    class="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full w-8 h-8 flex items-center justify-center z-10">
                    ▶
                </button>
                </div>
            `;

      addMessage(galleryHtml, "bot");
    }

    addMessage(
      `
            Kami sudah dipercaya ratusan pasangan di Jabodetabek dan Jogja untuk menghias hari bahagianya… Kini giliran kamu! 🎉<br />
            Masih bingung pilih paket atau ingin diskusi konsep?<br />
            Yuk ngobrol santai dulu — klik tombol di bawah ini:
            `,
      "bot"
    );

    addMessage(
      `
            <button
                class="w-full py-2 text-sm bg-green-600 text-white rounded-full hover:bg-green-700"
                onclick="window.open('https://wa.me/6281617775709?text=Halo%20Chiz%20Decor%20👋%0ASaya%20lihat-lihat%20paket%20dekorasinya%20dan%20tertarik%2C%20tapi%20masih%20mau%20cari%20tahu%20dulu%20lebih%20lanjut.', '_blank')"
            >
                Ngobrol via WhatsApp
            </button>
    `,
      "bot"
    );

    setAvailablePackages([]);
    addMessage("Ingin memilih paket lain?", "bot", ["Ya", "Tidak"]);
  };

  const handleYesNoResponse = (response: string) => {
    const lower = response.toLowerCase();

    if (lower === "ya") {
      addMessage("Wedding / Engagement?", "bot", ["Wedding", "Engagement"]);
    } else if (lower === "tidak") {
      addMessage(
        "Baik, kalau ada pertanyaan lain silakan hubungi kami via WhatsApp ya 😊",
        "bot"
      );

      if (lastSelectedPackage) {
        addMessage(
          `
                <button
                    class="w-full py-2 text-sm bg-green-500 text-white rounded-full hover:bg-green-600"
                    onclick="window.open('https://wa.me/6281617775709?text=Halo%20Chiz%20Decor%20👋%0ASaya%20lihat-lihat%20paket%20${encodeURIComponent(
                      lastSelectedPackage.name
                    )}%20dan%20tertarik%2C%20tapi%20masih%20mau%20cari%20tahu%20lebih%20lanjut.', '_blank')"
                >
                    Tanyakan lebih lanjut di WhatsApp
                </button>
            `,
          "bot"
        );
      }
    }
  };

  const startChat = () => {
    addMessage(
      `Hai! Selamat datang di <strong>Chiz Decor ✨</strong><br />Kami siap bantu kamu mewujudkan dekorasi impianmu 💐<br /><strong>Boleh tahu, acara kamu untuk Engagement atau Wedding?</strong>`,
      "bot",
      ["Wedding", "Engagement"]
    );
  };

  useEffect(() => {
    startChat();
  }, []);

  useEffect(() => {
    const lastIndex = messages.length - 1;
    if (lastIndex === lastHandledIndexRef.current) return;
    const lastMsg = messages[lastIndex];
    if (!lastMsg || lastMsg.sender !== "user") return;

    const text = lastMsg.text.trim().toLowerCase();

    if (["wedding", "engagement"].includes(text)) {
      handleCategoryResponse(lastMsg.text);
    } else if (/^[a-zA-Z]\./.test(lastMsg.text)) {
      handleUserPackageChoice(lastMsg.text);
    } else if (["ya", "tidak"].includes(text)) {
      handleYesNoResponse(lastMsg.text);
    }

    lastHandledIndexRef.current = lastIndex;
  }, [messages]);

  const toggleChat = () => setIsChatOpen(!isChatOpen);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        className="bg-gradient-to-r mb-5 from-[var(--color-primary)] via-[var(--color-secondary)] to-[#A15C59] text-white p-4 rounded-full shadow-lg transform transition-all hover:scale-105 hover:shadow-xl focus:outline-none"
        onClick={toggleChat}
      >
        <span className="text-xl font-semibold">
          {isChatOpen ? "Tutup Chat" : "Buka Chat"}
        </span>
      </button>

      {isChatOpen && (
        <div className="bg-white p-4 shadow-lg rounded-lg w-96 max-w-full">
          <div className="chat-box max-h-[50vh] overflow-y-auto mb-4 space-y-4 no-scrollbar">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message p-2 rounded-lg ${
                  msg.sender === "bot"
                    ? "bg-secondary text-primary"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                <div dangerouslySetInnerHTML={{ __html: msg.text }} />
                {msg.sender === "bot" && msg.options && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {msg.options.map((option, i) => (
                      <button
                        key={i}
                        className="py-1 px-4 bg-primary text-secondary rounded-full hover:bg-primary-600"
                        onClick={() => {
                          addMessage(option, "user");
                        }}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BotChat;
