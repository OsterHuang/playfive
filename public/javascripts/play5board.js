/** 
* Play5Board
* 
* This is GUI Style programming.
**/

    function Play5Board(element, editable, boardWidth, boardSize) {
        var parentObj = this;
        
        // ----
        // Data Model
        // ----
        if (editable)
            this.editable = editable;
        else
            this.editable = false;

        if (boardWidth)
            this.boardWidth = parseInt(boardWidth);
        else
            this.boardWidth = 400;

        //TODO: need validation - even, greater equals 9, ....
        this.boardSize = 15;
        
        this.boardGridWidth = Math.round(this.boardWidth / (this.boardSize + 2));

        this.rawString = '';
        this.moves = [];
        this.origMoves = [];
        this.isShowTracePanel = false;
        this.showingSeq = 0;
        
        
        // ----
        // DOM Element
        // ----
        this.element = element;
        this.previewWhite;
        this.previewBlack;
        this.panelUrl;
        this.panelNav;
        this.panelTrace;
        
        // ----
        // Methods
        // ----
        this.paintBoard = function(repainting) {
//            if (!parentObj.xTable && !repainting) 
//                return;
            parentObj.element.style.width = (parentObj.boardGridWidth * (parentObj.boardSize + 4)) + 'px';
            
            parentObj.xTable = document.createElement("table");
            parentObj.xTable.setAttribute("style", "border-spacing:0px; margin-left:auto; margin-right:auto; background-image:url(./images/board/wood_board.png);");
            parentObj.element.appendChild(parentObj.xTable);            
            
            // -- insert: first col for y-axis / board grid / last col for y-axis
            for (var y = 0; y < parentObj.boardSize; y++) {
                var xRow = parentObj.xTable.insertRow(-1);
                //first column
                var yAxisCell = parentObj.insertCellAtRow(xRow);//first column
                yAxisCell.innerHTML = (parentObj.boardSize - y) + '';
                
                //board grids
                for (var x = 0; x < parentObj.boardSize; x++) {
                    var xCell = parentObj.insertCellAtRow(xRow);
                    
                    //Decide background-image
                    var xChar = 'c';
                    var yChar = 'c';

                    if (y == 0) {
                        yChar = 't';
                    } else if (y == parentObj.boardSize - 1) {
                        yChar = 'b';
                    }
                    if (x == 0) {
                        xChar = 'l';
                    } else if (x == parentObj.boardSize - 1) {
                        xChar = 'r';
                    }

                    if ((x == 3 || x == parentObj.boardSize - 4) && 
                       (y == 3 || y == parentObj.boardSize - 4)) {
                        xChar = 's'; yChar = 'p';
                    } else if (x == Math.floor(parentObj.boardSize / 2) &&
                              y == Math.floor(parentObj.boardSize / 2)) {
                        xChar = 's'; yChar = 'p';
                    }
                    var imgName = 'e' + xChar + yChar;

                    xCell.style.backgroundImage = 'url(./images/board/' + imgName + '.png)';
                    xCell.style.backgroundSize = "100%";
                    xCell.id = parentObj.element.id + '_x' + x + '_y' + y;
                    xCell.ordinate = {x:x, y:y};
                    if (parentObj.editable) {
                        xCell.style.cursor = 'crosshair';
                    }
                    
//                    xCell.onmouseover = function(event) {
//                        var target = event.target || event.srcElement;
//                        if (target.stone && target.stone.move.seq <= parentObj.showingSeq) {
//                            target.style.cursor = 'default';
//                        }
//                    }
//                    xCell.onmouseover = function(event) {
//                        console.log('in');
//                        var target = event.target || event.srcElement;
//                        
//                        if (!parentObj.editable)
//                            return;
//                        
//                        if (target.previewStone)
//                            return;
//                        
//                        //No stone in or the stone is hidden 
//                        if (!target.stone || target.stone.move.seq < parentObj.showingSeq) {
//                            
//                            // Black
//                            if (parentObj.moves.length == 0 || parentObj.moves[parentObj.moves.length - 1].seq % 2 == 0) {
//                                target.previewStone = parentObj.previewBlack;
//                                target.appendChild(target.previewStone);
//                            } else if (parentObj.moves[parentObj.moves.length - 1].seq % 2 == 1) {
//                                target.previewStone = parentObj.previewWhite;
//                                target.appendChild(xCell.previewStone);
//                            }
//                        }
//                    }
//                    xCell.onmouseout = function(event) {
//                        console.log('out');
//                        var target = event.target || event.srcElement;
//                        
//                        if (!parentObj.editable)
//                            return;
//                        
//                        if (!target.previewStone)
//                            return;
//                        
//                        target.removeChild(target.previewStone);
//                        target.previewStone = null;
//                    }
                    xCell.onclick = function(event) {
                        var target = event.target || event.srcElement;
                        
                        if (!parentObj.editable)
                            return;
                        
                        if (this.stone && (parentObj.showingSeq >= this.stone.move.seq)) {
                            parentObj.navigateToMove(this.stone.move.seq);
                            return;
                        }
                        
                        //No stone in or the stone is hidden 
                        if (!this.stone && (parentObj.showingSeq == parentObj.moves.length)) {
                            //The move is new move. Add to the end of
                            parentObj.showingSeq++;
                            
                            var newMove = {seq: parentObj.showingSeq, ordinate:{x: target.ordinate.x, y:target.ordinate.y}};
                            parentObj.moves.push(newMove);
//                            parentObj.paintOneMove(newMove);
//                            parentObj.paintOneTraceMove(newMove);
                            parentObj.repaintMoves();
                            parentObj.repaintTraceMoves();
                            parentObj.renewExportString();
                            
                            return;
                        }
                        
                        // Has Stone and the stone is not displayed.
//                        if (target.stone.move.seq >= parentObj.showingSeq) {
                        if (parentObj.moves.length > parentObj.showingSeq) {
                            var moveIdx = parentObj.showingSeq;
                            parentObj.showingSeq++;
                            
                            parentObj.moves.splice(moveIdx, parentObj.moves.length - moveIdx);
                            parentObj.moves.push({seq: parentObj.showingSeq, ordinate:{x: target.ordinate.x, y:target.ordinate.y}});
                            
                            parentObj.repaintMoves();
                            parentObj.repaintTraceMoves();
                            parentObj.renewExportString();
                        }
                    }
                }
                
                //last column
                yAxisCell = parentObj.insertCellAtRow(xRow);//last column
                yAxisCell.innerHTML = (parentObj.boardSize - y) + '';
            }
            
            
            //--insert x-axis at first row, last row
            for (var twoTimes = 0; twoTimes < 2; twoTimes++) {
                var at = (twoTimes == 0) ? 0 : -1;
                var axisRow = parentObj.xTable.insertRow(at);
                
                //Empty first column
                var xCell = parentObj.insertCellAtRow(axisRow);
                if (twoTimes == 0) {
                    // -- Show / Hide Number --
                    var xChk = document.createElement("input");
                    xChk.type = 'checkbox';
                    xChk.setAttribute("style", "");
                    xChk.style.float = 'right';
                    xChk.checked = true;
                    
                    xChk.onclick = function (event) {
                        var target = event.target || event.srcElement;
                        parentObj.showOrHideNumber(target.checked);
                    }
                    
                    xCell.appendChild(xChk);
                }
//                xCell.setAttribute("style", "");
//                xCell.style.width = parentObj.boardGridWidth + "px";
//                xCell.style.height = parentObj.boardGridWidth + "px";
//                xCell.style.textAlign = "center";

                for (var i = 0; i < parentObj.boardSize; i++) {
                    xCell = parentObj.insertCellAtRow(axisRow);
                    xCell.innerHTML = toReadableFromOrigX(i, parentObj.boardSize);
                }
                
                //Empty Last column
                xCell = parentObj.insertCellAtRow(axisRow);
            }
            
        };
        
        this.paintUrlArea = function() {
            // Create Div element
            var xDiv = document.createElement("div");
            parentObj.element.appendChild(xDiv);
            xDiv.style.backgroundColor = "#F9F9F9";
            xDiv.style.padding = "4px";
            
            xDiv.style.borderStyle = "solid";
            xDiv.style.borderWidth = "1px"
            xDiv.style.borderColor = "#B2B2B2";
            xDiv.style.borderRadius = "6px"
//            xDiv.style.position = "absolute";
            xDiv.style.display = "none";
            xDiv.style.width = parentObj.boardWidth;
            xDiv.style.color =  "#3C3030";
            xDiv.style.fontFamily = "monospace"
            
            parentObj.panelUrl = xDiv;   
            
            // Create Select all Button
            var xSelectAll = document.createElement("div");
            xSelectAll.innerHTML = "&boxbox;";
            xSelectAll.style.cursor = "pointer";
            xSelectAll.style.float = "left";
            xSelectAll.style.color = "#666666";
            
            xSelectAll.style.borderStyle = "solid";
            xSelectAll.style.borderWidth = "1px"
            xSelectAll.style.borderColor = "#B2B2B2";
            xSelectAll.style.borderRadius = "6px";
            xSelectAll.style.width = "30px";
            
            
            xSelectAll.onmouseover = function(event) {
                xSelectAll.style.backgroundColor = "#CCCCCC";
            }
            xSelectAll.onmouseout = function(event) {
                xSelectAll.style.backgroundColor = "white";
            }
            
            parentObj.panelUrl.appendChild(xSelectAll);
            
            // Create Text Area
            var xSpanUrl = document.createElement("textarea");
            parentObj.panelUrl.appendChild(xSpanUrl);
            parentObj.panelUrl.spanUrl = xSpanUrl;
            parentObj.panelUrl.spanUrl.style.width = parentObj.boardWidth + "px";
            parentObj.panelUrl.spanUrl.style.resize = "none";
            parentObj.panelUrl.spanUrl.style.overflow = "hidden";
            
            // Select all button action to select ALL url
//            xSelectAll.onclick = function(event) {
            xSelectAll.onclick = function(event) {
                // Deselect all
                if (document.selection) document.selection.empty(); 
                else if (window.getSelection) window.getSelection().removeAllRanges();
                
                if (document.selection) {
                    var range = document.body.createTextRange();
                    range.moveToElementText(parentObj.panelUrl.spanUrl);
                    range.select();
                }
                else if (window.getSelection) {
                    var range = document.createRange();
                    range.selectNode(parentObj.panelUrl.spanUrl);
                    window.getSelection().addRange(range);
                }
            }
            
            // -- URL function --
            parentObj.panelUrl.setText = function(urlString) {
                parentObj.panelUrl.spanUrl.value = urlString;
                //Auto grow hiehgt
                parentObj.panelUrl.spanUrl.style.height = "auto";
                parentObj.panelUrl.spanUrl.style.height = parentObj.panelUrl.spanUrl.scrollHeight+'px';
            }
            
        }
        
        this.paintNavPanel = function() {
            var xDiv = document.createElement("div");
            parentObj.element.appendChild(xDiv);
            xDiv.setAttribute("style", "");
//            xDiv.style.borderBottom = "solid 1px #ddd"
            xDiv.style.padding = "2px";
            xDiv.id = parentObj.element.id + '_navpanel';
            
            parentObj.panelNav = xDiv;
            
            // -- Buttton Beginning --
            var xBtnBeginning = parentObj.createNavButton();
            xDiv.appendChild(xBtnBeginning);
            xBtnBeginning.innerHTML = "&lt;&lt;";
            xBtnBeginning.onclick = function(event) {parentObj.navigateToBeginning()};
            
            // -- Button Previous
            var xBtnPrevious = parentObj.createNavButton();
            xDiv.appendChild(xBtnPrevious);
            xBtnPrevious.innerHTML = "&lt;";
            xBtnPrevious.onclick = function(event) {parentObj.navigateToPrevious()};
            
            // -- Button Next
            var xBtnNext = parentObj.createNavButton();
            xDiv.appendChild(xBtnNext);
            xBtnNext.innerHTML = "&gt;";
            xBtnNext.onclick = function(event) {parentObj.navigateToNext()};
            
            // -- Button End
            var xBtnEnd = parentObj.createNavButton();
            xDiv.appendChild(xBtnEnd);
            xBtnEnd.innerHTML = "&gt;&gt;";
            xBtnEnd.onclick = function(event) {parentObj.navigateToEnd()};
            
            // -- Button Export
            var xBtnExport = parentObj.createNavButton();
            xDiv.appendChild(xBtnExport);
            xBtnExport.innerHTML = "&#8632;";
            xBtnExport.style.marginLeft = "20px";
            xBtnExport.onclick = function(event) {
                if (parentObj.panelUrl.isShow) {
                    parentObj.panelUrl.style.display = "none";
                    parentObj.panelUrl.isShow = false;
                } else {
                    parentObj.panelUrl.style.display = "block";
                    parentObj.panelUrl.isShow = true;
                    
                    parentObj.renewExportString();
                }
                
                parentObj.panelUrl.spanUrl.style.height = "auto";
                parentObj.panelUrl.spanUrl.style.height = parentObj.panelUrl.spanUrl.scrollHeight+'px';
            };
 
            // -- Button reload confirm
            var xBtnReload = parentObj.createNavButton();
            xDiv.appendChild(xBtnReload);
            xBtnReload.innerHTML = "&#x21bb;";
            xBtnReload.style.float = "right";
            xBtnReload.onclick = function(event) {
                var confirmed = confirm("Reload ？");
                if (confirmed)
                    parentObj.reloadMoves();
            }
            
            var xDivCollapse = document.createElement("div");
            xDiv.appendChild(xDivCollapse);
            xDivCollapse.innerHTML = "......";
            xDivCollapse.setAttribute("style", "");
            xDivCollapse.style.border = "solid 1px #ddd";
            xDivCollapse.style.borderRadius = "4px";
            xDivCollapse.style.backgroundColor = "#eee"
            xDivCollapse.style.height = "6px";
            xDivCollapse.style.lineHeight = "0px";
            xDivCollapse.style.cursor = 'n-resize';
            xDivCollapse.onclick = function(event) {
                if (!parentObj.isShowTracePanel) {
                    parentObj.isShowTracePanel = true;
                    parentObj.panelTrace.style.display = 'table-row';
                    xDivCollapse.style.cursor = 'n-resize';
                } else {
                    parentObj.isShowTracePanel = false;
                    parentObj.panelTrace.style.display = 'none';
                    xDivCollapse.style.cursor = 's-resize';
                }
            }
            
        }
        
        this.paintTracePanel = function() {
            var xDiv = document.createElement("div");
            parentObj.element.appendChild(xDiv);
            xDiv.setAttribute("style", "");
            //xDiv.style.display = "none";
            xDiv.style.display = "table-row"; parentObj.isShowTracePanel = true;
            xDiv.style.textAlign = "left";
            xDiv.id = parentObj.element.id + '_tracepanel';
            
            parentObj.panelTrace = xDiv;
            
        }
        
        this.paintMoves = function() {
            if (!parentObj.moves || parentObj.moves.length == 0) {
                return;
            }
            
            parentObj.showingSeq = parentObj.moves[parentObj.moves.length - 1].seq;
            
            for (var i = 0; i < parentObj.moves.length; i++) {
                parentObj.paintOneMove(parentObj.moves[i]);
            }
            
        };
                    
        this.paintOneMove = function(pMove) {
            if (!pMove.ordinate) {
                return;
            }
            
            var stone;//span element for the white or black Image
            var stoneSeq = document.createElement("span"); //span element for the number
            if (pMove.seq % 2 == 1) {
                stone = parentObj.createBlackStone();
            } else {
                stone = parentObj.createWhiteStone();
            }

            //Cross reference [move span] <-> [move object]
            stone.move = pMove;
            pMove.stone = stone;

            stoneSeq.innerHTML = '' + pMove.seq;
            stoneSeq.setAttribute("style", "");
            stoneSeq.style.marginLeft = 'auto';
            stoneSeq.style.marginRight = 'auto';
//                if (pMove.seq < 10) {
//                    stoneSeq.style.fontSize = parentObj.boardGridWidth /  + 'px';
//                } else 
            if (pMove.seq < 100) {
                stoneSeq.style.fontSize = parentObj.boardGridWidth / 2 + 'px';
            } else {
                stoneSeq.style.fontSize = parentObj.boardGridWidth / 3 + 'px';
            }

            stone.appendChild(stoneSeq);
            stone.seq = stoneSeq;

            var grid = document.getElementById(parentObj.element.id + '_x' + stone.move.ordinate.x + '_y' + stone.move.ordinate.y);
            //console.log(' - find grid by id - ' + parentObj.element.id + '_x' + stone.move.ordinate.x + '_y' + stone.move.ordinate.y);
            grid.appendChild(stone);
            grid.stone = stone;
            stone.grid = grid; 
        }
        
        this.repaintMoves = function() {
            for (var x = 0; x < this.boardSize; x++) {
                for (var y = 0; y < this.boardSize; y++) {
                    var gridCell = document.getElementById(this.element.id + '_x' + x + '_y' + y);
                    gridCell.stone = null;
                    while (gridCell && gridCell.firstChild) gridCell.removeChild(gridCell.firstChild);
                }
            }
            
            this.paintMoves();
        }
        
        this.paintTraceMoves = function() {
            for (var i = 0; i < parentObj.moves.length; i++) {
                parentObj.paintOneTraceMove(parentObj.moves[i]);
            }
        }
        
        this.paintOneTraceMove = function(pMove) {
            var btnTrace = parentObj.createTraceButton();
            if (pMove.ordinate)
                btnTrace.innerHTML = pMove.seq + '.' + toReadableOrdinate(pMove.ordinate, parentObj.boardSize);
            else
                btnTrace.innerHTML = pMove.seq + '.N/A';
            btnTrace.move = pMove;
            parentObj.panelTrace.appendChild(btnTrace);

            if (pMove.seq >= 100) {
                btnTrace.style.fontSize = '10px';
            }

            btnTrace.onclick = function(event) {
                var target = event.target || event.srcElement;
                parentObj.navigateToMove(target.move.seq);
            };
        }
        
        this.repaintTraceMoves = function() {
            while (parentObj.panelTrace.firstChild) this.panelTrace.removeChild(parentObj.panelTrace.firstChild);
            //this.panelTrace.removeAll();
            this.paintTraceMoves();
        }
        
        this.showMoves = function() {
            for (var i = 0; i < parentObj.moves.length; i++) {
                if (!parentObj.moves[i].stone) {
                    continue;
                } else if (parentObj.moves[i].seq <= this.showingSeq) {
                    parentObj.moves[i].stone.style.display = 'flex';
                } else {
                    parentObj.moves[i].stone.style.display = 'none';
                }
            }
            this.renewExportString();
        }
        
        this.renewExportString = function() {
			var movesUrl = document.location.origin + document.location.pathname + '?moves=';
			
			for(var i = 0; i < parentObj.showingSeq; i++) {
//				console.log(toReadableOrdinate(parentObj.moves[i].ordinate, parentObj.boardSize));
				movesUrl += toReadableOrdinate(parentObj.moves[i].ordinate, parentObj.boardSize);
				if(i != parentObj.showingSeq - 1)
					movesUrl += ',';
//				console.log('movesUrl:', movesUrl);
//				document.getElementById('url4Share').innerHTML = movesUrl;
			}
            
            this.panelUrl.setText(movesUrl);
        }
        
        
        // ----
        // Create element methods - for the same style
        // ----
        this.insertCellAtRow = function (tRow) {
            var xCell = tRow.insertCell(-1);
            xCell.setAttribute("style", "");
            xCell.style.width = parentObj.boardGridWidth + "px";
            xCell.style.height = parentObj.boardGridWidth + "px";
            xCell.style.textAlign = "center";
            return xCell;
        }
        
        this.createStone = function() {
            var span = document.createElement("span");
            span.setAttribute("style", "");
            span.style.backgroundSize = "95%";
            span.style.height = "100%";
            span.style.width = "100%";
            span.style.display = "flex";
            span.style.alignItems = "center";
            span.style.backgroundRepeat = "no-repeat";
            span.style.textAlign = "center";
            return span;
        }
        
        this.createBlackStone = function() {
            var span = parentObj.createStone();
            span.style.backgroundImage = 'url(./images/board/black.png)';
            span.style.color = 'white';
            return span;
        }
        
        this.createWhiteStone = function() {
            var span = parentObj.createStone();
            span.style.backgroundImage = 'url(./images/board/white.png)';
            span.style.color = 'black';
            return span;
        }
        
        this.createNavButton = function() {
            var xBtn = document.createElement("button");
            xBtn.setAttribute("style", "");
            xBtn.style.width = '30px';
            xBtn.style.margin = '4px';
            return xBtn;
        }
        
        this.createTraceButton = function() {
            var xBtn = document.createElement("button");
            xBtn.setAttribute("style", "");
            xBtn.style.width = '50px';
            xBtn.style.margin = '1px';            
            xBtn.style.fontSize = '12px';
            return xBtn;
        }
        
        // ----
        this.previewWhite = this.createWhiteStone();
        this.previewWhite.style.opacity = 0.4;
        this.previewBlack = this.createBlackStone();
        this.previewBlack.style.opacity = 0.4;
        this.element.play5board = this;
        this.element.style.display = 'table';
        this.element.style.textAlign = 'center';
    }

    Play5Board.prototype.getBoardById = function(pId) {
        
    }
    
    Play5Board.prototype.display = function() {
        this.paintBoard();
        this.paintMoves();
        this.paintUrlArea();
        this.paintNavPanel();
        this.paintTracePanel();
        this.paintTraceMoves();
        
        this.renewExportString();
    };

    /**
    * Display the moves on the board which is from the original rawstring.
    */
    
    Play5Board.prototype.adjustBoardWidth = function(pxWidth) {
        this.boardWidth = pxWidth;
        this.boardGridWidth = this.boardWidth / this.boardSize;
        if (!this.xTable)
            return;
        this.xTable.get
    }
    
    Play5Board.prototype.navigateToBeginning = function() {
        this.showingSeq = 1;
        this.showMoves();
    }
    
    Play5Board.prototype.navigateToPrevious = function() {
        if (this.showingSeq > 1)
            this.showingSeq--;
        this.showMoves();
    }
    
    Play5Board.prototype.navigateToNext = function() {
        if (this.showingSeq < this.moves[this.moves.length - 1].seq)
            this.showingSeq++;
        this.showMoves();
    }
    
    Play5Board.prototype.navigateToEnd = function() {
        this.showingSeq = this.moves[this.moves.length - 1].seq;
        this.showMoves();
    }
    
    Play5Board.prototype.navigateToMove = function(pSeq) {
        if (pSeq >= 1 && pSeq <= this.moves[this.moves.length - 1].seq) {
            this.showingSeq = pSeq;
            this.showMoves();
        }
    }
    
    Play5Board.prototype.reloadMoves = function() {
        this.moves = JSON.parse( JSON.stringify( this.origMoves ) );
        this.showingSeq = this.moves.length;
        this.repaintMoves();
        this.repaintTraceMoves();
        this.renewExportString();
    }
    
    Play5Board.prototype.showOrHideNumber = function(isShow) {
        for (var i = 0; this.moves.length > length; i++) {
            if (isShow)
                this.moves[i].stone.seq.style.display = 'inline';
            else
                this.moves[i].stone.seq.style.display = 'none';
        }
    }
    
    Play5Board.prototype.hideNumber = function() {
        
    }

    // ----
    // Getters and setters
    // ----
    
    Play5Board.prototype.setRawString = function(rawString) {
        this.rawString = rawString;
    };

    Play5Board.prototype.getRawString = function() {
        return this.rawString;
    };

    Play5Board.prototype.setMoves = function(moves) {
        this.moves = moves;
//        this.origMoves = moves.slice(0);
        this.origMoves = JSON.parse( JSON.stringify( moves ) );
//        console.log('origMoves:', this.origMoves);
//        this.moves[0].ordinate = {x:0, y:0};
//        console.log('After modify display moves:', this.origMoves);
    };

    Play5Board.prototype.getMoves = function() {
        return this.moves;
    };

    Play5Board.prototype.getBoardSize = function() {
        return this.boardSize;
    }

    Play5Board.prototype.setEditable = function(editable) {
        this. editable = editable;
    };

    Play5Board.prototype.getEditable = function() {
        return this.editable;
    };


    Play5Board.prototype.toString = function() {
        
    };

function toMovesObj(rawString, boardSize) {
    if (!rawString || rawString.trim().length == 0)
        return [];
    
	rawString = unescape(rawString);
    var rawMovesString = rawString.split(/[ ,]+/);
    var moves = [];
    
    for (var i = 0; i < rawMovesString.length; i++) {
        var move = {
            seq: i + 1,
            ordinate: toOrigOrdinate(rawMovesString[i], boardSize)
        };
        moves.push(move);
    }
    
    return moves;
}

/**
* cnn - c means alphebat, n means digits
*/
function toOrigOrdinate(cnn, boardSize) {
    if (cnn === '--') {
        return null;
    }
    
    var ordinate = {
        x: toOrigFromReadableX(cnn.substr(0, 1)), 
        y: toOrigFromReadableY(cnn.substr(1), boardSize)
    };
    return ordinate;
}

function toOrigFromReadableX(rX) {
    return parseInt(rX.charCodeAt(0), 10) - 97;
}

function toOrigFromReadableY(rY, boardSize) {
    return boardSize - parseInt(rY, 10);
}

function toReadableFromOrigX(rX) {
    return String.fromCharCode(97 + rX);
}

function toReadableFromOrigY(rY, boardSize) {
    return '' + (boardSize - rY);
}

function toReadableOrdinate(origOrdinate, boardSize) {
    return toReadableFromOrigX(origOrdinate.x) + toReadableFromOrigY(origOrdinate.y, boardSize)
}

var getUniqueId = (function () {
  var incrementingId = 0;
  return function(element) {
    if (!element.id) {
      element.id = "id_play5board_" + incrementingId++;
      // Possibly add a check if this ID really is unique
    }
    return element.id;
  };
}());

$(document).ready(function() {
    $(".play5board").each(function(number, element) {
        
        if (!element.id) {
            element.id = "id_play5board_" + number++;
        }
        console.log("Here is one of the class of play5board. " + element.id);
        
        var play5board = new Play5Board(
            element,
            element.getAttribute("pb-editable"),
            element.getAttribute("pb-width")
        );
        
        play5board.setMoves(
            toMovesObj(element.getAttribute("pb-rawstring"), play5board.boardSize)
        );
        
        play5board.display();
    });
});