import React from 'react';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className='min-h-screen bg-[#0B1120] text-slate-200 font-sans p-6 md:p-12'>
      <div className='max-w-3xl mx-auto'>
        
        {/* Ortga qaytish tugmasi */}
        <a href="/" className='inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors'>
          <ArrowLeft className='w-5 h-5' /> Asosiy sahifaga qaytish
        </a>

        {/* Asosiy oyna */}
        <div className='bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 shadow-2xl rounded-3xl p-8'>
          <div className='flex items-center gap-4 mb-8 border-b border-slate-700/50 pb-6'>
            <div className='bg-emerald-500/10 p-3 rounded-xl'>
              <ShieldCheck className='w-8 h-8 text-emerald-400' />
            </div>
            <div>
              <h1 className='text-2xl md:text-3xl font-bold text-white'>Maxfiylik Siyosati (Privacy Policy)</h1>
              <p className='text-slate-400 mt-1'>Oxirgi yangilanish: 2026-yil 14-mart</p>
            </div>
          </div>
          
          <div className='space-y-6'>
            <div>
              <h2 className='text-xl font-semibold text-emerald-400 mb-2'>1. Ma'lumotlarga kirish (Data Accessed)</h2>
              <p className='text-slate-300 leading-relaxed mb-2'>
                Dasturimiz sizning YouTube obunalaringizni ko'rish uchun <code className="bg-slate-700/50 px-2 py-1 rounded text-emerald-300">youtube.readonly</code> ruxsatini so'raydi. Biz faqatgina siz obuna bo'lgan ochiq kanallar ro'yxatini ko'ramiz.
              </p>
              <p className='text-slate-400 text-sm italic'>
                (Our application requests access to your YouTube subscriptions using the youtube.readonly scope. We only access the list of channels you are subscribed to.)
              </p>
            </div>

            <div>
              <h2 className='text-xl font-semibold text-emerald-400 mb-2'>2. Ma'lumotlardan foydalanish (Data Usage)</h2>
              <p className='text-slate-300 leading-relaxed mb-2'>
                Sizning ma'lumotlaringiz faqatgina real vaqt rejimida akkauntingizni taqiqlangan manbalardan himoya qilish (audit) uchun ishlatiladi. Biz bu orqali faqat ekranda tekshiruv natijasini ko'rsatamiz.
              </p>
              <p className='text-slate-400 text-sm italic'>
                (We use this data strictly in real-time to scan your subscriptions against a public database of prohibited or dangerous channels. We only use this to show you the audit result on your screen.)
              </p>
            </div>

            <div>
              <h2 className='text-xl font-semibold text-emerald-400 mb-2'>3. Ma'lumotlarni ulashish (Data Sharing)</h2>
              <p className='text-slate-300 leading-relaxed mb-2'>
                Biz sizning shaxsiy ma'lumotlaringizni hech qanday holatda uchinchi shaxslarga bermaymiz, sotmaymiz yoki ulashmaymiz.
              </p>
              <p className='text-slate-400 text-sm italic'>
                (We do NOT share, sell, or transfer your Google user data to any third parties.)
              </p>
            </div>

            <div>
              <h2 className='text-xl font-semibold text-emerald-400 mb-2'>4. Saqlash va Himoyalash (Data Storage & Protection)</h2>
              <p className='text-slate-300 leading-relaxed mb-2'>
                Biz YouTube ma'lumotlaringizni serverlarimizda saqlamaymiz. Tekshiruv jarayoni vaqtinchalik xotirada amalga oshadi va natija chiqqach, barcha ma'lumotlar tizimdan darhol o'chirib yuboriladi.
              </p>
              <p className='text-slate-400 text-sm italic'>
                (We do NOT store your YouTube data. The scanning process is done purely in temporary memory. Once the scan is complete and the result is displayed, your data is immediately completely discarded from our system.)
              </p>
            </div>

            <div>
              <h2 className='text-xl font-semibold text-emerald-400 mb-2'>5. Saqlash muddati va O'chirish (Data Retention & Deletion)</h2>
              <p className='text-slate-300 leading-relaxed mb-2'>
                Ma'lumotlar bizda saqlanmagani uchun, ularni ushlab turish yoki o'chirish muddati yo'q. Siz istalgan vaqtda Google Akkaunt sozlamalari orqali dasturimizga berilgan ruxsatni bekor qilishingiz mumkin.
              </p>
              <p className='text-slate-400 text-sm italic'>
                (Since we do not store any of your personal data on our servers, there is no data to retain or delete. You can revoke our application's access at any time directly from your Google Account settings.)
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PrivacyPolicy;