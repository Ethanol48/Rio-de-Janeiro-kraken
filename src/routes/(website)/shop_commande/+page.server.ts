import {  GetItem, GetListOrder, GetNameItem, getUsername, OrderSend } from '$lib/server/db/utilities';
import { date } from 'drizzle-orm/mysql-core';
import type { Actions, PageServerLoad } from './$types';
import { user } from '$lib/server/db/schema';
import { redirect } from '@sveltejs/kit';



export const load: PageServerLoad = async (event) => {  

  if (event.locals.user?.id != "s7bgztrttrr5jtp2m6crtv7y"){
    return redirect(302, '/home');
  }
  
  const ListOrder =await GetListOrder();
  let list_result = [];
  let list_userid : string[] = [];
  async function GetListResult(userid : string,itemid : string,claimed: boolean | null) {
    return [await getUsername(userid), await GetNameItem(itemid),1,claimed]
  }
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
    console.log('userid',locals.user!.id)
    const list =  await OrderSend(locals.user!.id);
    console.log(await GetNameItem(list[0].productid))
  
    
   
    return {
      
    };
  },
};