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

  const [ytUserCode, setYtUserCode] = useState('')
  const [ytVerificationUrl, setYtVerificationUrl] = useState('')
  const [ytDeviceCode, setYtDeviceCode] = useState('')
  const [isPolling, setIsPolling] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [results, setResults] = useState([])

  // ==========================================
  // TELEGRAM FUNKSIYALARI
  // ==========================================
  const handleSendCode = async () => {
    if (!phone) return setError('Iltimos, telefon raqamingizni kiriting!')
    setLoading(true)
    setError('')
    try {
      const res = await fetch('https://antixavf-backend.onrender.com/api/tg/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
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
      const res = await fetch('https://antixavf-backend.onrender.com/api/tg/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, phone_code_hash: hash, code }),
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
      const res = await fetch('https://antixavf-backend.onrender.com/api/tg/verify-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password }),
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
  // YOUTUBE FUNKSIYALARI
  // ==========================================
  const handleGetYtCode = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('https://antixavf-backend.onrender.com/api/yt/get-code')
      const data = await res.json()
      if (!res.ok)
        throw new Error(data.detail || "Google bilan bog'lanishda xatolik")

      setYtUserCode(data.user_code)
      setYtVerificationUrl(data.verification_url)
      setYtDeviceCode(data.device_code)

      setPlatform('yt')
      setStep('yt_auth')
      setIsPolling(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let timeoutId
    const checkYtStatus = async () => {
      if (!isPolling || !ytDeviceCode) return
      try {
        const res = await fetch('https://antixavf-backend.onrender.com/api/yt/verify-and-check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ device_code: ytDeviceCode }),
        })
        const data = await res.json()

        if (data.status === 'pending') {
          timeoutId = setTimeout(checkYtStatus, 5000)
        } else if (data.status === 'success') {
          setIsPolling(false)
          setResults(data.banned_channels)
          setStep('result')
        } else {
          throw new Error(data.detail || "Noma'lum xatolik")
        }
      } catch (err) {
        setIsPolling(false)
        setError(err.message)
      }
    }

    if (isPolling) checkYtStatus()
    return () => clearTimeout(timeoutId)
  }, [isPolling, ytDeviceCode])

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
    setYtUserCode('')
    setYtVerificationUrl('')
    setYtDeviceCode('')
    setIsPolling(false)
  }

  // Sehrli Router: Agar Maxfiylik Siyosatiga kirilsa, shu sahifani ochadi
  if (window.location.pathname === '/privacy-policy') {
    return <PrivacyPolicy />
  }

  return (
    <div className='min-h-screen bg-[#0B1120] text-slate-200 font-sans selection:bg-emerald-500/30 selection:text-emerald-200 flex flex-col items-center justify-center p-4 relative overflow-hidden'>
      {/* Orqa fondagi mavhum (abstract) yorug'lik effektlari */}
      <div className='absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] pointer-events-none'></div>
      <div className='absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none'></div>

      {/* Sarlavha qismi */}
      <div className='text-center mb-10 max-w-2xl relative z-10 flex flex-col items-center'>
        <div className='bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 mb-6 shadow-lg shadow-emerald-500/10 backdrop-blur-sm'>
          <img
            src={img1}
            alt='Antixavf Logo'
            className='w-16 h-16 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]'
          />
        </div>
        <h1 className='text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-400 mb-4 tracking-tight'>
          Antixavf.uz
        </h1>
        <p className='text-slate-400 text-lg'>
          Ijtimoiy tarmoqlardagi akkauntingizni taqiqlangan manbalardan himoya
          qiling. <br className='hidden md:block' />
          <span className='text-emerald-400/80 font-medium'>
            100% maxfiy va xavfsiz audit.
          </span>
        </p>
      </div>

      {/* Asosiy oyna (Glassmorphism) */}
      <div className='bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 shadow-2xl rounded-3xl w-full max-w-md p-6 md:p-8 transition-all relative z-10'>
        {/* ASOSIY MENYU */}
        {!platform && (
          <div className='flex flex-col gap-4 animate-fade-in'>
            <h2 className='text-lg font-medium text-slate-300 mb-2 text-center'>
              Tekshiruv yo'nalishini tanlang
            </h2>

            <button
              onClick={() => setPlatform('tg')}
              className='group flex items-center justify-between bg-slate-900/50 hover:bg-[#2AABEE]/10 border border-slate-700 hover:border-[#2AABEE]/50 text-white p-4 rounded-2xl transition-all duration-300'
            >
              <div className='flex items-center gap-4'>
                <div className='bg-[#2AABEE]/20 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300'>
                  <Send className='w-6 h-6 text-[#2AABEE]' />
                </div>
                <div className='text-left'>
                  <h3 className='font-semibold text-lg'>Telegram</h3>
                  <p className='text-xs text-slate-400'>
                    Kanallar va guruhlar auditi
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={handleGetYtCode}
              disabled={loading}
              className='group flex items-center justify-between bg-slate-900/50 hover:bg-[#FF0000]/10 border border-slate-700 hover:border-[#FF0000]/50 text-white p-4 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
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
                  <p className='text-xs text-slate-400'>Obunalar xavfsizligi</p>
                </div>
              </div>
            </button>
          </div>
        )}

        {/* TELEGRAM QISMI */}
        {platform === 'tg' && step === 'phone' && (
          <div className='flex flex-col gap-5 animate-fade-in'>
            <div className='text-center'>
              <div className='inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/10 mb-3'>
                <Smartphone className='w-6 h-6 text-blue-400' />
              </div>
              <h2 className='text-xl font-semibold text-white'>
                Telegram raqamingiz
              </h2>
              <p className='text-sm text-slate-400 mt-1'>
                Xalqaro formatda kiriting (+998...)
              </p>
            </div>

            <div className='relative'>
              <input
                type='text'
                placeholder='+998 90 123 45 67'
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className='w-full bg-slate-900/80 border border-slate-600 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-center text-lg tracking-wider'
              />
            </div>

            {error && (
              <p className='text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 py-2 rounded-lg flex items-center justify-center gap-2'>
                <AlertOctagon className='w-4 h-4' /> {error}
              </p>
            )}

            <button
              onClick={handleSendCode}
              disabled={loading}
              className='w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:opacity-50 text-white py-4 rounded-xl font-medium transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2'
            >
              {loading ? (
                <>
                  <Loader2 className='w-5 h-5 animate-spin' /> Yuborilmoqda...
                </>
              ) : (
                'Kodni olish'
              )}
            </button>
            <button
              onClick={resetState}
              className='flex items-center justify-center gap-2 text-slate-400 hover:text-white text-sm mt-2 transition-colors'
            >
              <ArrowLeft className='w-4 h-4' /> Ortga qaytish
            </button>
          </div>
        )}

        {platform === 'tg' && step === 'code' && (
          <div className='flex flex-col gap-5 animate-fade-in'>
            <div className='text-center'>
              <div className='inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/10 mb-3'>
                <KeyRound className='w-6 h-6 text-emerald-400' />
              </div>
              <h2 className='text-xl font-semibold text-white'>
                Tasdiqlash kodi
              </h2>
              <p className='text-sm text-slate-400 mt-1'>
                Telegramdan kelgan 5 xonali kodni kiriting
              </p>
            </div>

            <input
              type='text'
              placeholder='•••••'
              value={code}
              onChange={e => setCode(e.target.value)}
              className='w-full bg-slate-900/80 border border-slate-600 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-center text-3xl tracking-[0.5em] font-mono'
              maxLength={5}
            />

            {error && (
              <p className='text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 py-2 rounded-lg flex items-center justify-center gap-2'>
                <AlertOctagon className='w-4 h-4' /> {error}
              </p>
            )}

            <button
              onClick={handleVerifyCode}
              disabled={loading}
              className='w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 disabled:opacity-50 text-white py-4 rounded-xl font-medium transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2'
            >
              {loading ? (
                <>
                  <Loader2 className='w-5 h-5 animate-spin' /> Tekshirilmoqda...
                </>
              ) : (
                'Tasdiqlash'
              )}
            </button>
            <button
              onClick={resetState}
              className='flex items-center justify-center gap-2 text-slate-400 hover:text-white text-sm mt-2 transition-colors'
            >
              Bekor qilish
            </button>
          </div>
        )}

        {platform === 'tg' && step === 'password' && (
          <div className='flex flex-col gap-5 animate-fade-in'>
            <div className='text-center'>
              <div className='inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-500/10 mb-3'>
                <Lock className='w-6 h-6 text-purple-400' />
              </div>
              <h2 className='text-xl font-semibold text-white'>
                2-bosqichli parol
              </h2>
              <p className='text-sm text-slate-400 mt-1'>
                Akkauntingizdagi qo'shimcha parolni kiriting
              </p>
            </div>

            <input
              type='password'
              placeholder='Parolingiz...'
              value={password}
              onChange={e => setPassword(e.target.value)}
              className='w-full bg-slate-900/80 border border-slate-600 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-center text-lg tracking-wider'
            />

            {error && (
              <p className='text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 py-2 rounded-lg flex items-center justify-center gap-2'>
                <AlertOctagon className='w-4 h-4' /> {error}
              </p>
            )}

            <button
              onClick={handleVerifyPassword}
              disabled={loading}
              className='w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 disabled:opacity-50 text-white py-4 rounded-xl font-medium transition-all shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2'
            >
              {loading ? (
                <>
                  <Loader2 className='w-5 h-5 animate-spin' /> Tekshirilmoqda...
                </>
              ) : (
                'Davom etish'
              )}
            </button>
            <button
              onClick={resetState}
              className='flex items-center justify-center gap-2 text-slate-400 hover:text-white text-sm mt-2 transition-colors'
            >
              Bekor qilish
            </button>
          </div>
        )}

        {/* YOUTUBE QISMI */}
        {platform === 'yt' && step === 'yt_auth' && (
          <div className='flex flex-col gap-5 animate-fade-in'>
            <div className='text-center border-b border-slate-700/50 pb-4'>
              <div className='inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10 mb-3'>
                <Youtube className='w-6 h-6 text-red-500' />
              </div>
              <h2 className='text-xl font-bold text-white'>
                YouTube Tasdiqlash
              </h2>
            </div>

            <div className='bg-slate-900/80 border border-slate-700 rounded-xl p-5 relative overflow-hidden group'>
              <div className='absolute top-0 left-0 w-1 h-full bg-emerald-500'></div>
              <p className='text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2'>
                1-Qadam: Kodni nusxalang
              </p>
              <div className='bg-black/50 py-3 rounded-lg text-center border border-slate-700/50'>
                <span className='text-3xl font-mono font-bold text-white tracking-[0.2em]'>
                  {ytUserCode}
                </span>
              </div>
            </div>

            <div className='bg-slate-900/80 border border-slate-700 rounded-xl p-5 relative overflow-hidden'>
              <div className='absolute top-0 left-0 w-1 h-full bg-blue-500'></div>
              <p className='text-blue-400 text-xs font-bold uppercase tracking-wider mb-2'>
                2-Qadam: Google'da tasdiqlang
              </p>
              <a
                href={ytVerificationUrl}
                target='_blank'
                rel='noreferrer'
                className='flex items-center justify-center gap-2 w-full bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white py-3 rounded-lg transition-colors'
              >
                Sahifaga o'tish <ExternalLink className='w-4 h-4' />
              </a>
            </div>

            <div className='bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-xs text-amber-200/80 leading-relaxed'>
              <strong className='text-amber-400'>Muhim:</strong> Xavfsizlik
              oynasi chiqqanda{' '}
              <span className='text-white'>
                "Advanced (Дополнительные настройки)"
              </span>{' '}
              orqali{' '}
              <span className='text-white'>"Перейти на страницу (unsafe)"</span>{' '}
              ni tanlang.
            </div>

            <div className='flex flex-col items-center justify-center gap-3 mt-2 bg-slate-900/30 py-4 rounded-xl border border-slate-700/30'>
              <Loader2 className='w-6 h-6 text-emerald-500 animate-spin' />
              <p className='text-emerald-400/80 text-sm font-medium'>
                Sizning ruxsat berishingiz kutilmoqda...
              </p>
            </div>

            {error && (
              <p className='text-red-400 text-sm text-center'>{error}</p>
            )}
            <button
              onClick={resetState}
              className='text-slate-400 hover:text-white text-sm transition-colors mt-2'
            >
              Bekor qilish
            </button>
          </div>
        )}

        {/* UMUMIY NATIJA OYNASI */}
        {step === 'result' && (
          <div className='flex flex-col gap-5 animate-fade-in'>
            {results.length > 0 ? (
              <>
                <div className='text-center'>
                  <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/20 mb-4 ring-4 ring-red-500/10'>
                    <AlertOctagon className='w-8 h-8 text-red-500' />
                  </div>
                  <h2 className='text-2xl font-bold text-white mb-2'>
                    Taqiqlangan manbalar topildi!
                  </h2>
                  <p className='text-sm text-slate-400'>
                    Quyidagi sahifalardan zudlik bilan chiqib ketishingiz
                    tavsiya etiladi:
                  </p>
                </div>

                <div className='bg-slate-900/80 border border-red-500/30 rounded-xl p-2 max-h-[250px] overflow-y-auto custom-scrollbar'>
                  {results.map((channel, idx) => (
                    <div
                      key={idx}
                      className='flex items-start gap-3 text-slate-300 py-3 px-4 border-b border-slate-800 last:border-0 hover:bg-slate-800/50 transition-colors rounded-lg'
                    >
                      <span className='text-red-500 mt-1'>❌</span>
                      <span className='font-medium leading-relaxed'>
                        {channel}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className='text-center py-8'>
                <div className='inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/20 mb-6 ring-8 ring-emerald-500/10 relative'>
                  <div className='absolute inset-0 rounded-full bg-emerald-400 blur-xl opacity-20 animate-pulse'></div>
                  <CheckCircle2 className='w-10 h-10 text-emerald-400 relative z-10' />
                </div>
                <h2 className='text-3xl font-bold text-white mb-3'>
                  Tabriklaymiz!
                </h2>
                <p className='text-slate-400 text-lg'>
                  Akkauntingiz butunlay toza. <br />
                  Hech qanday xavfli manba topilmadi.
                </p>
              </div>
            )}
            <button
              onClick={resetState}
              className='w-full bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white py-4 rounded-xl font-medium transition-colors mt-2'
            >
              Yangi tekshiruv boshlash
            </button>
          </div>
        )}
      </div>

      {/* Footer / Maxfiylik eslatmasi */}
      <div className='mt-12 text-center max-w-md relative z-10'>
        <div className='inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm mb-4'>
          <ShieldCheck className='w-4 h-4 text-emerald-500' />
          <span className='text-xs text-slate-300 font-medium'>
            In-Memory Security
          </span>
        </div>
        <p className='text-slate-500 text-xs leading-relaxed'>
          Antixavf.uz hech qanday shaxsiy ma'lumotlarni yoki parollarni
          saqlamaydi. <br /> Tekshiruv tugashi bilan barcha ma'lumotlar
          serverdan butunlay o'chiriladi.
        </p>
        
        {/* Maxfiylik siyosatiga havola */}
        <a href="/privacy-policy" className="text-blue-400 hover:text-blue-300 text-xs mt-3 inline-block underline transition-colors">
          Maxfiylik Siyosati (Privacy Policy)
        </a>
      </div>
    </div>
  )
}