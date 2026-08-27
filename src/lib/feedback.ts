// Feedback, Directional Guidance, and Proximity Engine

import { calculateBearing, calculateHaversineDistance } from './geo';

export type ProximityTier = 'very_cold' | 'cold' | 'warm' | 'hot' | 'success';

export interface FeedbackResult {
  tier: ProximityTier;
  distanceKm: number;
  directionLabel: string;
  directionArrow: string;
  hintMessage: string;
  tierColor: string; // Tailwind color class or hex
  tierBadge: string;
  isSuccess: boolean;
  scoreAwarded?: number;
}

/**
 * Maps a bearing angle (0-360°) to cardinal compass arrow & label
 */
export function getCompassDirection(bearing: number): { label: string; arrow: string } {
  const directions = [
    { label: 'North', arrow: '⬆️' },
    { label: 'North-East', arrow: '↗️' },
    { label: 'East', arrow: '➡️' },
    { label: 'South-East', arrow: '↘️' },
    { label: 'South', arrow: '⬇️' },
    { label: 'South-West', arrow: '↙️' },
    { label: 'West', arrow: '⬅️' },
    { label: 'North-West', arrow: '↖️' },
  ];

  const index = Math.round(bearing / 45) % 8;
  return directions[index];
}

/**
 * Computes directional and proximity feedback for the student marker against the target.
 * Strict constraint: Never exposes the literal target coordinates.
 */
export function calculateFeedback(
  currentLat: number,
  currentLon: number,
  targetLat: number,
  targetLon: number,
  toleranceKm: number,
  stage: 1 | 2
): FeedbackResult {
  const distanceKm = calculateHaversineDistance(currentLat, currentLon, targetLat, targetLon);
  const bearing = calculateBearing(currentLat, currentLon, targetLat, targetLon);
  const { label: dirLabel, arrow: dirArrow } = getCompassDirection(bearing);

  // Check if within tolerance
  if (distanceKm <= toleranceKm) {
    return {
      tier: 'success',
      distanceKm,
      directionLabel: 'On Target',
      directionArrow: '🎯',
      hintMessage: stage === 1 ? 'Target country found! Excellent job!' : 'Coordinates matched with high precision! 🎉',
      tierColor: '#34D399',
      tierBadge: '🎯 TARGET REACHED',
      isSuccess: true,
      scoreAwarded: stage === 1 ? 100 : 250,
    };
  }

  // Tier calculation based on distance
  if (distanceKm > 6000) {
    return {
      tier: 'very_cold',
      distanceKm,
      directionLabel: dirLabel,
      directionArrow: dirArrow,
      hintMessage: `Far away on the globe. Rotate and move ${dirLabel.toLowerCase()}.`,
      tierColor: '#60A5FA', // Cold Ice Blue
      tierBadge: '❄️ VERY COLD',
      isSuccess: false,
    };
  }

  if (distanceKm > 2500) {
    return {
      tier: 'cold',
      distanceKm,
      directionLabel: dirLabel,
      directionArrow: dirArrow,
      hintMessage: `Getting the right hemisphere. Head ${dirLabel.toLowerCase()}.`,
      tierColor: '#93C5FD', // Light Blue
      tierBadge: '🧊 COLD',
      isSuccess: false,
    };
  }

  if (distanceKm > 800) {
    return {
      tier: 'warm',
      distanceKm,
      directionLabel: dirLabel,
      directionArrow: dirArrow,
      hintMessage: `Getting warmer! Adjust toward ${dirLabel.toLowerCase()}.`,
      tierColor: '#F59E0B', // Amber
      tierBadge: '☀️ WARM',
      isSuccess: false,
    };
  }

  // Under 800km but outside tolerance -> HOT
  return {
    tier: 'hot',
    distanceKm,
    directionLabel: dirLabel,
    directionArrow: dirArrow,
    hintMessage: `Very close! Nudge slightly ${dirLabel.toLowerCase()} to lock in.`,
    tierColor: '#F87171', // Coral / Red-Orange Hot
    tierBadge: '🔥 HOT!',
    isSuccess: false,
  };
}
