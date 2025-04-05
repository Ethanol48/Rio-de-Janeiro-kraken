import { json } from '@sveltejs/kit';

export async function POST({ request, locals }) {
    if (!locals.user) {
        return json({ error: "Unauthorized" }, { status: 401 });
    }

    const { selectedCup } = await request.json();
    const winningCup = Math.floor(Math.random() * 3) + 1; // Random entre 1 et 3
    const isWinner = selectedCup === winningCup;

    

    return json({
        isWinner,
        winningCup,
        message: isWinner 
            ? "Quoi?? Tu as trouvé la rose ! 🌹 Pfff, bon voila tes 3 points" 
            : "Dommage, pas cette fois haha !"
    }, { status: 200 });
}