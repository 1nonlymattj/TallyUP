let homePlayers = [];
let awayPlayers = [];
let inningScores = [];
let opponentInningScores = [];
let batterStats = [];

let selectedTeam = 'home';
let half = 'top';

let currentBatter = 0;
let outs = 0;
let batterIndex = 0;
let homeTeamRuns = 0;
let awayTeamRuns = 0;
let inning = 1;
let maxInnings = 9;
let timer;
let timerMinutes = 60;
let timerSecondsLeft = 0;
let startHalfInningScore = 0;

let bases = [false, false, false];
let timerInterval = null;
let gameOver = false;
let pendingHitType = null;
let runnersAdvancingForHit = false;

let homeTeam = '';
let awayTeam = '';

const savedToggle = localStorage.getItem('showAdvancedStats');

const positionOptions = [
    'P', 'C', '1B', '2B', '3B',
    'SS', 'LF', 'LC', 'RC', 'RF',
    'EH', 'CF', '5th Man'
];

const boxScore = {
  home: {},
  away: {}
};

// const baseCoords = {
//   0: { left: 140, top: 70 },  // 1st base
//   1: { left: 80, top: 0 }, // 2nd base
//   2: { left: 20, top: 70 },   // 3rd base
//   3: { left: 80, top: 140 }    // Home (optional)
// };

const baseCoords = {
  0: { top: 70, left: 140 }, // 1st base
  1: { top: 0,   left: 80 }, // 2nd base
  2: { top: 70,  left: 20 }, // 3rd base
  3: { top: 140, left: 80 }  // Home plate
};
