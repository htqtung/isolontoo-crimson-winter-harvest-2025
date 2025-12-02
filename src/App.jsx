import { useState, useEffect, useRef } from 'react'
import Menu from './components/Menu'
import { translations } from './translations'
import './App.css'

// Generate initial snowflakes
const generateSnowflakes = () => {
  return Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    duration: Math.random() * 8 + 6,
    delay: Math.random() * 8,
    opacity: Math.random(),
    size: Math.random() * 5 + 2,
  }))
}

// Check if menu content should be blurred (before December 24, 2025)
const menuRevealDate = new Date('December 24, 2025 00:00:00').getTime()
const checkIfBlurred = () => Date.now() < menuRevealDate

// Get initial language from localStorage or default to Vietnamese
const getInitialLang = () => localStorage.getItem('lang') || 'vi'

function App() {
  const [countdown, setCountdown] = useState({ days: '00', hours: '00', minutes: '00', seconds: '00' })
  const [snowflakes] = useState(generateSnowflakes)
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuBlurred, setMenuBlurred] = useState(checkIfBlurred)
  const [lang, setLang] = useState(getInitialLang)
  const cursorLightRef = useRef(null)
  const cursorDotRef = useRef(null)

  const t = translations[lang]

  const switchLanguage = (newLang) => {
    setLang(newLang)
    localStorage.setItem('lang', newLang)
  }

  // Countdown timer
  useEffect(() => {
    const targetDate = new Date('December 25, 2025 18:00:00').getTime()
    
    const timer = setInterval(() => {
      const now = Date.now()
      const distance = targetDate - now

      // Check if blur should be removed
      if (now >= menuRevealDate && menuBlurred) {
        setMenuBlurred(false)
      }

      if (distance < 0) {
        clearInterval(timer)
        setCountdown({ days: '00', hours: '00', minutes: '00', seconds: '00', ended: true })
        return
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24))
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)

      setCountdown({
        days: days < 10 ? '0' + days : String(days),
        hours: hours < 10 ? '0' + hours : String(hours),
        minutes: minutes < 10 ? '0' + minutes : String(minutes),
        seconds: seconds < 10 ? '0' + seconds : String(seconds),
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [menuBlurred])

  // Cursor light effect (desktop only)
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (window.innerWidth > 768) {
        if (cursorLightRef.current) {
          cursorLightRef.current.style.left = e.clientX + 'px'
          cursorLightRef.current.style.top = e.clientY + 'px'
        }
        if (cursorDotRef.current) {
          cursorDotRef.current.style.left = e.clientX + 'px'
          cursorDotRef.current.style.top = e.clientY + 'px'
        }
      }
    }

    document.addEventListener('mousemove', handleMouseMove)
    return () => document.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="app">
      {/* Language Toggle */}
      <div className="lang-toggle">
        <button 
          className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
          onClick={() => switchLanguage('en')}
        >
          EN
        </button>
        <button 
          className={`lang-btn ${lang === 'vi' ? 'active' : ''}`}
          onClick={() => switchLanguage('vi')}
        >
          VI
        </button>
      </div>

      {/* Menu Overlay */}
      <Menu isOpen={menuOpen} onClose={() => setMenuOpen(false)} blurred={menuBlurred} lang={lang} />

      {/* Cursor Effects (desktop only) */}
      <div ref={cursorLightRef} className="cursor-light" />
      <div ref={cursorDotRef} className="cursor-dot" />

      {/* Snow Container */}
      <div className="snow-container">
        {snowflakes.map((flake) => (
          <div
            key={flake.id}
            className="snowflake"
            style={{
              left: `${flake.left}vw`,
              animationDuration: `${flake.duration}s`,
              animationDelay: `${flake.delay}s`,
              opacity: flake.opacity,
              width: `${flake.size}px`,
              height: `${flake.size}px`,
            }}
          />
        ))}
      </div>

      {/* Snow Drifts */}
      <div className="snow-drifts">
        <div className="drift drift-3" />
        <div className="drift drift-1" />
        <div className="drift drift-2" />
      </div>

      {/* Logo & Theme */}
      <div className="logo-container">
        <div className="logo-main">Isolontoo</div>
        <div className="logo-theme">{t.theme}</div>
      </div>

      {/* Countdown Timer */}
      <div className="countdown-container">
        {countdown.ended ? (
          <div className="time-val feast-begun">{t.feastBegun}</div>
        ) : (
          <>
            <div className="time-block">
              <span className="time-val">{countdown.days}</span>
              <span className="time-label">{t.days}</span>
            </div>
            <div className="colon">:</div>
            <div className="time-block">
              <span className="time-val">{countdown.hours}</span>
              <span className="time-label">{t.hrs}</span>
            </div>
            <div className="colon">:</div>
            <div className="time-block">
              <span className="time-val">{countdown.minutes}</span>
              <span className="time-label">{t.min}</span>
            </div>
            <div className="colon">:</div>
            <div className="time-block">
              <span className="time-val">{countdown.seconds}</span>
              <span className="time-label">{t.sec}</span>
            </div>
          </>
        )}
      </div>

      <div className="subtext">{t.subtext}</div>
      
      <button onClick={() => setMenuOpen(true)} className="btn-enter">
        {t.openMenu}
      </button>
    </div>
  )
}

export default App
