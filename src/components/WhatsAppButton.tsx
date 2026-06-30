const WHATSAPP_NUMBER = '201206534773';

export function WhatsAppButton() {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('أريد الاستفسار عن المنتجات')}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-50 flex items-center gap-3 group"
      aria-label="تواصل عبر واتساب"
    >
      <span className="hidden sm:block bg-white text-green-700 text-sm font-bold px-4 py-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap border border-green-100">
        تواصل معنا
      </span>
      <div className="relative bg-green-500 hover:bg-green-400 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95">
        <svg viewBox="0 0 32 32" className="w-9 h-9 fill-white" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 0C7.163 0 0 7.163 0 16c0 2.82.736 5.47 2.027 7.775L0 32l8.437-2.011A15.94 15.94 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm8.066 22.27c-.337.95-1.966 1.818-2.705 1.933-.69.107-1.563.152-2.52-.158-.581-.19-1.327-.444-2.285-.87-4.01-1.731-6.63-5.746-6.83-6.014-.198-.27-1.62-2.154-1.62-4.109 0-1.954 1.025-2.916 1.39-3.316.365-.4.797-.499 1.063-.499.266 0 .532.003.765.014.245.012.574-.093.898.686.337.806 1.143 2.78 1.244 2.981.1.2.167.434.033.7-.134.267-.2.433-.398.666-.199.234-.419.521-.597.7-.199.199-.406.414-.174.812.232.398 1.032 1.7 2.216 2.75 1.522 1.355 2.806 1.776 3.205 1.975.399.2.632.167.865-.1.233-.267.998-1.165 1.264-1.564.266-.4.532-.333.897-.2.365.134 2.32 1.095 2.72 1.294.398.2.664.3.764.465.1.166.1.966-.237 1.918z" />
        </svg>
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping opacity-75" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full" />
      </div>
    </a>
  );
}
