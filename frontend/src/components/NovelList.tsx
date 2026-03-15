import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config/api';

interface Novel {
  _id: string;
  title: string;
  description: string;
  coverImageUrl: string;
  qrImageUrl: string;
  category: string;
  price: number;
}

interface NovelListProps {
  onBuyNovel: (novel: Novel) => void;
  selectedCategory?: string;
}

const NovelList: React.FC<NovelListProps> = ({ onBuyNovel, selectedCategory = 'All' }) => {
  const navigate = useNavigate();
  const [novels, setNovels] = useState<Novel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNovels();
  }, []);

  // Filter novels based on selected category
  const filteredNovels = selectedCategory === 'All' 
    ? novels 
    : novels.filter(novel => novel.category === selectedCategory);

  const fetchNovels = async () => {
    try {
      const response = await axios.get(`${API_URL}/novels`);
      setNovels(response.data.data);
    } catch (error) {
      console.error('Error fetching novels:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNovelClick = (novel: Novel) => {
    navigate(`/novel/${novel._id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-white text-xl">Loading novels...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          📚 NovelTap Premium Novels
        </h1>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredNovels.map((novel) => (
            <div
              key={novel._id}
              className="flex flex-col h-full bg-[#1e293b] border border-slate-800 rounded-lg overflow-hidden shadow-lg hover:shadow-emerald-500/20 hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105 cursor-pointer"
            >
              {/* Fixed aspect ratio image container */}
              <div 
                className="relative aspect-[2/3] bg-gray-700 flex items-center justify-center overflow-hidden"
                onClick={() => handleNovelClick(novel)}
              >
                <img
                  src={novel.coverImageUrl}
                  alt={novel.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200x300/1e40af/ffffff?text=Novel+Cover';
                  }}
                />
              </div>
              
              {/* Content section with flex to push button to bottom */}
              <div className="flex flex-col flex-1 p-4">
                {/* Title */}
                <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">
                  {novel.title}
                </h3>
                
                {/* Category badge */}
                <div className="mb-3">
                  <span className="inline-block bg-emerald-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                    {novel.category}
                  </span>
                </div>
                
                {/* Description with 3-line clamp and pre-line formatting */}
                <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-1 whitespace-pre-line">
                  {novel.description}
                </p>
                
                {/* Price and button section */}
                <div className="flex items-center justify-between">
                  <span className="text-emerald-400 font-bold text-lg">
                    ₹{novel.price}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onBuyNovel(novel);
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded transition-colors duration-200 text-sm"
                  >
                    Buy Access
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NovelList;
