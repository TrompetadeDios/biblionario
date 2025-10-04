document.addEventListener('DOMContentLoaded', () => {

    const screens = {
        start: document.getElementById('start-screen'),
        rules: document.getElementById('rules-screen'),
        game: document.getElementById('game-screen'),
        win: document.getElementById('win-screen')
    };

    const gameSounds = {
        correct: new Audio('sounds/correct.mp3'),
        wrong: new Audio('sounds/wrong.mp3'),
        suspense: new Audio('sounds/suspense.mp3'),
        win: new Audio('sounds/win.mp3'),
        start: new Audio('sounds/start_game.mp3')
    };

    const allGameSoundFiles = Object.values(gameSounds);
    let audioUnlocked = false;


    const trackList = [
        'musica/pista-tecnologica-1.mp3',
    ];
    const backgroundMusic = document.getElementById('background-music');
    if (backgroundMusic) {
        backgroundMusic.volume = 0.4;
    }


    const buttons = {
        start: document.getElementById('start-btn'),
        showRules: document.getElementById('rules-btn'),
        backToStart: document.getElementById('back-to-start-btn'),
        startFromRules: document.getElementById('start-from-rules-btn'),
        reveal: document.getElementById('reveal-btn'),
        next: document.getElementById('next-btn'),
        hint: document.getElementById('wildcard-50-50'),
        audience: document.getElementById('wildcard-audience'),
        phone: document.getElementById('wildcard-call'),

        toggleRounds: document.getElementById('toggle-rounds-btn'),

        restartFail: document.getElementById('restart-fail-btn'),
        backToStartFail: document.getElementById('back-to-start-fail-btn'),
        restartWin: document.getElementById('restart-win-btn'),
        backToStartWin: document.getElementById('back-to-start-win-btn'),
    };

    const gameElements = {
        playerNameInput: document.getElementById('player-name'),
        question: document.getElementById('question'),
        answers: document.getElementById('answer-options'),
        roundsList: document.getElementById('rounds-list'),
        roundsContainer: document.getElementById('rounds-container'),
        audiencePoll: document.getElementById('audience-poll'),
        phoneTimer: document.getElementById('phone-timer'),
        timerDisplay: document.getElementById('timer-display'),
        finalScoreDisplay: document.getElementById('final-score-display'),
        winTitle: document.getElementById('win-title'),
        fireworksContainer: document.getElementById('fireworks-container'),
        rotatingCircle: document.getElementById('rotating-circle'),
        startScreenContent: document.querySelector('#start-screen .screen-content')
    };


    let phoneTimerInterval = null;
    let isPhoneUsed = false;
    let isAudienceUsed = false;
    let isHintUsed = false;
    let currentQuestionIndex = 0;
    let selectedAnswer = null;
    let playerName = '';

    // =========================================================
    // ⭐ MODIFICACIÓN CLAVE 1: Banco completo de 60 preguntas
    // =========================================================
    const allAvailableQuestions = [
        // --- capitulo 1 ----//
        { question: "Según el capítulo 1, ¿cuál fue la debilidad más terrible de Joab?", answers: ["Su falta de lealtad.", "Su desinterés por el liderazgo.", "Su reacción en la carne.", "Su falta de valentía."], correctAnswer: 2 },
        { question: "¿qué es lo que Joab hizo sin una orden directa de David", answers: ["Se quedó en casa en lugar de ir a la batalla.", "Inició una guerra contra Abner.", "Se unió a los enemigos del reino.", "Se negó a seguir a David en el desierto."], correctAnswer: 1 },
        { question: "¿Qué consecuencia trágica tuvo la guerra que Joab inició por su cuenta?", answers: ["La pérdida de todo el ejército de David.", "David fue despojado de su reino.", "Joab perdió su posición como general.", "La muerte de su hermano, Asael."], correctAnswer: 3 },
        { question: "Según el capítulo 1, ¿qué podría provocar la 'confianza excesiva' de un líder?", answers: ["Que se vuelva más humilde y sabio.", "Que gane todas sus batallas sin ayuda.", "Que sea más leal a su superior.", "Que deje de ver lo que debe de ver y empiece a ver lo que no fue llamado a ver"], correctAnswer: 3 },
        { question: "¿Qué lección se extrae del fracaso del liderazgo de Asael, hermano de Joab?"
            , answers: ["Que un líder nunca debe huir de la batalla.", "Que el carácter y la impulsividad de un líder pueden llevarlo al fracaso.", "Que la velocidad es más importante que la sabiduría en la batalla.", "Que es bueno hacer lo que no fue llamado a hacer."], correctAnswer: 1 },
        { question: "¿qué característica principal tienen los líderes al estilo de Joab?"
            , answers: ["Pelean las batallas que Dios les ha dictado.", "Siempre aceptan la responsabilidad de sus errores.", "Tienen un espíritu de individualismo, rebeldía e independencia.", "Son humildes y obedientes a su pastor."], correctAnswer: 2 },
        { question: "¿Qué nos enseña la muerte de Asael, al ser herido en la quinta costilla?"
            , answers: ["Que la velocidad no importa en el liderazgo.", "Que los líderes deben ser más fuertes que sus enemigos.", "Que la vanidad no afecta a los líderes.", "Que por más bueno que seas, siempre necesitarás de otros."], correctAnswer: 3 },
            //---capitulo 2 ---//
        { question: "en el capitulo 2 ¿Cuál de las siguientes afirmaciones describe mejor a Barzilai, según el capítulo?"
            , answers: ["Un hombre noble, anciano y leal a su rey.", "Un consejero del rey que se oponía a David.", "Un joven guerrero que se destacó en la batalla.", "Un anciano ambicioso que buscaba poder político."], correctAnswer: 0 },

        { question: "Barzilai ayudó a David en un momento de gran dificultad. ¿Qué fue lo que le ofreció para mostrar su apoyo?"
            , answers: ["Dinero y armas para su ejército.", "Suministros y alimentos para su comitiva", "Soldados para luchar en su favor.", "Un lugar para esconderse en su casa."], correctAnswer: 1 },

        { question: "¿Cuál fue la razón principal por la que Barzilai rechazó la oferta de David?"
            , answers: ["Temía a los enemigos de David en la corte.", "Tenía que cuidar de su familia.", "Prefería vivir una vida tranquila en su tierra natal.", "Sentía que no merecía el honor."], correctAnswer: 2 },

        { question: "En lugar de aceptar la oferta, ¿a quién le pidió Barzilai a David que llevara en su lugar?"
            , answers: ["A su sobrino, quien era un joven ambicioso.", "A su siervo más leal.", "A su nieto, para que sirviera como paje.", "A su hijo Quiman."], correctAnswer: 3 },

        { question: "Una lección clave del liderazgo de Barzilai, según el capítulo, es que un líder debe…"
            , answers: ["Aceptar todas las oportunidades de promoción.", "Nunca rechazar una oferta de un superior.", "Saber cuándo retirarse y delegar en la siguiente generación.", "Ser ambicioso y buscar el reconocimiento."], correctAnswer: 2 },

        { question: "El liderazgo de Barzilai se diferencia del liderazgo de Joab (Capítulo 1) en que Barzilai era..."
            , answers: ["Humilde y sabía cuándo servir sin esperar recompensa.", "Un líder militar que tomaba decisiones rápidas.", "Más joven y con más energía.", "Más ambicioso y buscaba el favor del rey."], correctAnswer: 0 },

        { question: "Según el capítulo 2, un líder al estilo de Barzilai se preocupa por...", answers: ["Mantener el poder y el control a toda costa.", "La preparación y el empoderamiento de la siguiente generación.", "La acumulación de riquezas y bienes materiales.", "Asegurar que su nombre sea recordado por generaciones."], correctAnswer: 1 },

        { question: "¿Qué lección sobre la humildad y la sabiduría en el liderazgo se puede extraer del ejemplo de Barzilai?", answers: ["Un líder humilde siempre debe ceder su posición, sin importar las circunstancias.", "La verdadera sabiduría es reconocer las propias limitaciones y saber cuándo es tiempo de descansar.", 
            "Un líder sabio busca la aprobación de todos para sus decisiones.", "Un líder humilde rechaza todo tipo de honor y reconocimiento."], correctAnswer: 1 },


    ];

    // ⭐ NUEVA VARIABLE: Contendrá el set de 15 preguntas para la partida actual
    let currentRoundQuestions = [];


    const roundPoints = [
        100, 200, 300, 500, 1000,
        2000, 4000, 8000, 16000, 32000,
        64000, 125000, 250000, 500000, 1000000
    ];


    function unlockAudio() {
        if (audioUnlocked) return;

        allGameSoundFiles.forEach(sound => {
            sound.volume = 0;
            sound.play().then(() => {
                sound.pause();
                sound.currentTime = 0;
                sound.volume = 1.0;
                audioUnlocked = true;
                console.log("Audio desbloqueado por interacción del usuario.");
            }).catch(e => {
                // Posible error si el navegador aún bloquea.
            });
        });
    }
    function typeWriterEffect(element, text) {
        if (!element) return;
        element.textContent = text;
        element.classList.remove('typewriter-anim');
        void element.offsetWidth;
        element.classList.add('typewriter-anim');
    }

    function showScreen(screenId) {
        for (let key in screens) {
            if (screens[key]) {
                screens[key].classList.remove('active');
            }
        }
        if (screens[screenId]) {
            screens[screenId].classList.add('active');
        }

        if (gameElements.fireworksContainer) gameElements.fireworksContainer.classList.add('hidden');
        if (gameElements.rotatingCircle) gameElements.rotatingCircle.classList.add('hidden');
    }

    function playSound(soundKey, loop = false) {

        if (!audioUnlocked && soundKey !== 'win') return;

        stopAllSounds();
        const sound = gameSounds[soundKey];
        if (sound) {
            sound.loop = loop;
            sound.play().catch(error => console.error("Error al reproducir el audio:", error));
        }
    }

    function stopAllSounds() {
        for (const key in gameSounds) {
            if (gameSounds[key]) {
                gameSounds[key].pause();
                gameSounds[key].currentTime = 0;
            }
        }
    }

    function playRandomTrack() {
        if (!backgroundMusic || trackList.length === 0) return;
        const randomIndex = Math.floor(Math.random() * trackList.length);
        const selectedTrack = trackList[randomIndex];
        backgroundMusic.src = selectedTrack;
        backgroundMusic.play().catch(error => {
            console.warn("Música de fondo no se reprodujo automáticamente.");
        });
    }

    function stopBackgroundMusic() {
        if (backgroundMusic) {
            backgroundMusic.pause();
            backgroundMusic.currentTime = 0;
            backgroundMusic.removeEventListener('ended', playRandomTrack);
        }
    }

    function startBackgroundMusic() {
        if (backgroundMusic) {
            backgroundMusic.removeEventListener('ended', playRandomTrack);
            backgroundMusic.addEventListener('ended', playRandomTrack);
            playRandomTrack();
        }
    }

   // =========================================================
    // ⭐ MODIFICACIÓN CLAVE 2: Ahora toma las primeras 15 preguntas en orden
    // =========================================================
    function resetGameState() {
        currentQuestionIndex = 0;
        isPhoneUsed = false;
        isAudienceUsed = false;
        isHintUsed = false;
        selectedAnswer = null;

        // AHORA SIMPLEMENTE TOMAMOS LAS PRIMERAS 15 PREGUNTAS EN ORDEN DEL ARRAY COMPLETO
        currentRoundQuestions = allAvailableQuestions.slice(0, 15);
        
        // El resto de tu función...
        if (phoneTimerInterval !== null) {
            clearInterval(phoneTimerInterval);
            // ... (resto de la función)
        }
        // ...
        stopBackgroundMusic();
        stopAllSounds();
    }

    function showFinalScreen() {
        resetGameState();
        stopBackgroundMusic();

        showScreen('win');

        playSound('win');

        const winText = "¡FELICIDADES!";
        const finalPrize = roundPoints[14].toLocaleString();

        if (gameElements.winTitle) {
            typeWriterEffect(gameElements.winTitle, winText);
        }
        if (gameElements.fireworksContainer) {
            gameElements.fireworksContainer.classList.remove('hidden');
        }
        if (gameElements.rotatingCircle) {
            gameElements.rotatingCircle.classList.remove('hidden');
        }

        setTimeout(() => {
            if (gameElements.finalScoreDisplay) {
                gameElements.finalScoreDisplay.textContent = `¡Has ganado el gran premio de ${finalPrize} Pts, ${playerName}!`;
                gameElements.finalScoreDisplay.classList.add('visible');
            }
        }, 1500);

        setTimeout(() => {
            if(buttons.restartWin) buttons.restartWin.style.display = 'inline-block';
            if(buttons.backToStartWin) buttons.backToStartWin.style.display = 'inline-block';
        }, 2500);


        if (buttons.restartWin) buttons.restartWin.style.display = 'none';
        if (buttons.backToStartWin) buttons.backToStartWin.style.display = 'none';


        history.replaceState(null, null, window.location.pathname + window.location.search);
    }

    function startGame() {
        const inputName = gameElements.playerNameInput ? gameElements.playerNameInput.value.trim() : 'Jugador Anónimo';

        if (inputName.length === 0) {
            alert("Por favor, introduce tu nombre para empezar.");
            gameElements.playerNameInput.focus();
            return;
        }

        playerName = inputName;
        resetGameState();
        playSound('start');

        if (gameElements.startScreenContent) {
            gameElements.startScreenContent.classList.add('fade-out');

            setTimeout(() => {
                showScreen('game');
                loadQuestion();
                gameElements.startScreenContent.classList.remove('fade-out');
            }, 500);
        } else {
            showScreen('game');
            loadQuestion();
        }
    }

    function toggleRounds() {
        if (!gameElements.roundsContainer || !buttons.toggleRounds) return;

        gameElements.roundsContainer.classList.toggle('minimized');

        const isMinimized = gameElements.roundsContainer.classList.contains('minimized');
        buttons.toggleRounds.textContent = isMinimized ? 'Mostrar Rondas ➡️' : 'Ocultar Rondas ⬅️';
    }

    function generateRoundsList() {
        if (!gameElements.roundsList) return;

        gameElements.roundsList.innerHTML = '';
        roundPoints.slice().reverse().forEach((points, index) => {
            const roundNumber = 15 - index;
            const li = document.createElement('li');
            li.dataset.round = roundNumber - 1;
            li.innerHTML = `<span>Ronda ${roundNumber}</span><span>${points.toLocaleString()} Pts</span>`;
            gameElements.roundsList.appendChild(li);
        });
    }

    function updateRoundsHighlight() {
        if (!gameElements.roundsList) return;

        const rounds = gameElements.roundsList.querySelectorAll('li');
        rounds.forEach(li => li.classList.remove('current-round'));

        const currentRoundLi = gameElements.roundsList.querySelector(`li[data-round="${currentQuestionIndex}"]`);
        if (currentRoundLi) {
            currentRoundLi.classList.add('current-round');
            currentRoundLi.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    // =========================================================
    // ⭐ MODIFICACIÓN CLAVE 3: Usa el set de preguntas de la ronda actual
    // =========================================================
    function loadQuestion() {
        selectedAnswer = null;
        gameElements.answers.innerHTML = '';
        buttons.reveal.style.display = 'inline-block';
        buttons.next.style.display = 'none';

        if (gameElements.audiencePoll) gameElements.audiencePoll.classList.add('hidden');
        if (gameElements.phoneTimer) {
            gameElements.phoneTimer.classList.add('hidden');
            gameElements.timerDisplay.classList.remove('timer-urgent');
        }

        if (phoneTimerInterval !== null) {
            clearInterval(phoneTimerInterval);
            phoneTimerInterval = null;
        }

        if (buttons.restartFail) buttons.restartFail.style.display = 'none';
        if (buttons.backToStartFail) buttons.backToStartFail.style.display = 'none';

        if (buttons.hint) {
            buttons.hint.style.display = 'inline-block';
            buttons.hint.disabled = isHintUsed;
            if(isHintUsed) buttons.hint.classList.add('used'); else buttons.hint.classList.remove('used');
        }
        if (buttons.audience) {
            buttons.audience.style.display = 'inline-block';
            buttons.audience.disabled = isAudienceUsed;
            if(isAudienceUsed) buttons.audience.classList.add('used'); else buttons.audience.classList.remove('used');
        }
        if (buttons.phone) {
            buttons.phone.style.display = 'inline-block';
            buttons.phone.disabled = isPhoneUsed;
            if(isPhoneUsed) buttons.phone.classList.add('used'); else buttons.phone.classList.remove('used');
        }

        playSound('suspense', true);

        // Uso de currentRoundQuestions en lugar de questions
        const currentQuestion = currentRoundQuestions[currentQuestionIndex];
        gameElements.question.textContent = currentQuestion.question;

        currentQuestion.answers.forEach((answer, index) => {
            const button = document.createElement('button');
            button.textContent = String.fromCharCode(65 + index) + ": " + answer;
            button.classList.add('answer-btn');
            button.dataset.index = index;
            button.style.visibility = 'visible';
            button.addEventListener('click', selectAnswer);
            gameElements.answers.appendChild(button);
        });

        updateRoundsHighlight();
    }

    function selectAnswer(event) {
        const previouslySelected = document.querySelector('.answer-btn.selected');
        if (previouslySelected) {
            previouslySelected.classList.remove('selected');
        }
        const selectedButton = event.target;
        selectedAnswer = parseInt(selectedButton.dataset.index);
        selectedButton.classList.add('selected');
    }

// =========================================================
// --- FUNCIÓN CENTRAL PARA ENVIAR DATOS A FORMSUBMIT (SOLUCIÓN FINAL) ---
// =========================================================
/**
 * Envía el progreso del juego a FormSubmit en momentos clave.
 * @param {string} player - Nombre del jugador.
 * @param {number} roundIndex - Índice de la ronda actual (0 a 14).
 * @param {number} points - Puntos ganados en esa ronda o totales.
 * @param {string} status - 'VICTORIA' o 'PERDIDA'.
 */
function sendGameProgress(player, roundIndex, points, status) {
    if (roundIndex < 0) return;

    const finalPrize = points.toLocaleString();
    const roundNumber = roundIndex + 1;
    let safeScoreText = "0 Pts";
    
    // ... (Lógica de puntuación segura, no necesita cambio)
    if (roundIndex > 0) {
        const safetyIndex = (roundIndex >= 10) ? 9 : (roundIndex >= 5) ? 4 : -1;
        if (status === 'PERDIDA') {
             safeScoreText = (safetyIndex >= 0) ? roundPoints[safetyIndex].toLocaleString() + " Pts" : "0 Pts";
        } else {
             safeScoreText = finalPrize + " Pts";
        }
    }


    const formUrl = 'https://formsubmit.co/elias230012@gmail.com'; 

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = formUrl;
    form.style.display = 'none';

    // 1. Definimos la URL de redirección
    // Mantenemos la parte principal de la URL y si es Victoria, añadimos '#win'
    const currentUrlBase = window.location.href.split('#')[0];
    const nextUrl = (status === 'VICTORIA') 
        ? currentUrlBase + '#win'
        : currentUrlBase; // Redirige de vuelta a la página principal del juego.
    
    // 2. Definir los campos
    const fields = {
        '_subject': `Juego Bíblico: ${status}`,
        'Nombre': player,
        'Ronda_Finalizada': `${roundNumber} / ${currentRoundQuestions.length}`,
        'Puntuación_Alcanzada': `${finalPrize} Pts`,
        'Puntuación_Segura_Ganada': safeScoreText,
        'Estado_Partida': status,
        '_captcha': 'false',
        // ⭐ CAMBIO CLAVE: Incluimos _next en todos los casos
        '_next': nextUrl 
    };
    
    // 3. Crear los inputs y añadirlos al formulario
    for (const name in fields) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = fields[name];
        form.appendChild(input);
    }

    // 4. Enviar
    document.body.appendChild(form);
    form.submit();

    console.log(`Resultado enviado a FormSubmit: ${status} en Ronda ${roundNumber}. Redireccionando a: ${nextUrl}`);
}

    // =========================================================
    // ⭐ nextQuestion (MODIFICADA: Solo envía al GANAR)
    // =========================================================
    function nextQuestion() {
        // currentQuestionIndex es el índice de la pregunta que acaba de responder (0-14)
        if (currentQuestionIndex === currentRoundQuestions.length - 1) {
            
            // El jugador acaba de responder la última pregunta (índice 14, ronda 15)
            // ⭐ ENVÍO CLAVE: Solo enviamos si gana la última pregunta
            sendGameProgress(playerName, 14, roundPoints[14], 'VICTORIA');

            showScreen('win');
            stopAllSounds();
            stopBackgroundMusic();

        } else {
            // Ya NO se envía el formulario en los checkpoints (Rondas 5 y 10).
            
            currentQuestionIndex++;
            loadQuestion();
        }
    }


    // =========================================================
    // ⭐ MODIFICACIÓN CLAVE 4: revealAnswer (Envía a FormSubmit al perder)
    // =========================================================
    function revealAnswer() {
        if (selectedAnswer === null) {
            alert("Por favor, selecciona una respuesta.");
            return;
        }

        // Uso de currentRoundQuestions
        const currentQuestion = currentRoundQuestions[currentQuestionIndex];
        const correctIndex = currentQuestion.correctAnswer;
        const answerButtons = document.querySelectorAll('.answer-btn');
        if (phoneTimerInterval !== null) {
            clearInterval(phoneTimerInterval);
            phoneTimerInterval = null;
        }
        if (gameElements.phoneTimer) {
            gameElements.phoneTimer.classList.add('hidden');
            gameElements.timerDisplay.classList.remove('timer-urgent');
        }

        if (buttons.hint) buttons.hint.disabled = true;
        if (buttons.audience) buttons.audience.disabled = true;
        if (buttons.phone) buttons.phone.disabled = true;

        stopAllSounds();

        let isCorrect = (selectedAnswer === correctIndex);

        if (isCorrect) {
            playSound('correct');
        } else {
            playSound('wrong');
        }

        answerButtons.forEach(button => {
            button.disabled = true;
            const buttonIndex = parseInt(button.dataset.index);
            if (buttonIndex === correctIndex) {
                button.classList.add('correct');
            } else if (buttonIndex === selectedAnswer) {
                button.classList.add('wrong');
            }
        });

        buttons.reveal.style.display = 'none';

        if (isCorrect) {
            // Uso de currentRoundQuestions.length
            if (currentQuestionIndex === currentRoundQuestions.length - 1) {
                buttons.next.textContent = "Ver Resultado Final";
            }
            buttons.next.style.display = 'inline-block';
        } else {
            // El jugador perdió. Calculamos la puntuación segura.
            const roundLostIndex = currentQuestionIndex;
            const winAmountIndex = (roundLostIndex >= 10) ? 9 : (roundLostIndex >= 5) ? 4 : -1;
            const finalScore = winAmountIndex >= 0 ? roundPoints[winAmountIndex] : 0;
            
            // ⭐ ENVÍO CLAVE: Enviar datos al perder.
            sendGameProgress(playerName, roundLostIndex, finalScore, 'PERDIDA');


            gameElements.question.textContent = "¡Respuesta Incorrecta! El juego ha terminado.";
            gameElements.answers.innerHTML = `<p style="font-size: 1.6em; color: #ff536aff;">Perdiste esta vez, pero la biblia dice en Filipenses 4:9 En cuanto a lo que habéis aprendido, recibido y oído de mí, y visto en mí, eso haced; y el Dios de la paz estará con vosotros... tu puntuacion es.: ${finalScore.toLocaleString()} Pts</p>`;
            buttons.next.style.display = 'none';

            if (buttons.restartFail) {
                buttons.restartFail.style.display = 'inline-block';
                buttons.restartFail.textContent = "Volver a Intentarlo";
                buttons.restartFail.classList.add('restart-btn-fail');
            }
            if (buttons.backToStartFail) {
                buttons.backToStartFail.style.display = 'inline-block';
                buttons.backToStartFail.textContent = "Ir a Inicio";
                buttons.backToStartFail.classList.add('back-to-start-fail-btn');
            }
        }
    }


    // =========================================================
    // ⭐ MODIFICACIÓN CLAVE 5: Usa currentRoundQuestions en comodines
    // =========================================================
    function useHint() {
        if (isHintUsed) return;
        isHintUsed = true;
        buttons.hint.disabled = true;
        if (buttons.hint) buttons.hint.classList.add('used');

        const currentQuestion = currentRoundQuestions[currentQuestionIndex];
        const correctIndex = currentQuestion.correctAnswer;
        const answerButtons = document.querySelectorAll('.answer-btn');

        const incorrectIndices = [];
        answerButtons.forEach((btn, index) => {
            if (index !== correctIndex && btn.style.visibility !== 'hidden') {
                incorrectIndices.push(index);
            }
        });

        while (incorrectIndices.length > 1) {
            const randomIndex = Math.floor(Math.random() * incorrectIndices.length);
            const indexToRemove = incorrectIndices.splice(randomIndex, 1)[0];
            answerButtons[indexToRemove].style.visibility = 'hidden';
            answerButtons[indexToRemove].disabled = true;
        }
    }

    function useAudience() {
        if (isAudienceUsed) return;
        isAudienceUsed = true;
        buttons.audience.disabled = true;
        if (buttons.audience) buttons.audience.classList.add('used');

        const currentQuestion = currentRoundQuestions[currentQuestionIndex];
        const correctIndex = currentQuestion.correctAnswer;
        const percentages = [0, 0, 0, 0];
        let remaining = 100;

        const correctPercentage = Math.floor(Math.random() * 40) + 50;
        percentages[correctIndex] = correctPercentage;
        remaining -= correctPercentage;

        const incorrectIndices = [0, 1, 2, 3].filter(i => i !== correctIndex);

        for (let i = 0; i < incorrectIndices.length; i++) {
            const index = incorrectIndices[i];

            if (i === incorrectIndices.length - 1) {
                percentages[index] = remaining;
            } else {
                const maxAllocation = Math.min(remaining, Math.floor(remaining / (incorrectIndices.length - i)) * 2 || 1);
                let randomPart = Math.floor(Math.random() * maxAllocation);
                if (randomPart === 0 && remaining > 0) randomPart = 1;

                percentages[index] = randomPart;
                remaining -= randomPart;
            }
        }

        if (!gameElements.audiencePoll) return;
        gameElements.audiencePoll.classList.remove('hidden');

        document.querySelectorAll('.poll-bar').forEach((bar, index) => {
            const pollPercentage = bar.querySelector('.poll-percentage');
            if (pollPercentage) {
                pollPercentage.style.height = percentages[index] + '%';
                pollPercentage.textContent = percentages[index] + '%';
            }
        });
    }

    function usePhone() {
        if (isPhoneUsed) return;
        isPhoneUsed = true;
        buttons.phone.disabled = true;
        if (buttons.phone) buttons.phone.classList.add('used');

        if (!gameElements.phoneTimer || !gameElements.timerDisplay) return;

        gameElements.phoneTimer.classList.remove('hidden');
        let timeLeft = 60;
        gameElements.timerDisplay.textContent = timeLeft;

        if (phoneTimerInterval !== null) clearInterval(phoneTimerInterval);

        phoneTimerInterval = setInterval(() => {
            timeLeft--;
            gameElements.timerDisplay.textContent = timeLeft;
            if (timeLeft <= 10) {
                gameElements.timerDisplay.classList.add('timer-urgent');
            } else {
                gameElements.timerDisplay.classList.remove('timer-urgent');
            }

            if (timeLeft <= 0) {
                clearInterval(phoneTimerInterval);
                phoneTimerInterval = null;
                gameElements.phoneTimer.classList.add('hidden');
                gameElements.timerDisplay.classList.remove('timer-urgent');
                alert("Tiempo de llamada agotado.");
            }
        }, 1000);

        setTimeout(() => {
            const currentQuestion = currentRoundQuestions[currentQuestionIndex];
            const correctText = String.fromCharCode(65 + currentQuestion.correctAnswer);
            alert(`Tu amigo dice: 'Estoy 90% seguro de que la respuesta correcta es la ${correctText}.'`);
        }, 10000);
    }
    
    if (buttons.start) buttons.start.addEventListener('click', () => {
        unlockAudio();
        startGame();
    });
    if (buttons.startFromRules) buttons.startFromRules.addEventListener('click', () => {
        unlockAudio();
        startGame();
    });

    if (buttons.toggleRounds) buttons.toggleRounds.addEventListener('click', toggleRounds);

    if (buttons.showRules) buttons.showRules.addEventListener('click', () => {
        showScreen('rules');
        startBackgroundMusic();
    });

    if (buttons.backToStart) buttons.backToStart.addEventListener('click', () => { showScreen('start'); startBackgroundMusic(); });

    if (buttons.reveal) buttons.reveal.addEventListener('click', revealAnswer);
    if (buttons.next) buttons.next.addEventListener('click', nextQuestion);
    if (buttons.hint) buttons.hint.addEventListener('click', useHint);
    if (buttons.audience) buttons.audience.addEventListener('click', useAudience);
    if (buttons.phone) buttons.phone.addEventListener('click', usePhone);
    if (buttons.restartFail) buttons.restartFail.addEventListener('click', () => {
        startGame();
        buttons.restartFail.style.display = 'none';
        if (buttons.backToStartFail) buttons.backToStartFail.style.display = 'none';
    });
    if (buttons.backToStartFail) buttons.backToStartFail.addEventListener('click', () => {
        resetGameState();
        showScreen('start');
        startBackgroundMusic();

        if (buttons.restartFail) buttons.restartFail.style.display = 'none';
        if (buttons.backToStartFail) buttons.backToStartFail.style.display = 'none';
    });
    if (buttons.restartWin) buttons.restartWin.addEventListener('click', () => {
        startGame();
    });

    if (buttons.backToStartWin) buttons.backToStartWin.addEventListener('click', () => {
        resetGameState();
        showScreen('start');
        startBackgroundMusic();
    });
    generateRoundsList();

    const hash = window.location.hash;

    if (hash === '#win') {
        audioUnlocked = true;
        playerName = 'Campeón';
        setTimeout(() => {
            showFinalScreen();
        }, 100);

    } else {
        showScreen('start');
        startBackgroundMusic();
    }
});