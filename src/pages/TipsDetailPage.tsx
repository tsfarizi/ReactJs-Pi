import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { useParams } from 'react-router-dom'
import supabase from '../utils/supabase';

export default function TipsDetailPage() {
    const { id } = useParams();
    const [article, setArticle] = useState<{ id: any; title: any; description: any; created_at: any; } | null>();

    useEffect(() => {
        const fetchArticleDetail = async () => {
            const { data, error } = await supabase
                .from('article')
                .select('id, title, description, created_at')
                .eq("id", id).maybeSingle();

            if (error) {
                console.error('Error fetching gallery:', error.message);
            } else {
                console.log(data);

                setArticle(data);
            }
        };

        fetchArticleDetail();
    }, [])

    return (
        <div>
            <Navbar />

            <div className='flex flex-col gap-10 justify-center items-center mt-28'>
                <div className='text-3xl font-bold'>{article?.title}</div>
                <div
                    className="text-justify mx-5 sm:mx-20 md:mx-72"
                    dangerouslySetInnerHTML={{
                        __html: article?.description.replace(/\n/g, '<br />'),
                    }}
                ></div>
            </div>

        </div>
    )
}
