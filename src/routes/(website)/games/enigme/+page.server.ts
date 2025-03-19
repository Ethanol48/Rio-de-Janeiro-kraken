import { addPoints } from '$lib/server/db/utilities';
import type { Actions, PageServerLoad } from './$types';

const liste_enigme = [
  [2, 19, "Coucou toi c'est l'enigme1", "PA", 5],
  [2, 20, "Coucou toi c'est l'enigme2", "PA", 5],
  [2, 21, "Coucou toi c'est l'enigme3", "PA", 5],
  [2, 22, "Coucou toi c'est l'enigme4", "PA", 5],
  [2, 23, "Coucou toi c'est l'enigme5", "PA", 5],
  [2, 24, "Coucou toi c'est l'enigme6", "PA", 5],
  [2, 25, "Coucou toi c'est l'enigme7", "PA", 5]
];

export const load: PageServerLoad = async (event) => {
  const Date_actuel = new Date();
  let reponse = "1";

  liste_enigme.forEach(element => {
    if (element[0].toString() === Date_actuel.getMonth().toString() && element[1].toString() === Date_actuel.getDate().toString()) {
      reponse = element[2];
    }
  });

  return {
    reponse: reponse,
  };
};

export const actions: Actions = {
  check_result: async ({ request, locals }) => {
    const formData = await request.formData();
    const userInput = formData.get('userInput');
    let msg = '';
    const Date_actuel = new Date();

    liste_enigme.forEach(element => {
      if (element[0].toString() === Date_actuel.getMonth().toString() && element[1].toString() === Date_actuel.getDate().toString()) {
        if (userInput === element[3]) {
          msg = "Bravo, vous avez trouvé la bonne réponse !";
          addPoints(locals.user!.id, 100);
        } else {
          msg = "Désolé, ce n'est pas la bonne réponse. Essayez encore !";
        }
      }
    });
    console.log(msg)
    return {
      message: msg
    };
  },
};