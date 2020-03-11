let whitePieces = 16;
let blackPieces = 16;
let currentTeam = "white";

var selectedPiece;
var killedPiece;

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

$(".chessPiece").mousedown(function(){

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
    
    
});

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
            
            if(checkTile(checkRow,checkCol,team,"pawnMove") == true){
                   
                displayPossibleMove(checkRow,checkCol);
                // console.log("you can move here");
                
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
            displayPossibleEmpassant(checkRow,checkCol + 1);
        }
        if(  checkEnpassant(row, col -1 , team) == true){
            displayPossibleEmpassant(checkRow,checkCol - 1);
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
            
            if(checkTile(checkRow,checkCol,team,"pawnMove") == true){
                   
                displayPossibleMove(checkRow,checkCol);
                console.log("you can move here");
                
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
            displayPossibleEmpassant(checkRow,checkCol - 1);
        }
        if(checkEnpassant(row, col + 1, team) == true){
            displayPossibleEmpassant(checkRow,checkCol + 1);
        }
    }

}
function rookMoves(row,col,team){
    
}
function knightMoves(row,col,team){
    
}
function bishopMoves(row,col,team){
    
}
function kingMoves(row,col,team){
    
}
function queenMoves(row,col,team){
    
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
            if(currentPiece.hasClass("possibleMove")){
                currentPiece.removeClass("possibleMove");
                if(currentPiece.hasClass("possibleEmpassant")){
                    currentPiece.removeClass("possibleEmpassant");
                }
            }
            
        }
    }
}

$(".tile").click(function(){
    
    // if tile is empty and is not a possible move, clear the moves
    // console.log("testing 1");
    
    if($(this).children().length == 0 && $(this).hasClass("possibleMove") == false){


        console.log("Clearing moves");
        
        clearMoves();
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
    

});
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
                    return true;
                }
                
                return false;
                
            }
            else{
                if(tileChild.hasClass("blackPiece")){
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
function checkEnpassant(row,col,team){
    // if the specified tile contains an enpassant pawn, return true
    
    let tileToCheck = document.getElementsByClassName(row + "x" + col)[0];
    
    // console.log(tileToCheck);
    
    if(tileToCheck != undefined && tileToCheck.hasChildNodes() == true){
        if(team == "white"){
            // if there is a piece in the same team, return false
            if(tileToCheck.childNodes[0].classList.contains("whitePiece")){
                return false;
            }
            else{
                // if there is a piece in the enemy team, check if its an enpassant piece
                for(let i = 0; i < enpassantBlackPieces.length; i++){

                    
                    
                    if(tileToCheck.childNodes[0] == enpassantBlackPieces[i]){
                        currentEmpassantPiece = enpassantBlackPieces[i];
                        return true;
                    }
                }
            }

           
           
        }
        if(team == "black"){

            if(tileToCheck.childNodes[0].classList.contains("blackPiece")){
                return false;
            }
            else{
                for(let i = 0; i < enpassantWhitePieces.length; i++){
                    if(tileToCheck.childNodes[0] == enpassantWhitePieces[i]){
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

    // console.log(newTile);
    killedPiece = newTile.innerHTML;
    newTile.innerHTML = "";

    newTile.appendChild(selectedPiece);

    if(selectedPiece.classList.contains("fa-chess-pawn")){
        // get the row of selectedPiece
       

        if(currentTeam == "black"){
            console.log(row);
            console.log(initialRow);
            
            
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

    if(currentTeam == "black"){
        console.log("changing teams");
        
        currentTeam = "white";
    }
    else{
        currentTeam = "black";
    }
}
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
function checkCheckmate(){

}
function checkCheck(){

}