"use client";

import { useEffect, useRef } from "react";

const FRAME_COUNT = 240;
const frameUrl = (index: number) => `/images/hero-frames/frame-${String(index + 1).padStart(4, "0")}.webp`;
const REVEAL_START = 0.78;
const SNAP_EPSILON = 0.0008;
// However fast someone scrolls, the sequence can never play faster than this
// constant speed — like holding the down-arrow key: steady velocity, no
// acceleration ramp, no ease-out, just even continuous motion that stops
// cleanly the instant it reaches the target.
const MIN_PLAYTHROUGH_SECONDS = 3.5;
const MAX_PROGRESS_PER_SECOND = 1 / MIN_PLAYTHROUGH_SECONDS;

function drawCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, canvas: HTMLCanvasElement) {
  const canvasW = canvas.width;
  const canvasH = canvas.height;
  if (!canvasW || !canvasH || !img.naturalWidth) return;
  const imgRatio = img.naturalWidth / img.naturalHeight;
  const canvasRatio = canvasW / canvasH;
  let drawW: number, drawH: number, offsetX: number, offsetY: number;
  if (imgRatio > canvasRatio) {
    drawH = canvasH;
    drawW = drawH * imgRatio;
    offsetX = (canvasW - drawW) / 2;
    offsetY = 0;
  } else {
    drawW = canvasW;
    drawH = drawW / imgRatio;
    offsetX = 0;
    offsetY = (canvasH - drawH) / 2;
  }
  ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
}

export default function ScrollHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const content = contentRef.current;
    const scrim = scrimRef.current;
    const hint = hintRef.current;
    if (!section || !canvas || !content || !scrim) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Setting canvas.width/height resets 2D context state, so smoothing must
    // be reapplied after every resize, not just once at setup.
    const applySmoothing = () => {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
    };

    const progressBar = section.querySelector<HTMLElement>(".scroll-hero-progress-fill");
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      section.classList.add("is-static");
      const img = new Image();
      img.decoding = "async";
      img.src = frameUrl(FRAME_COUNT - 1);
      const resizeStatic = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const rect = canvas.getBoundingClientRect();
        canvas.width = Math.round(rect.width * dpr);
        canvas.height = Math.round(rect.height * dpr);
        applySmoothing();
        drawCover(ctx, img, canvas);
      };
      img.onload = resizeStatic;
      content.style.opacity = "1";
      content.style.transform = "none";
      scrim.style.opacity = ".75";
      if (hint) hint.style.display = "none";
      const progressTrack = section.querySelector<HTMLElement>(".scroll-hero-progress");
      if (progressTrack) progressTrack.style.display = "none";
      window.addEventListener("resize", resizeStatic);
      return () => window.removeEventListener("resize", resizeStatic);
    }

    const images: HTMLImageElement[] = [];
    const loaded = new Array(FRAME_COUNT).fill(false);
    let currentFrame = 0;

    const drawFrame = (index: number) => {
      let idx = index;
      while (idx > 0 && !loaded[idx]) idx--;
      if (!loaded[idx]) return;
      drawCover(ctx, images[idx], canvas);
    };

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.decoding = "async";
      img.src = frameUrl(i);
      img.onload = () => {
        loaded[i] = true;
        if (i === currentFrame) drawFrame(currentFrame);
      };
      images.push(img);
    }

    const computeTargetProgress = () => {
      const rect = section.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      return scrollable > 0 ? Math.min(1, Math.max(0, -rect.top / scrollable)) : 0;
    };

    // The displayed progress chases the scroll-derived target at a capped
    // rate, so however fast someone scrolls, playback never speeds up past
    // MAX_PROGRESS_PER_SECOND — it just falls behind and catches up smoothly.
    let targetProgress = 0;
    let displayProgress = 0;
    let rafId = 0;
    let looping = false;
    let lastTime = 0;

    const applyProgress = (progress: number) => {
      const frameIndex = Math.round(progress * (FRAME_COUNT - 1));
      if (frameIndex !== currentFrame) {
        currentFrame = frameIndex;
        drawFrame(frameIndex);
      }

      const revealProgress = Math.min(1, Math.max(0, (progress - REVEAL_START) / (1 - REVEAL_START)));
      content.style.opacity = String(revealProgress);
      content.style.transform = `translateY(${(1 - revealProgress) * 26}px)`;
      content.style.pointerEvents = revealProgress > 0.4 ? "auto" : "none";
      scrim.style.opacity = String(revealProgress * 0.82);
      if (hint) hint.style.opacity = String(1 - Math.min(1, progress / 0.12));
      if (progressBar) progressBar.style.width = `${progress * 100}%`;
    };

    const loop = (now: number) => {
      const dt = lastTime ? Math.min((now - lastTime) / 1000, 0.1) : 1 / 60;
      lastTime = now;

      const diff = targetProgress - displayProgress;
      // Constant speed toward the target, capped, never eased — matches the
      // feel of holding the down-arrow key rather than a spring settling.
      const maxStep = MAX_PROGRESS_PER_SECOND * dt;
      const stepMagnitude = Math.min(maxStep, Math.abs(diff));
      displayProgress += Math.sign(diff) * stepMagnitude;

      if (Math.abs(targetProgress - displayProgress) < SNAP_EPSILON) {
        displayProgress = targetProgress;
        applyProgress(displayProgress);
        looping = false;
        lastTime = 0;
        return;
      }
      applyProgress(displayProgress);
      rafId = requestAnimationFrame(loop);
    };

    const ensureLoop = () => {
      if (!looping) {
        looping = true;
        lastTime = 0;
        rafId = requestAnimationFrame(loop);
      }
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      applySmoothing();
      currentFrame = -1; // canvas bitmap was cleared by the resize, force a redraw
      applyProgress(displayProgress);
    };

    const onScroll = () => {
      targetProgress = computeTargetProgress();
      ensureLoop();
    };

    targetProgress = computeTargetProgress();
    displayProgress = targetProgress;
    resize();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section className="scroll-hero" id="home" ref={sectionRef}>
      <div className="scroll-hero-sticky">
        <canvas ref={canvasRef} className="scroll-hero-canvas" aria-hidden="true" />
        <div className="scroll-hero-scrim" ref={scrimRef} />
        <div className="scroll-hero-hint" ref={hintRef}>
          <span>Scroll to explore</span>
          <i className="bi bi-arrow-down"></i>
        </div>
        <div className="scroll-hero-progress" aria-hidden="true">
          <div className="scroll-hero-progress-fill" />
        </div>
        <div className="container position-relative">
          <div className="scroll-hero-content" ref={contentRef}>
            <p className="eyebrow-line">
              IDEAS <i className="bi bi-dot"></i> TECHNOLOGY <i className="bi bi-dot"></i> REAL IMPACT
            </p>
            <h1>
              Digital Solutions
              <br />
              <em>for a Digital Future</em>
            </h1>
            <p className="hero-lead">
              We design and develop modern websites, software applications and digital experiences that
              help businesses grow, automate and move with confidence.
            </p>
            <div className="hero-actions d-flex flex-column flex-sm-row gap-3">
              <a className="btn-gold" href="#contact">
                Start Your Project <i className="bi bi-arrow-right"></i>
              </a>
              <a className="btn-outline-gold" href="#portfolio">
                Our Services
              </a>
            </div>
            <div className="hero-stats">
              <div>
                <strong>Client-Focused</strong>
                <small>Direct communication, always</small>
              </div>
              <div>
                <strong>Modern &amp; Scalable</strong>
                <small>Built with the right tools</small>
              </div>
              <div>
                <strong>Sri Lanka &amp; Worldwide</strong>
                <small>Wherever your business is</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
