import { useState, useEffect, useRef } from "react";

const conversation = [
  { speaker: "Jay", text: "Hey, New Year." },
  { speaker: "Jay", text: "Why do you always need to bring joy, prosperity, and success?" },
  { speaker: "Jay", text: "Why can’t you come alone this time?" },
  { speaker: "New Year", text: "That’s what I’ve been doing all these years, Jay." },
  { speaker: "Jay", text: "Then what is so 'Happy' about you?" },
  { speaker: "New Year", text: "The fact that you’re talking to me right now... that makes me happy." },
  { speaker: "New Year", text: "And beautiful." },
];

export default function NewYearCard() {
  const [phase, setPhase] = useState("intro");
  const [step, setStep] = useState(0);
  const [fade, setFade] = useState(true);
  const [introFade, setIntroFade] = useState(true);
  const [typedText, setTypedText] = useState("");
  const [showCard, setShowCard] = useState(false);
  const [typedBeautiful, setTypedBeautiful] = useState("");
  const [typedHappy, setTypedHappy] = useState('""');
  const [finalText, setFinalText] = useState("");
  const [showReset, setShowReset] = useState(false);
  const [hasReadOnce, setHasReadOnce] = useState(false);
  const [typedYear, setTypedYear] = useState("");

  const audioRef = useRef(null);
  const lastIndex = conversation.length - 1;

  // Initialize Audio
  useEffect(() => {
    audioRef.current = new Audio("/newyear.mp3");
    audioRef.current.preload = "auto";
    audioRef.current.volume = 0.35;
    audioRef.current.loop = true;
  }, []);

  // Intro Typing Logic
  useEffect(() => {
    if (phase !== "intro") return;
    let i = 0;
    const introString = "First Conversation";
    
    const typeNext = () => {
      setTypedText(introString.slice(0, i + 1));
      i++;
      if (i === introString.length) {
        setTimeout(() => {
          setIntroFade(false);
          setTimeout(() => {
            if (hasReadOnce) {
              setTypedText("One more time?");
            }else{
              setTypedText("Click Me!");
            }
            setIntroFade(true);
          }, 800);
        }, 1000);
        return;
      }
      const delay = introString[i - 1] === " " ? 125 : 250;
      setTimeout(typeNext, delay);
    };
    typeNext();
  }, [phase]);

  // Auto-advance Conversation
  useEffect(() => {
    if (phase !== "conversation" || step === lastIndex) return;
    const timer = setTimeout(() => nextLine(), 4000);
    return () => clearTimeout(timer);
  }, [step, phase]);

  // Card Appearance Logic
  useEffect(() => {
    if (phase === "conversation") {
      setShowCard(false);
      setTimeout(() => setShowCard(true), 500);
    }
  }, [phase]);

  const nextLine = () => {
    setFade(false);
    setTimeout(() => {
      if (step < lastIndex) {
        setStep(step + 1);
        setFade(true);
      }
    }, 700);
  };

  const playAudio = () => {
    if (phase !== 'intro' || (typedText !== 'Click Me!' && typedText !== 'One more time?')) return;
    
    // START AUDIO HERE
    audioRef.current.play().catch(err => console.log("Audio play blocked:", err));

    setIntroFade(false);
    setTimeout(() => {
      setPhase("conversation");
      setStep(0);
      setFade(true);
    }, 800);
  };

  const handleClick = () => {
    if (phase === "intro") {
      playAudio();
    } else if (phase === "conversation" && step < lastIndex) {
      nextLine();
    }
  };

  // Logic for typing "Beautiful" in the last line
  useEffect(() => {
    if (step !== lastIndex) return;
    const word = "beautiful!!";
    setTypedBeautiful("");
    let i = 0;
    const typeNext = () => {
      setTypedBeautiful(word.slice(0, i + 1));
      i++;
      if (i < word.length) {
        setTimeout(typeNext, i > word.length - 2 ? 400 : 300);
      } else {
        setTimeout(() => setPhase("final"), 1500);
      }
    };
    setTimeout(typeNext, 500);
  }, [step]);

  // Final Phase: "Happy New Year" and Card Fade Out
  useEffect(() => {
    if (phase !== "final") return;
    const happy = "Happy";
    const newYear = " New Year";
    const year2026 = "2026";
    
    setTypedHappy('""');
    setFinalText("");
    setTypedYear(""); // Reset year
    setShowReset(false);

    let i = 0;
    let j = 0;
    let k = 0;

    const typeHappy = () => {
      if (i < happy.length) {
        i++;
        setTypedHappy(`"${happy.slice(0, i)}"`);
        setTimeout(typeHappy, 300);
      } else {
        typeNewYear();
      }
    };

    const typeNewYear = () => {
      if (j < newYear.length) {
        j++;
        setFinalText(newYear.slice(0, j));
        setTimeout(typeNewYear, 200);
      } else {
        // WAIT 0.5 SECONDS THEN TYPE 2026
        setTimeout(typeYear, 500);
      }
    };

    const typeYear = () => {
      if (k < year2026.length) {
        k++;
        setTypedYear(year2026.slice(0, k));
        setTimeout(typeYear, 300);
      } else {
        setTimeout(() => {
          setShowCard(false); 
          setTimeout(() => setShowReset(true), 1000);
        }, 1200);
      }
    };

    setTimeout(typeHappy, 800);
  }, [phase]);

  const handleReset = (e) => {
    e.stopPropagation();
    setShowReset(false);
    setHasReadOnce(true);
    setPhase("intro");
    setStep(0);
    setIntroFade(true);
  };

  return (
    <div
      onClick={handleClick}
      className="min-h-screen flex items-center justify-center p-4 overflow-hidden relative"
      style={{
        backgroundImage: "url('/bg2.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* 1. INTRO PHASE */}
      {phase === 'intro' && (
        <div className="relative -translate-y-12 flex items-center justify-center">
          <div className={`font-greeting text-4xl text-white transition-opacity duration-1000 ${introFade ? "opacity-100" : "opacity-0"}`}>
            {typedText}
          </div>
        </div>
      )}

      {/* 2. CONVERSATION & FINAL PHASE */}
      {(phase === "conversation" || phase === "final") && (
        <div className="relative max-w-md w-full h-64 -translate-y-12 flex items-center justify-center">
          
          {/* Card Background */}
          <div className={`absolute inset-0 rounded-2xl bg-black/30 transition-opacity duration-1000 ${showCard ? "opacity-100" : "opacity-0"}`} />

          {/* Text Container */}
          <div className="relative z-10 w-full px-6 flex flex-col items-center justify-center">
            
            {phase === "conversation" && (
              <div className="relative w-full h-32 flex items-center justify-center">
                {conversation.map((line, i) => (
                  <div
                    key={i}
                    className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-700 ${i === step && fade ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                  >
                    <p className="text-xs uppercase font-labels text-white/50 tracking-[0.2em] mb-3">{line.speaker}</p>
                    <p className="text-2xl md:text-3xl font-mordern text-white/90 leading-tight text-center">
                      {i === lastIndex ? (
                        <>And <span className="font-greeting text-black text-4xl inline-block">{typedBeautiful}</span></>
                      ) : (
                        line.text
                      )}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {phase === "final" && (
              <div className="flex flex-col items-center justify-center">
                <p className="text-4xl md:text-6xl font-greeting text-center">
                  <span className="text-white">{typedHappy}</span>
                  <span className="text-black">{finalText}</span>
                </p>
                <p className="text-4xl md:text-6xl font-greeting text-black mt-4 min-h-[1.2em]">
                  {typedYear}
                </p>
                
                <button
                  onClick={handleReset}
                  className={`absolute -bottom-20 px-8 py-2 rounded-full bg-white/10 border border-white/20 text-white transition-all duration-1000 ease-in-out font-mordern text-xs tracking-[0.3em] uppercase hover:bg-white/20 active:scale-95 ${showReset ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
                >
                  Read Again
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}