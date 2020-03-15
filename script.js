let whitePieces = 16;
let blackPieces = 16;
let currentTeam = "white";


var selectedPiece;
var killedPiece;
var enemyCount;
var drawCounter;

let classCounter = 0;
let maxClassNumber = 0;


let enpassantBlackPieces = [];
let enpassantWhitePieces = [];
var currentEmpassantPiece;
let performingEmpassant = false;

let checkAttackLine = [];
let blockedMoves = [];
let defendedPieces = [];
let currentlyInCheck = false;
//if piece has an enpassant piece next to it, then display enpassant move




initBoard();


// *************************************************************************************************************************************************
// *************************************************************************************************************************************************
//                                                          Game State Functions
// *************************************************************************************************************************************************
// *************************************************************************************************************************************************
function initBoard() {

    let gameBoard = document.getElementsByClassName("boardInner")[0];
    let gameBoardBox = gameBoard.getBoundingClientRect();

    let tileHeight = (gameBoardBox.height - 6) / 8;
    let tileWidth = (gameBoardBox.width - 6) / 8;

    let leftPos = 0;
    let topPos = 0;



    var nextTile;
    // generate each tile on the board
    for (let i = 0; i < 8; i++) {
        leftPos = 0;
        if (i % 2 == 0) {



            nextTile = "white";

        }
        else {
            nextTile = "black";

        }

        for (let j = 0; j < 8; j++) {

            // place tile
            let boardTile = document.createElement("div");

            boardTile.style.width = tileWidth + "px";
            boardTile.style.height = tileHeight + "px";
            boardTile.style.position = "absolute";
            boardTile.style.top = topPos + "px";
            boardTile.style.left = leftPos + "px";

            gameBoard.appendChild(boardTile);


            boardTile.classList.add(nextTile);
            boardTile.classList.add("tile");
            boardTile.classList.add(i + "x" + j);

            if (nextTile == "black") {
                nextTile = "white";
            }
            else {
                nextTile = "black";
            }


            leftPos += tileWidth;

        }

        topPos += tileHeight;
    }

    initPieces();

}

function initPieces() {

    let boardTiles = document.getElementsByClassName("tile");

    for (let h = 0; h < boardTiles.length; h++) {

        let boardTile = boardTiles[h];
        // initialize black pieces
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {


                let chessPiece = document.createElement("i");
                chessPiece.classList.add("chessPiece");
                chessPiece.classList.add(i + "x" + j + "piece");
                if (i < 2) {
                    chessPiece.classList.add("blackPiece");
                }
                else {
                    chessPiece.classList.add("whitePiece");
                }
                if (i == 1 || i == 6) {

                    if (boardTile.classList.contains(i + "x" + j)) {
                        chessPiece.classList.add("fas");

                        chessPiece.classList.add("fa-chess-pawn");
                        boardTile.appendChild(chessPiece);
                    }
                    // initialize black pawns
                }
                else {
                    if (j == 0 || j == 7) {
                        // initialize rooks

                        if (boardTile.classList.contains(i + "x" + j)) {
                            chessPiece.classList.add("fas");

                            chessPiece.classList.add("fa-chess-rook");
                            boardTile.appendChild(chessPiece);
                        }
                    }
                    if (j == 1 || j == 6) {
                        // initialize horses
                        if (boardTile.classList.contains(i + "x" + j)) {
                            chessPiece.classList.add("fas");

                            chessPiece.classList.add("fa-chess-knight");
                            boardTile.appendChild(chessPiece);
                        }
                    }
                    if (j == 2 || j == 5) {
                        // initialize bishops
                        if (boardTile.classList.contains(i + "x" + j)) {
                            chessPiece.classList.add("fas");

                            chessPiece.classList.add("fa-chess-bishop");
                            boardTile.appendChild(chessPiece);
                        }
                    }
                    if (j == 4) {
                        // initialize king
                        if (boardTile.classList.contains(i + "x" + j)) {
                            chessPiece.classList.add("fas");

                            chessPiece.classList.add("fa-chess-king");
                            boardTile.appendChild(chessPiece);
                        }
                    }
                    if (j == 3) {
                        // initialize queen
                        if (boardTile.classList.contains(i + "x" + j)) {
                            chessPiece.classList.add("fas");

                            chessPiece.classList.add("fa-chess-queen");
                            boardTile.appendChild(chessPiece);
                        }
                    }
                }



            }
            if (i == 1) {
                i = 5;
            }
        }
    }


}

// *************************************************************************************************************************************************
// *************************************************************************************************************************************************
//                                                          Pieces Functions
// *************************************************************************************************************************************************
// *************************************************************************************************************************************************
function onPieceTouch() {
    // if has the class possibleMove , execute the move
    if ($(this).hasClass("possibleMove")) {

        if ($(this).hasClass("possibleEmpassant")) {
            performingEmpassant = true;
        }
        var row;
        var col;
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if ($(this).hasClass(i + "x" + j + "piece")) {
                    row = i;
                    col = j;
                }
            }
        }
        movePiece(row, col);
        clearMoves();
    }
    else {
        // if clicking on a piece on the opposite team, dont change the selected piece
        if (currentTeam == "black") {
            if ($(this).hasClass("whitePiece")) {

            }
            else {
                selectedPiece = this;



            }
        }
        else {
            if ($(this).hasClass("blackPiece")) {

            }
            else {
                selectedPiece = this;

            }
        }

        // console.log(selectedPiece);

        clearMoves();
        var row;
        var col;
        var team;
        // get piece location
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (this.classList.contains(i + "x" + j + "piece")) {
                    row = i;
                    col = j;
                }
            }
        }
        // check which side 
        if (this.classList.contains("blackPiece")) {
            team = "black";
        }
        else {
            team = "white";
        }
        // check piece type
        if (currentTeam == team) {
            $("." + row + "x" + col).addClass("selectedPiece");
            if (this.classList.contains("fa-chess-pawn")) {
                // console.log("i am a pawn!");
                pawnMoves(row, col, team);

            }
            if (this.classList.contains("fa-chess-rook")) {
                // console.log("i am a rook!");
                rookMoves(row, col, team);
            }
            if (this.classList.contains("fa-chess-knight")) {
                // console.log("i am a knight!");
                knightMoves(row, col, team);
            }
            if (this.classList.contains("fa-chess-bishop")) {
                // console.log("i am a bishop!");
                bishopMoves(row, col, team);
            }
            if (this.classList.contains("fa-chess-king")) {
                // console.log("i am a king!");
                kingMoves(row, col, team);
            }
            if (this.classList.contains("fa-chess-queen")) {
                // console.log("i am a queen!");
                queenMoves(row, col, team);
            }
        }

    }

}
let initpieces = document.getElementsByClassName("chessPiece");
for (let i = 0; i < initpieces.length; i++) {
    initpieces[i].addEventListener("mousedown", onPieceTouch);
}
function checkIfValid(row, col) {
    for (let i = 0; i < checkAttackLine.length; i++) {
        if (row == checkAttackLine[i][0] && col == checkAttackLine[i][1]) {
            return true;
        }
    }
    return false;
}
function pawnMoves(row, col, team) {
    // if black pawn, check tiles below
    var checkRow;
    var checkCol;
    if (team == "black") {
        checkCol = col;
        checkRow = row + 1;
        if (row == 1) {
            // check two tiles ahead


            for (let i = 0; i < 2; i++) {


                if (checkTile(checkRow, checkCol, team, "pawnMove") == true) {

                    displayPossibleMove(checkRow, checkCol);


                    // console.log("you can move here");

                }
                else {
                    // exit loop
                    i = 2;
                }
                checkRow++;
            }

        }
        else if (row < 7) {
            // check one tile ahead
            if (row == 6) {
                if (checkTile(checkRow, checkCol, team, "pawnMove") == true) {
                    displayPawnExchange(checkRow, checkCol);

                }
            }
            else {
                if (checkTile(checkRow, checkCol, team, "pawnMove") == true) {

                    displayPossibleMove(checkRow, checkCol);
                    // console.log("you can move here");

                }
            }


        }
        checkCol = col;
        checkRow = row + 1;

        if (checkTile(checkRow, checkCol - 1, team, "pawnAttack") == true) {
            // console.log("testing 1");

            displayPossibleMove(checkRow, checkCol - 1);
        }
        if (checkTile(checkRow, checkCol + 1, team, "pawnAttack") == true) {
            // console.log("testing 2");
            displayPossibleMove(checkRow, checkCol + 1);
        }
        if (checkEnpassant(row, col + 1, team) == true) {
            displayPossibleEmpassant(checkRow, checkCol + 1, "right");
        }
        if (checkEnpassant(row, col - 1, team) == true) {
            displayPossibleEmpassant(checkRow, checkCol - 1, "left");
        }


        // check diagonals
    }

    // if white pawn, check tiles above
    if (team == "white") {
        checkCol = col;
        checkRow = row - 1;
        if (row == 6) {
            // check two tiles ahead


            for (let i = 0; i < 2; i++) {


                if (checkTile(checkRow, checkCol, team, "pawnMove") == true) {

                    displayPossibleMove(checkRow, checkCol);
                    // console.log("you can move here");

                }
                else {
                    // exit loop
                    i = 2;
                }
                checkRow--;
            }

        }
        else if (row > 0) {
            // check one tile ahead
            if (row == 1) {
                if (checkTile(checkRow, checkCol, team, "pawnMove") == true) {

                    displayPawnExchange(checkRow, checkCol);


                }
            }
            else {
                if (checkTile(checkRow, checkCol, team, "pawnMove") == true) {

                    displayPossibleMove(checkRow, checkCol);
                    // console.log("you can move here");

                }
            }
        }
        checkCol = col;
        checkRow = row - 1;

        if (checkTile(checkRow, checkCol - 1, team, "pawnAttack") == true) {
            // console.log("testing 1");

            displayPossibleMove(checkRow, checkCol - 1);
        }
        if (checkTile(checkRow, checkCol + 1, team, "pawnAttack") == true) {
            // console.log("testing 2");
            displayPossibleMove(checkRow, checkCol + 1);
        }

        if (checkEnpassant(row, col - 1, team, "left") == true) {
            displayPossibleEmpassant(checkRow, checkCol - 1);
        }
        if (checkEnpassant(row, col + 1, team, "right") == true) {
            displayPossibleEmpassant(checkRow, checkCol + 1);
        }
    }

}
function rookMoves(row, col, team) {

    checkCross(row, col, team, 8, false);

}
function knightMoves(row, col, team) {
    if (checkTile(row - 2, col - 1, team, "knight") == true) {
        displayPossibleMove(row - 2, col - 1);
    }
    if (checkTile(row - 2, col + 1, team, "knight") == true) {
        displayPossibleMove(row - 2, col + 1);
    }
    if (checkTile(row - 1, col - 2, team, "knight") == true) {
        displayPossibleMove(row - 1, col - 2);
    }
    if (checkTile(row - 1, col + 2, team, "knight") == true) {
        displayPossibleMove(row - 1, col + 2);
    }
    if (checkTile(row + 2, col - 1, team, "knight") == true) {
        displayPossibleMove(row + 2, col - 1);
    }
    if (checkTile(row + 2, col + 1, team, "knight") == true) {
        displayPossibleMove(row + 2, col + 1);
    }
    if (checkTile(row + 1, col - 2, team, "knight") == true) {
        displayPossibleMove(row + 1, col - 2);
    }
    if (checkTile(row + 1, col + 2, team, "knight") == true) {
        displayPossibleMove(row + 1, col + 2);
    }

}
function bishopMoves(row, col, team) {
    // check ascending diagonal (L->R)
    checkDiagonals(row, col, team, 8, false);


}
function kingMoves(row, col, team) {
    checkDiagonals(row, col, team, 1, true);
    checkCross(row, col, team, 1, true);
}
function queenMoves(row, col, team) {
    checkDiagonals(row, col, team, 8, false);
    checkCross(row, col, team, 8, false);
}
function checkDiagonals(row, col, team, limit, king) {
    let checkCol = col - 1;
    let checkRow = row + 1;
    let type = "bishop";
    if (king == true) {
        type = "king";
    }
    enemyCount = 0;
    for (i = 0; i < limit; i++) {
        if (enemyCount < 1) {
            if (checkTile(checkRow, checkCol, team, type) == true) {
                displayPossibleMove(checkRow, checkCol, type);
                checkCol--;
                checkRow++;
            }
            else {
                i = limit;
            }
        }
    }
    checkCol = col + 1;
    checkRow = row - 1;
    enemyCount = 0;
    for (i = 0; i < limit; i++) {
        if (enemyCount < 1) {
            if (checkTile(checkRow, checkCol, team, type) == true) {
                displayPossibleMove(checkRow, checkCol, type);
                checkCol++;
                checkRow--;
            }
            else {
                i = limit;
            }
        }

    }




    // check descending diagonal (L->R)
    checkCol = col - 1;
    checkRow = row - 1;
    enemyCount = 0;
    for (i = 0; i < limit; i++) {
        if (enemyCount < 1) {
            if (checkTile(checkRow, checkCol, team, type) == true) {
                displayPossibleMove(checkRow, checkCol, type);
                checkCol--;
                checkRow--;
            }
            else {
                i = limit;
            }
        }

    }
    checkCol = col + 1;
    checkRow = row + 1;
    enemyCount = 0;
    for (i = 0; i < limit; i++) {
        if (enemyCount < 1) {
            if (checkTile(checkRow, checkCol, team, type) == true) {
                displayPossibleMove(checkRow, checkCol, type);
                checkCol++;
                checkRow++;
            }
            else {
                i = limit;
            }
        }

    }
}
function checkCross(row, col, team, limit, king) {
    let type = "rook";
    if (king == true) {
        type = "king";
    }
    if (col < 7) {
        enemyCount = 0;
        let checkCol = col + 1;

        // check horizontal moves to the right
        for (let i = 0; i < limit; i++) {
            if (enemyCount < 1) {
                if (checkTile(row, checkCol, team, type) == true) {
                    displayPossibleMove(row, checkCol, type);
                    checkCol++;
                }
                else {
                    i = limit;
                }
            }

        }
    }

    if (col > 0) {
        enemyCount = 0;
        // check horizontal moves to the left
        let checkCol = col - 1;
        for (let i = 0; i < limit; i++) {
            if (enemyCount < 1) {
                if (checkTile(row, checkCol, team, type) == true) {
                    displayPossibleMove(row, checkCol, type);
                    checkCol--;
                }
                else {
                    i = limit;
                }
            }

        }
    }

    // check vertical moves above
    if (row > 0) {
        enemyCount = 0;
        let checkRow = row - 1;
        for (let i = 0; i < limit; i++) {
            if (enemyCount < 1) {
                if (checkTile(checkRow, col, team, type) == true) {
                    displayPossibleMove(checkRow, col, type);
                    checkRow--;
                }
                else {
                    i = limit;
                }
            }

        }
    }


    // check vertical moves below
    if (row < 7) {
        enemyCount = 0;
        let checkRow = row + 1;
        for (let i = 0; i < limit; i++) {
            if (enemyCount < 1) {
                if (checkTile(checkRow, col, team, type) == true) {
                    displayPossibleMove(checkRow, col, type);
                    checkRow++;
                }
                else {
                    i = limit;
                }
            }
        }
    }

}
function clearMoves() {
    // console.log("testing 1");
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            let currentTile = $("." + i + "x" + j);
            let currentPiece = $("." + i + "x" + j + "piece");
            if (currentTile.hasClass("possibleMove")) {
                // console.log("testing 2");

                currentTile.removeClass("possibleMove");

                if (currentTile.hasClass("possibleEmpassant")) {
                    currentTile.removeClass("possibleEmpassant");
                }
            }
            if (currentTile.hasClass("pawnExchange")) {
                currentTile.removeClass("pawnExchange");
            }
            if (currentTile.hasClass("selectedPiece")) {
                currentTile.removeClass("selectedPiece");
            }
            if (currentPiece.hasClass("possibleMove")) {
                currentPiece.removeClass("possibleMove");
                if (currentPiece.hasClass("possibleEmpassant")) {
                    currentPiece.removeClass("possibleEmpassant");
                }
            }

        }
    }
}
function onTileClick() {
    // if tile is empty and is not a possible move, clear the moves
    // console.log("testing 1");

    if ($(this).children().length == 0 && $(this).hasClass("possibleMove") == false) {


        // console.log("Clearing moves");

        if ($(this).hasClass("pawnExchange") == false) {
            clearMoves();
        }

    }
    else if ($(this).hasClass("possibleMove")) {

        if ($(this).hasClass("possibleEmpassant")) {
            performingEmpassant = true;
        }
        clearMoves();
        var row;
        var col;
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if ($(this).hasClass(i + "x" + j)) {
                    row = i;
                    col = j;
                }
            }
        }
        // console.log(row);
        // console.log(col);

        var initialRow;

        for (i = 0; i < 8; i++) {
            for (j = 0; j < 8; j++) {
                if (selectedPiece.classList.contains(i + "x" + j + "piece")) {
                    initialRow = i;
                }
            }
        }

        movePiece(row, col, initialRow);



    }
    if ($(this).hasClass("pawnExchange")) {

        clearMoves();
        var row;
        var col;

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if ($(this).hasClass(i + "x" + j)) {
                    row = i;
                    col = j;
                }
            }
        }

        exchangePawn(row, col);

    }
    if ($(this).children().length > 0) {

    }
}
let inittiles = document.getElementsByClassName("tile");

for (let i = 0; i < inittiles.length; i++) {
    inittiles[i].addEventListener("click", onTileClick)
}



// *************************************************************************************************************************************************
// *************************************************************************************************************************************************
//                                                          Game Events Functions
// *************************************************************************************************************************************************
// *************************************************************************************************************************************************
function checkTile(row, col, team, piece) {

    let tile = $("." + row + "x" + col);
    let tileChild = tile.children();
    //check if tile has a chessPiece in it
    if (tileChild.length > 0) {

        if (piece == "pawnMove") {
            return false;
        }
        else {

            if(tileChild.hasClass("fa-chess-king")){
                kingFound = true;
            }
            if (team == "black") {
                // console.log(tileChild.hasClass("whitePiece"));

                if (tileChild.hasClass("whitePiece")) {
                    if (piece != "king") {
                        enemyCount = 1;
                        return true;
                    }
                    else {

                        for (let i = 0; i < defendedPieces.length; i++) {
                            if (row == defendedPieces[i][0] && col == defendedPieces[i][1]) {
                                // console.log("enemy piece is defended");

                                return false;


                            }
                        }
                        return true;
                        // check if this co-ordinate matches any of the ally intersecting co-ordinates (the enemy piece is being defended by another piece). if it does, return false.

                    }

                }

                return false;

            }
            else {
                if (tileChild.hasClass("blackPiece")) {
                    if (piece != "king") {
                        enemyCount = 1;
                        return true;
                    }
                    else {

                        for (let i = 0; i < defendedPieces.length; i++) {
                            if (row == defendedPieces[i][0] && col == defendedPieces[i][1]) {
                                // console.log("enemy piece is defended");

                                return false;


                            }
                        }
                        return true;
                        // check if this co-ordinate matches any of the ally intersecting co-ordinates (the enemy piece is being defended by another piece). if it does, return false.

                    }
                }

                return false;
            }

        }


    }
    else if (piece == "king") {

        // check if the co-ordinate of the tile match any of the blocked moves
        for (let i = 0; i < blockedMoves.length; i++) {
            if (row == blockedMoves[i][0] && col == blockedMoves[i][1]) {
                return false;
            }
        }
        return true;
        // clear the blocked moves array when changing teams
    }

    // if no elements inside

    if (piece != "pawnAttack") {
        return true;
    }






}
function checkEnpassant(row, col, team, side) {
    // check if square to move into has no friendly pieces
    // if the specified tile contains an enpassant pawn, return true

    let tileToCheck = document.getElementsByClassName(row + "x" + col)[0];


    // console.log(tileToCheck);
    var newPos;
    if (tileToCheck != undefined && tileToCheck.hasChildNodes() == true) {
        if (team == "white") {
            if (side == "right") {
                newPos = document.getElementsByClassName(row - 1 + "x" + col + 1)[0];
            }
            else {
                newPos = document.getElementsByClassName(row - 1 + "x" + col - 1)[0];
            }
            var newPosChild = [];
            if (newPos != undefined) {

                newPosChild = newPos.childNodes;
            }

            // if there is a piece in the same team, return false
            if (tileToCheck.childNodes[0].classList.contains("whitePiece")) {
                return false;
            }
            else {
                // if there is a piece in the enemy team, check if its an enpassant piece
                for (let i = 0; i < enpassantBlackPieces.length; i++) {

                    if (tileToCheck.childNodes[0] == enpassantBlackPieces[i].piece) {

                        if (newPosChild.length > 0) {
                            if (newPos.childNodes[0].classList.contains("whitePiece") == true) {

                                return false;
                            }
                        }

                        currentEmpassantPiece = enpassantBlackPieces[i].piece;
                        return true;

                    }
                }
            }



        }
        if (team == "black") {
            if (side == "right") {
                newPos = document.getElementsByClassName(row + 1 + "x" + col + 1)[0];
            }
            else {
                newPos = document.getElementsByClassName(row + 1 + "x" + col - 1)[0];
            }

            var newPosChild = [];
            if (newPos != undefined) {
                newPosChild = newPos.childNodes;
            }

            if (tileToCheck.childNodes[0].classList.contains("blackPiece")) {
                return false;
            }
            else {
                for (let i = 0; i < enpassantWhitePieces.length; i++) {
                    if (tileToCheck.childNodes[0] == enpassantWhitePieces[i].piece) {

                        if (newPosChild.length > 0) {
                            if (newPos.childNodes[0].classList.contains("blackPiece") == true) {

                                return false;
                            }
                        }
                        currentEmpassantPiece = enpassantWhitePieces[i].piece;
                        return true;
                    }
                }
            }

        }

    }

    return false;
}
function displayPossibleMove(row, col, type) {

    
    if (currentlyInCheck == true) {
        if(type == "king"){
            $("." + row + "x" + col).addClass("possibleMove");
    
            let piece = $("." + row + "x" + col + "piece");
            if (piece != undefined) {
                piece.addClass("possibleMove");
            }
        }
        else{
            
            if (checkIfValid(row, col) == true) {
                $("." + row + "x" + col).addClass("possibleMove");
    
                let piece = $("." + row + "x" + col + "piece");
                if (piece != undefined) {
                    piece.addClass("possibleMove");
                }
            }
        }
       
    }
    else {
        $("." + row + "x" + col).addClass("possibleMove");

        let piece = $("." + row + "x" + col + "piece");
        if (piece != undefined) {
            piece.addClass("possibleMove");
        }
    }


}
function displayPossibleEmpassant(row, col) {


    $("." + row + "x" + col).addClass("possibleMove");
    $("." + row + "x" + col).addClass("possibleEmpassant");

    let piece = $("." + row + "x" + col + "piece");
    if (piece != undefined) {
        piece.addClass("possibleEmpassant");
        piece.addClass("possibleMove");
    }
}
function displayPawnExchange(row, col) {
    let newTile = document.getElementsByClassName(row + "x" + col)[0];
    newTile.classList.add("pawnExchange");
}
function movePiece(row, col, initialRow) {
    // console.log("testing 1");
    // console.log(row);
    // console.log(col);
    if(selectedPiece.classList.contains("fa-chess-pawn") == false){
        drawCounter++;
    }
    else{
        drawCounter = 0;
    }
    
    for (let i = 0; i < enpassantBlackPieces.length; i++) {
        enpassantBlackPieces[i].counter++;
        if (enpassantBlackPieces[i].piece == selectedPiece || enpassantBlackPieces[i].counter == 1) {
            enpassantBlackPieces.splice(i, 1);
            console.log(enpassantBlackPieces);

        }
    }
    for (let i = 0; i < enpassantWhitePieces.length; i++) {
        enpassantWhitePieces[i].counter++;
        if (enpassantWhitePieces[i].piece == selectedPiece || enpassantWhitePieces[i].counter == 1) {
           
            enpassantWhitePieces.splice(i, 1);
            console.log(enpassantWhitePieces);

        }
    }


    if (currentEmpassantPiece != undefined && performingEmpassant == true) {
        currentEmpassantPiece.remove();
        currentEmpassantPiece = undefined;
        performingEmpassant = false;
    }


    selectedPiece.remove();
    replaceLocationClass(row, col);
    let newTile = document.getElementsByClassName(row + "x" + col)[0];

    // console.log(newTile);

    let newTileChild = newTile.childNodes[0];

    if (newTileChild != undefined) {
        killedPiece = newTileChild;
    }

    newTile.innerHTML = "";

    newTile.appendChild(selectedPiece);
    // remove check square
    for(let i = 0; i < 8; i++){
        for(let j = 0; j < 8; j++){
            if($("." + i + "x" + j).hasClass("check")){
                $("." + i + "x" + j).removeClass("check");
            }
        }
    }

    if (selectedPiece.classList.contains("fa-chess-pawn")) {
        // get the row of selectedPiece

        var enpassantPiece = {
            piece:undefined,
            counter:0
        }

        if (currentTeam == "black") {


            if (row - initialRow == 2) {

                enpassantPiece.piece = selectedPiece;
                enpassantBlackPieces.push(enpassantPiece);
                console.log(enpassantBlackPieces);

            }
        }
        else {
            if (initialRow - row == 2) {
                enpassantPiece.piece = selectedPiece;
                enpassantWhitePieces.push(enpassantPiece);
                console.log(enpassantWhitePieces);
            }
        }


    }
    blockedMoves = [];
    defendedPieces = [];
    if(checkDraw() == true){
        draw();
        return;
    }
    clearAttackLines();
    checkAttackLines();
    clearMoves();
    changeTeams();
    
}
function changeTeams(){
    if (currentTeam == "black") {
        // console.log("changing teams");

        currentTeam = "white";
        $(".currentTurn h1").text("White's Turn!")
    }
    else {
        currentTeam = "black";
        $(".currentTurn h1").text("Black's Turn!")
    }
}
function exchangePawn(row, col) {
    selectedPiece.remove();
    replaceLocationClass(row, col);
    let newTile = document.getElementsByClassName(row + "x" + col)[0];
    newTile.appendChild(selectedPiece);


    displayExchangeMenu();

}
function displayExchangeMenu() {

    $(".exchangeMenu").toggle();

    // toggleEvent Listeners
    let tiles = document.getElementsByClassName("tile");

    for (let i = 0; i < tiles.length; i++) {
        tiles[i].removeEventListener("click", onTileClick)
    }

    let pieces = document.getElementsByClassName("chessPiece");
    for (let i = 0; i < pieces.length; i++) {
        pieces[i].removeEventListener("mousedown", onPieceTouch);
    }
}
function removeExchangeMenu() {
    $(".exchangeMenu").toggle();

    // toggleEvent Listeners
    let tiles = document.getElementsByClassName("tile");

    for (let i = 0; i < tiles.length; i++) {
        tiles[i].addEventListener("click", onTileClick)
    }

    let pieces = document.getElementsByClassName("chessPiece");
    for (let i = 0; i < pieces.length; i++) {
        pieces[i].addEventListener("mousedown", onPieceTouch);
    }
}
$(".promotion").click(function () {
    selectedPiece.classList.remove("fa-chess-pawn");
    if ($(this).hasClass("fa-chess-rook")) {
        // replace current piece with rook

        selectedPiece.classList.add("fa-chess-rook");
    }
    if ($(this).hasClass("fa-chess-knight")) {
        // replace current piece with rook

        selectedPiece.classList.add("fa-chess-knight");
    }
    if ($(this).hasClass("fa-chess-queen")) {
        // replace current piece with rook

        selectedPiece.classList.add("fa-chess-queen");
    }
    if ($(this).hasClass("fa-chess-bishop")) {
        // replace current piece with rook

        selectedPiece.classList.add("fa-chess-bishop");
    }
    selectedPiece.classList.remove("promotion");
    removeExchangeMenu();
    blockedMoves = [];
    defendedPieces = [];
    clearAttackLines();
    checkAttackLines();

    changeTeams();

});
function replaceLocationClass(row, col) {

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (selectedPiece.classList.contains(i + "x" + j + "piece")) {
                selectedPiece.classList.remove(i + "x" + j + "piece");
            }
        }
    }

    selectedPiece.classList.add(row + "x" + col + "piece");

}
function clearEnemyMoves() {

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if ($("." + i + "x" + j).hasClass("enemyMove")) {
                $("." + i + "x" + j).removeClass("enemyMove");
            }
        }
    }
}
function enemyMoves() {

    var pieces;
    var team;
    if (currentTeam == "white") {
        pieces = document.getElementsByClassName("blackPiece");
        team = "black";
    }
    else {
        pieces = document.getElementsByClassName("whitePiece");
        team = "white";
    }


    // display all the attack lines
    for (let i = 0; i < pieces.length; i++) {
        //get row and col of piece
        var row;
        var col;

        for (let j = 0; j < 8; j++) {
            for (let k = 0; k < 8; k++) {

                if (pieces[i].classList.contains(j + "x" + k + "piece")) {
                    row = j;
                    col = k;
                }
            }
        }

        if (pieces[i].classList.contains("fa-chess-pawn")) {
            pawnEnemyMove(row, col, team);

            // console.log("testing attack lines B");

        }
        if (pieces[i].classList.contains("fa-chess-rook")) {
            rookEnemyMove(row, col, team);
            // console.log("testing attack lines B");

        }
        if (pieces[i].classList.contains("fa-chess-bishop")) {
            bishopEnemyMove(row, col, team);
            // console.log("testing attack lines B");

        }
        if (pieces[i].classList.contains("fa-chess-queen")) {
            queenEnemyMove(row, col, team);
            // console.log("testing attack lines B");

        }
        if (pieces[i].classList.contains("fa-chess-knight")) {
            knightEnemyMove(row, col, team);
            // console.log("testing attack lines B");

        }


    }
}
function checkAttackLines() {
    // this function is called after a move is made and checks where the current player's attack lines are
    // display all the possible attacklines for the current player
    // get all the possible pieces in the current team
    // console.log("testing attack Lines A");

    var pieces;
    var team;
    clearUniqueClass();
    clearPiercingAttack();
    if (currentTeam == "black") {
        pieces = document.getElementsByClassName("blackPiece");
        team = "black";
    }
    else {
        pieces = document.getElementsByClassName("whitePiece");
        team = "white";
    }


    // display all the attack lines
    for (let i = 0; i < pieces.length; i++) {
        //get row and col of piece
        var row;
        var col;

        for (let j = 0; j < 8; j++) {
            for (let k = 0; k < 8; k++) {

                if (pieces[i].classList.contains(j + "x" + k + "piece")) {
                    row = j;
                    col = k;
                }
            }
        }

        if (pieces[i].classList.contains("fa-chess-pawn")) {
            pawnAttackLine(row, col, team);
            // console.log("testing attack lines B");

        }
        if (pieces[i].classList.contains("fa-chess-rook")) {
            rookAttackLine(row, col, team);
           
            // console.log("testing attack lines B");

        }
        if (pieces[i].classList.contains("fa-chess-knight")) {
            knightAttackLine(row, col, team);
            // console.log("testing attack lines B");

        }
        if (pieces[i].classList.contains("fa-chess-bishop")) {
            bishopAttackLine(row, col, team);
       
            // console.log("testing attack lines B");

        }
        if (pieces[i].classList.contains("fa-chess-queen")) {
            queenAttackLine(row, col, team);
          
            // console.log("testing attack lines B");

        }
        if (pieces[i].classList.contains("fa-chess-king")) {
            kingAttackLine(row, col, team);
            // console.log("testing attack lines B");

        }

    }

    var enemyKing;
    let enemyKings = document.getElementsByClassName("fa-chess-king");
    var enemyTeam;
    // display the possible moves of the enemy king
    if (team == "black") {
        enemyTeam = "white";
        if (enemyKings[0].classList.contains("whitePiece")) {
            enemyKing = enemyKings[0];
        }
        else {
            enemyKing = enemyKings[1];
        }
    }
    if (team == "white") {
        enemyTeam = "black";
        if (enemyKings[0].classList.contains("blackPiece")) {
            enemyKing = enemyKings[0];
        }
        else {
            enemyKing = enemyKings[1];
        }
    }

    var kingRow;
    var kingCol;
    // get location of enemyKing
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {

            if (enemyKing.classList.contains(i + "x" + j + "piece")) {
                kingRow = i;
                kingCol = j;
            }
        }
    }
    clearKingLine();
    enemyKingMoves(kingRow, kingCol, enemyTeam);

    clearEnemyMoves();
    enemyMoves();


    // if the attacklines intersect with the king's possible moves, remove those possible moves.
    let blockedMovesCount = 0;
    let kingTotalMoves = 0;
    let kingTargeted = false;
    let enemyCanBlock = false;
    let enemyCanKill = false;
    var uniqueAttackLine;
    var piercingAttackLine;
    currentlyInCheck = false;
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {


            if ($("." + i + "x" + j).hasClass("attackLine")) {
                // check if enemy king's moves intersect with the attacklines
                if ($("." + i + "x" + j).hasClass("kingLine")) {
                    blockedMoves.push([i, j]);
                    blockedMovesCount++;

                }
                // check if attacklines intersect with enemy king
                if ($("." + i + "x" + j).children().length > 0) {
                    if ($("." + i + "x" + j).children().hasClass("fa-chess-king")) {
                        

                        if (team == "black") {
                            if ($("." + i + "x" + j).children().hasClass("whitePiece")) {
                                $("." + i + "x" + j).addClass("check");
                                kingTargeted = true;
                                currentlyInCheck = true;
                            }
                        }
                        else {
                            if ($("." + i + "x" + j).children().hasClass("blackPiece")) {
                                $("." + i + "x" + j).addClass("check");
                                kingTargeted = true;
                                currentlyInCheck = true;
                            }
                        }

                        for (let k = 0; k < maxClassNumber; k++) {
                            if ($("." + i + "x" + j).hasClass(k.toString())) {
                                uniqueAttackLine = k.toString();
                                // console.log(uniqueAttackLine);

                            }
                        }
                    }
                }


            }
            // count the number of total moves the enemy can make without accounting for blocked moves
            if ($("." + i + "x" + j).hasClass("kingLine")) {

                kingTotalMoves++;

            }
            
            // console.log($("." + i + "x" + j).children());
            // console.log(selectedPiece);


            if ($("." + i + "x" + j).children()[0] == selectedPiece) {
                // console.log("selected Piece Found");

                if ($("." + i + "x" + j).hasClass("enemyMove")) {
                    enemyCanKill = true;
                }
            }
            

        }
    }

    for(let i = 0 ; i < 8; i++){
        for(j = 0; j < 8; j++){
            if ($("." + i + "x" + j).hasClass(uniqueAttackLine)) {
                // console.log("unique attack line found");
                // console.log(uniqueAttackLine);


                if ($("." + i + "x" + j).hasClass("enemyMove")) {
                    console.log("enemyMove Found");
                    enemyCanBlock = true;
                }

                       
            }
            if ($("." + i + "x" + j).children().length > 0) {
                if ($("." + i + "x" + j).children().hasClass("fa-chess-king")) {
                    for(let k = 0; k <= maxClassNumber; k++){
                        if($("." + i + "x" + j).hasClass("piercing" + k)){
                            piercingAttackLine = k;
                            console.log("piercing line located");
                            
                        }
                    }  
                }
            }  
        }
    }
    
    let pieceCounter = 0;
    let pieceLocations = [];
    // count and locate all the pieces that are inside the piercing attack line

     // for the bishops, rooks and queen, display an attackline that ignores all enemy pieces except the king.
    // for each attackline, count the number of enemypieces that intersect with it.
    // if the number of pieces count to 3 (the attacking piece, the blocking piece, and the king, only allow that piece's movement to be inside the attack line.
    // if the number of pieces count to greater than 3, allow all movement to occur.
    
    if(piercingAttackLine != undefined){
        for(let i = 0; i < 8; i++){
            for(let j = 0; j < 8; j++){
                if($("." + i + "x" + j).hasClass("piercing" + piercingAttackLine)){
                    if($("." + i + "x" + j).children().length > 0){
                        pieceCounter++;
                        // if piece is not of the same team, or not the enemyking, save the location
                        if($("." + i + "x" + j).children()[0].classList.contains(currentTeam + "Piece") == false && $("." + i + "x" + j).children()[0].classList.contains("fa-chess-king") == false){
                            pieceLocations.push([i,j]);
                        }
                    }
                }
            }
        }
    }

    // console.log(pieceCounter);
    // console.log(pieceLocations);
    
    if(pieceCounter == 3){

        // for the one piece that is blocking, save the positions that can be made to a global array
        // save the position of the blocking piece to a global variable
        
    }
    
 
    
    
    //  store all the co-ordinates for the uniqueAttackLine in a global array so the enemy's moves can only be ones that are in the array.
    checkAttackLine = [];
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if ($("." + i + "x" + j).hasClass(uniqueAttackLine)) {
                checkAttackLine.push([i, j]);
            }
        }
    }

   


    // console.log(kingTotalMoves);
    // console.log(blockedMovesCount);
    // console.log(kingTargeted);
    // console.log(enemyCanBlock);
    // console.log(enemyCanKill);





    if (kingTotalMoves === blockedMovesCount && kingTargeted == true && enemyCanBlock == false && enemyCanKill == false) {
        // check if any of the enemyteam's pieces intersect with the attacklines that target the king

        setTimeout(function () {
            checkmate(enemyTeam);
        }, 500);
    }
    else if (kingTargeted == true) {
        setTimeout(function () {
            check(enemyTeam);
        }, 500);
    }

    // if the attacklines intersect with the king, check if there are possible moves. If yes, it's a check. If none, check if ally lines block enemylines. If none, it's checkmate .Otherwise, it's a check.
}
function checkDraw(){

    let pieceCounter = 0
    for(i = 0; i < 8; i++){
        for(j = 0; j < 8; j++){
            if($("."+i+"x"+j).children().hasClass("chessPiece")){
                pieceCounter++;
            }
        }
    }

    if(drawCounter == 50 || pieceCounter == 2){
        return true;
    }

    return false;
}
function draw(){
    let tiles = document.getElementsByClassName("tile");

    for (let i = 0; i < tiles.length; i++) {
        tiles[i].removeEventListener("click", onTileClick)
    }

    let pieces = document.getElementsByClassName("chessPiece");
    for (let i = 0; i < pieces.length; i++) {
        pieces[i].removeEventListener("mousedown", onPieceTouch);
    }

    $(".checkStatus").toggle();
    $(".checkStatus").text("Its a DRAW!");
    $(".currentTurn h1").text("Its a DRAW!");
    setTimeout(function(){
        $(".checkStatus").fadeOut();
    }, 3000);
}
function checkmate(team) {
    
    
    let tiles = document.getElementsByClassName("tile");

    for (let i = 0; i < tiles.length; i++) {
        tiles[i].removeEventListener("click", onTileClick)
    }

    let pieces = document.getElementsByClassName("chessPiece");
    for (let i = 0; i < pieces.length; i++) {
        pieces[i].removeEventListener("mousedown", onPieceTouch);
    }
    // locate check square and convert to a checkmate square
    for(let i = 0; i < 8; i++){
        for(let j = 0; j < 8; j++){
            if($("." + i + "x" + j).hasClass("check")){
                $("." + i + "x" + j).addClass("checkmate");
            }
        }
    }
    var winner;
    if(team == "white"){
        winner = "black";
    }
    else{
        winner = "white";
    }
    $(".checkStatus").toggle();
    $(".checkStatus").text(team.toUpperCase() + " checkmate. " + winner.toUpperCase() + " wins!");
    $(".currentTurn h1").text(team.toUpperCase() + " checkmate. " + winner.toUpperCase() + " wins!");
    setTimeout(function(){
        $(".checkStatus").fadeOut();
    }, 3000);
    // remove all event listeners, display win message
}
function check(team) {

    // display check message
   
    $(".checkStatus").toggle();
    $(".checkStatus").text(team.toUpperCase() + " in check!");
    setTimeout(function(){
        $(".checkStatus").fadeOut();
    }, 1000);
    // for all pieces, but the king and those with attacklines that intercept all possible checks, remove their event listeners
}
$(".reset").click(resetBoard);
function resetBoard(){
    

    for(let i = 0; i < 8; i++){
        for(let j = 0; j < 8; j++){
            if($("." + i + "x" + j).hasClass("check")){
                $("." + i + "x" + j).removeClass("check");
            }
            if($("." + i + "x" + j).hasClass("checkmate")){
                $("." + i + "x" + j).removeClass("checkmate");
            }
            if($("." + i + "x" + j).children().length > 0){
                $("." + i + "x" + j).children()[0].remove();
            }
        }
    }
    $(".currentTurn h1").text("White's move!")
    clearMoves();
    clearAttackLines();
    clearEnemyMoves();
    clearKingLine();
    clearUniqueClass();
    initPieces();
    classCounter = 0;
    maxClassNumber = 0;
    enpassantBlackPieces = [];
    enpassantWhitePieces = [];
    currentEmpassantPiece;
    performingEmpassant = false;

    checkAttackLine = [];
    blockedMoves = [];
    defendedPieces = [];
    currentlyInCheck = false;
    currentTeam = "white";
    let tiles = document.getElementsByClassName("tile");

    for (let i = 0; i < tiles.length; i++) {
        tiles[i].addEventListener("click", onTileClick)
    }

    let pieces = document.getElementsByClassName("chessPiece");
    for (let i = 0; i < pieces.length; i++) {
        pieces[i].addEventListener("mousedown", onPieceTouch);
    }
    
    
}
function enemyKingMoves(row, col, team) {
    checkKingCross(row, col, team, 1);
    checkKingDiagonals(row, col, team, 1);
}
function displayKingLine(row, col) {

    let tile = document.getElementsByClassName(row + "x" + col)[0]
    if (tile != undefined) {
        tile.classList.add("kingLine");
    }

}
function clearKingLine() {
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if ($("." + i + "x" + j).hasClass("kingLine")) {
                $("." + i + "x" + j).removeClass("kingLine");
            }
        }
    }
}
function checkCheckmate() {
    // check after each move if it's a checkmate
}
function checkCheck() {

    // check if king still has possible moves


}

// ************************************************************************************************************************************************
// ************************************************************************************************************************************************
//                                                          Attack Line Code
// ************************************************************************************************************************************************
// ************************************************************************************************************************************************
function displayPiercingAttack(row,col,id){
    let attackTile = document.getElementsByClassName(row + "x" + col)[0];
    if (attackTile != undefined) {
        attackTile.classList.add("piercing" + id);
    }
}
function clearPiercingAttack(){
    for(let i = 0; i < 8; i++){
        for(let j = 0; j < 8; j++){

            for(let k = 0; k <= maxClassNumber ;k++){
                if($("." + i + "x" + j).hasClass("piercing" + k)){
                    $("." + i + "x" + j).removeClass("piercing" + k);
                }
            }

        }
    }
}

function displayAttackLine(row, col) {
    // console.log("testing attack line");


    let attackTile = document.getElementsByClassName(row + "x" + col)[0];
    if (attackTile != undefined) {
        attackTile.classList.add("attackLine");
    }

}

function clearAttackLines() {

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {

            if ($("." + i + "x" + j).hasClass("attackLine")) {
                $("." + i + "x" + j).removeClass("attackLine");
            }
        }
    }
}
function checkForAlly(row, col, team) {
    let possiblePiece = $("." + row + "x" + col).children();
    // console.log("checking for ally");


    if (possiblePiece.length > 0) {
        if (team == "white") {
            if (possiblePiece.hasClass("whitePiece")) {
                return true;
            }
            return false;
        }
        else {
            if (possiblePiece.hasClass("blackPiece")) {
                return true;
            }
            return false;
        }
    }
}
function pawnAttackLine(row, col, team) {
    // if black pawn, check tiles below
    var checkRow;
    var checkCol;
    let uniqueClass = classCounter.toString();
    classCounter++;
    maxClassNumber++;



    if (team == "black") {
        checkCol = col;
        checkRow = row + 1;


        // if the tile being checked contains an ally, save the position of the tile
        if (checkForAlly(checkRow, checkCol - 1, team) == true) {
            defendedPieces.push([checkRow, checkCol - 1]);
        }
        // if the tile being checked contains an ally, save the position of the tile
        if (checkForAlly(checkRow, checkCol + 1, team) == true) {
            defendedPieces.push([checkRow, checkCol + 1]);
        }
        // if the tile being checked contains an ally, save the position of the tile
        if (checkForAlly(row, col + 1, team) == true) {
            defendedPieces.push([checkRow, checkCol + 1]);
        }
        // if the tile being checked contains an ally, save the position of the tile
        if (checkForAlly(row, col - 1, team) == true) {
            defendedPieces.push([checkRow, checkCol - 1]);
        }


        // console.log("testing 1");

        displayAttackLine(checkRow, checkCol - 1);
        displayUniqueClass(checkRow, checkCol - 1, uniqueClass);
        displayUniqueClass(row, col, uniqueClass);
        classCounter++;
        maxClassNumber++;


        // console.log("testing 2");
        displayAttackLine(checkRow, checkCol + 1);
        uniqueClass = classCounter.toString();
        displayUniqueClass(checkRow, checkCol + 1, uniqueClass);
        displayUniqueClass(row, col, uniqueClass);
        classCounter++;
        maxClassNumber++;



        // check diagonals
    }

    // if white pawn, check tiles above
    if (team == "white") {
        checkCol = col;
        checkRow = row - 1;

        // if the tile being checked contains an ally, save the position of the tile
        if (checkForAlly(checkRow, checkCol - 1, team) == true) {
            defendedPieces.push([checkRow, checkCol - 1]);
        }
        // if the tile being checked contains an ally, save the position of the tile
        if (checkForAlly(checkRow, checkCol + 1, team) == true) {
            defendedPieces.push([checkRow, checkCol + 1]);
        }
        // if the tile being checked contains an ally, save the position of the tile
        if (checkForAlly(row, col + 1, team) == true) {
            defendedPieces.push([checkRow, checkCol + 1]);
        }
        // if the tile being checked contains an ally, save the position of the tile
        if (checkForAlly(row, col - 1, team) == true) {
            defendedPieces.push([checkRow, checkCol - 1]);
        }


        // console.log("testing 1");

        displayAttackLine(checkRow, checkCol - 1);
        uniqueClass = classCounter.toString();
        displayUniqueClass(checkRow, checkCol - 1, uniqueClass);
        displayUniqueClass(row, col, uniqueClass);
        classCounter++;
        maxClassNumber++;

        // console.log("testing 2");
        displayAttackLine(checkRow, checkCol + 1);
        uniqueClass = classCounter.toString();
        displayUniqueClass(checkRow, checkCol + 1, uniqueClass);
        displayUniqueClass(row, col, uniqueClass);
        classCounter++;
        maxClassNumber++;

    }

}

function rookAttackLine(row, col, team) {

    let uniqueClass = classCounter.toString();
    classCounter++;
    maxClassNumber++;
    checkCrossAttack(row, col, team, 8, uniqueClass);
    checkPiercingCross(row,col,team,8,uniqueClass);

}
function knightAttackLine(row, col, team) {


    let uniqueClass = classCounter.toString();
    classCounter++;
    maxClassNumber++;

    // if the tile being checked contains an ally, save the position of the tile
    if (checkForAlly(row - 2, col - 1, team) == true) {
        defendedPieces.push([row - 2, col - 1]);

    }
    if (checkForAlly(row - 2, col + 1, team) == true) {
        defendedPieces.push([row - 2, col + 1]);
    }
    if (checkForAlly(row - 1, col - 2, team) == true) {
        defendedPieces.push([row - 1, col - 2]);
    }
    if (checkForAlly(row - 1, col + 2, team) == true) {
        defendedPieces.push([row - 1, col + 2]);
    }
    if (checkForAlly(row + 2, col - 1, team) == true) {
        defendedPieces.push([row + 2, col - 1]);
    }
    if (checkForAlly(row + 2, col + 1, team) == true) {
        defendedPieces.push([row + 2, col + 1]);
    }
    if (checkForAlly(row + 1, col - 2, team) == true) {
        defendedPieces.push([row + 1, col - 2]);
    }
    if (checkForAlly(row + 1, col + 2, team) == true) {
        defendedPieces.push([row + 1, col + 2]);
    }


    if (checkTile(row - 2, col - 1, team, "knight") == true) {
        displayAttackLine(row - 2, col - 1);
        displayUniqueClass(row - 2, col - 1, uniqueClass);
        displayUniqueClass(row, col, uniqueClass);

        classCounter += 1;
        maxClassNumber += 1;
    }
    if (checkTile(row - 2, col + 1, team, "knight") == true) {
        displayAttackLine(row - 2, col + 1);
        uniqueClass = classCounter.toString();
        displayUniqueClass(row - 2, col + 1, uniqueClass);
        displayUniqueClass(row, col, uniqueClass);

        classCounter += 1;
        maxClassNumber += 1;
    }
    if (checkTile(row - 1, col - 2, team, "knight") == true) {
        displayAttackLine(row - 1, col - 2);
        uniqueClass = classCounter.toString();
        displayUniqueClass(row - 1, col - 2, uniqueClass);
        displayUniqueClass(row, col, uniqueClass);

        classCounter += 1;
        maxClassNumber += 1;
    }
    if (checkTile(row - 1, col + 2, team, "knight") == true) {
        displayAttackLine(row - 1, col + 2);
        uniqueClass = classCounter.toString();
        displayUniqueClass(row - 1, col + 2, uniqueClass);
        displayUniqueClass(row, col, uniqueClass);

        classCounter += 1;
        maxClassNumber += 1;
    }
    if (checkTile(row + 2, col - 1, team, "knight") == true) {
        displayAttackLine(row + 2, col - 1);
        uniqueClass = classCounter.toString();
        displayUniqueClass(row + 2, col - 1, uniqueClass);
        displayUniqueClass(row, col, uniqueClass);

        classCounter += 1;
        maxClassNumber += 1;
    }
    if (checkTile(row + 2, col + 1, team, "knight") == true) {
        displayAttackLine(row + 2, col + 1);
        uniqueClass = classCounter.toString();
        displayUniqueClass(row + 2, col + 1, uniqueClass);
        displayUniqueClass(row, col, uniqueClass);

        classCounter += 1;
        maxClassNumber += 1;
    }
    if (checkTile(row + 1, col - 2, team, "knight") == true) {
        displayAttackLine(row + 1, col - 2);
        uniqueClass = classCounter.toString();
        displayUniqueClass(row + 1, col - 2, uniqueClass);
        displayUniqueClass(row, col, uniqueClass);

        classCounter += 1;
        maxClassNumber += 1;
    }
    if (checkTile(row + 1, col + 2, team, "knight") == true) {
        displayAttackLine(row + 1, col + 2);
        uniqueClass = classCounter.toString();
        displayUniqueClass(row + 1, col + 2, uniqueClass);
        displayUniqueClass(row, col, uniqueClass);

        classCounter += 1;
        maxClassNumber += 1;
    }

}
function bishopAttackLine(row, col, team) {
    // check ascending diagonal (L->R)
    let uniqueClass = classCounter.toString();
    classCounter++;
    maxClassNumber++;
    checkDiagonalsAttack(row, col, team, 8, uniqueClass);
    checkPiercingDiagonals(row, col, team, 8, uniqueClass);


}
function kingAttackLine(row, col, team) {
    checkDiagonalsAttack(row, col, team, 1);
    checkCrossAttack(row, col, team, 1);
}
function queenAttackLine(row, col, team) {
    let uniqueClass = classCounter.toString();
    classCounter++;
    maxClassNumber++;
    checkDiagonalsAttack(row, col, team, 8, uniqueClass);
    checkCrossAttack(row, col, team, 8, uniqueClass);
    checkPiercingDiagonals(row, col, team, 8, uniqueClass);
    checkPiercingCross(row, col, team, 8, uniqueClass);
}
function checkPiercingDiagonals(row, col, team, limit, uniqueClass){
    let checkCol = col - 1;
    let checkRow = row + 1;
    enemyCount = 0;
    kingFound = false;
    for (i = 0; i < limit; i++) {
        
         if(kingFound == false){
            if (checkTile(checkRow, checkCol, team, "bishop") == true) {
              
                displayPiercingAttack(checkRow, checkCol, uniqueClass);
                displayPiercingAttack(row, col, uniqueClass);

                checkCol--;
                checkRow++;
            }
            else {
                i = limit;
            }
         }

            
        
    }
    checkCol = col + 1;
    checkRow = row - 1;
    enemyCount = 0;
    classCounter++;
    maxClassNumber++;
    kingFound = false;
    for (i = 0; i < limit; i++) {
        
        if(kingFound == false){

            if (checkTile(checkRow, checkCol, team, "bishop") == true) {
                
                uniqueClass = classCounter.toString();
                displayPiercingAttack(checkRow, checkCol, uniqueClass);
                displayPiercingAttack(row, col, uniqueClass);

                checkCol++;
                checkRow--;
            }
            else {
                i = limit;
            }
        }
           
        

    }




    // check descending diagonal (L->R)
    checkCol = col - 1;
    checkRow = row - 1;
    enemyCount = 0;
    classCounter++;
    maxClassNumber++;
    kingFound = false;
    for (i = 0; i < limit; i++) {
        
        if(kingFound == false){
            if (checkTile(checkRow, checkCol, team, "bishop") == true) {

               
                uniqueClass = classCounter.toString();
                displayPiercingAttack(row, col, uniqueClass);

                displayPiercingAttack(checkRow, checkCol, uniqueClass);

                checkCol--;
                checkRow--;
            }
            else {
                i = limit;
            }
        }
            
            
        

    }
    checkCol = col + 1;
    checkRow = row + 1;
    enemyCount = 0;
    classCounter++;
    maxClassNumber++;
    kingFound = false;
    for (i = 0; i < limit; i++) {
        
        if(kingFound == false){
            if (checkTile(checkRow, checkCol, team, "bishop") == true) {
            
                uniqueClass = classCounter.toString();
                displayPiercingAttack(row, col, uniqueClass);

                displayPiercingAttack(checkRow, checkCol, uniqueClass);


                checkCol++;
                checkRow++;
            }
            else {
                i = limit;
            }
        }
           
            
        

    }
}
function checkPiercingCross(row, col, team, limit, uniqueClass){
    if (col < 7) {
        enemyCount = 0;
        let checkCol = col + 1;
        kingFound = false;

        // check horizontal moves to the right
        for (let i = 0; i < limit; i++) {
            
            if(kingFound == false){
                if (checkTile(row, checkCol, team, "rook") == true) {
                   
                    uniqueClass = classCounter.toString();
                    displayPiercingAttack(row, col, uniqueClass);

                    displayPiercingAttack(row, checkCol, uniqueClass);


                    checkCol++;
                }
                else {
                    i = limit;
                }
            }
               
            

        }
    }
    classCounter++;
    maxClassNumber++;
    kingFound = false;
    if (col > 0) {
        enemyCount = 0;
        // check horizontal moves to the left
        let checkCol = col - 1;
        for (let i = 0; i < limit; i++) {
           
                if(kingFound == false){
                    if (checkTile(row, checkCol, team, "rook") == true) {
                   
                        uniqueClass = classCounter.toString();
                        displayPiercingAttack(row, col, uniqueClass);
    
                        displayPiercingAttack(row, checkCol, uniqueClass);
    
    
    
                        checkCol--;
                    }
                    else {
                        i = limit;
                    }
                }
                
            

        }
    }
    classCounter++;
    maxClassNumber++;
    kingFound = false;
    // check vertical moves above
    if (row > 0) {
        enemyCount = 0;
        let checkRow = row - 1;
        for (let i = 0; i < limit; i++) {
            
            if(kingFound == false){
                if (checkTile(checkRow, col, team, "rook") == true) {
                   
                    uniqueClass = classCounter.toString();
                    displayPiercingAttack(row, col, uniqueClass);

                    displayPiercingAttack(checkRow, col, uniqueClass);


                    checkRow--;
                }
                else {
                    i = limit;
                }
            
            }
              

        }
    }

    classCounter++;
    maxClassNumber++;
    kingFound = false;
    // check vertical moves below
    if (row < 7) {
        enemyCount = 0;
        let checkRow = row + 1;
        for (let i = 0; i < limit; i++) {
            
            if(kingFound == false){
                if (checkTile(checkRow, col, team, "rook") == true) {
                    
                    uniqueClass = classCounter.toString();
                    displayPiercingAttack(row, col, uniqueClass);

                    displayPiercingAttack(checkRow, col, uniqueClass);


                    checkRow++;
                }
                else {
                    i = limit;
                }
            }
            
            
        }
    }

}
function checkDiagonalsAttack(row, col, team, limit, uniqueClass) {
    let checkCol = col - 1;
    let checkRow = row + 1;
    enemyCount = 0;
    for (i = 0; i < limit; i++) {
        if (enemyCount < 1) {
            if (checkForAlly(checkRow, checkCol, team) == true) {
                defendedPieces.push([checkRow, checkCol]);
            }

            if (checkTile(checkRow, checkCol, team, "bishop") == true) {
                displayAttackLine(checkRow, checkCol);
                displayUniqueClass(checkRow, checkCol, uniqueClass);
                displayUniqueClass(row, col, uniqueClass);

                checkCol--;
                checkRow++;
            }
            else {
                i = limit;
            }
        }
    }
    checkCol = col + 1;
    checkRow = row - 1;
    enemyCount = 0;
    classCounter++;
    maxClassNumber++;

    for (i = 0; i < limit; i++) {
        if (enemyCount < 1) {
            if (checkForAlly(checkRow, checkCol, team) == true) {
                defendedPieces.push([checkRow, checkCol]);
            }
            if (checkTile(checkRow, checkCol, team, "bishop") == true) {
                displayAttackLine(checkRow, checkCol);
                uniqueClass = classCounter.toString();
                displayUniqueClass(checkRow, checkCol, uniqueClass);
                displayUniqueClass(row, col, uniqueClass);

                checkCol++;
                checkRow--;
            }
            else {
                i = limit;
            }
        }

    }




    // check descending diagonal (L->R)
    checkCol = col - 1;
    checkRow = row - 1;
    enemyCount = 0;
    classCounter++;
    maxClassNumber++;

    for (i = 0; i < limit; i++) {
        if (enemyCount < 1) {
            if (checkForAlly(checkRow, checkCol, team) == true) {
                defendedPieces.push([checkRow, checkCol]);
            }
            if (checkTile(checkRow, checkCol, team, "bishop") == true) {

                displayAttackLine(checkRow, checkCol);
                uniqueClass = classCounter.toString();
                displayUniqueClass(row, col, uniqueClass);

                displayUniqueClass(checkRow, checkCol, uniqueClass);

                checkCol--;
                checkRow--;
            }
            else {
                i = limit;
            }
        }

    }
    checkCol = col + 1;
    checkRow = row + 1;
    enemyCount = 0;
    classCounter++;
    maxClassNumber++;

    for (i = 0; i < limit; i++) {
        if (enemyCount < 1) {
            if (checkForAlly(checkRow, checkCol, team) == true) {
                defendedPieces.push([checkRow, checkCol]);
            }
            if (checkTile(checkRow, checkCol, team, "bishop") == true) {
                displayAttackLine(checkRow, checkCol);
                uniqueClass = classCounter.toString();
                displayUniqueClass(row, col, uniqueClass);

                displayUniqueClass(checkRow, checkCol, uniqueClass);


                checkCol++;
                checkRow++;
            }
            else {
                i = limit;
            }
        }

    }
}
function checkCrossAttack(row, col, team, limit, uniqueClass) {
    if (col < 7) {
        enemyCount = 0;
        let checkCol = col + 1;

        // check horizontal moves to the right
        for (let i = 0; i < limit; i++) {
            if (enemyCount < 1) {
                if (checkForAlly(row, checkCol, team) == true) {
                    defendedPieces.push([row, checkCol]);
                }
                if (checkTile(row, checkCol, team, "rook") == true) {
                    displayAttackLine(row, checkCol);
                    uniqueClass = classCounter.toString();
                    displayUniqueClass(row, col, uniqueClass);

                    displayUniqueClass(row, checkCol, uniqueClass);


                    checkCol++;
                }
                else {
                    i = limit;
                }
            }

        }
    }
    classCounter++;
    maxClassNumber++;

    if (col > 0) {
        enemyCount = 0;
        // check horizontal moves to the left
        let checkCol = col - 1;
        for (let i = 0; i < limit; i++) {
            if (enemyCount < 1) {
                if (checkForAlly(row, checkCol, team) == true) {
                    defendedPieces.push([row, checkCol]);
                }
                if (checkTile(row, checkCol, team, "rook") == true) {
                    displayAttackLine(row, checkCol);
                    uniqueClass = classCounter.toString();
                    displayUniqueClass(row, col, uniqueClass);

                    displayUniqueClass(row, checkCol, uniqueClass);



                    checkCol--;
                }
                else {
                    i = limit;
                }
            }

        }
    }
    classCounter++;
    maxClassNumber++;
    // check vertical moves above
    if (row > 0) {
        enemyCount = 0;
        let checkRow = row - 1;
        for (let i = 0; i < limit; i++) {
            if (enemyCount < 1) {
                if (checkForAlly(checkRow, col, team) == true) {
                    defendedPieces.push([checkRow, col]);
                }
                if (checkTile(checkRow, col, team, "rook") == true) {
                    displayAttackLine(checkRow, col);
                    uniqueClass = classCounter.toString();
                    displayUniqueClass(row, col, uniqueClass);

                    displayUniqueClass(checkRow, col, uniqueClass);


                    checkRow--;
                }
                else {
                    i = limit;
                }
            }

        }
    }

    classCounter++;
    maxClassNumber++;
    // check vertical moves below
    if (row < 7) {
        enemyCount = 0;
        let checkRow = row + 1;
        for (let i = 0; i < limit; i++) {
            if (enemyCount < 1) {
                if (checkForAlly(checkRow, col, team) == true) {
                    defendedPieces.push([checkRow, col]);
                }
                if (checkTile(checkRow, col, team, "rook") == true) {
                    displayAttackLine(checkRow, col);
                    uniqueClass = classCounter.toString();
                    displayUniqueClass(row, col, uniqueClass);

                    displayUniqueClass(checkRow, col, uniqueClass);


                    checkRow++;
                }
                else {
                    i = limit;
                }
            }
        }
    }

}

function displayUniqueClass(row, col, uniqueClass) {
    $("." + row + "x" + col).addClass(uniqueClass);
    // console.log("adding uniqueClass");


    // clear all unique classes before calling the attack line functions again to prevent build up of incorrect attack line IDs
}
function clearUniqueClass() {

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {

            for (let k = 0; k <= maxClassNumber; k++) {
                if ($("." + i + "x" + j).hasClass(k.toString())) {
                    $("." + i + "x" + j).removeClass(k.toString());
                }
            }

        }
    }

}
// the functions below check the enemy king's possible moves before accounting for attack lines and defended pieces, hence it uses the bishop and rook types.
function checkKingDiagonals(row, col, team, limit) {
    let checkCol = col - 1;
    let checkRow = row + 1;
    enemyCount = 0;
    for (i = 0; i < limit; i++) {
        if (enemyCount < 1) {
            if (checkTile(checkRow, checkCol, team, "bishop") == true) {
                displayKingLine(checkRow, checkCol);
                checkCol--;
                checkRow++;
            }
            else {
                i = limit;
            }
        }
    }
    checkCol = col + 1;
    checkRow = row - 1;
    enemyCount = 0;
    for (i = 0; i < limit; i++) {
        if (enemyCount < 1) {
            if (checkTile(checkRow, checkCol, team, "bishop") == true) {
                displayKingLine(checkRow, checkCol);
                checkCol++;
                checkRow--;
            }
            else {
                i = limit;
            }
        }

    }




    // check descending diagonal (L->R)
    checkCol = col - 1;
    checkRow = row - 1;
    enemyCount = 0;
    for (i = 0; i < limit; i++) {
        if (enemyCount < 1) {
            if (checkTile(checkRow, checkCol, team, "bishop") == true) {
                displayKingLine(checkRow, checkCol);
                checkCol--;
                checkRow--;
            }
            else {
                i = limit;
            }
        }

    }
    checkCol = col + 1;
    checkRow = row + 1;
    enemyCount = 0;
    for (i = 0; i < limit; i++) {
        if (enemyCount < 1) {
            if (checkTile(checkRow, checkCol, team, "bishop") == true) {
                displayKingLine(checkRow, checkCol);
                checkCol++;
                checkRow++;
            }
            else {
                i = limit;
            }
        }

    }
}
function checkKingCross(row, col, team, limit) {
    if (col < 7) {
        enemyCount = 0;
        let checkCol = col + 1;

        // check horizontal moves to the right
        for (let i = 0; i < limit; i++) {
            if (enemyCount < 1) {
                if (checkTile(row, checkCol, team, "rook") == true) {
                    displayKingLine(row, checkCol);
                    checkCol++;
                }
                else {
                    i = limit;
                }
            }

        }
    }

    if (col > 0) {
        enemyCount = 0;
        // check horizontal moves to the left
        let checkCol = col - 1;
        for (let i = 0; i < limit; i++) {
            if (enemyCount < 1) {
                if (checkTile(row, checkCol, team, "rook") == true) {
                    displayKingLine(row, checkCol);
                    checkCol--;
                }
                else {
                    i = limit;
                }
            }

        }
    }

    // check vertical moves above
    if (row > 0) {
        enemyCount = 0;
        let checkRow = row - 1;
        for (let i = 0; i < limit; i++) {
            if (enemyCount < 1) {
                if (checkTile(checkRow, col, team, "rook") == true) {
                    displayKingLine(checkRow, col);
                    checkRow--;
                }
                else {
                    i = limit;
                }
            }

        }
    }


    // check vertical moves below
    if (row < 7) {
        enemyCount = 0;
        let checkRow = row + 1;
        for (let i = 0; i < limit; i++) {
            if (enemyCount < 1) {
                if (checkTile(checkRow, col, team, "rook") == true) {
                    displayKingLine(checkRow, col);
                    checkRow++;
                }
                else {
                    i = limit;
                }
            }
        }
    }

}
// **********************************************************************************************************************************************
// **********************************************************************************************************************************************
//                                                      Check Enemy Moves
// **********************************************************************************************************************************************
// **********************************************************************************************************************************************
function displayEnemyMove(row, col) {
    $("." + row + "x" + col).addClass("enemyMove");
}
function pawnEnemyMove(row, col, team) {
    // if black pawn, check tiles below
    var checkRow;
    var checkCol;
    if (team == "black") {
        checkCol = col;
        checkRow = row + 1;
        if (row == 1) {
            // check two tiles ahead


            for (let i = 0; i < 2; i++) {


                if (checkTile(checkRow, checkCol, team, "pawnMove") == true) {

                    displayEnemyMove(checkRow, checkCol);
                    // console.log("you can move here");

                }
                else {
                    // exit loop
                    i = 2;
                }
                checkRow++;
            }

        }
        else if (row < 7) {
            // check one tile ahead


            if (checkTile(checkRow, checkCol, team, "pawnMove") == true) {

                displayEnemyMove(checkRow, checkCol);
                // console.log("you can move here");

            }



        }
        checkCol = col;
        checkRow = row + 1;

        if (checkTile(checkRow, checkCol - 1, team, "pawnAttack") == true) {
            // console.log("testing 1");

            displayEnemyMove(checkRow, checkCol - 1);
        }
        if (checkTile(checkRow, checkCol + 1, team, "pawnAttack") == true) {
            // console.log("testing 2");
            displayEnemyMove(checkRow, checkCol + 1);
        }
        if (checkEnpassant(row, col + 1, team,"right") == true) {
            displayEnemyMove(checkRow, checkCol + 1);
        }
        if (checkEnpassant(row, col - 1, team,"left") == true) {
            displayEnemyMove(checkRow, checkCol - 1);
        }


        // check diagonals
    }

    // if white pawn, check tiles above
    if (team == "white") {
        checkCol = col;
        checkRow = row - 1;
        if (row == 6) {
            // check two tiles ahead


            for (let i = 0; i < 2; i++) {


                if (checkTile(checkRow, checkCol, team, "pawnMove") == true) {

                    displayEnemyMove(checkRow, checkCol);
                    // console.log("you can move here");

                }
                else {
                    // exit loop
                    i = 2;
                }
                checkRow--;
            }

        }
        else if (row > 0) {
            // check one tile ahead


            if (checkTile(checkRow, checkCol, team, "pawnMove") == true) {

                displayEnemyMove(checkRow, checkCol);
                // console.log("you can move here");

            }

        }
        checkCol = col;
        checkRow = row - 1;

        if (checkTile(checkRow, checkCol - 1, team, "pawnAttack") == true) {
            // console.log("testing 1");

            displayEnemyMove(checkRow, checkCol - 1);
        }
        if (checkTile(checkRow, checkCol + 1, team, "pawnAttack") == true) {
            // console.log("testing 2");
            displayEnemyMove(checkRow, checkCol + 1);
        }

        if (checkEnpassant(row, col - 1, team) == true) {
            displayEnemyMove(checkRow, checkCol - 1, "left");
        }
        if (checkEnpassant(row, col + 1, team) == true) {
            displayEnemyMove(checkRow, checkCol + 1, "right");
        }
    }

}
function rookEnemyMove(row, col, team) {

    checkEnemyCross(row, col, team, 8, false);

}
function knightEnemyMove(row, col, team) {
    if (checkTile(row - 2, col - 1, team, "knight") == true) {
        displayEnemyMove(row - 2, col - 1);
    }
    if (checkTile(row - 2, col + 1, team, "knight") == true) {
        displayEnemyMove(row - 2, col + 1);
    }
    if (checkTile(row - 1, col - 2, team, "knight") == true) {
        displayEnemyMove(row - 1, col - 2);
    }
    if (checkTile(row - 1, col + 2, team, "knight") == true) {
        displayEnemyMove(row - 1, col + 2);
    }
    if (checkTile(row + 2, col - 1, team, "knight") == true) {
        displayEnemyMove(row + 2, col - 1);
    }
    if (checkTile(row + 2, col + 1, team, "knight") == true) {
        displayEnemyMove(row + 2, col + 1);
    }
    if (checkTile(row + 1, col - 2, team, "knight") == true) {
        displayEnemyMove(row + 1, col - 2);
    }
    if (checkTile(row + 1, col + 2, team, "knight") == true) {
        displayEnemyMove(row + 1, col + 2);
    }

}
function bishopEnemyMove(row, col, team) {
    // check ascending diagonal (L->R)
    checkEnemyDiagonals(row, col, team, 8, false);


}
function queenEnemyMove(row, col, team) {
    checkEnemyDiagonals(row, col, team, 8, false);
    checkEnemyCross(row, col, team, 8, false);
}
function checkEnemyDiagonals(row, col, team, limit, king) {
    let checkCol = col - 1;
    let checkRow = row + 1;
    let type = "bishop";
    if (king == true) {
        type = "king";
    }
    enemyCount = 0;
    for (i = 0; i < limit; i++) {
        if (enemyCount < 1) {
            if (checkTile(checkRow, checkCol, team, type) == true) {
                displayEnemyMove(checkRow, checkCol);
                checkCol--;
                checkRow++;
            }
            else {
                i = limit;
            }
        }
    }
    checkCol = col + 1;
    checkRow = row - 1;
    enemyCount = 0;
    for (i = 0; i < limit; i++) {
        if (enemyCount < 1) {
            if (checkTile(checkRow, checkCol, team, type) == true) {
                displayEnemyMove(checkRow, checkCol);
                checkCol++;
                checkRow--;
            }
            else {
                i = limit;
            }
        }

    }




    // check descending diagonal (L->R)
    checkCol = col - 1;
    checkRow = row - 1;
    enemyCount = 0;
    for (i = 0; i < limit; i++) {
        if (enemyCount < 1) {
            if (checkTile(checkRow, checkCol, team, type) == true) {
                displayEnemyMove(checkRow, checkCol);
                checkCol--;
                checkRow--;
            }
            else {
                i = limit;
            }
        }

    }
    checkCol = col + 1;
    checkRow = row + 1;
    enemyCount = 0;
    for (i = 0; i < limit; i++) {
        if (enemyCount < 1) {
            if (checkTile(checkRow, checkCol, team, type) == true) {
                displayEnemyMove(checkRow, checkCol);
                checkCol++;
                checkRow++;
            }
            else {
                i = limit;
            }
        }

    }
}
function checkEnemyCross(row, col, team, limit, king) {
    let type = "rook";
    if (king == true) {
        type = "king";
    }
    if (col < 7) {
        enemyCount = 0;
        let checkCol = col + 1;

        // check horizontal moves to the right
        for (let i = 0; i < limit; i++) {
            if (enemyCount < 1) {
                if (checkTile(row, checkCol, team, type) == true) {
                    displayEnemyMove(row, checkCol);
                    checkCol++;
                }
                else {
                    i = limit;
                }
            }

        }
    }

    if (col > 0) {
        enemyCount = 0;
        // check horizontal moves to the left
        let checkCol = col - 1;
        for (let i = 0; i < limit; i++) {
            if (enemyCount < 1) {
                if (checkTile(row, checkCol, team, type) == true) {
                    displayEnemyMove(row, checkCol);
                    checkCol--;
                }
                else {
                    i = limit;
                }
            }

        }
    }

    // check vertical moves above
    if (row > 0) {
        enemyCount = 0;
        let checkRow = row - 1;
        for (let i = 0; i < limit; i++) {
            if (enemyCount < 1) {
                if (checkTile(checkRow, col, team, type) == true) {
                    displayEnemyMove(checkRow, col);
                    checkRow--;
                }
                else {
                    i = limit;
                }
            }

        }
    }


    // check vertical moves below
    if (row < 7) {
        enemyCount = 0;
        let checkRow = row + 1;
        for (let i = 0; i < limit; i++) {
            if (enemyCount < 1) {
                if (checkTile(checkRow, col, team, type) == true) {
                    displayEnemyMove(checkRow, col);
                    checkRow++;
                }
                else {
                    i = limit;
                }
            }
        }
    }

}