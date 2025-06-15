// --- Game State Variables ---
let team1 = {
    name: '',
    runs: 0,
    wickets: 0,
    overs: 0,
    balls: 0,
    target: null // Target set by the first team for the second
};

let team2 = {
    name: '',
    runs: 0,
    wickets: 0,
    overs: 0,
    balls: 0,
    target: null
};

let currentInnings = 1; // 1 or 2
let battingTeam = null; // Reference to the current batting team object (team1 or team2)
let bowlingTeam = null; // Reference to the current bowling team object
let oversLimit = 0; // Will be set by user input

// Removed: let history = [];

// --- DOM Elements ---
const team1NameInput = document.getElementById('team1NameInput');
const team2NameInput = document.getElementById('team2NameInput');
const oversLimitInput = document.getElementById('oversLimitInput');
const startGameButton = document.getElementById('startGameButton');
const teamInputSection = document.getElementById('teamInputSection');

const gameplaySection = document.getElementById('gameplaySection');
const currentBattingTeamDisplay = document.getElementById('currentBattingTeamDisplay');

// Team 1 Score Display
const displayTeam1Name = document.getElementById('displayTeam1Name');
const displayTeam1Runs = document.getElementById('displayTeam1Runs');
const displayTeam1Wickets = document.getElementById('displayTeam1Wickets');
const displayTeam1Overs = document.getElementById('displayTeam1Overs');
const team1TargetDisplay = document.getElementById('team1Target');

// Team 2 Score Display
const displayTeam2Name = document.getElementById('displayTeam2Name');
const displayTeam2Runs = document.getElementById('displayTeam2Runs');
const displayTeam2Wickets = document.getElementById('displayTeam2Wickets');
const displayTeam2Overs = document.getElementById('displayTeam2Overs');
const team2TargetDisplay = document.getElementById('team2Target');

const actionButtonsDiv = document.getElementById('actionButtons');
const runButtons = document.querySelectorAll('.run-btn');
const addWicketButton = document.getElementById('addWicketButton');
const addWideButton = document.getElementById('addWideButton');
const addNoBallButton = document.getElementById('addNoBallButton');
const addDotBallButton = document.getElementById('addDotBallButton');

const statusMessage = document.getElementById('statusMessage');
// Removed: const undoButton = document.getElementById('undoButton');
const endInningsButton = document.getElementById('endInningsButton');
const resetGameButton = document.getElementById('resetGameButton');
const finalResultDisplay = document.getElementById('finalResult');


// --- Game Initialization & Control ---

function initializeGame() {
    team1.name = team1NameInput.value.trim();
    team2.name = team2NameInput.value.trim();
    const parsedOversLimit = parseInt(oversLimitInput.value);

    if (!team1.name || !team2.name) {
        alert('Please enter names for both teams!');
        return;
    }
    if (isNaN(parsedOversLimit) || parsedOversLimit <= 0) {
        alert('Please enter a valid overs limit (a positive number).');
        return;
    }
    oversLimit = parsedOversLimit; // Set the global overs limit

    displayTeam1Name.textContent = team1.name;
    displayTeam2Name.textContent = team2.name;

    teamInputSection.style.display = 'none';
    gameplaySection.style.display = 'block';
    resetGameButton.style.display = 'block';

    // Disable inputs after game starts
    team1NameInput.disabled = true;
    team2NameInput.disabled = true;
    oversLimitInput.disabled = true;
    startGameButton.disabled = true;

    startInnings(1); // Start the first innings
    updateScorecardDisplay();
}

function startInnings(inningsNum) {
    currentInnings = inningsNum;
    finalResultDisplay.style.display = 'none';
    // Removed: history = []; // Clear history at the start of each innings

    if (currentInnings === 1) {
        battingTeam = team1;
        bowlingTeam = team2;
        endInningsButton.style.display = 'block';
        statusMessage.textContent = `${battingTeam.name} is batting first. (Max ${oversLimit} overs)`;
        team2TargetDisplay.style.display = 'none';
    } else { // Innings 2
        battingTeam = team2;
        bowlingTeam = team1;
        endInningsButton.style.display = 'none'; // Hide for 2nd innings
        const target = bowlingTeam.runs + 1;
        statusMessage.textContent = `${battingTeam.name} is chasing ${target} runs in ${oversLimit} overs.`;
        team2TargetDisplay.textContent = `Target: ${target}`;
        team2TargetDisplay.style.display = 'block';
    }

    currentBattingTeamDisplay.textContent = `${battingTeam.name} Batting`;
    enableActionButtons();
    // Removed: undoButton.disabled = true; // Disable undo at start of new innings
}

function endGame(message, resultType) {
    statusMessage.textContent = message;
    finalResultDisplay.textContent = message;
    finalResultDisplay.className = `status-message final-result ${resultType}`;
    finalResultDisplay.style.display = 'block';
    disableActionButtons();
    endInningsButton.style.display = 'none';
    // Removed: undoButton.disabled = true; // No undo after game ends
}

function resetGame() {
    // Reset all team data
    team1 = { name: '', runs: 0, wickets: 0, overs: 0, balls: 0, target: null };
    team2 = { name: '', runs: 0, wickets: 0, overs: 0, balls: 0, target: null };
    oversLimit = 0; // Reset overs limit

    currentInnings = 1;
    battingTeam = null;
    bowlingTeam = null;
    // Removed: history = []; // Clear history on full reset

    // Reset display elements
    team1NameInput.value = '';
    team2NameInput.value = '';
    oversLimitInput.value = '2'; // Reset to default 2 overs
    teamInputSection.style.display = 'block';
    gameplaySection.style.display = 'none';
    statusMessage.textContent = '';
    finalResultDisplay.style.display = 'none';
    endInningsButton.style.display = 'none';
    resetGameButton.style.display = 'none';
    team1TargetDisplay.style.display = 'none';
    team2TargetDisplay.style.display = 'none';
    // Removed: undoButton.disabled = true; // Disable undo button

    // Re-enable inputs
    team1NameInput.disabled = false;
    team2NameInput.disabled = false;
    oversLimitInput.disabled = false;
    startGameButton.disabled = false;

    updateScorecardDisplay(); // Reset displayed scores to 0
}


// --- Score & Display Management ---

function updateScorecardDisplay() {
    displayTeam1Runs.textContent = team1.runs;
    displayTeam1Wickets.textContent = team1.wickets;
    displayTeam1Overs.textContent = `${team1.overs}.${team1.balls}`;

    displayTeam2Runs.textContent = team2.runs;
    displayTeam2Wickets.textContent = team2.wickets;
    displayTeam2Overs.textContent = `${team2.overs}.${team2.balls}`;
}

function disableActionButtons() {
    runButtons.forEach(button => button.disabled = true);
    addWicketButton.disabled = true;
    addWideButton.disabled = true;
    addNoBallButton.disabled = true;
    addDotBallButton.disabled = true;
}

function enableActionButtons() {
    runButtons.forEach(button => button.disabled = false);
    addWicketButton.disabled = false;
    addWideButton.disabled = false;
    addNoBallButton.disabled = false;
    addDotBallButton.disabled = false;
}

// Removed: saveState() function
// Removed: undoLastAction() function


function checkOverAndWicket(isExtra = false) {
    // Removed: saveState(); // No longer saving state for undo

    if (!isExtra) {
        battingTeam.balls++;
    }

    if (battingTeam.balls === 6) {
        battingTeam.overs++;
        battingTeam.balls = 0;
    }

    updateScorecardDisplay();
    checkGameEndConditions();
}

function checkGameEndConditions() {
    const isAllOut = battingTeam.wickets >= 10;
    const isOversCompleted = battingTeam.overs >= oversLimit;

    // --- Innings 1 End Conditions ---
    if (currentInnings === 1) {
        if (isAllOut || isOversCompleted) {
            let message = '';
            if (isAllOut) message = `${battingTeam.name} is All Out! `;
            if (isOversCompleted) message += `All ${oversLimit} overs completed. `;
            message += `Innings 1 ends.`;
            statusMessage.textContent = message;

            endInningsButton.style.display = 'block';
            disableActionButtons();
            // Removed: undoButton.disabled = true; // No undo once innings ends
        }
    }
    // --- Innings 2 End Conditions ---
    else if (currentInnings === 2) {
        const target = bowlingTeam.runs + 1;

        // Scenario 1: Chasing team wins
        if (battingTeam.runs >= target) {
            const wicketsRemaining = 10 - battingTeam.wickets;
            endGame(`${battingTeam.name} wins by ${wicketsRemaining} wickets!`, 'win');
        }
        // Scenario 2: Chasing team is all out AND hasn't reached target
        else if (isAllOut) {
            const runsDifference = target - battingTeam.runs - 1;
            endGame(`${bowlingTeam.name} wins by ${runsDifference} runs!`, 'loss');
        }
        // Scenario 3: All overs bowled AND target not reached
        else if (isOversCompleted) {
            const runsDifference = target - battingTeam.runs - 1; // Runs needed
            endGame(`${bowlingTeam.name} wins by ${runsDifference} runs!`, 'loss');
        }
    }
}


// --- Event Handlers for Actions ---

startGameButton.addEventListener('click', initializeGame);
// Removed: undoButton.addEventListener('click', undoLastAction);

endInningsButton.addEventListener('click', () => {
    if (currentInnings === 1) {
        team2.target = team1.runs + 1; // Set target for the second team
        statusMessage.textContent = `Innings 1 over. ${team2.name} needs ${team2.target} runs to win in ${oversLimit} overs.`;
        endInningsButton.style.display = 'none';
        startInnings(2); // Start the second innings
    }
});

resetGameButton.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset the entire game?')) {
        resetGame();
    }
});


runButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        const runs = parseInt(event.target.dataset.runs);
        battingTeam.runs += runs;
        statusMessage.textContent = `${runs} Run${runs !== 1 ? 's' : ''}!`;
        checkOverAndWicket();
    });
});

addWicketButton.addEventListener('click', () => {
    battingTeam.wickets++;
    statusMessage.textContent = 'Wicket!';
    checkOverAndWicket();
});

addWideButton.addEventListener('click', () => {
    battingTeam.runs += 1;
    statusMessage.textContent = 'Wide Ball (1 Run)!';
    checkOverAndWicket(true);
});

addNoBallButton.addEventListener('click', () => {
    battingTeam.runs += 1;
    statusMessage.textContent = 'No Ball (1 Run)!';
    checkOverAndWicket(true);
});

addDotBallButton.addEventListener('click', () => {
    statusMessage.textContent = 'Dot Ball!';
    checkOverAndWicket();
});

// Initial display setup (only update display, don't start game)
updateScorecardDisplay();