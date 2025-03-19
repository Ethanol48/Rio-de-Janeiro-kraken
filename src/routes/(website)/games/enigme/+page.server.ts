import { addPoints, enigme_check, enigme_get_question, enigme_vainqueur, getUsername } from '$lib/server/db/utilities';
import { date } from 'drizzle-orm/mysql-core';
import type { Actions, PageServerLoad } from './$types';
import { user } from '$lib/server/db/schema';



export const load: PageServerLoad = async (event) => {  
  const Day = new Date;
  let msg="";
  let check = false;
  const reponses= await enigme_get_question(Day.getDate(),Day.getMonth());
  console.log(reponses)
  if(reponses[1]===true)
  {   
    check = true
     msg=`Le code à été trouvé aujourd\'hui, le gagnant est ${await enigme_vainqueur(Day.getDate(),Day.getMonth())}`
  }  
  else{
    if(reponses[0] !== null){
      msg = reponses[0]}
  }
  console.log(msg)
  return {
    msg,
    check:check
  };
};

export const actions: Actions = {
  check_result: async ({ request, locals }) => {
    const formData = await request.formData();
    const userInput = formData.get('userInput');
    let msg = '';
    const Date_actuel = new Date();
    
    let username = await getUsername(locals.user?.id);
    if(userInput !==''){
      msg = "Veuillez entrez votre réponse";
    }
    else{

    }
    const resultat = await enigme_check(Date_actuel.getDate(),Date_actuel.getMonth(),userInput,locals.user?.id, username);
    console.log("monsreuslt" ,resultat)
    if(resultat[1] ===true)
      {
        msg = `Bravo, vous avez trouvé la bonne réponse! Vous avez gagné ${resultat[0]} points`;
      } 
      else {
        msg = "Désolé, ce n'est pas la bonne réponse. Essayez encore !";
      }
    
   
    return {
      message: msg
    };
  },
};