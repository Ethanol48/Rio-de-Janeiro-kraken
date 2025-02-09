// routes/games/roue_random/api/spin/+server.ts
import { user } from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { addPoints, getPoints,Addplaynumber , Combiendefoisjouer} from '$lib/server/db/utilities';
import { eq } from 'drizzle-orm';

// Mapping des gains par segment
const SEGMENT_POINTS = [1, 10, 5, 3, 2]; // Index = segment

export async function GET({ locals }) { // Suppose que l'user est dans locals
  const userId = locals.user.id; // À adapter selon ton système d'authentification

  
  try {

    const temp = await Combiendefoisjouer(userId);
    if(temp>=10)
        return new Response(
            JSON.stringify("None"),
            { headers: { 'Content-Type': 'application/json' } }
          );
    const nombredepoints = await getPoints(userId);
    if (nombredepoints<=0){
      return new Response(
        JSON.stringify("NONON"),
        { headers: { 'Content-Type': 'application/json' } }
      );
    }
    // Vérification du temps d'attente
    await Addplaynumber(userId);
    await addPoints(userId,-1);
    
    
    return new Response(
      JSON.stringify("fd"),
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