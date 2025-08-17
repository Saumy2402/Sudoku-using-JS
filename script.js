// Sudoku program

import {makeGrid, makeSudoku, makePuzzle} from './functionality.js';

// Setting up the game
const board = document.getElementById('board');
const numbers = document.getElementById('numbers');
const errors = document.getElementById('errors');
const overlay = document.getElementById('overlay');
var numberSelect = null;
var errorCount = 0;
var grid;
var puzzle;
const errorLimit = 3;
var selectedDifficulty;

// Counter
const clock = {
    counter: document.getElementById('counter'),
    startTime: 0,
    elapsedTime: 0,
    timer: null,
    isRunning: false,

    start(){
        if(!this.isRunning){
            this.isRunning = true;
            this.timer = setInterval(() => this.update(), 10);
            this.startTime = Date.now() - this.elapsedTime;
        }
    },

    pause(){
        if(this.isRunning){
            clearInterval(this.timer);
            this.startTime = Date.now() - this.elapsedTime;
            this.isRunning = false;
        }
    },

    reset(){
        if(this.isRunning){
            this.pause();
        }
        this.startTime = Date.now();
        this.update();
    },
    update(){
        this.elapsedTime = Date.now() - this.startTime;

        let hours = Math.floor(this.elapsedTime / (1000 * 60 * 60));
        let minutes = Math.floor(this.elapsedTime / (1000 * 60) % 60);
        let seconds = Math.floor((this.elapsedTime / 1000) % 60 );

        hours = String(hours).padStart(2, '0');
        minutes = String(minutes).padStart(2, '0');
        seconds = String(seconds).padStart(2, '0');

        this.counter.textContent = `${hours}:${minutes}:${seconds}`;
    }
};

// set the game
openModal(document.getElementById('gameDifficultyModal'));

function createNewSudoku(){
    // create the puzzle and its solution
    grid = makeGrid();
    makeSudoku(grid);
    let missingCount;
    console.log(selectedDifficulty);

    switch (selectedDifficulty) {
        case 'easy':
            missingCount = Math.floor(Math.random() * (42 - 35 + 1)) + 35;
            break;
        case 'medium':
            missingCount = Math.floor(Math.random() * (47 - 42 + 1) + 42);
            break;
        case 'hard':
            missingCount = Math.floor(Math.random() * (52 - 48 + 1) + 48);
            break;
        case 'expert':
            missingCount = Math.floor(Math.random() * (57 - 53 + 1)) + 53;
            break;
        default:
            missingCount = 40;
    }

    puzzle = makePuzzle(grid, missingCount);
    // puzzle = grid.map(r => r.slice());
    // puzzle[0][0] = 0;
}

function setGame(){
    let copy = puzzle.map(r => r.slice());
    // set clock
    clock.start();
    // set error count
    errors.innerText = `${errorCount}/${errorLimit}`;
    document.getElementById('difficulty-display').innerText = `Difficulty: ${selectedDifficulty}`;

    // set grid
    for(let i=0; i<9; i++){
        for(let j=0; j<9; j++){
            // <div id='0-0' class='tile'>1</div>
            let number = document.createElement('div');
            number.id = `${i}-${j}`;
            number.classList.add('tile');
            // click event listener
            number.addEventListener('click', tileClick);
            // mouseover event listener
            number.addEventListener('mouseover', tileMouseOver);
            // mouseout event listener
            number.addEventListener('mouseout', tileMouseOut);
            if(copy[i][j] != 0){
                number.innerText = copy[i][j];
                number.style.color = 'black';
            }
            
            // horizontal line
            if(i == 2 || i == 5 || i == 8){
                number.classList.add('bottom-border');
            }
            else if(i == 0){
                number.classList.add('top-border')
            }
            // vertical line
            if(j == 2 || j == 5 || j == 8){
                number.classList.add('right-border');
            }
            else if(j == 0){
                number.classList.add('left-border');
            }
                
            board.appendChild(number);
        }
    }

    // set numbers
    for(let i=1; i<=9; i++){
        // <div id='num1' class='digit'>1</div>
        let number = document.createElement('div');
        number.id = `num${i}`;
        number.classList.add('digit');
        number.innerText = i;
        number.addEventListener('click', numberClick);
        numbers.appendChild(number);

        if(Array.from(document.querySelectorAll('.tile')).filter(tile => {
                return tile.innerText == i;
                }).length == 9){
            number.classList.add('number-disable');
            number.removeEventListener('click', numberClick);
        }
    }
}

// number - click
function numberClick(event){
    if(numberSelect != null)
        numberSelect.classList.remove('dark-highlight');
    numberSelect = event.target;
    numberSelect.classList.add('dark-highlight');
}

// tile - click
function tileClick(event){
    if(numberSelect != null && event.target.innerText == ''){
        let coords = event.target.id.split('-');

        let x = parseInt(coords[0]);
        let y = parseInt(coords[1]);

        if(grid[x][y] == numberSelect.innerText){
            event.target.innerText = numberSelect.innerText;
            event.target.style.color = 'rgba(21, 2, 195, 1)';   
            event.target.dispatchEvent(new Event('mouseover'));
            
            // A particular number has been filled in the sudoku
            if(Array.from(document.querySelectorAll('.tile')).filter(tile => {
                return tile.innerText == numberSelect.innerText;
                }).length == 9){
                    numberSelect.classList.remove('dark-highlight');
                    numberSelect.classList.add('number-disable');
                    numberSelect.removeEventListener('click', numberClick);
                    numberSelect = null;
            }

            // if Player has won
            if(Array.from(document.querySelectorAll('.tile')).filter(tile => {
                return tile.innerText == '';
            }).length == 0){
                clock.pause();
                const resultModal = document.getElementById('resultModal')
                resultModal.classList.add('active');
                document.querySelector('#resultModal .message .text').innerText = 'YOU WIN!';   
                document.querySelector('#resultModal .message .text').style.color = 'rgba(0, 184, 3, 1)'
                document.querySelector('#resultModal .message .time').innerText = `TIME: ${clock.counter.innerText}`;
                document.querySelector('#resultModal .message .difficulty').innerText = `difficulty: ${selectedDifficulty}`;
                
                document.getElementById('overlay').classList.add('active');
            }
        }
        else{
            errorCount++;
            errors.innerText = `${errorCount}/${errorLimit}`;
            // If player has lost
            if(errorCount == errorLimit){
                clock.pause();
                const resultModal = document.getElementById('resultModal')
                resultModal.classList.add('active');
                document.querySelector('#resultModal .message .text').innerText = 'YOU LOSS!';
                document.querySelector('#resultModal .message .text').style.color = 'tomato';
                document.querySelector('#resultModal .message .difficulty').innerText = `difficulty: ${selectedDifficulty}`;
                document.getElementById('overlay').classList.add('active');
            }
        }
    }
    else if(event.target.innerText != ''){
        document.getElementById(`num${event.target.innerText}`)
                .dispatchEvent(new Event('click'));
    }
            
}

// tile - mouseover
function tileMouseOver(event){
    let coords = event.target.id.split('-');
    let x = parseInt(coords[0]);
    let y = parseInt(coords[1]);
    
    // over row and column
    for(let i=0; i<9; i++){
        document.getElementById(`${i}-${y}`).classList.add('light-highlight');
        document.getElementById(`${x}-${i}`).classList.add('light-highlight');
    }
    // check subgrid
    let startRow = Math.floor(x / 3) * 3;
    let startCol = Math.floor(y / 3) * 3;

    for(let i=0; i<3; i++){
        for(let j=0; j<3; j++){
            document.getElementById(`${startRow + i}-${startCol + j}`)
                    .classList.add('light-highlight');
        }
    }

    // highlight numbers
    if(event.target.innerText != ''){
        let num = event.target.innerText;
        Array.from(document.querySelectorAll('.tile')).filter(element => {
            return element.innerText == num;
        }).forEach(element => {
            element.classList.add('dark-highlight');
        });
    }
}

// tile-mouseout
function tileMouseOut(event){
    let coords = event.target.id.split('-');
    let x = parseInt(coords[0]);
    let y = parseInt(coords[1]);
    
    // over row and column
    for(let i=0; i<9; i++){
        document.getElementById(`${i}-${y}`).classList.remove('light-highlight');
        document.getElementById(`${x}-${i}`).classList.remove('light-highlight');
    }
    // over subgrids
    let startRow = Math.floor(x / 3) * 3;
    let startCol = Math.floor(y / 3) * 3;

    for(let i=0; i<3; i++){
        for(let j=0; j<3; j++){
            document.getElementById(`${startRow + i}-${startCol + j}`)
                    .classList.remove('light-highlight');
        }
    }
    // over numbers
    if(event.target.innerText != ''){
        let num = event.target.innerText;
        Array.from(document.querySelectorAll('.tile')).filter(element => {
            return element.innerText == num;
        }).forEach(element => {
            element.classList.remove('dark-highlight');
        });
    }
}

function clearGame(){
    board.innerHTML = '';
    numbers.innerHTML = '';
    numberSelect = null;
    errorCount = 0;
    errors.innerText = `${errorCount}/${errorLimit}`;
    clock.reset();
}

// Confirmation dialog script
const openModalButtons = document.querySelectorAll('[data-modal-target]');
const closeModalButtons = document.querySelectorAll('[data-close-button]');
const difficultyModalButtons = document.querySelectorAll('[data-difficulty]');

openModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = document.querySelector(button.dataset.modalTarget);
        openModal(modal);
    });
});

// for overlay
overlay.addEventListener('click', () => {
    const modals = document.querySelectorAll('.modal.active');
    modals.forEach(modal => {
        if(modal.id != 'resultModal' && modal.id != 'gameDifficultyModal')
            closeModal(modal);
    });
});

closeModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = button.closest('.modal');
        closeModal(modal);

        if (button.hasAttribute('data-new-game-button'))
            openModal(document.getElementById('gameDifficultyModal'));
    });
});

// difficulty modal buttons
difficultyModalButtons.forEach(button => {
    button.addEventListener('click', ()=>{
        selectedDifficulty = button.getAttribute('data-difficulty');
        const modal = button.closest('.modal');
        closeModal(modal);
        clearGame();
        createNewSudoku();
        setGame();
    })
})

function openModal(modal) {
    if (modal == null) return;
    modal.classList.add('active');
    overlay.classList.add('active');
    clock.pause();
}

function closeModal(modal) {
    if (modal == null) return;
    modal.classList.remove('active');
    overlay.classList.remove('active');
    clock.start();
}

// for index.html
window.clearGame = clearGame;
window.setGame = setGame;
window.createNewSudoku = createNewSudoku;

