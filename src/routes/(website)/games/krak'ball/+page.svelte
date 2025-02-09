<script lang="ts">
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';

  let cups = [1, 2, 3];
  let selectedCup: number | null = null;
  let isAnimating = false;
  let gameStarted = false;
  let timeLeft = 30;
  let timer;
  let resultMessage = '';
  let jeu_a_commencer = false
  let winningCup =1// cups[Math.floor(Math.random() * cups.length)]; 
  let showRose = false; 
  let start = false;
  let button_msg = "Commencer le jeu"

  onMount(() => {
    resetCupsPosition();
  });

  function resetCupsPosition() {
    cups.forEach((cup, index) => {
      gsap.set(`#cup${cup}`, { x: index * 5, y: 0 });
    });
  }

  async function Checkplay() {
    
    const response = await fetch('/games/krak\'ball/api/removepoint');
		const data = await response.json();
    console.log(data)
    if(data==="None"){
      resultMessage='Vous avez déjà jouer 10 fois aujourd\'hui, attendais le lendeamin !'
      return "-1";
    }
    return "1";
    
  }
  async function startGame() {
  if (isAnimating) return;
  if(jeu_a_commencer){
    jeu_a_commencer = false;
    resetGame();
  }

  const checksipeutjouer = await Checkplay()
  if(checksipeutjouer=="-1"){
    return;
  }
  

  gameStarted = true;
  button_msg = "Recommencer"
  jeu_a_commencer = true
  isAnimating = true;
  resultMessage = '';
  selectedCup = null;
  showRose = false;
  winningCup = 1//cups[Math.floor(Math.random() * cups.length)];

  

  // Étape 1: Lever les gobelets pour afficher la rose au milieu
  gsap.to(`#cup${2}`, {
    y: -100,
    duration: 0.5,
    onComplete: () => {
      start = true;
      // Afficher la rose au milieu
      showRose = true;

      // Attendre un moment pour que la rose soit visible
      setTimeout(() => {
        start = false;
        // Cacher la rose
        showRose = false;

        // Étape 2: Redescendre les gobelets
        gsap.to(`#cup${2}`, {
          y: 0,
          duration: 0.5,
          onComplete: () => {
            // Étape 3: Déplacer le premier et le dernier gobelet vers le milieu
            gsap.to("#cup1", {
              x: 185,
              duration: 1,
            });
            gsap.to("#cup3", {
              x: -170,
              duration: 1,
              onComplete: () => {
                // Étape 4: Remettre les gobelets à leur place
                gsap.to("#cup1", {
                  x: 0,
                  duration: 1,
                });
                gsap.to("#cup3", {
                  x: 20,
                  duration: 1,
                  onComplete: () => {
                    isAnimating = false;
                    startTimer();
                  }
                });
              }
            });
          }
        });
      }, 1000); // Temps pendant lequel la rose est visible (1 seconde)
    }
  });
}

  function startTimer() {
    timeLeft = 30;
    timer = setInterval(() => {
      timeLeft--;
      if (timeLeft <= 0) {
        clearInterval(timer);
        endGame(false);
      }
    }, 1000);
  }

  
  function selectCup(cup) {
    if (!gameStarted || isAnimating || selectedCup !== null) return;
    selectedCup = cup;

    gsap.to(`#cup${cup}`, {
      y: -100,
      duration: 0.5,
      onComplete: () => {
        if (cup === winningCup) {
          showRose = true;
          resultMessage = 'Félicitations, vous avez trouvé la rose ! 🌹';
          
        } else {
          resultMessage = 'Désolé, il n\'y a rien sous ce gobelet.';
        }
        endGame(cup === winningCup);
      },
    });
  }

  async function endGame(isWinner) {
    if(isWinner){
      const response = await fetch('/games/krak\'ball/api/addpoint');
			const data = await response.json();
      console.log(data)

    }
    gameStarted = false;
    clearInterval(timer);
  }

  function resetGame() {
    clearInterval(timer);
    gameStarted = false;
    isAnimating = false;
    selectedCup = null;
    resultMessage = '';
    showRose = false;
    resetCupsPosition();
  }
</script>

<style>
  .container {
    display :flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  .cups-container {
    display: flex;
    
  }
  .cup {
    width: 150px;
    height: 150px;
    background-image: url('/gobelet_krak.png');
    background-size: cover;
    margin: 10px;
    cursor: pointer;
    position: relative;
  }
  .rose {
    width: 50px;
    height: 50px;
    background-image: url('/rose.png');
    background-size: cover;
    position: absolute;
    bottom: -50px;
    left: 50%;
    transform: translateX(-50%);
  }
  .button {
    margin-top: 20px;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
  }
  .message {
    margin-top: 20px;
    font-size: 20px;
    color: green;
  }
  .timer {
    margin-top: 10px;
    font-size: 18px;
  }
</style>

<div class="container">
  <div class="cups-container justify-between">
    {#each cups as cup}
      <div id="cup{cup}" class="cup" on:click={() => selectCup(cup)}>
          {#if (selectedCup === cup && showRose ) ||(2 === cup && showRose && start) }
            <div class="rose"></div>
          {/if}
      </div>
    {/each}
  </div>
  <button class="button" on:click={startGame} disabled={isAnimating || gameStarted}>
    
    {button_msg}

  </button>
  {#if resultMessage}
    <div class="message">{resultMessage}</div>
  {/if}
  {#if gameStarted}
    <div class="timer">Temps restant : {timeLeft} secondes</div>
  {/if}
</div>
