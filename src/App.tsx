import { useState, useEffect } from 'react';
import { supabase, Product, ProductVariant } from './lib/supabase';
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { WhatsAppButton } from './components/WhatsAppButton';
import { ProductPage } from './pages/ProductPage';
import { Loader2, ShoppingBag, Truck, ShieldCheck, Clock, Lock } from 'lucide-react';

function useHashRouter() {
  const getHash = () => window.location.hash.slice(1);
  const [hash, setHash] = useState(getHash);

  useEffect(() => {
    const onHashChange = () => setHash(getHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = (path: string) => {
    window.location.hash = path;
  };

  return { hash, navigate };
}

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { hash, navigate } = useHashRouter();

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, product_variants(*), product_images(*)')
        .order('sort_order', { ascending: true });

      if (error) throw error;

      if (data) {
        setProducts(
          data.map((p) => ({
            ...p,
            product_variants: (p.product_variants ?? []).sort(
              (a: ProductVariant, b: ProductVariant) => a.sort_order - b.sort_order
            ),
            product_images: (p.product_images ?? []).sort(
              (a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order
            ),
          }))
        );
      }
    } catch (err) {
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  }

  const currentSlug = hash.startsWith('product/') ? hash.slice('product/'.length) : null;
  const currentProduct = currentSlug
    ? products.find((p) => p.slug === currentSlug || p.id === currentSlug) ?? null
    : null;

  const handleViewProduct = (product: Product) => {
    navigate(`product/${product.slug ?? product.id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    navigate('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (currentProduct) {
    return (
      <>
        <ProductPage product={currentProduct} onBack={handleBackToHome} />
        <WhatsAppButton />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Header />

      {/* Hero banner */}
      <section className="bg-gradient-to-l from-black via-zinc-900 to-black text-white py-10 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full px-4 py-1.5 mb-5">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <p className="text-yellow-400 text-sm font-bold">التوصيل غداً إن شاء الله لجميع المحافظات</p>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black mb-3">
            منتجات صحية أصلية
            <span className="text-yellow-400 block mt-1">للرجل الأردني</span>
          </h2>
          <p className="text-zinc-400 text-base mb-8">
            دفع عند الاستلام • توصيل سري وسريع • ضمان الجودة
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            {[
              { Icon: Truck, text: 'توصيل لجميع المحافظات' },
              { Icon: ShieldCheck, text: 'أصلي 100%' },
              { Icon: Clock, text: 'التوصيل غداً' },
              { Icon: Lock, text: 'تغليف سري' },
            ].map(({ Icon, text }) => (
              <div key={text} className="flex items-center gap-1.5 text-xs text-zinc-300 bg-white/5 border border-white/10 rounded-full px-3 py-2">
                <Icon className="w-3.5 h-3.5 text-yellow-400" />
                {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products grid */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl font-black text-gray-900 mb-2">منتجاتنا</h2>
          <p className="text-gray-500 text-sm mb-8">اختر منتجاً للاطلاع على العروض وتقديم طلبك</p>

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-24">
              <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-400 text-xl font-medium">لا توجد منتجات متاحة</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} onView={handleViewProduct} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Trust section */}
      <section className="bg-black text-white py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <h3 className="text-center text-lg font-black mb-8 text-white">لماذا تختار متجر شباب دائما؟</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { emoji: '✅', title: 'منتجات أصلية', sub: 'مضمونة 100%' },
              { emoji: '🚚', title: 'توصيل سريع', sub: 'غداً إن شاء الله' },
              { emoji: '💵', title: 'الدفع عند الاستلام', sub: 'بدون مقدم' },
              { emoji: '🔒', title: 'توصيل سري', sub: 'بتغليف مناسب' },
            ].map((item) => (
              <div key={item.title} className="flex flex-col items-center gap-2">
                <span className="text-3xl">{item.emoji}</span>
                <p className="font-black text-white text-sm">{item.title}</p>
                <p className="text-gray-400 text-xs">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-zinc-950 text-gray-500 py-6 px-4 text-center text-sm border-t border-zinc-800">
        <p className="font-medium text-gray-400 mb-1">متجر شباب دائما للرجال - الأردن</p>
        <p>© 2024 جميع الحقوق محفوظة</p>
      </footer>

      <WhatsAppButton />
    </div>
  );
}
