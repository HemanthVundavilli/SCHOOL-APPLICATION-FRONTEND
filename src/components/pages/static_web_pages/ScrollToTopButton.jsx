import React, { useState, useEffect } from "react";

const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    setVisible(window.pageYOffset > 300);
  };

  const scrollToTop = () => {
    const duration = 600;
    const start = window.scrollY;
    const startTime = performance.now();
  
    const animateScroll = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      window.scrollTo(0, start * (1 - ease));
  
      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };
  
    requestAnimationFrame(animateScroll);
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    visible && (
      <button
        onClick={scrollToTop}
        className="btn btn-primary rounded-circle shadow"
        style={{
          position: "fixed",
          bottom: "30px",
          right: "30px",
          zIndex: 1000,
          width: "50px",
          height: "50px",
        }}
        aria-label="Scroll to top"
      >
        ↑
      </button>
    )
  );
};

export default ScrollToTopButton;