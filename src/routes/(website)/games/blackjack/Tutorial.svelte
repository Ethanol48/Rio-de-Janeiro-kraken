<script lang="ts">
  import * as CardUI from "$lib/components/ui/card";
  import Carta  from "./[game_id]/comps/Card.svelte";
  import { Carta as carta, Color as color } from "$lib/games/blackjack";

  const incrementX = 17;
  const incrementY = 20;

  const cartasExponer = [
    { symbol: carta.Jack, color: color.DIAMONDS },
    { symbol: carta.King, color: color.SPADES },
    { symbol: carta.Queen, color: color.HEARTS },
  ]
</script>

<div class="flex gap-3 mb-6 flex-col md:flex-row md:justify-center  w-[280px]">

  <CardUI.Root class="min-w-[280px] min-h-[280px] w-full h-full">
    <CardUI.Content class="w-full h-full flex flex-col pt-9">
      <div class="w-full h-full flex">
        <div class="relative w-full h-full flex flex-col justify-between">
          <h4 class="typography text-center">User cards</h4>
          <Carta
            class={"absolute"}
            style={`bottom: 40px; left: 20px;`}
            color={color.SPADES}
            symbol={carta.Ten}
          />
          <Carta
            class={"absolute"}
            style={`bottom: ${incrementY + 40}px; left: ${incrementX + 20}px;`}
            color={color.CLOVERS}
            symbol={carta.Eight}
          />

          <p class="text-center mt-[-1]">Card Count: <strong>{18}</strong></p>
        </div>

        <div class="relative w-full h-full flex flex-col justify-between">
          <h4 class="typography text-center">Dealer cards</h4>
          <Carta
            class={"absolute"}
            style={`bottom: 40px; left: 20px;`}
            color={color.SPADES}
            symbol={carta.Seven}
          />
          <Carta
            class={"absolute"}
            style={`bottom: ${incrementY + 40}px; left: ${incrementX + 20}px;`}
            color={color.HEARTS}
            symbol={carta.Jack}
          />

          <p class="text-center mt-[-1]">Card Count: <strong>{17}</strong></p>
        </div>
      </div>
      
      <h4 class="text-center mt-3">The point of the game is to have a better <br> hand than the dealer !!</h4>
    </CardUI.Content>
  </CardUI.Root>
  
  <CardUI.Root class="min-w-[280px] min-h-[280px]">
    <CardUI.Content class="w-full h-full flex justify-between pt-9">
    
      <div class="flex flex-col items-center w-1/2 h-full">
        <div class="relative w-full h-full flex flex-col justify-between">

          {#each cartasExponer as cartita, i}
            <Carta
              class={"absolute"}
              style={`bottom: ${incrementY * i + 10}px; left: ${incrementX * i + 20}px;`}
              color={cartita.color}
              symbol={cartita.symbol}
             />
          {/each}
        </div>
        <p class="typography text-center ">
          Any card higher than <strong>10</strong> 
          it's value is <strong>10</strong>
        </p>
      </div>


      <div class="flex flex-col justify-between items-center">
        <h4 class="typography mb-3 text-center">The ace is a joker!!</h4>
        <Carta color={color.SPADES} symbol={carta.Ace} />
        <p class="typography text-center">Aces can either have a <br> value of <strong>1</strong> or <strong>11</strong></p>
      </div>



   </CardUI.Content>
  </CardUI.Root>


  <CardUI.Root>
    <CardUI.Content class="w-full h-full flex justify-center pt-9">bettin stand double</CardUI.Content>
  </CardUI.Root>
  
</div>


