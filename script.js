let whitePieces = 16;
let blackPieces = 16;
let currentTeam = "white";

var selectedPiece;
var killedPiece;
var enemyCount;

let enpassantBlackPieces = [];
let enpassantWhitePieces = [];
var currentEmpassantPiece;
let performingEmpassant = false;

//if piece has an enpassant piece next to it, then display enpassant move




initBoard();


// *************************************************************************************************************************************************
// *************************************************************************************************************************************************
//                                                          Game State Functions
// *************************************************************************************************************************************************
// *************************************************************************************************************************************************
function initBoard(){

    let gameBoard = document.getElementsByClassName("boardInner")[0];
    let gameBoardBox = gameBoard.getBoundingClientRect();

    let tileHeight = (gameBoardBox.height - 6)/8;
    let tileWidth = (gameBoardBox.width - 6)/8;

    let leftPos = 0;
    let topPos = 0;

    
    
    var nextTile;
    // generate each tile on the board
    for(let i = 0; i < 8; i++){
        leftPos = 0;
        if( i % 2 == 0){



            nextTile = "black";
          
        }
        else{
            nextTile = "white";
        
        }

        for(let j = 0; j < 8; j++){

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

            if(nextTile == "black"){
                nextTile = "white";
            }
            else{
                nextTile = "black";
            }
                   

            leftPos += tileWidth;

        }

        topPos += tileHeight;
    }

    initPieces();

}

function initPieces(){

    let boardTiles = document.getElementsByClassName("tile");

    for(let h = 0; h < boardTiles.length; h++){

        let boardTile = boardTiles[h];
        // initialize black pieces
        for(let i = 0; i < 8; i++){
            for(let j = 0; j < 8; j++){

               
                let chessPiece = document.createElement("i");
                chessPiece.classList.add("chessPiece");
                chessPiece.classList.add(i + "x" + j + "piece");
                if(i < 2){
                    chessPiece.classList.add("blackPiece");
                }
                else{
                    chessPiece.classList.add("whitePiece");
                }
                if(i == 1 || i == 6){

                    if(boardTile.classList.contains(i + "x" + j)){
                        chessPiece.classList.add("fas");
                       
                        chessPiece.classList.add("fa-chess-pawn");
                        boardTile.appendChild(chessPiece);
                    }
                    // initialize black pawns
                }
                else{
                    if(j == 0 || j == 7){
                        // initialize rooks
                        
                        if(boardTile.classList.contains(i + "x" + j)){
                            chessPiece.classList.add("fas");
                           
                            chessPiece.classList.add("fa-chess-rook");
                            boardTile.appendChild(chessPiece);
                        }
                    }
                    if(j == 1 || j == 6){
                        // initialize horses
                        if(boardTile.classList.contains(i + "x" + j)){
                            chessPiece.classList.add("fas");
                           
                            chessPiece.classList.add("fa-chess-knight");
                            boardTile.appendChild(chessPiece);
                        }
                    }
                    if(j == 2 || j == 5){
                        // initialize bishops
                        if(boardTile.classList.contains(i + "x" + j)){
                            chessPiece.classList.add("fas");
                           
                            chessPiece.classList.add("fa-chess-bishop");
                            boardTile.appendChild(chessPiece);
                        }
                    }
                    if(j == 4){
                        // initialize king
                        if(boardTile.classList.contains(i + "x" + j)){
                            chessPiece.classList.add("fas");
                           
                            chessPiece.classList.add("fa-chess-king");
                            boardTile.appendChild(chessPiece);
                        }
                    }
                    if(j == 3){
                        // initialize queen
                        if(boardTile.classList.contains(i + "x" + j)){
                            chessPiece.classList.add("fas");
                           
                            chessPiece.classList.add("fa-chess-queen");
                            boardTile.appendChild(chessPiece);
                        }
                    }
                }

                

            }
            if(i == 1){
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
function onPieceTouch(){
    // if has the class possibleMove , execute the move
    if($(this).hasClass("possibleMove")){

        if($(this).hasClass("possibleEmpassant")){
            performingEmpassant = true;
        }
        var row;
        var col;
        for(let i = 0; i < 8; i++){
            for(let j = 0; j < 8; j++){
                if($(this).hasClass(i + "x" + j + "piece")){
                    row = i;
                    col = j;
                }
            }
        }
        movePiece(row,col);
        clearMoves();
    }
    else{
            // if clicking on a piece on the opposite team, dont change the selected piece
        if(currentTeam == "black"){
            if($(this).hasClass("whitePiece")){
                
            }
            else{
                selectedPiece = this;
                
                
            }
        }
        else{
            if($(this).hasClass("blackPiece")){

            }
            else{
                selectedPiece = this;
                
            }
        }
        
        // console.log(selectedPiece);
        
        clearMoves();
        var row;
        var col;
        var team;
        // get piece location
        for(let i = 0; i < 8; i++){
            for(let j = 0; j < 8; j++){
                if(this.classList.contains(i + "x" + j + "piece")){
                    row = i;
                    col = j;
                }
            }
        }
        // check which side 
        if(this.classList.contains("blackPiece")){
            team = "black";
        }
        else{
            team = "white";
        }
        // check piece type
        if(currentTeam == team){
            if(this.classList.contains("fa-chess-pawn")){
                console.log("i am a pawn!");
                pawnMoves(row,col,team);
                
            }
            if(this.classList.contains("fa-chess-rook")){
                console.log("i am a rook!");
                rookMoves(row,col,team);
            }
            if(this.classList.contains("fa-chess-knight")){
                console.log("i am a knight!");
                knightMoves(row,col,team);
            }
            if(this.classList.contains("fa-chess-bishop")){
                console.log("i am a bishop!");
                bishopMoves(row,col,team);
            }
            if(this.classList.contains("fa-chess-king")){
                console.log("i am a king!");
                kingMoves(row,col,team);
            }
            if(this.classList.contains("fa-chess-queen")){
                console.log("i am a queen!");
                queenMoves(row,col,team);
            }
        }

    }

}
let initpieces = document.getElementsByClassName("chessPiece");
for(let i = 0; i < initpieces.length; i++){
    initpieces[i].addEventListener("mousedown",onPieceTouch);
}

function pawnMoves(row,col,team){
    // if black pawn, check tiles below
    var checkRow;
    var checkCol;
    if(team == "black"){
        checkCol = col;
        checkRow = row + 1;
        if(row == 1){
            // check two tiles ahead
           

            for(let i = 0; i < 2; i++){

                
                if(checkTile(checkRow,checkCol,team,"pawnMove") == true){
                   
                    displayPossibleMove(checkRow,checkCol);
                    console.log("you can move here");
                    
                }
                else{
                    // exit loop
                    i = 2;  
                }
                checkRow++;
            }

        }
        else if(row < 7){
            // check one tile ahead
            if(row == 6){
                if(checkTile(checkRow,checkCol,team,"pawnMove") == true){
                    displayPawnExchange(checkRow,checkCol);

                }
            }
            else{
                if(checkTile(checkRow,checkCol,team,"pawnMove") == true){
                   
                    displayPossibleMove(checkRow,checkCol);
                    // console.log("you can move here");
                    
                }
            }
           

        }
        checkCol = col;
        checkRow = row + 1;
      
        if(checkTile(checkRow,checkCol - 1, team, "pawnAttack") == true){
            // console.log("testing 1");
            
            displayPossibleMove(checkRow,checkCol - 1);
        }
        if(checkTile(checkRow,checkCol + 1, team, "pawnAttack") == true){
            // console.log("testing 2");
            displayPossibleMove(checkRow,checkCol + 1);
        }
        if(  checkEnpassant(row, col + 1, team) == true){
            displayPossibleEmpassant(checkRow,checkCol + 1,"right");
        }
        if(  checkEnpassant(row, col -1 , team) == true){
            displayPossibleEmpassant(checkRow,checkCol - 1,"left");
        }
      
        
        // check diagonals
    }

    // if white pawn, check tiles above
    if(team == "white"){
        checkCol = col;
        checkRow = row - 1;
        if(row == 6){
            // check two tiles ahead
           

            for(let i = 0; i < 2; i++){

                
                if(checkTile(checkRow,checkCol,team,"pawnMove") == true){
                   
                    displayPossibleMove(checkRow,checkCol);
                    console.log("you can move here");
                    
                }
                else{
                    // exit loop
                    i = 2;  
                }
                checkRow--;
            }

        }
        else if(row > 0){
            // check one tile ahead
            if(row == 1){
                if(checkTile(checkRow,checkCol,team,"pawnMove") == true){
                   
                    displayPawnExchange(checkRow,checkCol);
                   
                    
                }
            }
            else{
                if(checkTile(checkRow,checkCol,team,"pawnMove") == true){
                   
                    displayPossibleMove(checkRow,checkCol);
                    console.log("you can move here");
                    
                }
            }
        }
        checkCol = col;
        checkRow = row - 1;
       
        if(checkTile(checkRow,checkCol - 1, team, "pawnAttack") == true){
            // console.log("testing 1");
            
            displayPossibleMove(checkRow,checkCol - 1);
        }
        if(checkTile(checkRow,checkCol + 1, team, "pawnAttack") == true){
            // console.log("testing 2");
            displayPossibleMove(checkRow,checkCol + 1);
        }
        
        if( checkEnpassant(row, col - 1, team) == true){
            displayPossibleEmpassant(checkRow,checkCol - 1,"left");
        }
        if(checkEnpassant(row, col + 1, team) == true){
            displayPossibleEmpassant(checkRow,checkCol + 1,"right");
        }
    }

}
function rookMoves(row,col,team){

    checkCross(row,col,team,8);
  
}
function knightMoves(row,col,team){
    if(checkTile(row - 2,col - 1, team,"knight") == true){
        displayPossibleMove(row - 2,col - 1);
    }
    if(checkTile(row - 2,col + 1, team,"knight") == true){
        displayPossibleMove(row - 2,col + 1);
    }
    if(checkTile(row - 1,col - 2, team,"knight") == true){
        displayPossibleMove(row - 1,col - 2);
    }
    if(checkTile(row - 1,col + 2, team,"knight") == true){
        displayPossibleMove(row - 1,col + 2);
    }
    if(checkTile(row + 2,col - 1, team,"knight") == true){
        displayPossibleMove(row + 2,col - 1);
    }
    if(checkTile(row + 2,col + 1, team,"knight") == true){
        displayPossibleMove(row + 2,col + 1);
    }
    if(checkTile(row + 1,col - 2, team,"knight") == true){
        displayPossibleMove(row + 1,col - 2);
    }
    if(checkTile(row + 1,col + 2, team,"knight") == true){
        displayPossibleMove(row + 1,col + 2);
    }
   
}
function bishopMoves(row,col,team){
    // check ascending diagonal (L->R)
    checkDiagonals(row,col,team,8);
   

}
function kingMoves(row,col,team){
    checkDiagonals(row,col,team,1);
    checkCross(row,col,team,1);
}
function queenMoves(row,col,team){
    checkDiagonals(row,col,team,8);
    checkCross(row,col,team,8);
}
function checkDiagonals(row,col,team,limit){
    let checkCol = col - 1;
    let checkRow = row + 1;
    enemyCount = 0;
    for(i = 0; i < limit; i++){
        if(enemyCount < 1){
            if(checkTile(checkRow,checkCol, team,"bishop") == true){
                displayPossibleMove(checkRow,checkCol);
                checkCol--;
                checkRow++;
            }
            else{
                i = limit;
            }
        }
    }
    checkCol = col + 1;
    checkRow = row - 1;
    enemyCount = 0;
    for(i = 0; i < limit; i++){
        if(enemyCount < 1){
            if(checkTile(checkRow,checkCol, team,"bishop") == true){
                displayPossibleMove(checkRow,checkCol);
                checkCol++;
                checkRow--;
            }
            else{
                i = limit;
            }
        }
       
    }




    // check descending diagonal (L->R)
    checkCol = col - 1;
    checkRow = row - 1;
    enemyCount = 0;
    for(i = 0; i < limit; i++){
        if(enemyCount < 1){
            if(checkTile(checkRow,checkCol, team,"bishop") == true){
                displayPossibleMove(checkRow,checkCol);
                checkCol--;
                checkRow--;
            }
            else{
                i = limit;
            }
        }
        
    }
    checkCol = col + 1;
    checkRow = row + 1;
    enemyCount = 0;
    for(i = 0; i < limit; i++){
        if(enemyCount < 1){
            if(checkTile(checkRow,checkCol, team,"bishop") == true){
                displayPossibleMove(checkRow,checkCol);
                checkCol++;
                checkRow++;
            }
            else{
                i = limit;
            }
        }
        
    }
}
function checkCross(row,col,team,limit){
    if(col < 7){
        enemyCount = 0;
        let checkCol = col + 1;
    
        // check horizontal moves to the right
        for(let i = 0; i < limit; i++){
            if(enemyCount < 1){
                if(checkTile(row,checkCol,team,"rook") == true ){
                    displayPossibleMove(row,checkCol);
                    checkCol++;
                }
                else{
                    i = limit;
                }
            }
            
        }
    }
   
    if(col > 0){
        enemyCount = 0;
        // check horizontal moves to the left
        let checkCol = col - 1;
        for(let i = 0; i < limit; i++){
            if(enemyCount < 1){
                if(checkTile(row,checkCol,team,"rook") == true){
                    displayPossibleMove(row,checkCol);
                    checkCol--;
                }
                else{
                    i = limit;
                }
            }
        
        }
    }
    
    // check vertical moves above
    if(row > 0){
        enemyCount = 0;
        let checkRow = row - 1;
        for(let i = 0; i < limit; i++){
            if(enemyCount < 1){
                if(checkTile(checkRow,col,team,"rook") == true){
                    displayPossibleMove(checkRow,col);
                    checkRow--;
                }
                else{
                    i = limit;
                }
            }
            
        }
    }

    
    // check vertical moves below
    if(row < 7){
        enemyCount = 0;
        let checkRow = row + 1;
        for(let i = 0; i < limit; i++){
            if(enemyCount < 1){
                if(checkTile(checkRow,col,team,"rook") == true){
                    displayPossibleMove(checkRow,col);
                    checkRow++;
                }
                else{
                    i = limit;
                }
            }
        }
    }

}
function clearMoves(){
    // console.log("testing 1");
    for(let i = 0; i < 8; i++){
        for(let j = 0; j < 8 ; j++){
            let currentTile = $("." + i + "x" + j);
            let currentPiece = $("." + i + "x" + j + "piece");
            if(currentTile.hasClass("possibleMove")){
                // console.log("testing 2");
                
                currentTile.removeClass("possibleMove");

                if(currentTile.hasClass("possibleEmpassant")){
                    currentTile.removeClass("possibleEmpassant");
                }
            }
            if(currentTile.hasClass("pawnExchange")){
                currentTile.removeClass("pawnExchange");
            }
            if(currentPiece.hasClass("possibleMove")){
                currentPiece.removeClass("possibleMove");
                if(currentPiece.hasClass("possibleEmpassant")){
                    currentPiece.removeClass("possibleEmpassant");
                }
            }
            
        }
    }
}
function onTileClick(){
// if tile is empty and is not a possible move, clear the moves
    // console.log("testing 1");
    
    if($(this).children().length == 0 && $(this).hasClass("possibleMove") == false){


        console.log("Clearing moves");

        if($(this).hasClass("pawnExchange") == false){
            clearMoves();
        }
        
    }
    else if($(this).hasClass("possibleMove")){
        
        if($(this).hasClass("possibleEmpassant")){
            performingEmpassant = true;
        }
        clearMoves();
        var row;
        var col;
        for(let i = 0; i < 8; i++){
            for(let j = 0; j < 8; j++){
                if($(this).hasClass(i + "x" + j)){
                    row = i;
                    col = j;
                }
            }
        }
        // console.log(row);
        // console.log(col);
        
        var initialRow;

        for(i = 0; i < 8; i++){
            for(j = 0; j < 8; j++){
                if(selectedPiece.classList.contains(i + "x" + j + "piece")){
                    initialRow = i;
                }
            }
        }

        movePiece(row,col,initialRow);
     
        
    
    }
    if($(this).hasClass("pawnExchange")){

        clearMoves();
        var row;
        var col;

        for(let i = 0; i < 8; i++){
            for(let j = 0; j < 8; j++){
                if($(this).hasClass(i + "x" + j)){
                    row = i;
                    col = j;
                }
            }
        }

        exchangePawn(row,col);

    }
}
let inittiles = document.getElementsByClassName("tile");

for(let i = 0; i < inittiles.length; i++){
    inittiles[i].addEventListener("click",onTileClick)
}



// *************************************************************************************************************************************************
// *************************************************************************************************************************************************
//                                                          Game Events Functions
// *************************************************************************************************************************************************
// *************************************************************************************************************************************************
function checkTile(row,col,team,piece){

    let tile = $("." + row + "x" + col);
    let tileChild = tile.children();
    //check if tile has a chessPiece in it
    if(tileChild.length > 0){

        if(piece == "pawnMove"){
            return false;
        }
        else{
         

            if(team == "black"){
                console.log(tileChild.hasClass("whitePiece"));
                
                if(tileChild.hasClass("whitePiece")){
                    enemyCount = 1;
                    return true;
                }
                
                return false;
                
            }
            else{
                if(tileChild.hasClass("blackPiece")){
                    enemyCount = 1;
                    return true;
                }
                
                return false;
            }
            
        }
        
        
    }
    
    // if no elements inside

    if(piece != "pawnAttack"){
        return true;
    }
    
    
    
    

 
}
function checkEnpassant(row,col,team,side){
    // check if square to move into has no friendly pieces
    // if the specified tile contains an enpassant pawn, return true
    
    let tileToCheck = document.getElementsByClassName(row + "x" + col)[0];
   
    
    // console.log(tileToCheck);
    var newPos;
    if(tileToCheck != undefined && tileToCheck.hasChildNodes() == true){
        if(team == "white"){
            if(side == "right"){
                newPos = document.getElementsByClassName(row - 1 + "x" + col + 1)[0];
            }
            else{
                newPos = document.getElementsByClassName(row - 1 + "x" + col - 1)[0];
            }
            var newPosChild = [];
            if(newPos != undefined){
                
                newPosChild = newPos.childNodes;
            }
          
            // if there is a piece in the same team, return false
            if(tileToCheck.childNodes[0].classList.contains("whitePiece")){
                return false;
            }
            else{
                // if there is a piece in the enemy team, check if its an enpassant piece
                for(let i = 0; i < enpassantBlackPieces.length; i++){                    
                    
                    if(tileToCheck.childNodes[0] == enpassantBlackPieces[i]){

                        if(newPosChild.length > 0){
                            if(newPos.childNodes[0].classList.contains("whitePiece") == true){
                            
                                return false;
                            }
                        }
                        
                        currentEmpassantPiece = enpassantBlackPieces[i];
                        return true;
                        
                    }                    
                }
            }

           
           
        }
        if(team == "black"){
            if(side == "right"){
                newPos = document.getElementsByClassName(row + 1 + "x" + col + 1)[0];
            }
            else{
                newPos = document.getElementsByClassName(row + 1 + "x" + col - 1)[0];
            }

            var newPosChild = [];
            if(newPos != undefined){
                newPosChild = newPos.childNodes;
            }
             
            if(tileToCheck.childNodes[0].classList.contains("blackPiece")){
                return false;
            }
            else{
                for(let i = 0; i < enpassantWhitePieces.length; i++){
                    if(tileToCheck.childNodes[0] == enpassantWhitePieces[i]){

                        if(newPosChild.length > 0){
                            if(newPos.childNodes[0].classList.contains("blackPiece") == true){
                                
                                return false;
                            }
                        }
                        currentEmpassantPiece = enpassantWhitePieces[i];
                        return true;
                    }
                }
            }
            
        }
    
    }
    
    return false;
}
function displayPossibleMove(row,col){

    $("." + row + "x" + col).addClass("possibleMove");

    let piece =   $("." + row + "x" + col + "piece");
    if(piece != undefined){
        piece.addClass("possibleMove");
    }

}
function displayPossibleEmpassant(row,col){

    
    $("." + row + "x" + col).addClass("possibleMove");
    $("." + row + "x" + col).addClass("possibleEmpassant");

    let piece =   $("." + row + "x" + col + "piece");
    if(piece != undefined){
        piece.addClass("possibleEmpassant");
        piece.addClass("possibleMove");
    }
}
function displayPawnExchange(row,col){
    let newTile = document.getElementsByClassName(row + "x" + col)[0];
    newTile.classList.add("pawnExchange");
}
function movePiece(row,col,initialRow){
    // console.log("testing 1");
    // console.log(row);
    // console.log(col);
    for(let i = 0; i < enpassantBlackPieces.length; i++){
        if(enpassantBlackPieces[i] == selectedPiece){
            enpassantBlackPieces.splice(i,1);
            console.log(enpassantBlackPieces);
            
        }
    }
    for(let i = 0; i < enpassantWhitePieces.length; i++){
        if(enpassantWhitePieces[i] == selectedPiece){
            enpassantWhitePieces.splice(i,1);
            console.log(enpassantWhitePieces);
            
        }
    }
    

    if(currentEmpassantPiece != undefined && performingEmpassant == true){
        currentEmpassantPiece.remove();
        currentEmpassantPiece = undefined;
        performingEmpassant = false;
    }
    
    
    selectedPiece.remove();
    replaceLocationClass(row,col);
    let newTile =  document.getElementsByClassName(row + "x" + col)[0];

    console.log(newTile);

    let newTileChild = newTile.childNodes[0];

    if(newTileChild != undefined){
        killedPiece = newTileChild;
    }
    
    newTile.innerHTML = "";

    newTile.appendChild(selectedPiece);

    if(selectedPiece.classList.contains("fa-chess-pawn")){
        // get the row of selectedPiece
       

        if(currentTeam == "black"){
            
            
            if(row - initialRow == 2){
                enpassantBlackPieces.push(selectedPiece);
                console.log(enpassantBlackPieces);
                
            }
        }
        else{
            if(initialRow - row == 2){
                enpassantWhitePieces.push(selectedPiece);
                console.log(enpassantWhitePieces);
            }
        }
        

    }
   
    clearAttackLines();
    checkAttackLines();
    clearMoves();

    if(currentTeam == "black"){
        console.log("changing teams");
        
        currentTeam = "white";
    }
    else{
        currentTeam = "black";
    }
}
function exchangePawn(row,col){
    selectedPiece.remove();
    replaceLocationClass(row,col);
    let newTile = document.getElementsByClassName(row + "x" + col)[0];
    newTile.appendChild(selectedPiece);


    displayExchangeMenu();

}
function displayExchangeMenu(){
    
    $(".exchangeMenu").toggle();

    // toggleEvent Listeners
    let tiles = document.getElementsByClassName("tile");

    for(let i = 0; i < tiles.length; i++){
        tiles[i].removeEventListener("click",onTileClick)
    }

    let pieces = document.getElementsByClassName("chessPiece");
    for(let i = 0; i < pieces.length; i++){
        pieces[i].removeEventListener("mousedown",onPieceTouch);
    }
}
function removeExchangeMenu(){
    $(".exchangeMenu").toggle();

    // toggleEvent Listeners
    let tiles = document.getElementsByClassName("tile");

    for(let i = 0; i < tiles.length; i++){
        tiles[i].addEventListener("click",onTileClick)
    }

    let pieces = document.getElementsByClassName("chessPiece");
    for(let i = 0; i < pieces.length; i++){
        pieces[i].addEventListener("mousedown",onPieceTouch);
    }
}
$(".promotion").click(function(){
    selectedPiece.classList.remove("fa-chess-pawn");
    if($(this).hasClass("fa-chess-rook")){
        // replace current piece with rook
      
        selectedPiece.classList.add("fa-chess-rook");
    }
    if($(this).hasClass("fa-chess-knight")){
        // replace current piece with rook
      
        selectedPiece.classList.add("fa-chess-knight");
    }
    if($(this).hasClass("fa-chess-queen")){
        // replace current piece with rook
      
        selectedPiece.classList.add("fa-chess-queen");
    }
    if($(this).hasClass("fa-chess-bishop")){
        // replace current piece with rook
      
        selectedPiece.classList.add("fa-chess-bishop");
    }
    selectedPiece.classList.remove("promotion");
    removeExchangeMenu();
    clearAttackLines();
    checkAttackLines();
   
    if(currentTeam == "black"){
        currentTeam = "white";
    }
    else{
        currentTeam = "black";
    }
});
function replaceLocationClass(row,col){

    for(let i = 0; i < 8; i++){
        for(let j = 0; j < 8; j++){
            if(selectedPiece.classList.contains(i + "x" + j + "piece")){
                selectedPiece.classList.remove(i + "x" + j +"piece");
            }
        }
    }

    selectedPiece.classList.add(row + "x" + col + "piece");

}
function checkAttackLines(){
    // this function is called after a move is made and checks where the current player's attack lines are
    // display all the possible attacklines for the current player
    // get all the possible pieces in the current team
    // console.log("testing attack Lines A");

    var pieces;
    var team;
        if(currentTeam == "black"){
            pieces = document.getElementsByClassName("blackPiece");
            team = "black";
        }
        else{
            pieces = document.getElementsByClassName("whitePiece");
            team = "white";
        }
    
     

        for(let i = 0; i < pieces.length; i++){
            //get row and col of piece
            var row;
            var col;
            
            for(let j = 0; j < 8; j++){
                for(let k = 0; k < 8; k++){

                    if(pieces[i].classList.contains(j + "x" + k + "piece")){
                        row = j;
                        col = k;
                    }
                }
            }
            
            if(pieces[i].classList.contains("fa-chess-pawn")){
                pawnAttackLine(row,col,team);
                // console.log("testing attack lines B");
                
            }
            if(pieces[i].classList.contains("fa-chess-rook")){
                rookAttackLine(row,col,team);
                // console.log("testing attack lines B");
                
            }
            if(pieces[i].classList.contains("fa-chess-knight")){
                knightAttackLine(row,col,team);
                // console.log("testing attack lines B");
                
            }
            if(pieces[i].classList.contains("fa-chess-bishop")){
                bishopAttackLine(row,col,team);
                // console.log("testing attack lines B");
                
            }
            if(pieces[i].classList.contains("fa-chess-queen")){
                queenAttackLine(row,col,team);
                // console.log("testing attack lines B");
                
            }
            if(pieces[i].classList.contains("fa-chess-king")){
                kingAttackLine(row,col,team);
                // console.log("testing attack lines B");
                
            }

        }
    

    // if the attacklines intersect with the king's possible moves, remove those possible moves.
    // if the attacklines intersect with the king, check if there are possible moves. If yes, it's a check. If none, check if ally lines block enemylines. If none, it's checkmate .Otherwise, it's a check.
}
function checkCheckmate(){
    // check after each move if it's a checkmate
}
function checkCheck(){
    // check after each move if it's a check
    // 
}

// ************************************************************************************************************************************************
// ************************************************************************************************************************************************
//                                                          Attack Line Code
// ************************************************************************************************************************************************
// ************************************************************************************************************************************************
function displayAttackLine(row,col){
    // console.log("testing attack line");
    

    let attackTile = document.getElementsByClassName(row + "x" + col )[0];
    if(attackTile != undefined){
        attackTile.classList.add("attackLine");
    }
 
}
function clearAttackLines(){

    for(let i = 0; i < 8; i++){
        for(let j = 0; j < 8; j++){

            if($("."+ i + "x" + j).hasClass("attackLine")){
                $("."+ i + "x" + j).removeClass("attackLine");
            }
        }
    }
}
function pawnAttackLine(row,col,team){
    // if black pawn, check tiles below
    var checkRow;
    var checkCol;
    if(team == "black"){
        checkCol = col;
        checkRow = row + 1;
        if(row == 1){
            // check two tiles ahead
           

            for(let i = 0; i < 2; i++){

                
                if(checkTile(checkRow,checkCol,team,"pawnMove") == true){
                   
                    displayAttackLine(checkRow,checkCol);
                    console.log("you can move here");
                    
                }
                else{
                    // exit loop
                    i = 2;  
                }
                checkRow++;
            }

        }
        else if(row < 7){
            // check one tile ahead
            if(row == 6){
                if(checkTile(checkRow,checkCol,team,"pawnMove") == true){
                    displayAttackLine(checkRow,checkCol);

                }
            }
            else{
                if(checkTile(checkRow,checkCol,team,"pawnMove") == true){
                   
                    displayAttackLine(checkRow,checkCol);
                    // console.log("you can move here");
                    
                }
            }
           

        }
        checkCol = col;
        checkRow = row + 1;
      
        if(checkTile(checkRow,checkCol - 1, team, "pawnAttack") == true){
            // console.log("testing 1");
            
            displayAttackLine(checkRow,checkCol - 1);
        }
        if(checkTile(checkRow,checkCol + 1, team, "pawnAttack") == true){
            // console.log("testing 2");
            displayAttackLine(checkRow,checkCol + 1);
        }
        if(  checkEnpassant(row, col + 1, team) == true){
            displayAttackLine(checkRow,checkCol + 1);
        }
        if(  checkEnpassant(row, col -1 , team) == true){
            displayAttackLine(checkRow,checkCol - 1);
        }
      
        
        // check diagonals
    }

    // if white pawn, check tiles above
    if(team == "white"){
        checkCol = col;
        checkRow = row - 1;
        if(row == 6){
            // check two tiles ahead
           

            for(let i = 0; i < 2; i++){

                
                if(checkTile(checkRow,checkCol,team,"pawnMove") == true){
                   
                    displayAttackLine(checkRow,checkCol);
                    console.log("you can move here");
                    
                }
                else{
                    // exit loop
                    i = 2;  
                }
                checkRow--;
            }

        }
        else if(row > 0){
            // check one tile ahead
            if(row == 1){
                if(checkTile(checkRow,checkCol,team,"pawnMove") == true){
                   
                    displayAttackLine(checkRow,checkCol);
                   
                    
                }
            }
            else{
                if(checkTile(checkRow,checkCol,team,"pawnMove") == true){
                   
                    displayAttackLine(checkRow,checkCol);
                    console.log("you can move here");
                    
                }
            }
        }
        checkCol = col;
        checkRow = row - 1;
       
        if(checkTile(checkRow,checkCol - 1, team, "pawnAttack") == true){
            // console.log("testing 1");
            
            displayAttackLine(checkRow,checkCol - 1);
        }
        if(checkTile(checkRow,checkCol + 1, team, "pawnAttack") == true){
            // console.log("testing 2");
            displayAttackLine(checkRow,checkCol + 1);
        }
        
        if( checkEnpassant(row, col - 1, team) == true){
            displayAttackLine(checkRow,checkCol - 1);
        }
        if(checkEnpassant(row, col + 1, team) == true){
            displayAttackLine(checkRow,checkCol + 1);
        }
    }

}
function rookAttackLine(row,col,team){

    checkCrossAttack(row,col,team,8);
  
}
function knightAttackLine(row,col,team){
    if(checkTile(row - 2,col - 1, team,"knight") == true){
        displayAttackLine(row - 2,col - 1);
    }
    if(checkTile(row - 2,col + 1, team,"knight") == true){
        displayAttackLine(row - 2,col + 1);
    }
    if(checkTile(row - 1,col - 2, team,"knight") == true){
        displayAttackLine(row - 1,col - 2);
    }
    if(checkTile(row - 1,col + 2, team,"knight") == true){
        displayAttackLine(row - 1,col + 2);
    }
    if(checkTile(row + 2,col - 1, team,"knight") == true){
        displayAttackLine(row + 2,col - 1);
    }
    if(checkTile(row + 2,col + 1, team,"knight") == true){
        displayAttackLine(row + 2,col + 1);
    }
    if(checkTile(row + 1,col - 2, team,"knight") == true){
        displayAttackLine(row + 1,col - 2);
    }
    if(checkTile(row + 1,col + 2, team,"knight") == true){
        displayAttackLine(row + 1,col + 2);
    }
   
}
function bishopAttackLine(row,col,team){
    // check ascending diagonal (L->R)
    checkDiagonalsAttack(row,col,team,8);
   

}
function kingAttackLine(row,col,team){
    checkDiagonalsAttack(row,col,team,1);
    checkCrossAttack(row,col,team,1);
}
function queenAttackLine(row,col,team){
    checkDiagonalsAttack(row,col,team,8);
    checkCrossAttack(row,col,team,8);
}
function checkDiagonalsAttack(row,col,team,limit){
    let checkCol = col - 1;
    let checkRow = row + 1;
    enemyCount = 0;
    for(i = 0; i < limit; i++){
        if(enemyCount < 1){
            if(checkTile(checkRow,checkCol, team,"bishop") == true){
                displayAttackLine(checkRow,checkCol);
                checkCol--;
                checkRow++;
            }
            else{
                i = limit;
            }
        }
    }
    checkCol = col + 1;
    checkRow = row - 1;
    enemyCount = 0;
    for(i = 0; i < limit; i++){
        if(enemyCount < 1){
            if(checkTile(checkRow,checkCol, team,"bishop") == true){
                displayAttackLine(checkRow,checkCol);
                checkCol++;
                checkRow--;
            }
            else{
                i = limit;
            }
        }
       
    }




    // check descending diagonal (L->R)
    checkCol = col - 1;
    checkRow = row - 1;
    enemyCount = 0;
    for(i = 0; i < limit; i++){
        if(enemyCount < 1){
            if(checkTile(checkRow,checkCol, team,"bishop") == true){
                displayAttackLine(checkRow,checkCol);
                checkCol--;
                checkRow--;
            }
            else{
                i = limit;
            }
        }
        
    }
    checkCol = col + 1;
    checkRow = row + 1;
    enemyCount = 0;
    for(i = 0; i < limit; i++){
        if(enemyCount < 1){
            if(checkTile(checkRow,checkCol, team,"bishop") == true){
                displayAttackLine(checkRow,checkCol);
                checkCol++;
                checkRow++;
            }
            else{
                i = limit;
            }
        }
        
    }
}
function checkCrossAttack(row,col,team,limit){
    if(col < 7){
        enemyCount = 0;
        let checkCol = col + 1;
    
        // check horizontal moves to the right
        for(let i = 0; i < limit; i++){
            if(enemyCount < 1){
                if(checkTile(row,checkCol,team,"rook") == true ){
                    displayAttackLine(row,checkCol);
                    checkCol++;
                }
                else{
                    i = limit;
                }
            }
            
        }
    }
   
    if(col > 0){
        enemyCount = 0;
        // check horizontal moves to the left
        let checkCol = col - 1;
        for(let i = 0; i < limit; i++){
            if(enemyCount < 1){
                if(checkTile(row,checkCol,team,"rook") == true){
                    displayAttackLine(row,checkCol);
                    checkCol--;
                }
                else{
                    i = limit;
                }
            }
        
        }
    }
    
    // check vertical moves above
    if(row > 0){
        enemyCount = 0;
        let checkRow = row - 1;
        for(let i = 0; i < limit; i++){
            if(enemyCount < 1){
                if(checkTile(checkRow,col,team,"rook") == true){
                    displayAttackLine(checkRow,col);
                    checkRow--;
                }
                else{
                    i = limit;
                }
            }
            
        }
    }

    
    // check vertical moves below
    if(row < 7){
        enemyCount = 0;
        let checkRow = row + 1;
        for(let i = 0; i < limit; i++){
            if(enemyCount < 1){
                if(checkTile(checkRow,col,team,"rook") == true){
                    displayAttackLine(checkRow,col);
                    checkRow++;
                }
                else{
                    i = limit;
                }
            }
        }
    }

}