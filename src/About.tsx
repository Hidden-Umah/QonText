import { FaLongArrowAltLeft, FaInfoCircle, FaMoon, FaSun } from "react-icons/fa"

interface AboutProps {
  onBack: () => void
  theme: "light" | "dark"
  toggleTheme: () => void
}

export default function About({ onBack, theme, toggleTheme }: AboutProps) {
  return (
    <div className="aboutPage">
      <div className="header">
        <button
          className="backButton"
          type="button"
          onClick={onBack}
        >
          <FaLongArrowAltLeft />
          Back
        </button>
        <h1>About</h1>
        <div className="headerActions">
          <button
            className="aboutIcon"
            type="button"
            aria-label="About page"
          >
            <FaInfoCircle />
          </button>
          <button
            className="theme"
            type="button"
            aria-label="Toggle theme"
            onClick={toggleTheme}
          >
            {theme === "dark" ? <FaSun /> : <FaMoon />}
          </button>
        </div>
      </div>
      <main className="aboutBody">
        {/* Empty for now */}
      </main>
    </div>
  )
}
