// routes/games/roue_random/api/spin/+server.ts
import { user } from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { canUserSpin, processSpin } from '$lib/server/db/utilities';
import { eq } from 'drizzle-orm';

// Mapping des gains par segment
const SEGMENT_POINTS = [0, 20, 10, 6, 4]; // Index = segment

export async function GET({ locals }) { // Suppose que l'user est dans locals
  const userId = locals.user.id; // À adapter selon ton système d'authentification

  
  try {
    // Vérification du temps d'attente
    const { canPlay, nextSpin } = await canUserSpin(userId);
    if (!canPlay) {
      return new Response(
        JSON.stringify({ 
          error: `Attendez encore ${nextSpin?.hours}h ${nextSpin?.minutes}min` 
        }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Calcul du résultat
    const probabilities = [5, 5, 10, 30, 50]; // Total = 100%
    const random = Math.random() * 100;
    
    let cumulative = 0;
    let segment = 0;
    for (let i = 0; i < probabilities.length; i++) {
      cumulative += probabilities[i];
      if (random <= cumulative) {
        segment = i;
        break;
      }
    }

    // Mise à jour en base
    const pointsWon = SEGMENT_POINTS[segment];
    await processSpin(userId, pointsWon);

    return new Response(
      JSON.stringify({ segment }),
      { headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Spin error:', error);
    return new Response(
      JSON.stringify({ error: 'Erreur interne du serveur' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}