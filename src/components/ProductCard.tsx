import { ArrowLeft, BadgeCheck } from 'lucide-react';
import { Product } from '../lib/supabase';

interface ProductCardProps {
  product: Product;
  onView: (product: Product) => void;
}

export function ProductCard({ product, onView }: ProductCardProps) {
  const images = (product.product_images ?? []).sort((a, b) => a.sort_order - b.sort_order);
  const coverImage = images[0]?.image_url ?? product.image_url ?? '';
  const isHoney = coverImage.includes('ETUMAX') || coverImage.includes('etumax') || coverImage.includes('royal-honey');

  return (
    <button
      onClick={() => onView(product)}
      className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:-translate-y-1 text-right w-full"
    >
      {/* Image */}
      <div className={`relative overflow-hidden ${isHoney ? 'bg-gradient-to-br from-amber-50 to-yellow-100' : 'bg-gradient-to-br from-slate-900 to-indigo-950'}`}>
        <div className="h-64 sm:h-72 flex items-center justify-center p-4 overflow-hidden">
          <img
            src={coverImage}
            alt={product.name_ar}
            className={`transition-transform duration-500 group-hover:scale-105 ${
              isHoney
                ? 'h-full w-full object-contain drop-shadow-xl'
                : 'h-full w-full object-cover object-top'
            }`}
          />
        </div>

        <div className="absolute top-3 right-3">
          <span className="bg-black/60 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm flex items-center gap-1">
            <BadgeCheck className="w-3.5 h-3.5 text-yellow-400" />
            أصلي 100%
          </span>
        </div>

        {/* Image count badge */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-3 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm">
            {images.length} صور
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-5">
        <h3 className="font-black text-gray-900 text-xl mb-2 group-hover:text-yellow-600 transition-colors leading-snug">
          {product.name_ar}
        </h3>
        <p className="text-gray-500 text-sm mb-5 leading-relaxed line-clamp-2">
          {product.description_ar}
        </p>

        <div className="flex items-center justify-between">
          <div className="text-sm text-green-600 font-bold">
            يبدأ من {Math.min(...(product.product_variants ?? []).map(v => v.price_jod), product.price_jod).toFixed(0)} د.أ
          </div>
          <div className="flex items-center gap-1.5 bg-black text-white px-4 py-2.5 rounded-xl font-bold text-sm group-hover:bg-yellow-500 group-hover:text-black transition-all">
            اطلب الآن
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </button>
  );
}
