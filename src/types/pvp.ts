export type LeagueTier = 'bronce' | 'plata' | 'oro' | 'diamante';
export type MatchMode = 'ai' | 'multiplayer';
export type MatchStatus = 'searching' | 'playing' | 'completed' | 'cancelled';
export type RoundResult = 'player1_win' | 'player2_win' | 'tie' | 'timeout';

export interface Player {
    id: string;
    username: string;
    avatarUrl: string | null;
    leaguePoints: number;
}

export interface PvPMatch {
    id: string;
    player1Id: string | null;
    player2Id: string | null;
    mode: MatchMode;
    p1Score: number;
    p2Score: number;
    status: MatchStatus;
    currentRound: number;
    winnerId: string | null;
    xpEarned: number;
    gemsEarned: number;
    leaguePointsEarned: number;
    createdAt: Date;
    finishedAt: Date | null;
}

export interface BattleState {
    matchId: string;
    exercises: Exercise[];
    currentRoundIndex: number;
    p1Score: number;
    p2Score: number;
    status: 'waiting' | 'active' | 'round_end' | 'battle_end';
    roundResult: RoundResult | null;
    userAnswer: string | null;
    botAnswer: string | null;
    timeLeft: number;
}

export interface Exercise {
    id: number;
    lesson_id: string;
    instruction: string;
    solution_js: string;
    toolbox_config: any;
    order_index: number;
}

export interface BattleRewards {
    xp: number;
    gems: number;
    leaguePoints: number;
    isVictory: boolean;
    isTie: boolean;
    oldLeague: LeagueTier;
    newLeague: LeagueTier;
}

export interface BotResponse {
    isCorrect: boolean;
    responseTime: number;
    code: string;
}