import { addPoints } from '$lib/server/db/utilities.js';
import { json } from '@sveltejs/kit';

export async function POST({ locals }) {
    if (!locals.user) {
        return json("NONON", { status: 401 });
    }


    addPoints(locals.user.id, -1); // Retirer 1 point
    // On peut ajouter une logique ici pour vérifier si l'utilisateur a suffisamment de points avant de retirer
    

    

    return json("OK", { status: 200 });
}