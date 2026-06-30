import { X, Star, Truck, ShieldCheck, Package, CheckCircle, ShoppingCart } from 'lucide-react';
import { Product, ProductVariant } from '../lib/supabase';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

interface ProductDetailProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onOrderNow: (variant: ProductVariant) => void;
}

export function ProductDetail({ product, isOpen, onClose, onOrderNow }: ProductDetailProps) {
  const { addToCart, items } = useCart();
  const [addedVariant, setAddedVariant] = useState<string | null>(null);
  const variants = product.product_variants ?? [];

  if (!isOpen) return null;

  const handleAddToCart = (variant: ProductVariant) => {
    addToCart(product, variant);
    setAddedVariant(variant.id);
    setTimeout(() => setAddedVariant(null), 2000);
  };

  const isInCart = (variantId: string) =>
    items.some((item) => item.variant.id === variantId);

  const savingsPercent = (variant: ProductVariant) => {
    if (!variant.original_price_jod) return 0;
    return Math.round(
      ((variant.original_price_jod - variant.price_jod) / variant.original_price_jod) * 100
    );
  };

  const variantColors = [
    { border: 'border-zinc-300', badge: 'bg-zinc-700 text-white', button: 'bg-zinc-800 hover:bg-zinc-700' },
    { border: 'border-yellow-400', badge: 'bg-yellow-500 text-black', button: 'bg-yellow-500 hover:bg-yellow-400 text-black' },
    { border: 'border-amber-600', badge: 'bg-amber-700 text-white', button: 'bg-amber-700 hover:bg-amber-600' },
  ];

  return (
    <>
      <div className="fixed inset-0 bg-black/70 z-50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        <div className="bg-white w-full max-w-2xl rounded-t-3xl sm:rounded-2xl max-h-[95vh] overflow-y-auto animate-slide-up">
          {/* Close bar */}
          <div className="flex items-center justify-between p-4 sticky top-0 bg-white border-b border-gray-100 z-10">
            <h2 className="text-lg font-black text-gray-900 truncate ml-2">{product.name_ar}</h2>
            <button
              onClick={onClose}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors flex-shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Product Image */}
          <div className="bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-50 px-8 py-8">
            <img
              src={product.image_url ?? ''}
              alt={product.name_ar}
              className="w-64 h-64 object-contain mx-auto drop-shadow-2xl"
            />
          </div>

          {/* Description */}
          <div className="px-5 py-4 border-b border-gray-100">
            <p className="text-gray-600 text-sm leading-relaxed">{product.description_ar}</p>
            <div className="flex flex-wrap gap-3 mt-3">
              <span className="flex items-center gap-1.5 text-xs text-green-700 bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
                <ShieldCheck className="w-3.5 h-3.5" />
                منتج أصلي مضمون
              </span>
              <span className="flex items-center gap-1.5 text-xs text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-200">
                <Truck className="w-3.5 h-3.5" />
                شامل التوصيل
              </span>
              <span className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
                <Star className="w-3.5 h-3.5" />
                دفع عند الاستلام
              </span>
            </div>
          </div>

          {/* Package Options */}
          <div className="px-5 py-5">
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-5 h-5 text-amber-600" />
              <h3 className="text-lg font-black text-gray-900">اختر العرض المناسب</h3>
            </div>

            <div className="space-y-3">
              {variants.map((variant, index) => {
                const colors = variantColors[index % variantColors.length];
                const saving = savingsPercent(variant);
                const inCart = isInCart(variant.id);
                const justAdded = addedVariant === variant.id;

                return (
                  <div
                    key={variant.id}
                    className={`border-2 rounded-2xl p-4 relative transition-all duration-200 ${colors.border} ${
                      variant.is_popular ? 'shadow-lg' : ''
                    }`}
                  >
                    {variant.is_popular && (
                      <div className="absolute -top-3 right-4">
                        <span className="bg-yellow-500 text-black text-xs font-black px-3 py-1 rounded-full">
                          الأكثر توفيراً
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${colors.badge}`}>
                            {variant.label_ar}
                          </span>
                          <span className="text-xs text-gray-500">
                            {variant.quantity} {variant.quantity === 1 ? 'علبة' : 'علب'}
                          </span>
                          {saving > 0 && (
                            <span className="text-xs font-bold text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                              وفر {saving}%
                            </span>
                          )}
                        </div>

                        <div className="flex items-baseline gap-2 mt-2">
                          <span className="text-2xl font-black text-gray-900">
                            {variant.price_jod.toFixed(0)} د.أ
                          </span>
                          {variant.original_price_jod && (
                            <span className="text-sm text-gray-400 line-through">
                              {variant.original_price_jod.toFixed(0)} د.أ
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-gray-500 mt-0.5">شامل التوصيل لجميع المحافظات</p>
                      </div>

                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => onOrderNow(variant)}
                          className={`whitespace-nowrap px-4 py-2 rounded-xl font-bold text-sm transition-all active:scale-95 ${colors.button} ${
                            index === 1 ? 'text-black' : 'text-white'
                          }`}
                        >
                          اطلب الآن
                        </button>
                        <button
                          onClick={() => handleAddToCart(variant)}
                          disabled={inCart}
                          className="whitespace-nowrap px-3 py-2 rounded-xl text-xs font-medium border border-gray-200 hover:bg-gray-50 transition-all active:scale-95 flex items-center gap-1.5 justify-center disabled:opacity-60"
                        >
                          {justAdded ? (
                            <>
                              <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                              <span className="text-green-600">أُضيف!</span>
                            </>
                          ) : inCart ? (
                            <>
                              <ShoppingCart className="w-3.5 h-3.5 text-gray-500" />
                              <span>في السلة</span>
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="w-3.5 h-3.5" />
                              <span>السلة</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="px-5 pb-8">
            <div className="bg-gray-50 rounded-2xl p-4 text-center">
              <p className="text-gray-500 text-sm">
                للاستفسار والطلب تواصل معنا عبر الواتساب
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
