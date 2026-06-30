import { useState } from 'react';
import {
  ArrowRight, CheckCircle, Loader2, Phone, MapPin,
  User, Truck, ShieldCheck, Star, Clock, Package
} from 'lucide-react';
import { Product, ProductVariant, supabase } from '../lib/supabase';
import { ImageSlider } from '../components/ImageSlider';

interface ProductPageProps {
  product: Product;
  onBack: () => void;
}

const governorates = [
  'عمان', 'الزرقاء', 'إربد', 'البلقاء', 'الكرك',
  'المفرق', 'معان', 'الطفيلة', 'مادبا', 'جرش', 'عجلون', 'العقبة',
];

export function ProductPage({ product, onBack }: ProductPageProps) {
  const variants = (product.product_variants ?? []).sort((a, b) => a.sort_order - b.sort_order);
  const images = (product.product_images ?? [])
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((img) => img.image_url);

  if (images.length === 0 && product.image_url) images.push(product.image_url);

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    governorate: '',
    city: '',
    address: '',
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');

  const handleVariantSelect = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    setTimeout(() => {
      document.getElementById('order-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 120);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!selectedVariant) e.variant = 'اختر العرض أولاً';
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
    if (!validate() || !selectedVariant) return;
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
          total_jod: selectedVariant.price_jod,
          status: 'pending',
        })
        .select()
        .single();

      if (orderError) throw orderError;

      await supabase.from('order_items').insert({
        order_id: order.id,
        product_id: product.id,
        product_name: `${product.name_ar} - ${selectedVariant.label_ar}`,
        quantity: selectedVariant.quantity,
        unit_price_jod: selectedVariant.price_jod,
        variant_label: selectedVariant.label_ar,
        variant_quantity: selectedVariant.quantity,
      });

      setOrderId(order.id.slice(0, 8).toUpperCase());
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      alert('حدث خطأ. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const saving = (v: ProductVariant) =>
    v.original_price_jod
      ? Math.round(((v.original_price_jod - v.price_jod) / v.original_price_jod) * 100)
      : 0;

  // ── Success screen ──────────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Back nav */}
        <div className="bg-black text-white h-14 flex items-center px-4">
          <button onClick={onBack} className="flex items-center gap-1.5 text-gray-300 hover:text-white">
            <ArrowRight className="w-5 h-5" />
            <span className="text-sm font-medium">متجر شباب دائما</span>
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">تم استلام طلبك!</h2>
            <p className="text-gray-500 mb-6 leading-relaxed">
              شكراً لك. سيتواصل معك فريقنا خلال فترة قصيرة لتأكيد الطلب.
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4 text-right space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">المنتج:</span>
                <span className="font-bold text-gray-900">{product.name_ar}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">العرض:</span>
                <span className="font-bold text-gray-900">{selectedVariant?.label_ar}</span>
              </div>
              <div className="flex justify-between border-t border-amber-200 pt-2">
                <span className="font-black text-gray-900">المبلغ الكلي:</span>
                <span className="font-black text-green-700 text-base">{selectedVariant?.price_jod} د.أ شامل التوصيل</span>
              </div>
            </div>

            <div className="flex items-center gap-2 justify-center bg-green-50 border border-green-200 rounded-2xl px-4 py-3 mb-6">
              <Clock className="w-5 h-5 text-green-600 flex-shrink-0" />
              <span className="text-green-700 font-bold text-sm">التوصيل غداً إن شاء الله</span>
            </div>

            <div className="bg-gray-50 rounded-xl px-4 py-2 mb-6">
              <p className="text-xs text-gray-400">رقم الطلب</p>
              <p className="font-black text-gray-900 tracking-widest">#{orderId}</p>
            </div>

            <button
              onClick={onBack}
              className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-yellow-500 hover:text-black transition-all"
            >
              العودة للمتجر
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Product page ───────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Sticky top bar */}
      <div className="sticky top-0 z-40 bg-black text-white shadow-lg border-b border-yellow-500/20">
        <div className="flex items-center h-14 px-4 gap-3 max-w-5xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-gray-300 hover:text-white transition-colors"
          >
            <ArrowRight className="w-5 h-5" />
            <span className="text-sm font-medium hidden sm:inline">متجر شباب دائما</span>
          </button>
          <div className="h-5 w-px bg-white/20 mx-1" />
          <h1 className="text-sm font-bold text-white truncate flex-1">{product.name_ar}</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-16">
        {/* Product hero - image + info side by side on desktop */}
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-start lg:pt-6">
          {/* Image slider */}
          <div className="lg:sticky lg:top-20">
            <div className="bg-white rounded-none lg:rounded-2xl overflow-hidden shadow-none lg:shadow-lg border-0 lg:border lg:border-gray-100">
              <ImageSlider
                images={images}
                alt={product.name_ar}
                className="h-72 sm:h-96 lg:h-[420px]"
              />

              {/* Badges below image */}
              <div className="flex flex-wrap gap-2 p-4 border-t border-gray-100">
                <span className="flex items-center gap-1.5 text-xs text-green-700 bg-green-50 px-3 py-1.5 rounded-full border border-green-200 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" /> أصلي مضمون 100%
                </span>
                <span className="flex items-center gap-1.5 text-xs text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-200 font-medium">
                  <Truck className="w-3.5 h-3.5" /> شامل التوصيل
                </span>
                <span className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200 font-medium">
                  <Star className="w-3.5 h-3.5 fill-amber-500" /> دفع عند الاستلام
                </span>
              </div>
            </div>
          </div>

          {/* Product info + offers + form */}
          <div className="pt-6 lg:pt-0 space-y-6">
            {/* Product title & description */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-start gap-2 mb-2">
                <div>
                  <h1 className="text-2xl font-black text-gray-900 leading-tight">{product.name_ar}</h1>
                  <div className="flex items-center gap-1 mt-1.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                    <span className="text-gray-400 text-xs mr-1">منتج موثوق</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mt-3">{product.description_ar}</p>

              <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2 mt-4">
                <Clock className="w-4 h-4 text-green-600 flex-shrink-0" />
                <p className="text-green-700 text-sm font-bold">التوصيل غداً إن شاء الله من وقت الطلب</p>
              </div>
            </div>

            {/* Step 1: Choose offer */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-black text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0">1</div>
                <h2 className="text-lg font-black text-gray-900">اختر عرضك</h2>
              </div>

              {errors.variant && (
                <p className="text-red-500 text-sm mb-3 bg-red-50 border border-red-200 rounded-xl px-3 py-2">{errors.variant}</p>
              )}

              <div className="space-y-3">
                {variants.map((variant) => {
                  const pct = saving(variant);
                  const selected = selectedVariant?.id === variant.id;

                  return (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() => handleVariantSelect(variant)}
                      className={`w-full text-right rounded-2xl border-2 p-4 transition-all duration-200 relative ${
                        selected
                          ? 'border-black bg-black text-white shadow-xl scale-[1.01]'
                          : 'border-gray-200 bg-gray-50 hover:border-gray-400 hover:bg-white hover:shadow-md'
                      }`}
                    >
                      {variant.is_popular && (
                        <span className={`absolute -top-3 right-4 text-xs font-black px-3 py-1 rounded-full ${
                          selected ? 'bg-yellow-400 text-black' : 'bg-yellow-500 text-black'
                        }`}>
                          الأوفر
                        </span>
                      )}

                      <div className="flex items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className={`font-black text-lg ${selected ? 'text-white' : 'text-gray-900'}`}>
                              {variant.label_ar}
                            </span>
                            {pct > 0 && (
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                selected ? 'bg-green-400 text-black' : 'bg-green-100 text-green-700 border border-green-300'
                              }`}>
                                وفر {pct}%
                              </span>
                            )}
                          </div>
                          <p className={`text-xs ${selected ? 'text-white/70' : 'text-gray-500'}`}>
                            شامل التوصيل لجميع محافظات الأردن
                          </p>
                        </div>

                        <div className="text-left flex-shrink-0">
                          <div className={`text-2xl font-black ${selected ? 'text-yellow-400' : 'text-gray-900'}`}>
                            {variant.price_jod.toFixed(0)}<span className="text-base mr-0.5">د.أ</span>
                          </div>
                          {variant.original_price_jod && (
                            <div className={`text-sm line-through text-left ${selected ? 'text-white/50' : 'text-gray-400'}`}>
                              {variant.original_price_jod.toFixed(0)} د.أ
                            </div>
                          )}
                        </div>

                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          selected ? 'border-yellow-400 bg-yellow-400' : 'border-gray-300 bg-white'
                        }`}>
                          {selected && <div className="w-2.5 h-2.5 bg-black rounded-full" />}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Order form */}
            {selectedVariant && (
              <div id="order-section" className="animate-slide-up space-y-5">
                {/* Selected offer summary */}
                <div className="bg-gradient-to-l from-black to-zinc-800 text-white rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Package className="w-5 h-5 text-yellow-400" />
                    <p className="font-black text-lg">طلبك</p>
                  </div>
                  <p className="text-white/80 text-sm mb-4">{product.name_ar} — {selectedVariant.label_ar}</p>

                  <div className="border-t border-white/20 pt-3 flex items-center justify-between">
                    <div>
                      <p className="text-white/60 text-xs">المبلغ الكلي الذي ستدفعه</p>
                      <p className="text-xs text-green-400 mt-0.5 flex items-center gap-1">
                        <Truck className="w-3.5 h-3.5" /> شامل التوصيل
                      </p>
                    </div>
                    <div>
                      <p className="text-4xl font-black text-yellow-400">
                        {selectedVariant.price_jod.toFixed(0)}<span className="text-xl mr-1">د.أ</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-3 bg-green-500/20 border border-green-500/30 rounded-xl px-3 py-2">
                    <Clock className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <p className="text-green-300 text-sm font-bold">التوصيل غداً إن شاء الله من وقت الطلب</p>
                  </div>
                </div>

                {/* Form */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="bg-black text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0">2</div>
                    <h2 className="text-lg font-black text-gray-900">بيانات التوصيل</h2>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                        <User className="w-4 h-4 text-yellow-500" /> الاسم الكامل *
                      </label>
                      <input
                        type="text"
                        name="customer_name"
                        value={formData.customer_name}
                        onChange={handleChange}
                        className={`w-full px-4 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all ${errors.customer_name ? 'border-red-400' : 'border-gray-200 focus:border-yellow-400'}`}
                        placeholder="أدخل اسمك الكامل"
                      />
                      {errors.customer_name && <p className="text-red-500 text-xs mt-1">{errors.customer_name}</p>}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                        <Phone className="w-4 h-4 text-yellow-500" /> رقم الهاتف للتواصل *
                      </label>
                      <div className="relative">
                        <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="tel"
                          name="customer_phone"
                          value={formData.customer_phone}
                          onChange={handleChange}
                          className={`w-full pr-11 pl-4 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all ${errors.customer_phone ? 'border-red-400' : 'border-gray-200 focus:border-yellow-400'}`}
                          placeholder="07X XXXX XXX"
                          dir="ltr"
                        />
                      </div>
                      {errors.customer_phone && <p className="text-red-500 text-xs mt-1">{errors.customer_phone}</p>}
                    </div>

                    {/* Governorate */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-yellow-500" /> المحافظة *
                      </label>
                      <select
                        name="governorate"
                        value={formData.governorate}
                        onChange={handleChange}
                        className={`w-full px-4 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all bg-white ${errors.governorate ? 'border-red-400' : 'border-gray-200 focus:border-yellow-400'}`}
                      >
                        <option value="">اختر المحافظة</option>
                        {governorates.map((g) => <option key={g} value={g}>{g}</option>)}
                      </select>
                      {errors.governorate && <p className="text-red-500 text-xs mt-1">{errors.governorate}</p>}
                    </div>

                    {/* City */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">المدينة / المنطقة *</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className={`w-full px-4 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all ${errors.city ? 'border-red-400' : 'border-gray-200 focus:border-yellow-400'}`}
                        placeholder="اسم المدينة أو المنطقة"
                      />
                      {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                    </div>

                    {/* Address */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">العنوان التفصيلي *</label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows={2}
                        className={`w-full px-4 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all resize-none ${errors.address ? 'border-red-400' : 'border-gray-200 focus:border-yellow-400'}`}
                        placeholder="الشارع، رقم المبنى، أي علامة مميزة..."
                      />
                      {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">ملاحظات (اختياري)</label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows={2}
                        className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all resize-none"
                        placeholder="أي تعليمات خاصة بالتوصيل..."
                      />
                    </div>

                    {/* Final review */}
                    <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-4 text-sm space-y-2">
                      <p className="font-black text-gray-900 mb-3">مراجعة الطلب</p>
                      <div className="flex justify-between text-gray-600">
                        <span>المنتج:</span>
                        <span className="font-bold text-gray-900">{product.name_ar}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>العرض:</span>
                        <span className="font-bold text-gray-900">{selectedVariant.label_ar}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>التوصيل:</span>
                        <span className="font-bold text-green-600">مجاني - غداً إن شاء الله</span>
                      </div>
                      <div className="border-t border-gray-200 pt-2 flex justify-between items-center">
                        <span className="font-black text-gray-900">المبلغ عند الاستلام:</span>
                        <span className="font-black text-xl text-black">{selectedVariant.price_jod.toFixed(0)} د.أ</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-black text-white py-5 rounded-2xl font-black hover:bg-yellow-500 hover:text-black transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 text-lg shadow-xl"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          جاري الإرسال...
                        </>
                      ) : (
                        `تأكيد الطلب - ${selectedVariant.price_jod.toFixed(0)} د.أ`
                      )}
                    </button>

                    <p className="text-center text-gray-400 text-xs">
                      الدفع عند الاستلام • التوصيل غداً إن شاء الله • تغليف سري
                    </p>
                  </form>
                </div>
              </div>
            )}

            {/* If no variant selected yet, show prompt */}
            {!selectedVariant && (
              <div className="bg-yellow-50 border-2 border-dashed border-yellow-300 rounded-2xl p-6 text-center">
                <p className="text-yellow-700 font-bold">اختر عرضاً من الخيارات أعلاه لإتمام الطلب</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
