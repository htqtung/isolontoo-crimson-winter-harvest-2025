import { useState, useEffect } from 'react'
import { translations } from '../translations'
import './Menu.css'

// Guest Name Input Modal
function GuestNameModal({ isOpen, onSubmit, t }) {
  const [inputValue, setInputValue] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (inputValue.trim()) {
      onSubmit(inputValue.trim())
    }
  }

  if (!isOpen) return null

  return (
    <div className="guest-modal-overlay">
      <div className="guest-modal">
        <div className="guest-modal-decoration">✦</div>
        <h2 className="guest-modal-title">{t.welcome}</h2>
        <p className="guest-modal-subtitle">{t.enterNamePrompt}</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="guest-modal-input"
            placeholder={t.yourName}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            autoFocus
          />
          <button type="submit" className="guest-modal-btn" disabled={!inputValue.trim()}>
            {t.enter}
          </button>
        </form>
      </div>
    </div>
  )
}

// Page content for mobile slides
const pages = [
  'cover',      // 0: Cover
  'tradition',  // 1: The Tradition (leaf1 back)
  'journey',    // 2: The Journey (leaf2 front)
  'menu1',      // 3: Act One menu (leaf2 back)
  'menu2',      // 4: Act Two menu (leaf3 front)
  'aboutName',  // 5: About Us - The Name (leaf3 back)
  'aboutTeam',  // 6: About Us - The Team
  'mission',    // 7: Our Mission (leaf4 front)
]

function Menu({ isOpen, onClose, blurred = false, lang = 'vi' }) {
  const [guestName, setGuestName] = useState('')
  const [flippedLeaves, setFlippedLeaves] = useState([false, false, false, false, false])
  const [isShifted, setIsShifted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [mobilePageIndex, setMobilePageIndex] = useState(0)
  const [showNameModal, setShowNameModal] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  const t = translations[lang]

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (isOpen) {
      const name = localStorage.getItem('guestName')
      if (!name) {
        setShowNameModal(true)
      } else {
        setGuestName(name)
      }
    }
  }, [isOpen])

  const handleGuestNameSubmit = (name) => {
    localStorage.setItem('guestName', name)
    setGuestName(name)
    setShowNameModal(false)
  }

  // Reset state when menu closes
  useEffect(() => {
    if (!isOpen) {
      setFlippedLeaves([false, false, false, false, false])
      setIsShifted(false)
      setMobilePageIndex(0)
      setIsClosing(false)
    }
  }, [isOpen])

  // Handle close with animation
  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onClose()
    }, 400) // Match the animation duration
  }

  // Mobile navigation with page flip
  const nextPage = () => {
    if (mobilePageIndex < pages.length - 1) {
      setMobilePageIndex(mobilePageIndex + 1)
    }
  }
  
  const prevPage = () => {
    if (mobilePageIndex > 0) {
      setMobilePageIndex(mobilePageIndex - 1)
    }
  }

  // Desktop book navigation functions
  const flipToStory = () => {
    if (isMobile) {
      setMobilePageIndex(1)
    } else {
      setIsShifted(true)
      setFlippedLeaves([true, false, false, false])
    }
  }

  const flipToMenu = () => {
    if (isMobile) {
      setMobilePageIndex(3)
    } else {
      setFlippedLeaves([true, true, false, false])
    }
  }

  // Desktop book spreads:
  // Spread 1 (flip L3): Name (L3 back) + Team (L4 front)
  // Spread 2 (flip L4): Mission (L4 back) + Thank You (L5 front)
  
  const flipToAbout = () => {
    if (isMobile) {
      setMobilePageIndex(5)
    } else {
      // Shows Name + Team spread
      setFlippedLeaves([true, true, true, false, false])
    }
  }

  const flipToMission = () => {
    if (isMobile) {
      setMobilePageIndex(7)
    } else {
      // Shows Mission + Thank You spread (flip L4, NOT L5)
      setFlippedLeaves([true, true, true, true, false])
    }
  }

  const flipBackToStory = () => {
    if (isMobile) {
      setMobilePageIndex(2)
    } else {
      setFlippedLeaves([true, false, false, false, false])
    }
  }

  const flipBackToMenu = () => {
    if (isMobile) {
      setMobilePageIndex(4)
    } else {
      setFlippedLeaves([true, true, false, false, false])
    }
  }

  const flipBackToAbout = () => {
    if (isMobile) {
      setMobilePageIndex(5)
    } else {
      // Back to Name + Team spread
      setFlippedLeaves([true, true, true, false, false])
    }
  }

  const closeBook = () => {
    if (isMobile) {
      setMobilePageIndex(0)
    } else {
      setFlippedLeaves([false, false, false, false, false])
      setIsShifted(false)
    }
  }

  if (!isOpen) return null

  // Mobile slide view
  if (isMobile) {
    return (
      <div className={`menu-overlay ${isClosing ? 'closing' : ''}`}>
        <button className="menu-close-btn mobile-close" onClick={handleClose}>
          <span>⌂</span>
        </button>
        <GuestNameModal isOpen={showNameModal} onSubmit={handleGuestNameSubmit} t={t} />

        <div className="mobile-book-container">
          <div className="mobile-book">
            {/* Page 0: Cover */}
            <div className={`mobile-page-wrapper ${mobilePageIndex > 0 ? 'flipped' : ''}`} style={{ zIndex: 8 - 0 }}>
              <div className="mobile-page cover-page">
                <div className="est-badge">Est. 2019</div>
                <div className="cover-content">
                  <div className="cover-line"></div>
                  <h1 className="cover-title">Isolontoo</h1>
                  <p className="cover-subtitle">{t.christmasMenu}</p>
                  <div className="cover-line"></div>
                </div>
                <div className="guest-section">
                  <p className="guest-label">{t.preparedFor}</p>
                  <p className="guest-name">{guestName}</p>
                  <button onClick={nextPage} className="btn-luxury">{t.openMenu}</button>
                </div>
              </div>
            </div>

            {/* Page 1: The Tradition */}
            <div className={`mobile-page-wrapper ${mobilePageIndex > 1 ? 'flipped' : ''}`} style={{ zIndex: 8 - 1 }}>
              <div className="mobile-page story-page">
                <div className="image-container">
                  <img src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80" alt="Kitchen" />
                </div>
                <h2 className="page-title">{t.theTradition}</h2>
                <div className="page-divider"></div>
                <div className="page-content">
                  <p className="intro-text">{t.traditionIntro}</p>
                  <p className="body-text">{t.traditionBody}</p>
                </div>
                <div className="mobile-nav">
                  <button onClick={prevPage} className="nav-btn">{t.closeCover}</button>
                  <button onClick={nextPage} className="nav-btn">{t.toJourney}</button>
                </div>
              </div>
            </div>

            {/* Page 2: The Journey */}
            <div className={`mobile-page-wrapper ${mobilePageIndex > 2 ? 'flipped' : ''}`} style={{ zIndex: 8 - 2 }}>
              <div className="mobile-page story-page">
                <div className="image-container">
                  <img src="https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=800&q=80" alt="Spices" />
                </div>
                <h2 className="page-title">{t.theJourney}</h2>
                <div className="page-divider"></div>
                <div className="page-content">
                  <p className="intro-text">{t.journeyIntro}</p>
                  <p className="body-text" dangerouslySetInnerHTML={{ __html: t.journeyBody }}></p>
                </div>
                <div className="mobile-nav">
                  <button onClick={prevPage} className="nav-btn">{t.backToTradition}</button>
                  <button onClick={nextPage} className="nav-btn">{t.viewMenuArrow}</button>
                </div>
              </div>
            </div>

            {/* Page 3: Act One Menu */}
            <div className={`mobile-page-wrapper ${mobilePageIndex > 3 ? 'flipped' : ''}`} style={{ zIndex: 8 - 3 }}>
              <div className={`mobile-page menu-page ${blurred ? 'content-blurred' : ''}`} data-blur-text={t.menuRevealDate}>
                <div className="act-label">{t.actOne}</div>
                
                <div className="course-item">
                  <span className="course-number">{t.courseI}</span>
                  <h3 className="dish-title">{t.dish1Title}</h3>
                  <p className="dish-desc">{t.dish1Desc}</p>
                </div>
                
                <div className="course-item">
                  <span className="course-number">{t.courseII}</span>
                  <h3 className="dish-title">{t.dish2Title}</h3>
                  <p className="dish-desc">{t.dish2Desc}</p>
                </div>

                <div className="course-item">
                  <span className="course-number">{t.courseIII}</span>
                  <h3 className="dish-title">{t.dish3Title}</h3>
                  <p className="dish-desc">{t.dish3Desc}</p>
                </div>

                <div className="mobile-nav">
                  <button onClick={prevPage} className="nav-btn">{t.backToJourney}</button>
                  <button onClick={nextPage} className="nav-btn">{t.toActTwo}</button>
                </div>
              </div>
            </div>

            {/* Page 4: Act Two Menu */}
            <div className={`mobile-page-wrapper ${mobilePageIndex > 4 ? 'flipped' : ''}`} style={{ zIndex: 8 - 4 }}>
              <div className={`mobile-page menu-page ${blurred ? 'content-blurred' : ''}`} data-blur-text={t.menuRevealDate}>
                <div className="act-label">{t.actTwo}</div>
                
                <div className="course-item">
                  <span className="course-number">{t.courseIV}</span>
                  <h3 className="dish-title">{t.dish4Title}</h3>
                  <p className="dish-desc">{t.dish4Desc}</p>
                </div>
                
                <div className="course-item">
                  <span className="course-number">{t.courseV}</span>
                  <h3 className="dish-title">{t.dish5Title}</h3>
                  <p className="dish-desc">{t.dish5Desc}</p>
                </div>
                
                <div className="course-item">
                  <span className="course-number">{t.courseVI}</span>
                  <h3 className="dish-title">{t.dish6Title}</h3>
                  <p className="dish-desc">{t.dish6Desc}</p>
                </div>

                <div className="mobile-nav">
                  <button onClick={prevPage} className="nav-btn">{t.backToActOne}</button>
                  <button onClick={nextPage} className="nav-btn">{t.about}</button>
                </div>
              </div>
            </div>

            {/* Page 5: About Us - The Name */}
            <div className={`mobile-page-wrapper ${mobilePageIndex > 5 ? 'flipped' : ''}`} style={{ zIndex: 8 - 5 }}>
              <div className="mobile-page menu-page">
                <h2 className="page-title">{t.aboutUsTitle}</h2>
                <h3 className="about-us-subtitle">{t.aboutUsSubtitle}</h3>
                <div className="page-divider"></div>
                <div className="page-content about-us-content">
                  <p className="intro-text">{t.aboutUsHeading1}</p>
                  <p className="body-text">{t.aboutUsPara1}</p>
                </div>
                <div className="mobile-nav">
                  <button onClick={prevPage} className="nav-btn">{t.backToMenu}</button>
                  <button onClick={nextPage} className="nav-btn">{t.toTeam}</button>
                </div>
              </div>
            </div>

            {/* Page 6: About Us - The Team */}
            <div className={`mobile-page-wrapper ${mobilePageIndex > 6 ? 'flipped' : ''}`} style={{ zIndex: 8 - 6 }}>
              <div className="mobile-page menu-page">
                <h2 className="page-title">{t.aboutUsHeading2}</h2>
                <div className="page-divider"></div>
                <div className="page-content about-us-content">
                  <p className="body-text">{t.aboutUsPara2}</p>
                </div>
                <div className="mobile-nav">
                  <button onClick={prevPage} className="nav-btn">{t.backToAboutUs}</button>
                  <button onClick={nextPage} className="nav-btn">{t.continueToMission}</button>
                </div>
              </div>
            </div>

            {/* Page 7: Our Mission */}
            <div className={`mobile-page-wrapper ${mobilePageIndex > 7 ? 'flipped' : ''}`} style={{ zIndex: 8 - 7 }}>
              <div className="mobile-page menu-page">
                <h2 className="page-title">{t.aboutUsHeading3}</h2>
                <div className="page-divider"></div>
                <div className="page-content about-us-content">
                  <p className="body-text">{t.aboutUsPara3}</p>
                  <p className="body-text closing-message">{t.closingMessage}</p>
                </div>
                <div className="mobile-nav">
                  <button onClick={prevPage} className="nav-btn">{t.backToTeam}</button>
                  <button onClick={() => setMobilePageIndex(0)} className="nav-btn">{t.startOver}</button>
                </div>
              </div>
            </div>
          </div>

          {/* Page indicators */}
          <div className="page-indicators">
            {pages.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === mobilePageIndex ? 'active' : ''}`}
                onClick={() => setMobilePageIndex(index)}
                aria-label={`Go to page ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Desktop 3D book view
  return (
    <div className={`menu-overlay ${isClosing ? 'closing' : ''}`}>
      <button className="menu-close-btn" onClick={handleClose}>
        <span>×</span>
      </button>

      <GuestNameModal isOpen={showNameModal} onSubmit={handleGuestNameSubmit} t={t} />

      <div className="scene">
        <div className={`book ${isShifted ? 'shifted' : ''}`}>
          
          {/* LEAF 1: Cover / Intro 1 */}
          <div className={`leaf ${flippedLeaves[0] ? 'flipped' : ''}`} id="leaf-1">
            <div className="face front cover-page">
              <div className="est-badge">Est. 2019</div>
              <div className="cover-content">
                <div className="cover-line"></div>
                <h1 className="cover-title">Isolontoo</h1>
                <p className="cover-subtitle">{t.christmasMenu}</p>
                <div className="cover-line"></div>
              </div>
              <div className="guest-section">
                <p className="guest-label">{t.preparedFor}</p>
                <p className="guest-name">{guestName}</p>
                <button onClick={flipToStory} className="btn-luxury">{t.openMenu}</button>
              </div>
            </div>
            <div className="face back story-page">
              <div className="image-container">
                <img src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80" alt="Kitchen" />
              </div>
              <h2 className="page-title">{t.theTradition}</h2>
              <div className="page-divider"></div>
              <div className="page-content">
                <p className="intro-text">{t.traditionIntro}</p>
                <p className="body-text">{t.traditionBody}</p>
              </div>
              <div className="nav-back" onClick={closeBook}>{t.closeCover}</div>
            </div>
          </div>

          {/* LEAF 2: Intro 2 / Menu 1 */}
          <div className={`leaf ${flippedLeaves[1] ? 'flipped' : ''}`} id="leaf-2">
            <div className="face front story-page with-border">
              <div className="image-container">
                <img src="https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=800&q=80" alt="Spices" />
              </div>
              <h2 className="page-title">{t.theJourney}</h2>
              <div className="page-divider"></div>
              <div className="page-content">
                <p className="intro-text">{t.journeyIntro}</p>
                <p className="body-text" dangerouslySetInnerHTML={{ __html: t.journeyBody }}></p>
              </div>
              <div className="page-footer">
                <button onClick={flipToMenu} className="btn-luxury">{t.viewMenu}</button>
              </div>
            </div>
            
            {/* Menu Page Left */}
            <div className={`face back menu-page ${blurred ? 'content-blurred' : ''}`} data-blur-text={t.menuRevealDate}>
              <div className="act-label">{t.actOne}</div>
              
              <div className="course-item">
                <span className="course-number">{t.courseI}</span>
                <h3 className="dish-title">{t.dish1Title}</h3>
                <p className="dish-desc">{t.dish1Desc}</p>
              </div>
              
              <div className="course-item">
                <span className="course-number">{t.courseII}</span>
                <h3 className="dish-title">{t.dish2Title}</h3>
                <p className="dish-desc">{t.dish2Desc}</p>
              </div>

              <div className="course-item">
                <span className="course-number">{t.courseIII}</span>
                <h3 className="dish-title">{t.dish3Title}</h3>
                <p className="dish-desc">{t.dish3Desc}</p>
              </div>

              <div className="nav-back" onClick={flipBackToStory}>{t.backToStory}</div>
            </div>
          </div>

          {/* LEAF 3: Menu 2 / About Us - The Name */}
          <div className={`leaf ${flippedLeaves[2] ? 'flipped' : ''}`} id="leaf-3">
            <div className={`face front menu-page with-border ${blurred ? 'content-blurred' : ''}`} data-blur-text={t.menuRevealDate}>
              <div className="act-label">{t.actTwo}</div>
              
              <div className="course-item">
                <span className="course-number">{t.courseIV}</span>
                <h3 className="dish-title">{t.dish4Title}</h3>
                <p className="dish-desc">{t.dish4Desc}</p>
              </div>
              
              <div className="course-item">
                <span className="course-number">{t.courseV}</span>
                <h3 className="dish-title">{t.dish5Title}</h3>
                <p className="dish-desc">{t.dish5Desc}</p>
              </div>
              
              <div className="course-item">
                <span className="course-number">{t.courseVI}</span>
                <h3 className="dish-title">{t.dish6Title}</h3>
                <p className="dish-desc">{t.dish6Desc}</p>
              </div>

              <div className="page-footer">
                <button onClick={flipToAbout} className="btn-luxury">{t.aboutUsTitle} →</button>
              </div>
            </div>
            
            {/* Leaf 3 Back: About Us - The Name (paired with Team on opposite page) */}
            <div className="face back menu-page">
              <h2 className="page-title">{t.aboutUsTitle}</h2>
              <h3 className="about-us-subtitle">{t.aboutUsSubtitle}</h3>
              <div className="page-divider"></div>
              <div className="page-content about-us-content">
                <h4 className="about-us-heading">{t.aboutUsHeading1}</h4>
                <p className="body-text">{t.aboutUsPara1}</p>
              </div>
              <div className="nav-back" onClick={flipBackToMenu}>{t.viewMenuBack}</div>
            </div>
          </div>

          {/* LEAF 4: About Us - The Team / About Us - Our Mission */}
          <div className={`leaf ${flippedLeaves[3] ? 'flipped' : ''}`} id="leaf-4">
            {/* Leaf 4 Front: The Team (visible with Name on opposite page) */}
            <div className="face front menu-page with-border">
              <h2 className="page-title">{t.aboutUsHeading2}</h2>
              <div className="page-divider"></div>
              <div className="page-content about-us-content">
                <p className="body-text">{t.aboutUsPara2}</p>
              </div>
              <div className="page-footer">
                <button onClick={flipToMission} className="btn-luxury">{t.continueToMission}</button>
              </div>
            </div>
            
            {/* Leaf 4 Back: Our Mission (paired with Thank You on opposite page) */}
            <div className="face back menu-page">
              <h2 className="page-title">{t.aboutUsHeading3}</h2>
              <div className="page-divider"></div>
              <div className="page-content about-us-content">
                <p className="body-text">{t.aboutUsPara3}</p>
              </div>
              <div className="nav-back" onClick={flipBackToAbout}>{t.backToAboutUs}</div>
            </div>
          </div>

          {/* LEAF 5: Thank You Page / End */}
          <div className={`leaf ${flippedLeaves[4] ? 'flipped' : ''}`} id="leaf-5">
            {/* Leaf 5 Front: Thank You (visible with Mission on opposite page) */}
            <div className="face front menu-page with-border empty-page">
              <div className="empty-page-content">
                <div className="empty-page-decoration">✦</div>
                <p className="empty-page-text">{t.closingMessage}</p>
              </div>
              <div className="page-footer">
                <button onClick={closeBook} className="btn-luxury">{t.closeBook}</button>
              </div>
            </div>
            <div className="face back end-page"></div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Menu
