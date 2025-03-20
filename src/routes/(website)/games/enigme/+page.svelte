<script lang="ts">
  import { Confetti } from "svelte-confetti"
  import { type PageServerData, type ActionData } from './$types.js';
  
	import * as Dialog from '$lib/components/ui/dialog/index.js';
  import { Button } from '$lib/components/ui/button';



  let { data, form }: { data: PageServerData, form: ActionData } = $props(); 
  let userInput = '';
  let confetti = $state(false)
  let trouve =  false;
  function trouverr() {
     trouve = true
  }
  // Réagit au changement de message pour lancer les confettis
  if (form?.message && form?.message.includes('Bravo')) {
   confetti = true;
  }
</script>

<form method="POST" action="?/check_result" >
  <div class="container">
    <h1 class="enigme-title">🎭 Énigme du jour</h1>

    {#if !confetti}
    <div class="enigme-box">
      <p class="enigme-text">
        {#if data.check === true}
          {data.msg}
          {trouverr()}
        {:else}
        {data.msg}
        {/if}
        
        
      </p>
    </div>
     
      <div class="input-container">
        {#if !trouve}
        <div class="wave-group">
          <input required type="text" class="input" name="userInput" bind:value={userInput}>
          <span class="bar"></span>
          <label class="label">
            <span class="label-char" style="--index: 0">L</span>
            <span class="label-char" style="--index: 1">e</span>
            <span class="label-char  ml-1" style="--index: 3">c</span>
            <span class="label-char" style="--index: 4">o</span>
            <span class="label-char" style="--index: 5">d</span>
            <span class="label-char" style="--index: 6">e</span>
          </label>
        </div>
        <button type="submit">Vérifier</button>
        {/if}
      </div>

      <br>
      <div style="margin-left: 2%;">
        <Dialog.Root>
          <Dialog.Trigger>
            <Button class="cursor-pointer" size="sm"><b>Comment jouer ❔</b></Button>
          </Dialog.Trigger>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>L'énigme du jour 🔎</Dialog.Title>
              <Dialog.Description>
                <br>
                🌟 Tu te crois malin ? 🌟<br><br>
                Alors prouve-le ! 🧠💡 Une énigme t’attend… Un mot de passe est caché à EPITA ! 🔎✨<br><br>
                Ta mission : le retrouver grâce à l’énigme… 📜🔐<br>

                ⚠️ Mais attention ! Chaque jour, il change de campus ! 🎭 <br>
                📍 Un jour à Villejuif, un autre au Kremlin-Bicêtre… Sauras-tu suivre la piste ? 👀👣
                <br><br>
                🚀 Le plus rapide gagne les points ! 🏆 Donc sois prêt, fonce et décroche la victoire ! 🔥
                  <br><br>
                🍀 Bonne chance ! 🍀
              </Dialog.Description>
            </Dialog.Header>
            <Dialog.Close>
              <Button class="mt-2">Fermer</Button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Root>
      </div>
      
    {/if}
    {#if form?.message && form?.message.includes('Bravo')}
      
      <p class="message" style="color: green;">{form?.message}</p>
    {:else}
    
    <p class="message" style="color: red;">{form?.message}</p>
    {/if}
  </div>

  <div style="
 position: fixed;
 top: -50px;
 left: 0;
 height: 100vh;
 width: 100vw;
 display: flex;
 justify-content: center;
 overflow: hidden;
 pointer-events: none;">
 {#if confetti}
 <Confetti x={[-5, 5]} y={[0, 0.1]} duration={2000} delay={[0, 2000]} infinite amount={300} fallDistance={"100vh"} />
 {/if}
</div>
</form>

  <style>
    @keyframes slideUnderline {
      from { width: 0; }
      to { width: 100%; }
    }
    
    @keyframes fadeIn {
      0% { opacity: 0; transform: translateY(-20px); }
      100% { opacity: 1; transform: translateY(0); }
    }

    .message {
    margin-top: 15px;
    font-size: 1.5rem;
    font-weight: bold;
    color: #333;
    text-shadow: 1px 1px 5px rgba(0, 0, 0, 0.1);
  }
  
    .container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      text-align: center;
      padding: 20px;
    }
    .enigme-title {
      font-size: 2.5rem;
      font-weight: bold;
      color: var(--background);
      margin-bottom: 20px;
      text-decoration: none;
      position: relative;
    }
    .enigme-title::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: -5px;
      width: 100%;
      height: 4px;
      background-color: #6c2a2a;
      animation: slideUnderline 1s ease-in-out;
    }
    .enigme-box {
      border: 2px solid #6c2a2a;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
      margin: 20px 0;
      animation: fadeIn 1s ease-in-out;
      width: 100%;
      max-width: 400px;
    }
    .enigme-text {
      font-size: 1.5rem;
      font-weight: bold;
      color: #333;
    }
    .input-container {
      display: flex;
      gap: 10px;
      align-items: center;
      justify-content: center;
      width: 100%;
      max-width: 400px;
      margin-top: 20px;
    }
    /* Stylisation de la wave-group */
    .wave-group { 
      position: relative;
      width: 100%;
      max-width: 250px;
    }
    .wave-group .input {
      font-size: 16px;
      padding: 10px 10px 10px 5px;
      display: block;
      width: 100%;
      border: none;
      border-bottom: 1px solid #515151;
      background: transparent;
    }
    .wave-group .input:focus {
      outline: none;
    }
    .wave-group .label {
      color: #999;
      font-size: 18px;
      font-weight: normal;
      position: absolute;
      pointer-events: none;
      left: 5px;
      top: 10px;
      display: flex;
    }
    .wave-group .label-char {
      transition: 0.2s ease all;
      transition-delay: calc(var(--index) * 0.05s);
    }
    .wave-group .input:focus ~ .label .label-char,
    .wave-group .input:valid ~ .label .label-char {
      transform: translateY(-20px);
      font-size: 14px;
      color: #000;
    }
    .wave-group .bar {
      position: relative;
      display: block;
      width: 100%;
    }
    .wave-group .bar:before,
    .wave-group .bar:after {
      content: '';
      height: 2px;
      width: 0;
      bottom: 1px;
      position: absolute;
      background: var(--background);
      transition: 0.2s ease all;
    }
    .wave-group .bar:before {
      left: 50%;
    }
    .wave-group .bar:after {
      right: 50%;
    }
    .wave-group .input:focus ~ .bar:before,
    .wave-group .input:focus ~ .bar:after {
      width: 50%;
    }
  
    /* Bouton (inspiré de Uiverse.io par adamgiebl) */
    button {
      font-family: inherit;
      font-size: 20px;
      background: #6c2a2a;
      color: white;
      padding: 0.7em 1em;
      padding-left: 0.9em;
      display: flex;
      align-items: center;
      border: none;
      border-radius: 16px;
      overflow: hidden;
      transition: all 0.2s;
      cursor: pointer;
    }
    button span {
      display: block;
      margin-left: 0.3em;
      transition: all 0.3s ease-in-out;
    }
    button svg {
      display: block;
      transform-origin: center center;
      transition: transform 0.3s ease-in-out;
    }
    button:hover .svg-wrapper {
      animation: fly-1 0.6s ease-in-out infinite alternate;
    }
    button:hover svg {
      transform: translateX(1.2em) rotate(45deg) scale(1.1);
    }
    button:hover span {
      transform: translateX(5em);
    }
    button:active {
      transform: scale(0.95);
    }
    @keyframes fly-1 {
      from { transform: translateY(0.1em); }
      to { transform: translateY(-0.1em); }
    }
    .message {
      margin-top: 15px;
      font-size: 1.5rem;
      font-weight: bold;
      color: #333;
      text-shadow: 1px 1px 5px rgba(0, 0, 0, 0.1);
    }
  
    /* Responsive styles */
    @media (max-width: 667px) {
      .enigme-title {
        font-size: 1.8rem;
        margin-bottom: 10px;
      }
      .enigme-box {
        padding: 10px;
        margin: 10px 0;
      }
      .enigme-text {
        font-size: 1rem;
      }
      .input-container {
        flex-direction: column;
        gap: 15px;
      }
      .wave-group {
        max-width: 90%;
      }
      
    }
    @media (max-width: 400px) {
      .enigme-title {
        font-size: 1.2rem;
      }
      .enigme-box {
        padding: 8px;
      }
      .enigme-text {
        font-size: 0.9rem;
      }
      .wave-group {
        max-width: 100%;
      }
      
    }
  </style>
  