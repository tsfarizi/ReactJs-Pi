import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import supabase from "../utils/supabase";
import { Link } from "react-router-dom";

export default function TipsPage() {
    const [article, setArticle] = useState<{
        id: number, title: string, created_at: string
    }[]>([]);

    useEffect(() => {
        const fetchArticle = async () => {
            const { data, error } = await supabase
                .from('article')
                .select('id, title, created_at')
                .order('id', { ascending: true });

            if (error) {
                console.error('Error fetching gallery:', error.message);
            } else {
                console.log(data);

                setArticle(data);
            }
        };

        fetchArticle();
    }, [])

    return (
        <div>
            <Navbar />
            <div className="px-6 py-12 max-w-5xl mx-auto mt-20">
                <h1 className="text-4xl font-bold text-center text-secondary mb-10">
                    Tips & Inspirasi dari Chiz Décor
                </h1>

                <div className="grid gap-8 md:grid-cols-2">
                    {article.map((tip, index) => (
                        <Link to={`/tips/${tip.id}`}>
                            <div
                                key={index}
                                className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition duration-300"
                            >
                                <h2 className="text-2xl font-semibold text-secondary mb-2">
                                    {tip.title}
                                </h2>
                                <p className="text-secondary">{new Date(tip.created_at).toLocaleString()}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

