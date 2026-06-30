import { useState } from 'react';
import { X, User, Phone, MapPin, CheckCircle, Loader2, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { supabase, ProductVariant, Product } from '../lib/supabase';

interface CheckoutFormProps {
  isOpen: boolean;
  onClose: () => void;
  directOrder?: { product: Product; variant: ProductVariant } | null;
}

const governorates = [
  'عمان', 'الزرقاء', 'إربد', 'البلقاء', 'الكرك',
  'المفرق', 'معان', 'الطفيلة', 'مادبا', 'جرش', 'عجلون', 'العقبة',
];

export function CheckoutForm({ isOpen, onClose, directOrder }: CheckoutFormProps) {
  const { items, total, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    governorate: '',
    city: '',
    address: '',
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const orderItems = directOrder
    ? [{ product: directOrder.product, variant: directOrder.variant }]
    : items;

  const orderTotal = directOrder ? directOrder.variant.price_jod : total;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.customer_name.trim()) e.customer_name = 'الاسم مطلوب';
    if (!formData.customer_phone.trim()) e.customer_phone = 'رقم الهاتف مطلوب';
    else if (!/^[0-9+\-\s]{9,15}$/.test(formData.customer_phone)) e.customer_phone = 'رقم غير صحيح';
    if (!formData.governorate) e.governorate = 'اختر المحافظة';
    if (!formData.city.trim()) e.city = 'المدينة مطلوبة';
    if (!formData.address.trim()) e.address = 'العنوان مطلوب';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: formData.customer_name,
          customer_phone: formData.customer_phone,
          customer_email: null,
          governorate: formData.governorate,
          city: formData.city,
          address: formData.address,
          notes: formData.notes || null,
          total_jod: orderTotal,
          status: 'pending',
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const rows = orderItems.map((item) => ({
        order_id: order.id,
        product_id: item.product.id,
        product_name: `${item.product.name_ar} - ${item.variant.label_ar}`,
        quantity: item.variant.quantity,
        unit_price_jod: item.variant.price_jod,
        variant_label: item.variant.label_ar,
        variant_quantity: item.variant.quantity,
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(rows);
      if (itemsError) throw itemsError;

      setOrderId(order.id);
      setSuccess(true);
      if (!directOrder) clearCart();
    } catch (err) {
      console.error(err);
      alert('حدث خطأ. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
  };

  const handleClose = () => {
    if (success) {
      setSuccess(false);
      setOrderId(null);
      setFormData({ customer_name: '', customer_phone: '', governorate: '', city: '', address: '', notes: '' });
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm" onClick={handleClose} />
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-2xl max-h-[95vh] flex flex-col animate-slide-up">
          <div className="flex items-center justify-between p-4 border-b border-gray-100 sticky top-0 bg-white z-10 rounded-t-3xl sm:rounded-t-2xl">
            <h2 className="text-xl font-black text-gray-900">
              {success ? 'تم إرسال الطلب!' : 'بيانات التوصيل'}
            </h2>
            <button onClick={handleClose} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {success ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-4">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-black text-gray-900">شكراً لك!</h3>
              <p className="text-gray-500 leading-relaxed">
                تم استلام طلبك بنجاح. سنتواصل معك خلال فترة قصيرة لتأكيد الطلب.
              </p>
              <div className="bg-gray-50 px-6 py-4 rounded-2xl border border-gray-200 w-full">
                <p className="text-sm text-gray-500 mb-1">رقم الطلب</p>
                <p className="text-lg font-black text-gray-900 font-mono tracking-widest">
                  #{orderId?.slice(0, 8).toUpperCase()}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-yellow-500 hover:text-black transition-all mt-2"
              >
                العودة للمتجر
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto flex flex-col">
              <div className="p-5 flex-1 space-y-5">
                {/* Order summary */}
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Package className="w-4 h-4 text-amber-700" />
                    <p className="font-black text-amber-900 text-sm">ملخص الطلب</p>
                  </div>
                  <div className="space-y-2">
                    {orderItems.map((item) => (
                      <div key={item.variant.id} className="flex justify-between items-center text-sm">
                        <span className="text-amber-800">
                          {item.product.name_ar} - {item.variant.label_ar}
                        </span>
                        <span className="font-black text-amber-900">
                          {item.variant.price_jod.toFixed(0)} د.أ
                        </span>
                      </div>
                    ))}
                    <div className="border-t border-amber-200 pt-2 flex justify-between font-black text-base">
                      <span className="text-amber-900">المجموع شامل التوصيل:</span>
                      <span className="text-amber-900">{orderTotal.toFixed(0)} د.أ</span>
                    </div>
                  </div>
                </div>

                {/* Personal info */}
                <div className="space-y-4">
                  <h3 className="font-black text-gray-900 flex items-center gap-2">
                    <User className="w-5 h-5 text-yellow-500" />
                    بيانات العميل
                  </h3>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">الاسم الكامل *</label>
                    <input
                      type="text"
                      name="customer_name"
                      value={formData.customer_name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all ${errors.customer_name ? 'border-red-400' : 'border-gray-200 focus:border-yellow-400'}`}
                      placeholder="أدخل اسمك الكامل"
                    />
                    {errors.customer_name && <p className="text-red-500 text-xs mt-1">{errors.customer_name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">رقم الهاتف *</label>
                    <div className="relative">
                      <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        name="customer_phone"
                        value={formData.customer_phone}
                        onChange={handleChange}
                        className={`w-full pr-11 pl-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all ${errors.customer_phone ? 'border-red-400' : 'border-gray-200 focus:border-yellow-400'}`}
                        placeholder="07X XXXX XXX"
                        dir="ltr"
                      />
                    </div>
                    {errors.customer_phone && <p className="text-red-500 text-xs mt-1">{errors.customer_phone}</p>}
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-4">
                  <h3 className="font-black text-gray-900 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-yellow-500" />
                    عنوان التوصيل
                  </h3>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">المحافظة *</label>
                    <select
                      name="governorate"
                      value={formData.governorate}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all bg-white ${errors.governorate ? 'border-red-400' : 'border-gray-200 focus:border-yellow-400'}`}
                    >
                      <option value="">اختر المحافظة</option>
                      {governorates.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                    {errors.governorate && <p className="text-red-500 text-xs mt-1">{errors.governorate}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">المدينة / المنطقة *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all ${errors.city ? 'border-red-400' : 'border-gray-200 focus:border-yellow-400'}`}
                      placeholder="اسم المدينة أو المنطقة"
                    />
                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">العنوان التفصيلي *</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows={2}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all resize-none ${errors.address ? 'border-red-400' : 'border-gray-200 focus:border-yellow-400'}`}
                      placeholder="الشارع، رقم المبنى، قرب..."
                    />
                    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">ملاحظات إضافية</label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows={2}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all resize-none"
                      placeholder="أي تعليمات خاصة بالتوصيل..."
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-gray-100 sticky bottom-0 bg-white">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white py-4 rounded-xl font-black hover:bg-yellow-500 hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg active:scale-95"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      جاري الإرسال...
                    </>
                  ) : (
                    `تأكيد الطلب - ${orderTotal.toFixed(0)} د.أ`
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
