import { LastlayRoue } from '$lib/server/db/utilities';
import { canUserPlay } from '$lib/server/db/utilities';
import {  user } from '$lib/server/db/schema'; // A
import { db } from '$lib/server/db'; //ssurez-vous d'importer correctement votre db et user
import { eq } from 'drizzle-orm';

// Fonction pour convertir une date en format YYYYMMDDHHmm
function dateToInt(date: Date): number {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Mois de 1 à 12
  const day = String(date.getDate()).padStart(2, '0'); // Jour de 1 à 31
  const hours = String(date.getHours()).padStart(2, '0'); // Heures de 0 à 23
  const minutes = String(date.getMinutes()).padStart(2, '0'); // Minutes de 0 à 59

  return parseInt(`${year}${month}${day}${hours}${minutes}`);
}

// Fonction pour vérifier si l'utilisateur peut jouer


// Fonction GET pour gérer la requête
export function GET() {
  const userId = 'user-id'; // Remplacez par l'ID de l'utilisateur réel

  canUserPlay(userId).then(({ canPlay, waitTime }) => {
    if (canPlay) {
      // L'utilisateur peut jouer, on continue avec la logique de la roue
      const probabilities = [
        { weight: 60 }, 
        { weight: 5 }, 
        { weight: 5 },
        { weight: 10 },  
        { weight: 20 }   
      ];

      const total = probabilities.reduce((sum, p) => sum + p.weight, 0);
      const random = Math.random() * total;

      let cumulative = 0;
      for (let i = 0; i < probabilities.length; i++) {
        cumulative += probabilities[i].weight;
        if (random <= cumulative) {
          return new Response(JSON.stringify({ segment: i }), {
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }

      // Si aucune valeur n'est trouvée (improbable)
      return new Response(JSON.stringify({ segment: 0 }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      // L'utilisateur doit attendre
      if (waitTime){
        const waitHours = Math.floor(waitTime / 100); // Heures à attendre
        const waitMinutes = waitTime % 100; // Minutes à attendre
        return new Response(JSON.stringify({ error: `Vous devez attendre encore ${waitHours} heures et ${waitMinutes} minutes` }), {
          headers: { 'Content-Type': 'application/json' },
          status: 403
        });
      }
      else{
        return new Response(JSON.stringify({ error: `Une erreur est survenu :/` }), {
          headers: { 'Content-Type': 'application/json' },
          status: 403
        });
      }
      
    }
  }).catch(error => {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    });
  });
}