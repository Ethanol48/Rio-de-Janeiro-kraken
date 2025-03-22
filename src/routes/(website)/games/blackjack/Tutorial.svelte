<script lang="ts">
  import * as CardUI from "$lib/components/ui/card";
  import Carta  from "./[game_id]/comps/Card.svelte";
  import { Carta as carta, Color as color } from "$lib/games/blackjack";
  import * as Carousel from "$lib/components/ui/carousel/index.js";

  import Autoplay from 'embla-carousel-autoplay'
  
  import {type EmblaCarouselType} from 'embla-carousel'
  import {type CarouselAPI} from '$lib/components/ui/carousel/context.js'
	import { onMount } from "svelte";

  import { addAutoplayProgressListeners } from "./progressBar.js"

  const incrementX = 17;
  const incrementY = 20;

  const cartasExponer = [
    { symbol: carta.Jack, color: color.DIAMONDS },
    { symbol: carta.King, color: color.SPADES },
    { symbol: carta.Queen, color: color.HEARTS },
  ];


  let emblaApi : CarouselAPI | undefined = $state(undefined);
  let plugins = [Autoplay({ playOnInit: true, delay: 7000, stopOnInteraction: false })]
  let progressNode: HTMLElement;

  
  $effect.pre(() => {
      if (!emblaApi || emblaApi === undefined) return;
      if (!progressNode) return;
  
      addAutoplayProgressListeners(emblaApi, progressNode);
  })

</script>

<div class="flex gap-3 mb-6 flex-col md:flex-row md:justify-center  w-[280px]">

  <Carousel.Root class="w-[280px]" opts={{loop: true}} bind:api={emblaApi} {plugins}>
    <Carousel.Content>
      <Carousel.Item>

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
            style={`bottom: 40px; left: 20px; background-color: #ffffff;`}
            color={color.SPADES}
            symbol={carta.Seven}
          />
          <Carta
            class={"absolute"}
            style={`bottom: ${incrementY + 40}px; left: ${incrementX + 20}px; background-color: #ffffff;`}
            color={color.HEARTS}
            symbol={carta.Jack}
          />

          <p class="text-center mt-[-1]">Card Count: <strong>{17}</strong></p>
        </div>
      </div>
      
      <h4 class="text-center mt-3">The point of the game is to have a better <br> hand than the dealer !!</h4>
    </CardUI.Content>
  </CardUI.Root>


      </Carousel.Item> 
      <Carousel.Item>

  <CardUI.Root class="min-w-[280px] min-h-[280px]">
    <CardUI.Content class="w-full h-full flex justify-between pt-9">
    
      <div class="flex flex-col items-center w-1/2">
        <div class="relative w-full h-full flex flex-col justify-between">
          {#each cartasExponer as cartita, i}
            <Carta
              class={"absolute"}
              style={`bottom: ${incrementY * i + 0}px; left: ${incrementX * i + 10}px;`}
              color={cartita.color}
              symbol={cartita.symbol}
             />
          {/each}
        </div>
        <p class="typography text-center ">
          Any card higher than <strong>10</strong> 
          has a value of <strong>10</strong>
        </p>
      </div>

      <div class="flex flex-col justify-between items-center">
        <h4 class="typography mb-3 text-center">The ace is a joker!!</h4>
        <Carta color={color.SPADES} symbol={carta.Ace} />
        <p class="typography text-center">Aces can either have a <br> value of <strong>1</strong> or <strong>11</strong></p>
      </div>



   </CardUI.Content>
  </CardUI.Root>


      </Carousel.Item>
    </Carousel.Content>

    <Carousel.Previous />
  <Carousel.Next />

  <div class="mt-4 flex justify-center">
    <div bind:this={progressNode} class="embla__progress embla__progress--hidden">
      <div class="embla__progress__bar"></div>
    </div>
  </div>

  </Carousel.Root>
 

<!--
  <CardUI.Root>
    <CardUI.Content class="w-full h-full flex justify-center pt-9">bettin stand double</CardUI.Content>
  </CardUI.Root>
  
  -->

</div>


<style>

:root {
  --brand-alternative: rgb(19, 120, 134);
  --background-site: rgb(249, 249, 249);
  --background-code: rgb(244, 244, 244);
  --text-body: hsl(140 90% 10%);
  --text-comment: rgb(99, 94, 105);
  --text-high-contrast: rgb(49, 49, 49);
  --text-medium-contrast: rgb(99, 94, 105);
  --text-low-contrast: rgb(116, 109, 118);
}

.embla__progress {
  border-radius: 1.8rem;
  /* box-shadow: inset 0 0 0 0.2rem var(--detail-medium-contrast); */
  background-color: var(--background-site);
  position: relative;
  height: 0.6rem;
  justify-self: flex-end;
  align-self: center;
  width: 13rem;
  max-width: 90%;
  overflow: hidden;
}
.embla__progress__bar {
  background-color: var(--text-body);
  position: absolute;
  width: 100%;
  top: 0;
  bottom: 0;
  left: -100%;
}

.embla__progress {
  justify-self: center;
  transition: opacity 0.3s ease-in-out;
  width: 8rem;
}
.embla__progress--hidden {
  opacity: 0;
}
.embla__progress__bar {
  animation-name: autoplay-progress;
  animation-timing-function: linear;
  animation-iteration-count: 1;
}
.embla__progress--hidden .embla__progress__bar {
  animation-play-state: paused;
}
@keyframes autoplay-progress {
  0% {
    transform: translate3d(0, 0, 0);
  }
  100% {
    transform: translate3d(100%, 0, 0);
  }
}

  </style>
