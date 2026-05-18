import { LeagueTier } from '../types/pvp';

export const LEAGUE_THRESHOLDS = {
    bronce: 0,
    plata: 1000,
    oro: 2000,
    diamante: 3000,
};

export const REWARDS = {
    victory: { xp: 30, gems: 5, leaguePoints: 50 },
    defeat: { xp: 10, gems: 1, leaguePoints: -25 },
    tie: { xp: 15, gems: 2, leaguePoints: 0 },
};

export const BOT_DIFFICULTY = {
    bronce: 0.5,
    plata: 0.75,
    oro: 0.9,
    diamante: 1.0,
};

export const BOT_TIMING = {
    bronce: { min: 3000, max: 8000 },
    plata: { min: 2000, max: 5000 },
    oro: { min: 1000, max: 3000 },
    diamante: { min: 500, max: 1500 },
};

export function getLeagueTier(leaguePoints: number): LeagueTier {
    if (leaguePoints >= LEAGUE_THRESHOLDS.diamante) return 'diamante';
    if (leaguePoints >= LEAGUE_THRESHOLDS.oro) return 'oro';
    if (leaguePoints >= LEAGUE_THRESHOLDS.plata) return 'plata';
    return 'bronce';
}

export function getLeagueName(tier: LeagueTier): string {
    const names: Record<LeagueTier, string> = {
        bronce: 'Liga Bronce',
        plata: 'Liga Plata',
        oro: 'Liga Oro',
        diamante: 'Liga Diamante',
    };
    return names[tier];
}

export function getNextLeaguePoints(tier: LeagueTier): number {
    return LEAGUE_THRESHOLDS[tier] + 1000;
}

export function getLeagueDivision(leaguePoints: number): number {
    const tier = getLeagueTier(leaguePoints);
    const pointsInTier = leaguePoints - LEAGUE_THRESHOLDS[tier];
    const division = Math.floor(pointsInTier / 250);
    return Math.min(4, Math.max(1, 4 - division));
}

export function getLeagueProgress(leaguePoints: number): number {
    const tier = getLeagueTier(leaguePoints);
    const pointsInTier = leaguePoints - LEAGUE_THRESHOLDS[tier];
    return (pointsInTier % 250) / 250 * 100;
}

export function getLeagueInfo(leaguePoints: number) {
    const tier = getLeagueTier(leaguePoints);
    const division = getLeagueDivision(leaguePoints);
    const progress = getLeagueProgress(leaguePoints);
    
    const divisionNames: Record<number, string> = {
        1: 'I',
        2: 'II',
        3: 'III',
        4: 'IV'
    };

    return {
        tier,
        name: getLeagueName(tier),
        division: divisionNames[division] || 'I',
        points: leaguePoints,
        nextThreshold: LEAGUE_THRESHOLDS[tier] + 1000,
        pointsToNextTier: Math.max(0, 1000 - (leaguePoints - LEAGUE_THRESHOLDS[tier]) % 1000 - (leaguePoints - LEAGUE_THRESHOLDS[tier]) % 1000 % 1000),
        progress,
    };
}

export function getBotDifficulty(leaguePoints: number): number {
    const tier = getLeagueTier(leaguePoints);
    return BOT_DIFFICULTY[tier];
}

export function getBotTiming(leaguePoints: number): { min: number; max: number } {
    const tier = getLeagueTier(leaguePoints);
    return BOT_TIMING[tier];
}

export function calculateRewards(
    p1Score: number,
    p2Score: number,
    isPlayer1: boolean
): { xp: number; gems: number; leaguePoints: number } {
    const playerScore = isPlayer1 ? p1Score : p2Score;
    const opponentScore = isPlayer1 ? p2Score : p1Score;

    if (playerScore > opponentScore) {
        return REWARDS.victory;
    } else if (playerScore < opponentScore) {
        return REWARDS.defeat;
    }
    return REWARDS.tie;
}

export function canWinRound(
    p1Score: number,
    p2Score: number,
    roundsPlayed: number
): 'p1_win' | 'p2_win' | 'continue' | 'tie' {
    const winsNeeded = 3;
    const roundsLeft = 5 - roundsPlayed;

    if (p1Score >= winsNeeded) return 'p1_win';
    if (p2Score >= winsNeeded) return 'p2_win';
    if (roundsPlayed >= 5) return 'tie';

    return 'continue';
}

export function generateBotAnswer(
    difficulty: number,
    minTime: number,
    maxTime: number
): Promise<{ isCorrect: boolean; responseTime: number }> {
    return new Promise((resolve) => {
        const responseTime = Math.floor(Math.random() * (maxTime - minTime) + minTime);
        const isCorrect = Math.random() < difficulty;

        setTimeout(() => {
            resolve({ isCorrect, responseTime });
        }, responseTime);
    });
}