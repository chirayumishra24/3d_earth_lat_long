'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { TopBar } from '@/components/ui/TopBar';
import { MasterSidebarCard } from '@/components/ui/MasterSidebarCard';
import { BottomControlPills } from '@/components/ui/BottomControlPills';
import { JumpCoordinateModal } from '@/components/ui/JumpCoordinateModal';
import { SuccessModal } from '@/components/ui/SuccessModal';
import { HelpModal } from '@/components/ui/HelpModal';
import { WelcomeScreen } from '@/components/ui/WelcomeScreen';
import { GuidedTour } from '@/components/ui/GuidedTour';
import { VisualChapterGuideModal } from '@/components/ui/VisualChapterGuideModal';
import { HemisphereMode } from '@/components/scene/HemispheresOverlay';
import { CHALLENGES, Challenge } from '@/lib/challenges';
import { calculateFeedback, FeedbackResult } from '@/lib/feedback';
import { soundManager } from '@/lib/audio';

// Dynamic import of 3D Canvas to avoid SSR issues with Three.js WebGL
const GlobeCanvas = dynamic(
  () => import('@/components/scene/GlobeCanvas').then((mod) => mod.GlobeCanvas),
  { ssr: false }
);

export default function Home() {
  // Activity Mode
  const [mode, setMode] = useState<'explore' | 'challenge'>('explore');

  // Welcome Screen & Guided Tour states
  const [isWelcomeOpen, setIsWelcomeOpen] = useState<boolean>(true);
  const [isTourOpen, setIsTourOpen] = useState<boolean>(false);
  const [isVisualGuideOpen, setIsVisualGuideOpen] = useState<boolean>(false);

  // Marker Lat/Lon state (Default at New Delhi ~28.61° N, 77.23° E)
  const [markerLat, setMarkerLat] = useState<number>(28.61);
  const [markerLon, setMarkerLon] = useState<number>(77.23);

  // Layer & Graticule Toggles
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [showEquator, setShowEquator] = useState<boolean>(true);
  const [showPrimeMeridian, setShowPrimeMeridian] = useState<boolean>(true);
  const [showCities, setShowCities] = useState<boolean>(true);
  const [showClouds, setShowClouds] = useState<boolean>(true);
  const [showDegreeLabels, setShowDegreeLabels] = useState<boolean>(true);
  const [showSpecialParallels, setShowSpecialParallels] = useState<boolean>(true);
  const [hemisphereMode, setHemisphereMode] = useState<HemisphereMode>('none');
  const [autoRotate, setAutoRotate] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Camera Fly-To target
  const [targetLookAt, setTargetLookAt] = useState<{ lat: number; lon: number } | null>(null);

  // Challenge Progression State
  const [challengeIndex, setChallengeIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [attempts, setAttempts] = useState<number>(0);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState<boolean>(false);

  // Modal dialog states
  const [isJumpModalOpen, setIsJumpModalOpen] = useState<boolean>(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState<boolean>(false);
  const [lastScoreAwarded, setLastScoreAwarded] = useState<number>(100);

  // Current Challenge
  const currentChallenge: Challenge = useMemo(() => {
    return CHALLENGES[challengeIndex % CHALLENGES.length];
  }, [challengeIndex]);

  // When switching to challenge mode, disable reference cities by default to prevent giving away answers
  useEffect(() => {
    if (mode === 'challenge') {
      setShowCities(false);
      setHemisphereMode('none');
    } else {
      setShowCities(true);
      setIsAnswerRevealed(false);
    }
  }, [mode]);

  // Live Proximity & Directional Feedback (Strictly directional, no literal coordinates revealed)
  const feedback: FeedbackResult = useMemo(() => {
    return calculateFeedback(
      markerLat,
      markerLon,
      currentChallenge.targetLat,
      currentChallenge.targetLon,
      currentChallenge.toleranceKm,
      currentChallenge.stage
    );
  }, [markerLat, markerLon, currentChallenge]);

  // Update marker position from click/drag
  const handleMarkerChange = useCallback((lat: number, lon: number) => {
    setMarkerLat(lat);
    setMarkerLon(lon);
  }, []);

  // Jump to specific coordinate with camera animation
  const handleJumpCoordinate = useCallback((lat: number, lon: number) => {
    setMarkerLat(lat);
    setMarkerLon(lon);
    setTargetLookAt({ lat, lon });
    soundManager.playPinDrop();
  }, []);

  // Reset Camera View to front
  const handleResetCamera = useCallback(() => {
    setTargetLookAt({ lat: 20, lon: 0 });
  }, []);

  // Check Answer Handler (Challenge Mode)
  const handleCheckAnswer = useCallback(() => {
    setAttempts((prev) => prev + 1);

    if (feedback.isSuccess) {
      const awarded = feedback.scoreAwarded || (currentChallenge.stage === 1 ? 100 : 250);
      setLastScoreAwarded(awarded);
      setScore((prev) => prev + awarded);
      setStreak((prev) => prev + 1);
      setIsSuccessModalOpen(true);
    } else {
      soundManager.playProximityChime(feedback.tier);
      // Auto-scaffold: after 3 failed attempts, gently turn on Graticule Grid if not already on
      if (attempts >= 2 && !showGrid) {
        setShowGrid(true);
      }
    }
  }, [feedback, currentChallenge, attempts, showGrid]);

  // Advance to Next Challenge
  const handleNextChallenge = useCallback(() => {
    setIsSuccessModalOpen(false);
    setIsAnswerRevealed(false);
    setAttempts(0);
    setChallengeIndex((prev) => (prev + 1) % CHALLENGES.length);
  }, []);

  // Explicit Reveal Answer trigger
  const handleRevealAnswer = useCallback(() => {
    setIsAnswerRevealed(true);
    // Smoothly pan camera to show target
    setTargetLookAt({
      lat: currentChallenge.targetLat,
      lon: currentChallenge.targetLon,
    });
  }, [currentChallenge]);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-space-950 flex flex-col">
      {/* 1. TOP BAR NAVIGATION */}
      <TopBar
        mode={mode}
        setMode={setMode}
        score={score}
        streak={streak}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        onResetCamera={handleResetCamera}
        onOpenHelp={() => setIsHelpModalOpen(true)}
        onOpenTour={() => setIsTourOpen(true)}
        onOpenVisualGuide={() => setIsVisualGuideOpen(true)}
      />

      {/* 2. MAIN 3D GLOBE CANVAS (FULLSCREEN BACKGROUND) */}
      <div id="section-globe" className="absolute inset-0 z-0">
        <GlobeCanvas
          markerLat={markerLat}
          markerLon={markerLon}
          onMarkerChange={handleMarkerChange}
          showGrid={showGrid}
          showEquator={showEquator}
          showPrimeMeridian={showPrimeMeridian}
          showCities={showCities}
          showClouds={showClouds}
          showDegreeLabels={showDegreeLabels}
          showSpecialParallels={showSpecialParallels}
          hemisphereMode={hemisphereMode}
          autoRotate={autoRotate}
          targetLookAt={targetLookAt}
          onFlyToComplete={() => setTargetLookAt(null)}
          targetLat={currentChallenge.targetLat}
          targetLon={currentChallenge.targetLon}
          isAnswerRevealed={isAnswerRevealed}
          isSuccess={feedback.isSuccess}
        />
      </div>

      {/* 3. CONSOLIDATED LEFT OBSERVATORY CARD */}
      <div className="relative z-10 w-full h-full flex flex-col justify-start p-4 sm:p-6 pt-20 sm:pt-22 pointer-events-none">
        <div id="section-readout" className="flex flex-col gap-3 pointer-events-auto items-start">
          <MasterSidebarCard
            lat={markerLat}
            lon={markerLon}
            onCoordinateChange={handleMarkerChange}
            mode={mode}
            setMode={setMode}
            challenge={currentChallenge}
            feedback={feedback}
            challengeIndex={challengeIndex}
            totalChallenges={CHALLENGES.length}
            attempts={attempts}
            onCheckAnswer={handleCheckAnswer}
            onCenterCamera={() => setTargetLookAt({ lat: markerLat, lon: markerLon })}
            onOpenJumpModal={() => setIsJumpModalOpen(true)}
            onRevealAnswer={handleRevealAnswer}
            isAnswerRevealed={isAnswerRevealed}
            hemisphereMode={hemisphereMode}
            setHemisphereMode={setHemisphereMode}
            showDegreeLabels={showDegreeLabels}
            setShowDegreeLabels={setShowDegreeLabels}
            showSpecialParallels={showSpecialParallels}
            setShowSpecialParallels={setShowSpecialParallels}
            onFlyToPreset={(lat, lon) => setTargetLookAt({ lat, lon })}
          />
        </div>
      </div>

      {/* 4. FLOATING BOTTOM CONTROL PILLS */}
      <BottomControlPills
        showGrid={showGrid}
        setShowGrid={setShowGrid}
        showEquator={showEquator}
        setShowEquator={setShowEquator}
        showPrimeMeridian={showPrimeMeridian}
        setShowPrimeMeridian={setShowPrimeMeridian}
        showCities={showCities}
        setShowCities={setShowCities}
        showClouds={showClouds}
        setShowClouds={setShowClouds}
        autoRotate={autoRotate}
        setAutoRotate={setAutoRotate}
      />

      {/* 5. MODALS & DIALOGS */}
      <WelcomeScreen
        isOpen={isWelcomeOpen}
        onStartTour={() => {
          setIsWelcomeOpen(false);
          setIsTourOpen(true);
        }}
        onStartExplore={() => {
          setIsWelcomeOpen(false);
        }}
      />

      <GuidedTour
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        onComplete={() => setIsTourOpen(false)}
      />

      <JumpCoordinateModal
        isOpen={isJumpModalOpen}
        onClose={() => setIsJumpModalOpen(false)}
        onJump={handleJumpCoordinate}
        currentLat={markerLat}
        currentLon={markerLon}
      />

      <VisualChapterGuideModal
        isOpen={isVisualGuideOpen}
        onClose={() => setIsVisualGuideOpen(false)}
        onJumpToLessonPreset={handleJumpCoordinate}
      />

      <SuccessModal
        isOpen={isSuccessModalOpen}
        challenge={currentChallenge}
        scoreAwarded={lastScoreAwarded}
        totalScore={score}
        streak={streak}
        onNextChallenge={handleNextChallenge}
      />

      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />
    </main>
  );
}
