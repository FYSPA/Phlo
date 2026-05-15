import { supabase } from './supabase';
import { calculateRewards, getLeagueTier } from '../utils/pvpUtils';
import { LeagueTier } from '../types/pvp';

export const pvpService = {
    async createMatch(playerId: string, mode: 'ai' | 'multiplayer' = 'ai'): Promise<string | null> {
        const { data, error } = await supabase
            .from('pvp_matches')
            .insert({
                player_1_id: playerId,
                mode,
                status: mode === 'ai' ? 'playing' : 'searching',
            })
            .select('id')
            .single();

        if (error) {
            console.error('Error creating match:', error);
            return null;
        }
        return data.id;
    },

    async updateMatchScore(
        matchId: string,
        p1Score: number,
        p2Score: number,
        currentRound: number
    ): Promise<boolean> {
        const { error } = await supabase
            .from('pvp_matches')
            .update({
                p1_score: p1Score,
                p2_score: p2Score,
                current_round: currentRound,
            })
            .eq('id', matchId);

        if (error) {
            console.error('Error updating match score:', error);
            return false;
        }
        return true;
    },

    async completeMatch(
        matchId: string,
        winnerId: string | null,
        p1Score: number,
        p2Score: number,
        player1Id: string
    ): Promise<void> {
        const rewards = calculateRewards(p1Score, p2Score, true);
        const isTie = p1Score === p2Score;

        await supabase
            .from('pvp_matches')
            .update({
                status: 'completed',
                winner_id: winnerId,
                p1_score: p1Score,
                p2_score: p2Score,
                xp_earned: rewards.xp,
                gems_earned: rewards.gems,
                league_points_earned: rewards.leaguePoints,
                finished_at: new Date().toISOString(),
            })
            .eq('id', matchId);

        await this.updatePlayerStats(player1Id, rewards.xp, rewards.gems, rewards.leaguePoints);
    },

    async updatePlayerStats(
        userId: string,
        xpEarned: number,
        gemsEarned: number,
        leaguePointsEarned: number
    ): Promise<void> {
        const { data: profile } = await supabase
            .from('profiles')
            .select('xp, gems, league_points')
            .eq('id', userId)
            .single();

        if (!profile) return;

        const newXp = profile.xp + xpEarned;
        const newGems = profile.gems + gemsEarned;
        const newLeaguePoints = Math.max(0, profile.league_points + leaguePointsEarned);

        await supabase
            .from('profiles')
            .update({
                xp: newXp,
                gems: newGems,
                league_points: newLeaguePoints,
            })
            .eq('id', userId);
    },

    async getPlayerProfile(userId: string) {
        const { data, error } = await supabase
            .from('profiles')
            .select('id, username, avatar_url, xp, gems, league_points')
            .eq('id', userId)
            .single();

        if (error) return null;
        return data;
    },

    async getPlayerLeagueTier(userId: string): Promise<LeagueTier> {
        const profile = await this.getPlayerProfile(userId);
        if (!profile) return 'bronce';
        return getLeagueTier(profile.league_points);
    },

    async saveMatchHistory(
        playerId: string,
        result: 'victory' | 'defeat' | 'tie',
        xpEarned: number,
        gemsEarned: number
    ): Promise<void> {
        await supabase
            .from('pvp_matches')
            .insert({
                player_1_id: playerId,
                player_2_id: null,
                mode: 'ai',
                status: 'completed',
                winner_id: result === 'victory' ? playerId : null,
                p1_score: result === 'victory' ? 3 : result === 'defeat' ? 0 : 1.5,
                p2_score: result === 'victory' ? 0 : result === 'defeat' ? 3 : 1.5,
                xp_earned: xpEarned,
                gems_earned: gemsEarned,
            });
    },
};