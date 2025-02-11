

import { redirect } from '@sveltejs/kit';


function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


export async function GET() {

  await wait(500);
  const resp = await fetch('/games/blackjack', { method: 'GET' });
  const id = await resp.json();

  console.log("id: ", id)
  redirect(301, `/games/blackjack/${id.id}`);
}



