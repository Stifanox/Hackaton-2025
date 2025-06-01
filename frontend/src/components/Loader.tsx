import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

type LoaderCircleProps = {
  onFinish: () => void;
  expandDuration?: number;
  delayAfterExpand?: number;
};

const Loader: React.FC<LoaderCircleProps> = ({
  onFinish,
  expandDuration = 800,
  delayAfterExpand = 600,
}) => {
  const circleRef = useRef<HTMLDivElement | null>(null);
  const [finalSize, setFinalSize] = useState<number>(0);
  const dotRefs = useRef<Array<HTMLDivElement | null>>([]);
  useEffect(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const diagonal = Math.sqrt(w * w + h * h);
    setFinalSize(diagonal * 2);
  }, []);

  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.2 });

    dotRefs.current.forEach((el, i) => {
      if (!el) return;
      tl.to(
        el,
        {
          y: -15,
          duration: 0.3,
          ease: "power1.inOut",
        },
        i * 0.2
      ).to(
        el,
        {
          y: 0,
          duration: 0.3,
          ease: "power1.inOut",
        },
        i * 0.2 + 0.3
      );
    });

    const timeout = setTimeout(() => {
      tl.kill();
      onFinish();
    }, expandDuration);

    return () => {
      tl.kill();
      clearTimeout(timeout);
    };
  }, [onFinish, expandDuration]);
  useEffect(() => {
    if (finalSize === 0 || !circleRef.current) return;

    const tl = gsap.timeline({
      onComplete: () => {
        onFinish();
      },
    });

    tl.to(circleRef.current, {
      width: finalSize,
      height: finalSize,
      duration: expandDuration / 1000,
      ease: "power2.inOut",
    });

    tl.to(
      {},
      {
        duration: delayAfterExpand / 1000,
      }
    );

    return () => {
      tl.kill();
    };
  }, [finalSize, expandDuration, delayAfterExpand, onFinish]);

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "#A3E635",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          zIndex: 1000,
        }}
      >
        <div
          ref={circleRef}
          style={{
            position: "relative",
            width: 0,
            height: 0,
            borderRadius: "50%",
            backgroundColor: "#FFFFFF",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h1
              style={{
                color: "#A3E635",
                fontSize: "2rem",
                fontWeight: 600,
                marginBottom: "24px",
              }}
            >
              Fredi KGB
            </h1>
            <div style={{ display: "flex", gap: 10 }}>
              {[0, 1, 2].map((idx) => (
                <div
                  key={idx}
                  ref={(el) => (dotRefs.current[idx] = el)}
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    backgroundColor: "#A3E635",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Loader;
