import { ShieldCheck, Truck, Clock } from 'lucide-react';

export function Hero() {
  return (
    <section className="bg-gradient-to-br from-black via-zinc-900 to-black text-white py-10 px-4 overflow-hidden relative">
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-yellow-400 via-transparent to-transparent" />
      <div className="container mx-auto max-w-4xl relative">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full px-4 py-1.5 mb-5">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <p className="text-yellow-400 text-sm font-bold">التوصيل غداً إن شاء الله لجميع المحافظات</p>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3 leading-tight">
            متجر المنتجات الصحية
            <span className="text-yellow-400 block mt-1">للرجال في الأردن</span>
          </h1>

          <p className="text-zinc-400 text-base sm:text-lg max-w-xl mx-auto mb-8">
            منتجات صحية أصلية مضمونة • الدفع عند الاستلام • توصيل سري وسريع
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 text-sm text-zinc-300 bg-white/5 rounded-full px-4 py-2">
              <Truck className="w-4 h-4 text-yellow-400" />
              توصيل لجميع محافظات الأردن
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-300 bg-white/5 rounded-full px-4 py-2">
              <ShieldCheck className="w-4 h-4 text-yellow-400" />
              منتجات أصلية مضمونة 100%
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-300 bg-white/5 rounded-full px-4 py-2">
              <Clock className="w-4 h-4 text-yellow-400" />
              الدفع عند الاستلام
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
