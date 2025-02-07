import { createCards } from "$lib/games/blackjack";
import { isGameOnGoing } from "$lib/server/db/utilities";


export function POST() {

  const userPoints = await getPoints(userId)
  const userId = "";



  isGameOnGoing(userId)

}
