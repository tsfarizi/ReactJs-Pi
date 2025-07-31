import { useState } from "react";

export default function ContactForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const whatsappNumber = "6281617775709";
        const text = `Hello, Nama saya ${name}.\nEmail: ${email}\n\n${message}`;
        const encodedText = encodeURIComponent(text);
        const url = `https://wa.me/${whatsappNumber}?text=${encodedText}`;
        window.open(url, "_blank");
    };

    return (
        <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D1A154]"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D1A154]"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D1A154]"
                    required
                />
            </div>
            <button
                type="submit"
                className="bg-[#9B7745] text-white px-6 py-2 rounded-full hover:bg-[#8c6435] transition"
            >
                Send via WhatsApp
            </button>
        </form>
    );
}
