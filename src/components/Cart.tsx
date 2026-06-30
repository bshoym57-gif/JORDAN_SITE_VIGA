import { X, Trash2, ShoppingBag, Package, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export function Cart({ isOpen, onClose, onCheckout }: CartProps) {
  const { items, removeFromCart, total, clearCart } = useCart();

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-y-0 left-0 w-full max-w-sm bg-white z-50 shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-gray-900" />
            <h2 className="text-xl font-black text-gray-900">سلة التسوق</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-4">
              <ShoppingBag className="w-16 h-16 opacity-30" />
              <p className="font-medium text-lg">السلة فارغة</p>
              <p className="text-sm text-center">أضف منتجات للمتابعة</p>
              <button
                onClick={onClose}
                className="flex items-center gap-2 text-sm font-bold text-yellow-600 hover:text-yellow-700 mt-2"
              >
                <ArrowLeft className="w-4 h-4" />
                تصفح المنتجات
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.variant.id} className="bg-gray-50 rounded-2xl p-4">
                  <div className="flex gap-3">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-amber-50 flex-shrink-0 flex items-center justify-center">
                      {item.product.image_url ? (
                        <img
                          src={item.product.image_url}
                          alt={item.product.name_ar}
                          className="w-full h-full object-contain p-1"
                        />
                      ) : (
                        <Package className="w-8 h-8 text-amber-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 text-sm truncate">{item.product.name_ar}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{item.variant.label_ar}</p>
                      <p className="text-xs text-green-600 mt-0.5">شامل التوصيل</p>
                      <p className="font-black text-gray-900 text-lg mt-1">
                        {item.variant.price_jod.toFixed(0)} د.أ
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.variant.id)}
                      className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-colors self-start"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-gray-100 p-4 space-y-3">
            <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
              <span className="font-bold text-gray-600">المجموع الكلي:</span>
              <span className="font-black text-2xl text-gray-900">{total.toFixed(0)} د.أ</span>
            </div>
            <button
              onClick={onCheckout}
              className="w-full bg-black text-white py-4 rounded-xl font-black hover:bg-yellow-500 hover:text-black transition-all active:scale-95 text-lg"
            >
              إتمام الطلب
            </button>
            <button
              onClick={clearCart}
              className="w-full text-red-500 text-sm py-2 font-medium hover:bg-red-50 rounded-xl transition-colors"
            >
              إفراغ السلة
            </button>
          </div>
        )}
      </div>
    </>
  );
}
