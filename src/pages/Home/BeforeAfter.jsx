import { useCallback, useEffect, useRef, useState } from "react";
import "./BeforeAfter.css";
import beforeLiving from "../../images/before-living.png";
import afterLiving from "../../images/after-living.png";
import beforeBedroom from "../../images/before-bedroom.png";
import afterBedroom from "../../images/after-bedroom.jpg";
import diningBefore from "../../images/before-dining.png";
import diningAfter from "../../images/after-dining.jpg";

const beforeAfterData = [
  {
    id: 1,
    title: "Living Room Transformation",
    description: "Complete renovation from outdated to modern luxury",
    beforeImage: beforeLiving,
    afterImage: afterLiving,
    service: "Full Interior Design"
  },
  {
    id: 2,
    title: "Dining Room Refresh",
    description: "A warm dining space upgraded with a refined modern layout",
    beforeImage: diningBefore,
    afterImage: diningAfter,
    service: "Dining Room Design"
  },
  {
    id: 3,
    title: "Bedroom Sanctuary",
    description: "Transformed into a peaceful retreat with smart storage",
    beforeImage: beforeBedroom,
    afterImage: afterBedroom,
    service: "Bedroom Design"
  }
];

function BeforeAfter() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef(null);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % beforeAfterData.length);
    setSliderPosition(50);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + beforeAfterData.length) % beforeAfterData.length);
    setSliderPosition(50);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setSliderPosition(50);
  };

  const updateSliderPosition = useCallback((clientX) => {
    if (!sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = (x / rect.width) * 100;

    const clampedPercentage = Math.max(5, Math.min(95, percentage));
    setSliderPosition(clampedPercentage);
  }, []);

  const startDragging = (clientX) => {
    setIsDragging(true);
    updateSliderPosition(clientX);
  };

  const handleMouseDown = (e) => {
    startDragging(e.clientX);
    e.preventDefault();
  };

  const handleTouchStart = (e) => {
    startDragging(e.touches[0].clientX);
    e.preventDefault();
  };

  const handleDividerKeyDown = (e) => {
    if (e.key === "ArrowLeft") {
      setSliderPosition((position) => Math.max(5, position - 5));
    }

    if (e.key === "ArrowRight") {
      setSliderPosition((position) => Math.min(95, position + 5));
    }
  };

  useEffect(() => {
    if (!isDragging) return undefined;

    const stopDragging = () => setIsDragging(false);
    const handleGlobalMouseMove = (e) => updateSliderPosition(e.clientX);
    const handleGlobalTouchMove = (e) => updateSliderPosition(e.touches[0].clientX);

    document.addEventListener("mouseup", stopDragging);
    document.addEventListener("mousemove", handleGlobalMouseMove);
    document.addEventListener("touchend", stopDragging);
    document.addEventListener("touchcancel", stopDragging);
    document.addEventListener("touchmove", handleGlobalTouchMove, { passive: true });

    return () => {
      document.removeEventListener("mouseup", stopDragging);
      document.removeEventListener("mousemove", handleGlobalMouseMove);
      document.removeEventListener("touchend", stopDragging);
      document.removeEventListener("touchcancel", stopDragging);
      document.removeEventListener("touchmove", handleGlobalTouchMove);
    };
  }, [isDragging, updateSliderPosition]);

  const currentProject = beforeAfterData[currentSlide];

  return (
    <section className="before-after-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Innovation Showcase</h2>
          <p className="section-subtitle">Experience the power of innovative design through our transformative projects</p>
        </div>

        <div className="before-after-slider">
          <div className="slider-container">
            <div className="slide">
              <div className="before-after-container" ref={sliderRef}>
                <div className="image-comparison">
                  <img
                    className="comparison-image after-image"
                    src={currentProject.afterImage}
                    alt={`${currentProject.title} after`}
                  />
                  <div
                    className="comparison-image-layer before-image"
                    style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                  >
                    <img
                      className="comparison-image"
                      src={currentProject.beforeImage}
                      alt={`${currentProject.title} before`}
                    />
                  </div>
                  <div className="image-label before-label">Before</div>
                  <div className="image-label after-label">After</div>
                  <div 
                    className="divider" 
                    style={{ left: `${sliderPosition}%` }}
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleTouchStart}
                    onKeyDown={handleDividerKeyDown}
                    role="slider"
                    tabIndex="0"
                    aria-label="Compare before and after"
                    aria-valuemin="5"
                    aria-valuemax="95"
                    aria-valuenow={Math.round(sliderPosition)}
                  >
                    <div className="divider-line"></div>
                    <div className="divider-circle">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M8 5L15 12L8 19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M16 5L9 12L16 19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="project-info">
                <h3 className="project-title">{currentProject.title}</h3>
                <p className="project-description">{currentProject.description}</p>
                <div className="project-service">
                  <span className="service-badge">{currentProject.service}</span>
                </div>
              </div>
            </div>
          </div>

          <button className="slider-nav prev-btn" onClick={prevSlide} aria-label="Previous project">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 5L8 12L15 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button className="slider-nav next-btn" onClick={nextSlide} aria-label="Next project">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="slider-dots">
          {beforeAfterData.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Show project ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default BeforeAfter;
