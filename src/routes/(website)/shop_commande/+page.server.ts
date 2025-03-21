import {  GetItem, GetListOrder, GetNameItem, getUsername, OrderSend } from '$lib/server/db/utilities';
import { date } from 'drizzle-orm/mysql-core';
import type { Actions, PageServerLoad } from './$types';
import { user } from '$lib/server/db/schema';
import { redirect } from '@sveltejs/kit';
import type { List } from '$lib/components/ui/tabs';



export const load: PageServerLoad = async (event) => {  

  if (event.locals.user?.id != "s7bgztrttrr5jtp2m6crtv7y"){
    return redirect(302, '/home');
  }
  const ListOrder =await GetListOrder();
  let list_result = [];
  async function GetListResult(userid : string,itemid : string,claimed: boolean | null) {
    return [await getUsername(userid), await GetNameItem(itemid),1,claimed]
  }
  console.log(ListOrder)

  /// Récuperer les users

  let list_userid : string[] = [];

  ListOrder.forEach(element => {
    if(!list_userid.includes(element.userid)){
      list_userid.push(element.userid)
    }
  });

  /// ajouter les users avec leur commande

  function UserInList(user_id : string, list ){ 
    let compt = 1
    list.forEach(element => {
      if(element[0] === user_id){
        console.log(!true)
        return true;
      }
      compt++;
    });
    console.log(!false)
    return false;
  }

  function UserHaveNotItem(item : string, list){
    list.forEach(element => {
      if(item==element)
        return false;
    });
    return true;
  }

  
  list_userid.forEach(el_UserId => {
    ListOrder.forEach(el_ListOrder => {
      if(el_UserId==el_ListOrder.userid){
        if(!(UserInList(el_UserId, list_result))){
          list_result.push([el_ListOrder.userid, [[el_ListOrder.itemid , 1]]])
        }
        else{
          
          
        }
      }
    });
  });

  console.log(list_result)
 


  /*
  ListOrder.forEach(element => {
    if(list_userid.includes(element.userid) && ){
      list_userid.push(element.userid)
      list_result.push(GetListResult(element.userid,element.itemid,element.claimed))
    }
    
  });
  */
  return {
    
  };
};

export const actions: Actions = {
  ordertes: async ({ request, locals }) => {
    

    async function GetName(params:string) {
      return await GetNameItem(params);
    }
    const list =  await OrderSend(locals.user!.id);
  
    
   
    return {
      
    };
  },
};