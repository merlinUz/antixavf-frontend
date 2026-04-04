import {
  AlertOctagon,
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  KeyRound,
  Loader2,
  Lock,
  Send,
  ShieldCheck,
  Smartphone,
  Youtube,
  EyeOff,
  SearchCheck
} from 'lucide-react'
import { useEffect, useState } from 'react'
import img1 from './assets/logo.svg'
import PrivacyPolicy from './PrivacyPolicy'

export default function App() {
  const [platform, setPlatform] = useState(null)
  const [step, setStep] = useState('phone')

  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [hash, setHash] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [results, setResults] = useState([])

  // YANGI GOOGLE WEB FLOW KODLARI
  const GOOGLE_CLIENT_ID = "174357315642-5p8lg1o305hpki8qu3qperp5u3fht85h.apps.googleusercontent.com";
  const REDIRECT_URI = "https://antixavf.uz";

  // ==========================================
  // SAHIFA YUKLANGANDA GOOGLE'DAN QAYTGANINI TEKSHIRISH
  // ==========================================
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const googleAuthCode = urlParams.get('code');

    if (googleAuthCode) {
      // 1. Manzil qatoridagi xunuk va uzun kodni tozalab tashlaymiz
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // 2. Darhol YouTube tekshiruvini boshlaymiz
      setPlatform('yt');
      setStep('yt_loading');
      verifyYouTubeWebCode(googleAuthCode);
    }
  }, []);

  const verifyYouTubeWebCode = async (authCode) => {
    try {
      // MANA SHU YER YANGILANDI:
      const res = await fetch('https://api.antixavf.uz/api/yt/verify-web', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: authCode }),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.detail || "Google bilan bog'lanishda xatolik");

      setResults(data.banned_channels);
      setStep('result');
    } catch (err) {
      setError(err.message);
      setStep('yt_error');
    }
  };

  const handleStartYouTubeAuth = () => {
    setLoading(true);
    // Google'ning rasmiy ruxsat so'rash sahifasiga yo'naltiramiz
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=https://www.googleapis.com/auth/youtube.readonly&access_type=offline&prompt=consent`;
    window.location.href = authUrl; 
  };

  // ==========================================
  // TELEGRAM FUNKSIYALARI
  // ==========================================
  const handlePhoneChange = (e) => {
    const val = e.target.value.replace(/[^\d\s]/g, '')
    setPhone(val)
  }

  const getCleanPhone = () => {
    return '+998' + phone.replace(/\s+/g, '')
  }

  const handleSendCode = async () => {
    if (!phone || phone.replace(/\s+/g, '').length < 9) {
      return setError("Iltimos, to'liq raqamni kiriting! (Masalan: 90 123 45 67)")
    }
    setLoading(true)
    setError('')
    try {
      // MANA SHU YER YANGILANDI:
      const res = await fetch('https://api.antixavf.uz/api/tg/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: getCleanPhone() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Xatolik yuz berdi')
      setHash(data.phone_code_hash)
      setStep('code')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async () => {
    if (!code) return setError('Iltimos, kodni kiriting!')
    setLoading(true)
    setError('')
    try {
      // MANA SHU YER YANGILANDI:
      const res = await fetch('https://api.antixavf.uz/api/tg/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: getCleanPhone(), phone_code_hash: hash, code }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Xatolik yuz berdi')

      if (data.status === 'password_needed') {
        setStep('password')
        return
      }
      setResults(data.banned_channels)
      setStep('result')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyPassword = async () => {
    if (!password) return setError('Iltimos, parolni kiriting!')
    setLoading(true)
    setError('')
    try {
      // MANA SHU YER YANGILANDI:
      const res = await fetch('https://api.antixavf.uz/api/tg/verify-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: getCleanPhone(), password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Xatolik yuz berdi')
      setResults(data.banned_channels)
      setStep('result')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // ==========================================
  // BOSH SAHIFAGA QAYTISH
  // ==========================================
  const resetState = () => {
    setPlatform(null)
    setStep('phone')
    setPhone('')
    setCode('')
    setPassword('')
    setHash('')
    setError('')
    setResults([])
    setLoading(false)
  }

  if (window.location.pathname === '/privacy-policy') {
    return <PrivacyPolicy />
  }

  return (
    <div className='min-h-screen bg-[#0B1120] text-slate-200 font-sans selection:bg-emerald-500/30 selection:text-emerald-200 flex items-center justify-center p-6 relative overflow-hidden'>
      {/* Orqa fondagi effektlar */}
      <div className='absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none'></div>
      <div className='absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none'></div>

      <div className='w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10 py-10'>
        
        {/* CHAP TOMON: Ma'lumotlar */}
        <div className='flex flex-col gap-8'>
          <div className='flex items-center gap-4'>
            <div className='bg-slate-800/50 p-3 rounded-2xl border border-slate-700/50 shadow-lg shadow-emerald-500/10 backdrop-blur-sm'>
              <img src={img1} alt='Antixavf Logo' className='w-10 h-10 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]' />
            </div>
            <span className='text-2xl font-bold text-white tracking-wide'>Antixavf</span>
          </div>

          <div className='space-y-4'>
            <h1 className='text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight'>
              Raqamli <span className='text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500'>xavfsizligingizni</span> o'z qo'lingizga oling.
            </h1>
            <p className='text-slate-400 text-lg md:text-xl max-w-lg leading-relaxed'>
              Ijtimoiy tarmoqlardagi akkauntlaringizni yashirin, zararli va taqiqlangan manbalardan bir necha soniya ichida tozalang.
            </p>
          </div>

          <div className='space-y-5 mt-4'>
            <div className='flex items-start gap-4'>
              <div className='bg-blue-500/10 p-3 rounded-xl shrink-0'>
                <SearchCheck className='w-6 h-6 text-blue-400' />
              </div>
              <div>
                <h3 className='text-white font-semibold text-lg'>Tezkor Audit</h3>
                <p className='text-slate-400 text-sm mt-1'>Telegram va YouTube obunalaringiz bazamizdagi qora ro'yxat bilan avtomatik tekshiriladi.</p>
              </div>
            </div>

            <div className='flex items-start gap-4'>
              <div className='bg-emerald-500/10 p-3 rounded-xl shrink-0'>
                <EyeOff className='w-6 h-6 text-emerald-400' />
              </div>
              <div>
                <h3 className='text-white font-semibold text-lg'>100% Maxfiylik</h3>
                <p className='text-slate-400 text-sm mt-1'>Sizning shaxsiy ma'lumotlaringiz saqlanmaydi. Tekshiruvdan so'ng darhol o'chiriladi.</p>
              </div>
            </div>

            <div className='flex items-start gap-4'>
              <div className='bg-purple-500/10 p-3 rounded-xl shrink-0'>
                <ShieldCheck className='w-6 h-6 text-purple-400' />
              </div>
              <div>
                <h3 className='text-white font-semibold text-lg'>Rasmiy Tasdiqlangan API</h3>
                <p className='text-slate-400 text-sm mt-1'>Platforma Google tomonidan rasmiy tasdiqdan o'tgan bo'lib, xalqaro xavfsizlik standartlariga javob beradi.</p>
              </div>
            </div>
          </div>
        </div>

        {/* O'NG TOMON: Tekshirish Oynasi */}
        <div className='w-full max-w-md mx-auto lg:ml-auto lg:mr-0'>
          <div className='bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 shadow-2xl shadow-black/50 rounded-3xl p-6 md:p-8 transition-all'>
            
            {/* ASOSIY MENYU */}
            {!platform && (
              <div className='flex flex-col gap-4 animate-fade-in'>
                <h2 className='text-xl font-semibold text-white mb-4 text-center'>
                  Tekshiruv yo'nalishini tanlang
                </h2>

                <button
                  onClick={() => setPlatform('tg')}
                  disabled={loading}
                  className={`group flex items-center justify-between bg-slate-900/60 hover:bg-[#2AABEE]/10 border border-slate-700 hover:border-[#2AABEE]/50 text-white p-5 rounded-2xl transition-all duration-300 shadow-inner ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className='flex items-center gap-4'>
                    <div className='bg-[#2AABEE]/20 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300'>
                      <Send className='w-6 h-6 text-[#2AABEE]' />
                    </div>
                    <div className='text-left'>
                      <h3 className='font-semibold text-lg'>Telegram</h3>
                      <p className='text-xs text-slate-400 mt-0.5'>Kanallar va guruhlar auditi</p>
                    </div>
                  </div>
                </button>

                {/* YOUTUBE TUGMASI */}
                <button
                  onClick={handleStartYouTubeAuth}
                  disabled={loading}
                  className={`group flex items-center justify-between bg-slate-900/60 hover:bg-[#FF0000]/10 border border-slate-700 hover:border-[#FF0000]/50 text-white p-5 rounded-2xl transition-all duration-300 shadow-inner ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className='flex items-center gap-4'>
                    <div className='bg-[#FF0000]/20 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300'>
                      {loading ? (
                        <Loader2 className='w-6 h-6 text-[#FF0000] animate-spin' />
                      ) : (
                        <Youtube className='w-6 h-6 text-[#FF0000]' />
                      )}
                    </div>
                    <div className='text-left'>
                      <h3 className='font-semibold text-lg'>YouTube</h3>
                      <p className='text-xs text-slate-400 mt-0.5'>Obunalar xavfsizligi</p>
                    </div>
                  </div>
                </button>
              </div>
            )}

            {/* TELEGRAM QISMI */}
            {platform === 'tg' && step === 'phone' && (
              <div className='flex flex-col gap-6 animate-fade-in'>
                <div className='text-center'>
                  <div className='inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-500/10 mb-4 ring-1 ring-blue-500/20'>
                    <Smartphone className='w-7 h-7 text-blue-400' />
                  </div>
                  <h2 className='text-xl font-semibold text-white'>Telegram raqamingiz</h2>
                </div>
                <div className='flex items-center bg-slate-900/80 border border-slate-600 rounded-xl px-4 py-3.5 text-white focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all text-lg tracking-wider shadow-inner'>
                  <span className='text-slate-400 font-medium mr-2'>+998</span>
                  <div className='w-px h-6 bg-slate-700 mr-3'></div>
                  <input
                    type='tel'
                    placeholder='90 123 45 67'
                    value={phone}
                    onChange={handlePhoneChange}
                    maxLength={12}
                    className='w-full bg-transparent focus:outline-none text-left placeholder:text-slate-600 font-medium'
                  />
                </div>
                {error && <p className='text-red-400 text-sm text-center'>{error}</p>}
                <button onClick={handleSendCode} disabled={loading} className='w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:opacity-50 text-white py-4 rounded-xl font-semibold transition-all'>
                  {loading ? 'Yuborilmoqda...' : 'Kodni olish'}
                </button>
                <button onClick={resetState} className='text-slate-400 hover:text-white text-sm mt-1 transition-colors'>Ortga qaytish</button>
              </div>
            )}
            
            {platform === 'tg' && step === 'code' && (
              <div className='flex flex-col gap-6 animate-fade-in'>
                 <div className='text-center'>
                  <div className='inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500/10 mb-4 ring-1 ring-emerald-500/20'>
                    <KeyRound className='w-7 h-7 text-emerald-400' />
                  </div>
                  <h2 className='text-xl font-semibold text-white'>Tasdiqlash kodi</h2>
                </div>
                <input type='text' placeholder='•••••' value={code} onChange={e => setCode(e.target.value)} className='w-full bg-slate-900/80 border border-slate-600 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-emerald-500 text-center text-3xl tracking-[0.5em] font-mono' maxLength={5} />
                {error && <p className='text-red-400 text-sm text-center'>{error}</p>}
                <button onClick={handleVerifyCode} disabled={loading} className='w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 disabled:opacity-50 text-white py-4 rounded-xl font-semibold'>
                  {loading ? 'Tekshirilmoqda...' : 'Tasdiqlash'}
                </button>
                <button onClick={resetState} className='text-slate-400 hover:text-white text-sm mt-1'>Bekor qilish</button>
              </div>
            )}

            {platform === 'tg' && step === 'password' && (
              <div className='flex flex-col gap-6 animate-fade-in'>
                <div className='text-center'>
                  <div className='inline-flex items-center justify-center w-14 h-14 rounded-full bg-purple-500/10 mb-4 ring-1 ring-purple-500/20'>
                    <Lock className='w-7 h-7 text-purple-400' />
                  </div>
                  <h2 className='text-xl font-semibold text-white'>2-bosqichli parol</h2>
                </div>
                <input type='password' placeholder='Parolingiz...' value={password} onChange={e => setPassword(e.target.value)} className='w-full bg-slate-900/80 border border-slate-600 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-purple-500 text-center text-lg' />
                {error && <p className='text-red-400 text-sm text-center'>{error}</p>}
                <button onClick={handleVerifyPassword} disabled={loading} className='w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 disabled:opacity-50 text-white py-4 rounded-xl font-semibold'>
                  {loading ? 'Tekshirilmoqda...' : 'Davom etish'}
                </button>
                <button onClick={resetState} className='text-slate-400 hover:text-white text-sm mt-1'>Bekor qilish</button>
              </div>
            )}

            {/* YOUTUBE LOADING EKRANI */}
            {platform === 'yt' && step === 'yt_loading' && (
              <div className='flex flex-col items-center justify-center gap-6 animate-fade-in py-8'>
                <div className='relative'>
                  <div className='absolute inset-0 rounded-full bg-emerald-500 blur-xl opacity-20 animate-pulse'></div>
                  <Loader2 className='w-16 h-16 text-emerald-500 animate-spin relative z-10' />
                </div>
                <div className='text-center'>
                  <h2 className='text-xl font-bold text-white mb-2'>Tekshirilmoqda...</h2>
                  <p className='text-slate-400 text-sm max-w-[250px] mx-auto'>
                    Google'dan muvaffaqiyatli qaytdingiz! Hozir obunalaringiz tahlil qilinmoqda.
                  </p>
                </div>
              </div>
            )}

            {/* YOUTUBE XATOLIK EKRANI */}
            {platform === 'yt' && step === 'yt_error' && (
              <div className='flex flex-col items-center justify-center gap-6 animate-fade-in py-6'>
                <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 mb-2 ring-1 ring-red-500/20'>
                  <AlertOctagon className='w-8 h-8 text-red-500' />
                </div>
                <div className='text-center'>
                  <h2 className='text-xl font-bold text-white mb-2'>Xatolik yuz berdi</h2>
                  <p className='text-slate-400 text-sm max-w-[250px] mx-auto mb-6'>
                    {error}
                  </p>
                </div>
                <button onClick={resetState} className='w-full bg-slate-800 hover:bg-slate-700 text-white py-4 rounded-xl font-medium transition-colors'>
                  Boshidan boshlash
                </button>
              </div>
            )}

            {/* UMUMIY NATIJA OYNASI */}
            {step === 'result' && (
              <div className='flex flex-col gap-6 animate-fade-in'>
                {results.length > 0 ? (
                  <>
                    <div className='text-center'>
                      <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/20 mb-4 ring-4 ring-red-500/10'>
                        {platform === 'yt' ? <Youtube className='w-8 h-8 text-red-500' /> : <Send className='w-8 h-8 text-red-500' />}
                      </div>
                      <h2 className='text-2xl font-bold text-white mb-2'>Xavfli manbalar topildi!</h2>
                      <p className='text-sm text-slate-400'>Quyidagi sahifalardan zudlik bilan chiqib ketish tavsiya etiladi:</p>
                    </div>
                    <div className='bg-slate-900/80 border border-red-500/30 rounded-xl p-2 max-h-[250px] overflow-y-auto custom-scrollbar shadow-inner'>
                      {results.map((channel, idx) => (
                        <div key={idx} className='flex items-start gap-3 text-slate-300 py-3 px-4 border-b border-slate-800 last:border-0 hover:bg-slate-800/50 transition-colors rounded-lg'>
                          <span className='text-red-500 mt-1'>❌</span>
                          <span className='font-medium leading-relaxed'>{channel}</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className='text-center py-6'>
                    <div className='inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/20 mb-6 ring-8 ring-emerald-500/10 relative'>
                      <div className='absolute inset-0 rounded-full bg-emerald-400 blur-xl opacity-20 animate-pulse'></div>
                      {platform === 'yt' ? <Youtube className='w-10 h-10 text-emerald-400 relative z-10' /> : <Send className='w-10 h-10 text-emerald-400 relative z-10' />}
                    </div>
                    <h2 className='text-3xl font-bold text-white mb-3'>Tabriklaymiz!</h2>
                    <p className='text-slate-300 text-base leading-relaxed mb-6'>
                      Sizning <strong>{platform === 'yt' ? 'YouTube' : 'Telegram'}</strong> akkauntingiz toza.
                    </p>
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-sm text-emerald-300/90 flex items-start gap-3">
                       <ShieldCheck className="w-6 h-6 shrink-0 mt-0.5" />
                       <p>Xavfsizligingizni ta'minlash uchun bu tekshiruvni har oy amalga oshirib turishni unutmang.</p>
                    </div>
                  </div>
                )}
                <button onClick={resetState} className='w-full bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white py-4 rounded-xl font-medium mt-2 shadow-lg'>
                  Yangi tekshiruv boshlash
                </button>
              </div>
            )}
          </div>

          <div className='mt-8 text-center text-slate-500 text-xs space-y-2'>
            <div className='flex items-center justify-center gap-1.5 mb-3'>
              <ShieldCheck className='w-4 h-4 text-emerald-500' />
              <span className='text-slate-400 font-medium'>Verified by Google API</span>
            </div>
            <p>© 2026 Antixavf Security.</p>
            <p>Ishlab chiquvchi: <span className="text-slate-400 font-medium">Merlin</span></p>
            <div className="flex items-center justify-center gap-4 mt-2 pt-2 border-t border-slate-800">
                <a href="/privacy-policy" className="text-blue-400/80 hover:text-blue-300 transition-colors">Maxfiylik Siyosati</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}