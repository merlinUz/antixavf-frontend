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
              <h1 className='text-2xl md:text-3xl font-bold text-white'>Maxfiylik Siyosati</h1>
              <p className='text-slate-400 mt-1'>Oxirgi yangilanish: 2026-yil 10-mart</p>
            </div>
          </div>
          
          <div className='space-y-6'>
            <div>
              <h2 className='text-xl font-semibold text-emerald-400 mb-2'>1. Ma'lumotlarni yig'ish</h2>
              <p className='text-slate-300 leading-relaxed'>
                Antixavf platformasi tizimga kirishingiz uchun faqatgina ochiq ma'lumotlarni qabul qiladi. Biz hech qanday shaxsiy parolingizni so'ramaymiz va o'z bazamizda saqlamaymiz.
              </p>
            </div>

            <div>
              <h2 className='text-xl font-semibold text-emerald-400 mb-2'>2. Ma'lumotlardan foydalanish</h2>
              <p className='text-slate-300 leading-relaxed'>
                Sizning ma'lumotlaringiz faqatgina akkauntingizni taqiqlangan manbalardan himoya qilish (audit) va xizmatlarimizdan xavfsiz foydalanishingizni ta'minlash uchun ishlatiladi.
              </p>
            </div>

            <div>
              <h2 className='text-xl font-semibold text-emerald-400 mb-2'>3. Uchinchi shaxslarga berish</h2>
              <p className='text-slate-300 leading-relaxed'>
                Biz sizning shaxsiy ma'lumotlaringizni hech qanday holatda uchinchi shaxslarga sotmaymiz yoki ulashmaymiz. Tekshiruv tugashi bilan kiritilgan vaqtinchalik kodlar darhol o'chiriladi.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PrivacyPolicy;