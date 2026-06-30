import { HeartPulse } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-black text-white shadow-lg border-b border-yellow-500/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center h-16 gap-3">
          <div className="bg-yellow-500 rounded-full p-1.5">
            <HeartPulse className="w-5 h-5 text-black" />
          </div>
          <div className="text-center">
            <h1 className="text-lg sm:text-xl font-black tracking-wide leading-tight">
              متجر شباب دائما للرجال
            </h1>
            <p className="text-xs text-yellow-400/80">منتجات صحية أصلية • توصيل غداً لجميع محافظات الأردن</p>
          </div>
        </div>
      </div>
    </header>
  );
}
