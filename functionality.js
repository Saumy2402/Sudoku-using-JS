// numbers from 1 to 9
const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export function makeGrid(){
    // create 2D array
    const grid = [];
    for(let i=0; i<9; i++){
        grid[i] = [];
        for(let j=0; j<9; j++)
            grid[i][j] = 0;
    }
    return grid;
}
export function shuffle(array){
    for(let i = array.length-1; i >= 0; i--){
        let random = Math.floor(Math.random() * (i+1));
        [array[i], array[random]] = [array[random], array[i]];
    }
}

export function isSafe(grid, row, col, num){
    // check row - col
    for(let i=0; i<9; i++){
        if(grid[row][i] == num || grid[i][col] == num)
            return false;
    }
    // check subgrid
    let startRow = Math.floor(row / 3) * 3;
    let startCol = Math.floor(col / 3) * 3;

    for(let i=0; i<3; i++){
        for(let j=0; j<3; j++){
            if(grid[startRow + i][startCol + j] == num)
                return false;
        }
    }
    return true;
}

export function makeSudoku(grid){
    for(let row=0; row<9; row++){
        for (let col=0; col<9; col++){
            if(grid[row][col] == 0){
                shuffle(arr);
                for(let num of arr){
                    if(isSafe(grid, row, col, num)){
                        grid[row][col] = num;

                        if(makeSudoku(grid))
                            return true;

                        grid[row][col] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
}

export function countSolutions(grid, count = {length : 0}){
    for(let row=0; row<9; row++){
        for (let col=0; col<9; col++){
            if(grid[row][col] == 0){
                for(let num = 1; num <= 9; num++){
                    if(isSafe(grid, row, col, num)){
                        grid[row][col] = num;

                        countSolutions(grid, count);

                        grid[row][col] = 0;

                        if(count.length > 1) return;
                    }
                }
                return ;
            }
        }
    }
    count.length++;
}

export function uniqueness(puzzle){
    let count = {length : 0};
    countSolutions(puzzle, count);
    return count.length == 1;
}

export function makePuzzle(grid, missing){
    const puzzle = grid.map(row => row.slice());
    let attempts = 0;
    const maxAttempts = missing * 30;

    while(missing > 0 && attempts < maxAttempts){
        let row = Math.floor(Math.random() * 9);
        let col = Math.floor(Math.random() * 9);

        if(puzzle[row][col] != 0){
            let data = puzzle[row][col];
            puzzle[row][col] = 0;

            if(!uniqueness(puzzle.map(r => r.slice()))){
                puzzle[row][col] = data;
            } else {
                missing--;
            }
        }
        attempts++;
    }

    return puzzle;
}


