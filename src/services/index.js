export * from './authService.js';
export * from './profileService.js';
export * from './vocabularyService.js';
export * from './materialsService.js';
export * from './communityService.js';
export * from './adminService.js';
export * from './progressService.js';
export * from './learningPathService.js';
export * from './leaderboardService.js';
export * from './classroomService.js';
export * from './liveClassroomService.js';
export * from './auditLogService.js';
export * from './aiLearningCoachService.js';
export * from './speakingLabService.js';
export * from './hanziMasteryService.js';
export * from './grammarEngineService.js';
export * from './listeningPracticeService.js';
export * from './crossSkillService.js';
export * from './aiFeedbackService.js';
export {
  GAMIFICATION_KEYS,
  REWARD_LIMITS,
  generatePersonalizedDailyMissions,
  ACHIEVEMENTS_SPEC,
  evaluateUserAchievements,
  DAILY_CHALLENGES_BANK,
  WEEKLY_CHALLENGES_BANK,
  getCurrentDailyChallenge,
  getCurrentWeeklyChallenge,
  evaluateChallengeSubmission,
  trackLearningRetentionEvent,
  getRetentionAnalytics,
  auditUserXp,
  generateActionToken
} from './gamificationService.js';
