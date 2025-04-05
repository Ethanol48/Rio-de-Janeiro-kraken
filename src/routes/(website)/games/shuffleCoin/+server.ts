
import { addPoints, removePoints } from '$lib/server/db/utilities';
import { type RequestHandler, fail, json } from '@sveltejs/kit';


function verifyUserCanPlay(userId: string): boolean {
  return true;
}

export const POST: RequestHandler = async ({ request, locals }) => {

  if (locals.user === null) {
    return fail(401, { message: "You need to be authenticated to play" });
  }


  if (!verifyUserCanPlay(locals.user.id)) {
    return fail(401, { message: "You cannot play" });
  }

  let form = await request.formData()
  const cup = form.get('cup')

  if (cup === undefined || cup === null) {
    fail(401, { message: "cup parameter was not given" })
  }

  if (cup !== '1' && cup !== '2' && cup !== '3') {
    fail(401, { message: "cup must be a number from 1 to 3" })
  }

  await removePoints(locals.user.id, 1);
  const isWinner = Math.random() < 0.33;

  if (isWinner) {
    await addPoints(locals.user.id, 3)
  }

  const mensaje = isWinner
    ? `Bravo ! Vous avez gagné avec le gobelet ${cup} !`
    : "Dommage, essayez encore avec un autre gobelet.";


  return json({
    message: mensaje,
    isWinner: isWinner,
    cup: cup
  })
}

