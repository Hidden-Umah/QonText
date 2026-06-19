import { useEffect, useState } from "react";
import {
  FaGithub,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
} from "react-icons/fa";
import "./About.css";

const sentences = [
  "Bro give up, I am lying don't mind me",
  "I saw your girlfriend with Kweku at the Pent... let me keep quiet errh",
  "I can see you're hungry because the way you are working die33 naa bro",
  "I am planning of starting a podcast, should I?",
  "Chaile low key low key I'm selling Coke... tell one",
  "If coding doesn't work out, we go sell phone cases at Circle",
  "Don't worry bro, even React developers cry sometimes",
  "Your future is loading... 99% stuck like Ghana WiFi",
  "You are one console.log away from greatness",
  "Error 404: Motivation not found, try again tomorrow",
  "Bro even my dreams are asking for funding",
  "Keep going, even broken code eventually ships",
  "Success is near, I just don't know where exactly",
  "You are not lazy, you are in energy-saving mode",
  "Even ChatGPT is tired of your bugs (just joking... maybe)",
  "At this point, success is just a missing semicolon away",
  "You are doing great, just not in production yet",
  "One day you'll laugh at this... or cry again, one of them",
  "Life is simple: build, break, cry, fix, repeat",
  "Bro you're basically one coffee away from greatness",
];

export default function About() {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const current = sentences[index];

    if (charIndex < current.length) {
      const timeout = setTimeout(() => {
        setText((prev) => prev + current[charIndex]);
        setCharIndex(charIndex + 1);
      }, 40);

      return () => clearTimeout(timeout);
    } else {
      const wait = setTimeout(() => {
        setText("");
        setCharIndex(0);
        setIndex((prev) => (prev + 1) % sentences.length);
      }, 1500);

      return () => clearTimeout(wait);
    }
  }, [charIndex, index]);

  return (
    <div className="about">
      {/* Video Background */}
      <video className="video-bg" autoPlay loop muted playsInline>
        <source
          src="https://res.cloudinary.com/dwflucucx/video/upload/v1781891329/From_Klickpin.com-_Discover_Practical_party_appetizer_ideas_for_your_next_inspiration_board_designed_for_people_who_want_results_that_look_intenti_nvtfyu.mp4"
          type="video/mp4"
        />
      </video>

      {/* Overlay */}
      <div className="overlay">
        <div className="hero">
          <h1>FlameCore</h1>

          <p className="typewriter">{text}</p>

          <p className="sub">
            We build tools that turn ideas into structured reality.
          </p>

          <span className="badge">
            Free • Open Source • Built for developers & students
          </span>
        </div>

        <footer className="footer">
          <a href="#"><FaGithub /></a>
          <a href="#"><FaTwitter /></a>
          <a href="#"><FaLinkedin /></a>
          <a href="#"><FaInstagram /></a>
        </footer>
      </div>
    </div>
  );
}