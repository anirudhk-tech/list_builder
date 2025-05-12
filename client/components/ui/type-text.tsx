import React, { useEffect, useRef, useState } from "react";

interface TypeTextProps {
  textsToType: string[];
  forwardSpeed?: number; // ms per character when typing forward
  backwardSpeed?: number; // ms per character when deleting
  pause?: number; // ms to pause before starting to delete
}

export const TypeText: React.FC<TypeTextProps> = ({
  textsToType,
  forwardSpeed = 200,
  backwardSpeed = 100,
  pause = 1000,
}) => {
  const [text, setText] = useState("");
  const idxRef = useRef(0);
  const posRef = useRef(0);
  const dirRef = useRef<"forward" | "backward">("forward");

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const tick = () => {
      const current = textsToType[idxRef.current];

      if (dirRef.current === "forward") {
        if (posRef.current <= current.length) {
          setText(current.slice(0, posRef.current));
          posRef.current++;
          timer = setTimeout(tick, forwardSpeed);
        } else {
          dirRef.current = "backward";
          posRef.current = current.length - 1;
          timer = setTimeout(tick, backwardSpeed + pause);
        }
      } else {
        if (posRef.current >= 0) {
          setText(current.slice(0, posRef.current));
          posRef.current--;
          timer = setTimeout(tick, backwardSpeed);
        } else {
          idxRef.current = (idxRef.current + 1) % textsToType.length;
          dirRef.current = "forward";
          posRef.current = 0;
          timer = setTimeout(tick, forwardSpeed);
        }
      }
    };

    timer = setTimeout(tick, forwardSpeed);

    return () => clearTimeout(timer);
  }, [textsToType, forwardSpeed, backwardSpeed, pause]);

  return (
    <span className="text-lg lg:text-xl mb-8 text-gray-300 max-w-xl">
      {text}
      <span className="cursor">|</span>

      <style jsx>{`
        .cursor {
          display: inline-block;
          animation: blink 1s step-end infinite;
        }
        @keyframes blink {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </span>
  );
};
