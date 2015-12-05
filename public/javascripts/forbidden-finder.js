/**
* This code refer from renlib source. 
* What all I do is just transform it to javascript from C++..
*
* Add a little methods for the bridge of this library to other data sturctur...
*
* Reference: 
*  http://www.renju.se/renlib/opensrc/
*  https://github.com/gomoku/RenLib
*/

function CPoint(x, y) {
    this.x = x;
    this.y = y;
    this.value = x * 100 + y;
}


function ForbiddenFinder(boardSize) {
    
    var parentObj = this;
    
    //pulibc
    this.boardSize = boardSize;
    this.ptForbidden = [];
    
    //
    this.cBoard = new Array(boardSize + 2); {
        for (var i = 0; i < this.cBoard.length; i++) {
            this.cBoard[i] = new Array(boardSize + 2);
        }
    }
    
    //Private method
    this.setStone = function (x, y, cStone) {
        this.cBoard[x+1][y+1] = cStone;
    }
    
	this.isFive = function (x, y, nColor) {
        if (this.cBoard[x+1][y+1] != ForbiddenFinder.EMPTYSTONE)
            return false;

        if (nColor == 0)	// black
        {
            this.setStone(x, y, ForbiddenFinder.BLACKSTONE);

            // detect black five
            var i, j;

            // 1 - horizontal direction
            var nLine = 1;
            i = x;
            while (i > 0)
            {
                if (this.cBoard[i--][y+1] == ForbiddenFinder.BLACKSTONE)
                    nLine++;
                else
                    break;
            }
            i = x+2;
            while (i < (this.boardSize+1))
            {
                if (this.cBoard[i++][y+1] == ForbiddenFinder.BLACKSTONE)
                    nLine++;
                else
                    break;
            }
            if (nLine == 5)
            {
                this.setStone(x, y, ForbiddenFinder.EMPTYSTONE);
                return true;
            }

            // 2 - vertical direction
            nLine = 1;
            i = y;
            while (i > 0)
            {
                if (this.cBoard[x+1][i--] == ForbiddenFinder.BLACKSTONE)
                    nLine++;
                else
                    break;
            }
            i = y+2;
            while (i < (this.boardSize+1))
            {
                if (this.cBoard[x+1][i++] == ForbiddenFinder.BLACKSTONE)
                    nLine++;
                else
                    break;
            }
            if (nLine == 5)
            {
                this.setStone(x, y, ForbiddenFinder.EMPTYSTONE);
                return true;
            }

            // 3 - diagonal direction (lower-left to upper-right: '/')
            nLine = 1;
            i = x;
            j = y;
            while ((i > 0) && (j > 0))
            {
                if (this.cBoard[i--][j--] == ForbiddenFinder.BLACKSTONE)
                    nLine++;
                else
                    break;
            }
            i = x+2;
            j = y+2;
            while ((i < (this.boardSize+1)) && (j < (this.boardSize+1)))
            {
                if (this.cBoard[i++][j++] == ForbiddenFinder.BLACKSTONE)
                    nLine++;
                else
                    break;
            }
            if (nLine == 5)
            {
                this.setStone(x, y, ForbiddenFinder.EMPTYSTONE);
                return true;
            }

            // 4 - diagonal direction (upper-left to lower-right: '\')
            nLine = 1;
            i = x;
            j = y+2;
            while ((i > 0) && (j < (this.boardSize+1)))
            {
                if (this.cBoard[i--][j++] == ForbiddenFinder.BLACKSTONE)
                    nLine++;
                else
                    break;
            }
            i = x+2;
            j = y;
            while ((i < (this.boardSize+1)) && (j > 0))
            {
                if (this.cBoard[i++][j--] == ForbiddenFinder.BLACKSTONE)
                    nLine++;
                else
                    break;
            }
            if (nLine == 5)
            {
                this.setStone(x, y, ForbiddenFinder.EMPTYSTONE);
                return true;
            }

            this.setStone(x, y, ForbiddenFinder.EMPTYSTONE);
            return false;
        }
        else if (nColor == 1)	// white
        {
            this.setStone(x, y, ForbiddenFinder.WHITESTONE);

            // detect white five or more
            var i, j;

            // 1 - horizontal direction
            var nLine = 1;
            i = x;
            while (i > 0)
            {
                if (this.cBoard[i--][y+1] == ForbiddenFinder.WHITESTONE)
                    nLine++;
                else
                    break;
            }
            i = x+2;
            while (i < (this.boardSize+1))
            {
                if (this.cBoard[i++][y+1] == ForbiddenFinder.WHITESTONE)
                    nLine++;
                else
                    break;
            }
            if (nLine >= 5)
            {
                this.setStone(x, y, ForbiddenFinder.EMPTYSTONE);
                return true;
            }

            // 2 - vertical direction
            nLine = 1;
            i = y;
            while (i > 0)
            {
                if (this.cBoard[x+1][i--] == ForbiddenFinder.WHITESTONE)
                    nLine++;
                else
                    break;
            }
            i = y+2;
            while (i < (this.boardSize+1))
            {
                if (this.cBoard[x+1][i++] == ForbiddenFinder.WHITESTONE)
                    nLine++;
                else
                    break;
            }
            if (nLine >= 5)
            {
                this.setStone(x, y, ForbiddenFinder.EMPTYSTONE);
                return true;
            }

            // 3 - diagonal direction (lower-left to upper-right: '/')
            nLine = 1;
            i = x;
            j = y;
            while ((i > 0) && (j > 0))
            {
                if (this.cBoard[i--][j--] == ForbiddenFinder.WHITESTONE)
                    nLine++;
                else
                    break;
            }
            i = x+2;
            j = y+2;
            while ((i < (this.boardSize+1)) && (j < (this.boardSize+1)))
            {
                if (this.cBoard[i++][j++] == ForbiddenFinder.WHITESTONE)
                    nLine++;
                else
                    break;
            }
            if (nLine >= 5)
            {
                this.setStone(x, y, ForbiddenFinder.EMPTYSTONE);
                return true;
            }

            // 4 - diagonal direction (upper-left to lower-right: '\')
            nLine = 1;
            i = x;
            j = y+2;
            while ((i > 0) && (j < (this.boardSize+1)))
            {
                if (this.cBoard[i--][j++] == ForbiddenFinder.WHITESTONE)
                    nLine++;
                else
                    break;
            }
            i = x+2;
            j = y;
            while ((i < (this.boardSize+1)) && (j > 0))
            {
                if (this.cBoard[i++][j--] == ForbiddenFinder.WHITESTONE)
                    nLine++;
                else
                    break;
            }
            if (nLine >= 5)
            {
                this.setStone(x, y, ForbiddenFinder.EMPTYSTONE);
                return true;
            }

            this.setStone(x, y, ForbiddenFinder.EMPTYSTONE);
            return false;
        }
        else 
            return false;
    }
    
	this.isOverline = function (x, y) {
        if (this.cBoard[x+1][y+1] != ForbiddenFinder.EMPTYSTONE)
            return false;

        this.setStone(x, y, ForbiddenFinder.BLACKSTONE);

        // detect black overline
        var i, j;
        var bOverline = false;

        // 1 - horizontal direction
        var nLine = 1;
        i = x;
        while (i > 0)
        {
            if (this.cBoard[i--][y+1] == ForbiddenFinder.BLACKSTONE)
                nLine++;
            else
                break;
        }
        i = x+2;
        while (i < (this.boardSize+1))
        {
            if (this.cBoard[i++][y+1] == ForbiddenFinder.BLACKSTONE)
                nLine++;
            else
                break;
        }
        if (nLine == 5)
        {
            this.setStone(x, y, ForbiddenFinder.EMPTYSTONE);
            return false;
        }
        else
            bOverline |= (nLine >= 6);

        // 2 - vertical direction
        nLine = 1;
        i = y;
        while (i > 0)
        {
            if (this.cBoard[x+1][i--] == ForbiddenFinder.BLACKSTONE)
                nLine++;
            else
                break;
        }
        i = y+2;
        while (i < (this.boardSize+1))
        {
            if (this.cBoard[x+1][i++] == ForbiddenFinder.BLACKSTONE)
                nLine++;
            else
                break;
        }
        if (nLine == 5)
        {
            this.setStone(x, y, ForbiddenFinder.EMPTYSTONE);
            return false;
        }
        else
            bOverline |= (nLine >= 6);

        // 3 - diagonal direction (lower-left to upper-right: '/')
        nLine = 1;
        i = x;
        j = y;
        while ((i > 0) && (j > 0))
        {
            if (this.cBoard[i--][j--] == ForbiddenFinder.BLACKSTONE)
                nLine++;
            else
                break;
        }
        i = x+2;
        j = y+2;
        while ((i < (this.boardSize+1)) && (j < (this.boardSize+1)))
        {
            if (this.cBoard[i++][j++] == ForbiddenFinder.BLACKSTONE)
                nLine++;
            else
                break;
        }
        if (nLine == 5)
        {
            this.setStone(x, y, ForbiddenFinder.EMPTYSTONE);
            return false;
        }
        else
            bOverline |= (nLine >= 6);

        // 4 - diagonal direction (upper-left to lower-right: '\')
        nLine = 1;
        i = x;
        j = y+2;
        while ((i > 0) && (j < (this.boardSize+1)))
        {
            if (this.cBoard[i--][j++] == ForbiddenFinder.BLACKSTONE)
                nLine++;
            else
                break;
        }
        i = x+2;
        j = y;
        while ((i < (this.boardSize+1)) && (j > 0))
        {
            if (this.cBoard[i++][j--] == ForbiddenFinder.BLACKSTONE)
                nLine++;
            else
                break;
        }
        if (nLine == 5)
        {
            this.setStone(x, y, ForbiddenFinder.EMPTYSTONE);
            return false;
        }
        else
            bOverline |= (nLine >= 6);

        this.setStone(x, y, ForbiddenFinder.EMPTYSTONE);
        return bOverline;
    }

    this.isFiveWithDir = function (x, y, nColor, nDir) {
        if (this.cBoard[x+1][y+1] != ForbiddenFinder.EMPTYSTONE)
            return false;

        var c;
        if (nColor == 0)	// black
            c = ForbiddenFinder.BLACKSTONE;
        else if (nColor == 1)	// white
            c = ForbiddenFinder.WHITESTONE;
        else
            return false;

        this.setStone(x, y, c);

        var i, j;
        var nLine;

        switch (nDir)
        {
        case 1:		// horizontal direction
            nLine = 1;
            i = x;
            while (i > 0)
            {
                if (this.cBoard[i--][y+1] == c)
                    nLine++;
                else
                    break;
            }
            i = x+2;
            while (i < (this.boardSize+1))
            {
                if (this.cBoard[i++][y+1] == c)
                    nLine++;
                else
                    break;
            }
            if (nLine == 5)
            {
                this.setStone(x, y, ForbiddenFinder.EMPTYSTONE);
                return true;
            }
            else
            {
                this.setStone(x, y, ForbiddenFinder.EMPTYSTONE);
                return false;
            }
            break;
        case 2:		// vertial direction
            nLine = 1;
            i = y;
            while (i > 0)
            {
                if (this.cBoard[x+1][i--] == c)
                    nLine++;
                else
                    break;
            }
            i = y+2;
            while (i < (this.boardSize+1))
            {
                if (this.cBoard[x+1][i++] == c)
                    nLine++;
                else
                    break;
            }
            if (nLine == 5)
            {
                this.setStone(x, y, ForbiddenFinder.EMPTYSTONE);
                return true;
            }
            else
            {
                this.setStone(x, y, ForbiddenFinder.EMPTYSTONE);
                return false;
            }
            break;
        case 3:		// diagonal direction - '/'
            nLine = 1;
            i = x;
            j = y;
            while ((i > 0) && (j > 0))
            {
                if (this.cBoard[i--][j--] == c)
                    nLine++;
                else
                    break;
            }
            i = x+2;
            j = y+2;
            while ((i < (this.boardSize+1)) && (j < (this.boardSize+1)))
            {
                if (this.cBoard[i++][j++] == c)
                    nLine++;
                else
                    break;
            }
            if (nLine == 5)
            {
                this.setStone(x, y, ForbiddenFinder.EMPTYSTONE);
                return true;
            }
            else
            {
                this.setStone(x, y, ForbiddenFinder.EMPTYSTONE);
                return false;
            }
            break;
        case 4:		// diagonal direction - '\'
            nLine = 1;
            i = x;
            j = y+2;
            while ((i > 0) && (j < (this.boardSize+1)))
            {
                if (this.cBoard[i--][j++] == c)
                    nLine++;
                else
                    break;
            }
            i = x+2;
            j = y;
            while ((i < (this.boardSize+1)) && (j > 0))
            {
                if (this.cBoard[i++][j--] == c)
                    nLine++;
                else
                    break;
            }
            if (nLine == 5)
            {
                this.setStone(x, y, ForbiddenFinder.EMPTYSTONE);
                return true;
            }
            else
            {
                this.setStone(x, y, ForbiddenFinder.EMPTYSTONE);
                return false;
            }
            break;
        default:
            this.setStone(x, y, ForbiddenFinder.EMPTYSTONE);
            return false;
            break;
        }
    }
    
    this.isFour = function (x, y, nColor, nDir) {
        if (this.cBoard[x+1][y+1] != ForbiddenFinder.EMPTYSTONE)
            return false;

        if (this.isFive(x, y, nColor))	// five?
            return false;
        else if ((nColor == 0) && (this.isOverline(x, y)))	// black overline?
            return false;
        else
        {
            var c;
            if (nColor == 0)	// black
                c = ForbiddenFinder.BLACKSTONE;
            else if (nColor == 1)	// white
                c = ForbiddenFinder.WHITESTONE;
            else
                return false;

            this.setStone(x, y, c);

            var i, j;

            switch (nDir)
            {
            case 1:		// horizontal direction
                i = x;
                while (i > 0)
                {
                    if (this.cBoard[i][y+1] == c)
                    {
                        i--;
                        continue;
                    }
                    else if (this.cBoard[i][y+1] == ForbiddenFinder.EMPTYSTONE)
                    {
                        if (this.isFiveWithDir(i-1, y, 0, nDir))
                        {
                            this.setStone(x, y, ForbiddenFinder.EMPTYSTONE);
                            return true;
                        }
                        else 
                            break;
                    }
                    else
                        break;
                }
                i = x+2;
                while (i < (this.boardSize+1))
                {
                    if (this.cBoard[i][y+1] == c)
                    {
                        i++;
                        continue;
                    }
                    else if (this.cBoard[i][y+1] == ForbiddenFinder.EMPTYSTONE)
                    {
                        if (this.isFiveWithDir(i-1, y, 0, nDir))
                        {
                            this.setStone(x, y, ForbiddenFinder.EMPTYSTONE);
                            return true;
                        }
                        else
                            break;
                    }
                    else
                        break;
                }
                this.setStone(x, y, ForbiddenFinder.EMPTYSTONE);
                return false;
                break;
            case 2:		// vertial direction
                i = y;
                while (i > 0)
                {
                    if (this.cBoard[x+1][i] == c)
                    {
                        i--;
                        continue;
                    }
                    else if (this.cBoard[x+1][i] == ForbiddenFinder.EMPTYSTONE)
                    {
                        if (this.isFiveWithDir(x, i-1, 0, nDir))
                        {
                            this.setStone(x, y, ForbiddenFinder.EMPTYSTONE);
                            return true;
                        }
                        else 
                            break;
                    }
                    else
                        break;
                }
                i = y+2;
                while (i < (this.boardSize+1))
                {
                    if (this.cBoard[x+1][i] == c)
                    {
                        i++;
                        continue;
                    }
                    else if (this.cBoard[x+1][i] == ForbiddenFinder.EMPTYSTONE)
                    {
                        if (this.isFiveWithDir(x, i-1, 0, nDir))
                        {
                            this.setStone(x, y, ForbiddenFinder.EMPTYSTONE);
                            return true;
                        }
                        else
                            break;
                    }
                    else
                        break;
                }
                this.setStone(x, y, ForbiddenFinder.EMPTYSTONE);
                return false;
                break;
            case 3:		// diagonal direction - '/'
                i = x;
                j = y;
                while ((i > 0) && (j > 0))
                {
                    if (this.cBoard[i][j] == c)
                    {
                        i--;
                        j--;
                        continue;
                    }
                    else if (this.cBoard[i][j] == ForbiddenFinder.EMPTYSTONE)
                    {
                        if (this.isFiveWithDir(i-1, j-1, 0, nDir))
                        {
                            this.setStone(x, y, ForbiddenFinder.EMPTYSTONE);
                            return true;
                        }
                        else 
                            break;
                    }
                    else
                        break;
                }
                i = x+2;
                j = y+2;
                while ((i < (this.boardSize+1)) && (j < (this.boardSize+1)))
                {
                    if (this.cBoard[i][j] == c)
                    {
                        i++;
                        j++;
                        continue;
                    }
                    else if (this.cBoard[i][j] == ForbiddenFinder.EMPTYSTONE)
                    {
                        if (this.isFiveWithDir(i-1, j-1, 0, nDir))
                        {
                            this.setStone(x, y, ForbiddenFinder.EMPTYSTONE);
                            return true;
                        }
                        else
                            break;
                    }
                    else
                        break;
                }
                this.setStone(x, y, ForbiddenFinder.EMPTYSTONE);
                return false;
                break;
            case 4:		// diagonal direction - '\'
                i = x;
                j = y+2;
                while ((i > 0) && (j < (this.boardSize+1)))
                {
                    if (this.cBoard[i][j] == c)
                    {
                        i--;
                        j++;
                        continue;
                    }
                    else if (this.cBoard[i][j] == ForbiddenFinder.EMPTYSTONE)
                    {
                        if (this.isFiveWithDir(i-1, j-1, 0, nDir))
                        {
                            this.setStone(x, y, ForbiddenFinder.EMPTYSTONE);
                            return true;
                        }
                        else 
                            break;
                    }
                    else
                        break;
                }
                i = x+2;
                j = y;
                while ((i < (this.boardSize+1)) && (j > 0))
                {
                    if (this.cBoard[i][j] == c)
                    {
                        i++;
                        j--;
                        continue;
                    }
                    else if (this.cBoard[i][j] == ForbiddenFinder.EMPTYSTONE)
                    {
                        if (this.isFiveWithDir(i-1, j-1, 0, nDir))
                        {
                            this.setStone(x, y, ForbiddenFinder.EMPTYSTONE);
                            return true;
                        }
                        else
                            break;
                    }
                    else
                        break;
                }
                this.setStone(x, y, ForbiddenFinder.EMPTYSTONE);
                return false;
                break;
            default:
                this.setStone(x, y, ForbiddenFinder.EMPTYSTONE);
                return false;
                break;
            }
        }
    }
    
    this.isOpenFour = function (x, y, nColor, nDir) {
        if (this.cBoard[x+1][y+1] != ForbiddenFinder.EMPTYSTONE)
            return 0;

        if (this.isFive(x, y, nColor))	// five?
            return 0;
        else if ((nColor == 0) && (this.isOverline(x, y)))	// black overline?
            return 0;
        else
        {
            var c;
            if (nColor == 0)	// black
                c = ForbiddenFinder.BLACKSTONE;
            else if (nColor == 1)	// white
                c = ForbiddenFinder.WHITESTONE;
            else
                return 0;

            this.setStone(x, y, c);

            var i, j;
            var nLine;

            switch (nDir)
            {
            case 1:		// horizontal direction
                nLine = 1;
                i = x;
                while (i >= 0)
                {
                    if (this.cBoard[i][y+1] == c)
                    {
                        i--;
                        nLine++;
                        continue;
                    }
                    else if (this.cBoard[i][y+1] == ForbiddenFinder.EMPTYSTONE)
                    {
                        if (!this.isFiveWithDir(i-1, y, 0, nDir))
                        {
                            this.setStone(x, y, ForbiddenFinder.EMPTYSTONE);
                            return 0;
                        }
                        else 
                            break;
                    }
                    else
                    {
                        this.setStone(x, y, ForbiddenFinder.EMPTYSTONE);
                        return 0;
                    }
                }
                i = x+2;
                while (i < (this.boardSize+1))
                {
                    if (this.cBoard[i][y+1] == c)
                    {
                        i++;
                        nLine++;
                        continue;
                    }
                    else if (this.cBoard[i][y+1] == ForbiddenFinder.EMPTYSTONE)
                    {
                        if (this.isFiveWithDir(i-1, y, 0, nDir))
                        {
                            this.setStone(x, y, ForbiddenFinder.EMPTYSTONE);
                            return (nLine==4 ? 1 : 2);
                        }
                        else
                            break;
                    }
                    else
                        break;
                }
                this.setStone(x, y, ForbiddenFinder.EMPTYSTONE);
                return 0;
                break;
            case 2:		// vertial direction
                nLine = 1;
                i = y;
                while (i >= 0)
                {
                    if (this.cBoard[x+1][i] == c)
                    {
                        i--;
                        nLine++;
                        continue;
                    }
                    else if (this.cBoard[x+1][i] == ForbiddenFinder.EMPTYSTONE)
                    {
                        if (!this.isFiveWithDir(x, i-1, 0, nDir))
                        {
                            this.setStone(x, y, ForbiddenFinder.EMPTYSTONE);
                            return 0;
                        }
                        else 
                            break;
                    }
                    else
                    {
                        this.setStone(x, y, ForbiddenFinder.EMPTYSTONE);
                        return 0;
                    }
                }
                i = y+2;
                while (i < (this.boardSize+1))
                {
                    if (this.cBoard[x+1][i] == c)
                    {
                        i++;
                        nLine++;
                        continue;
                    }
                    else if (this.cBoard[x+1][i] == ForbiddenFinder.EMPTYSTONE)
                    {
                        if (this.isFiveWithDir(x, i-1, 0, nDir))
                        {
                            this.setStone(x, y, ForbiddenFinder.EMPTYSTONE);
                            return (nLine==4 ? 1 : 2);
                        }
                        else
                            break;
                    }
                    else
                        break;
                }
                this.setStone(x, y, ForbiddenFinder.EMPTYSTONE);
                return 0;
                break;
            case 3:		// diagonal direction - '/'
                nLine = 1;
                i = x;
                j = y;
                while ((i >= 0) && (j >= 0))
                {
                    if (this.cBoard[i][j] == c)
                    {
                        i--;
                        j--;
                        nLine++;
                        continue;
                    }
                    else if (this.cBoard[i][j] == ForbiddenFinder.EMPTYSTONE)
                    {
                        if (!this.isFiveWithDir(i-1, j-1, 0, nDir))
                        {
                            this.setStone(x, y, ForbiddenFinder.EMPTYSTONE);
                            return 0;
                        }
                        else 
                            break;
                    }
                    else
                    {
                        this.setStone(x, y, ForbiddenFinder.EMPTYSTONE);
                        return 0;
                    }
                }
                i = x+2;
                j = y+2;
                while ((i < (this.boardSize+1)) && (j < (this.boardSize+1)))
                {
                    if (this.cBoard[i][j] == c)
                    {
                        i++;
                        j++;
                        nLine++;
                        continue;
                    }
                    else if (this.cBoard[i][j] == ForbiddenFinder.EMPTYSTONE)
                    {
                        if (this.isFiveWithDir(i-1, j-1, 0, nDir))
                        {
                            this.setStone(x, y, ForbiddenFinder.EMPTYSTONE);
                            return (nLine==4 ? 1 : 2);
                        }
                        else
                            break;
                    }
                    else
                        break;
                }
                this.setStone(x, y, ForbiddenFinder.EMPTYSTONE);
                return 0;
                break;
            case 4:		// diagonal direction - '\'
                nLine = 1;
                i = x;
                j = y+2;
                while ((i >= 0) && (j <= (this.boardSize+1)))
                {
                    if (this.cBoard[i][j] == c)
                    {
                        i--;
                        j++;
                        nLine++;
                        continue;
                    }
                    else if (this.cBoard[i][j] == ForbiddenFinder.EMPTYSTONE)
                    {
                        if (!this.isFiveWithDir(i-1, j-1, 0, nDir))
                        {
                            this.setStone(x, y, ForbiddenFinder.EMPTYSTONE);
                            return 0;
                        }
                        else 
                            break;
                    }
                    else
                    {
                        this.setStone(x, y, ForbiddenFinder.EMPTYSTONE);
                        return 0;
                    }
                }
                i = x+2;
                j = y;
                while ((i < (this.boardSize+1)) && (j > 0))
                {
                    if (this.cBoard[i][j] == c)
                    {
                        i++;
                        j--;
                        nLine++;
                        continue;
                    }
                    else if (this.cBoard[i][j] == ForbiddenFinder.EMPTYSTONE)
                    {
                        if (this.isFiveWithDir(i-1, j-1, 0, nDir))
                        {
                            this.setStone(x, y, ForbiddenFinder.EMPTYSTONE);
                            return (nLine==4 ? 1 : 2);
                        }
                        else
                            break;
                    }
                    else
                        break;
                }
                this.setStone(x, y, ForbiddenFinder.EMPTYSTONE);
                return 0;
                break;
            default:
                this.setStone(x, y, ForbiddenFinder.EMPTYSTONE);
                return 0;
                break;
            }
        }
    }
    
    this.isOpenThree = function (x, y, nColor, nDir) {
        if (this.isFive(x, y, nColor))	// five?
            return false;
        else if ((nColor == 0) && (this.isOverline(x, y)))	// black overline?
            return false;
        else
        {
            var c;
            if (nColor == 0)	// black
                c = ForbiddenFinder.BLACKSTONE;
            else if (nColor == 1)	// white
                c = ForbiddenFinder.WHITESTONE;
            else
                return false;

            this.setStone(x, y, c);

            var i, j;

            switch (nDir)
            {
            case 1:		// horizontal direction
                i = x;
                while (i > 0)
                {
                    if (this.cBoard[i][y+1] == c)
                    {
                        i--;
                        continue;
                    }
                    else if (this.cBoard[i][y+1] == ForbiddenFinder.EMPTYSTONE)
                    {
                        if ((this.isOpenFour(i-1, y, nColor, nDir) == 1) && (!this.isDoubleFour(i-1, y)) && (!this.isDoubleThree(i-1, y)))
                        {
                            this.setStone(x, y, ForbiddenFinder.EMPTYSTONE);
                            return true;
                        }
                        else 
                            break;
                    }
                    else
                        break;
                }
                i = x+2;
                while (i < (this.boardSize+1))
                {
                    if (this.cBoard[i][y+1] == c)
                    {
                        i++;
                        continue;
                    }
                    else if (this.cBoard[i][y+1] == ForbiddenFinder.EMPTYSTONE)
                    {
                        if ((this.isOpenFour(i-1, y, nColor, nDir) == 1) && (!this.isDoubleFour(i-1, y)) && (!this.isDoubleThree(i-1, y)))
                        {
                            this.setStone(x, y, ForbiddenFinder.EMPTYSTONE);
                            return true;
                        }
                        else
                            break;
                    }
                    else
                        break;
                }
                this.setStone(x, y, ForbiddenFinder.EMPTYSTONE);
                return false;
                break;
            case 2:		// vertial direction
                i = y;
                while (i > 0)
                {
                    if (this.cBoard[x+1][i] == c)
                    {
                        i--;
                        continue;
                    }
                    else if (this.cBoard[x+1][i] == ForbiddenFinder.EMPTYSTONE)
                    {
                        if ((this.isOpenFour(x, i-1, nColor, nDir) == 1) && (!this.isDoubleFour(x, i-1)) && (!this.isDoubleThree(x, i-1)))
                        {
                            this.setStone(x, y, ForbiddenFinder.EMPTYSTONE);
                            return true;
                        }
                        else 
                            break;
                    }
                    else
                        break;
                }
                i = y+2;
                while (i < (this.boardSize+1))
                {
                    if (this.cBoard[x+1][i] == c)
                    {
                        i++;
                        continue;
                    }
                    else if (this.cBoard[x+1][i] == ForbiddenFinder.EMPTYSTONE)
                    {
                        if ((this.isOpenFour(x, i-1, nColor, nDir) == 1) && (!this.isDoubleFour(x, i-1)) && (!this.isDoubleThree(x, i-1)))
                        {
                            this.setStone(x, y, ForbiddenFinder.EMPTYSTONE);
                            return true;
                        }
                        else
                            break;
                    }
                    else
                        break;
                }
                this.setStone(x, y, ForbiddenFinder.EMPTYSTONE);
                return false;
                break;
            case 3:		// diagonal direction - '/'
                i = x;
                j = y;
                while ((i > 0) && (j > 0))
                {
                    if (this.cBoard[i][j] == c)
                    {
                        i--;
                        j--;
                        continue;
                    }
                    else if (this.cBoard[i][j] == ForbiddenFinder.EMPTYSTONE)
                    {
                        if ((this.isOpenFour(i-1, j-1, nColor, nDir) == 1) && (!this.isDoubleFour(i-1, j-1)) && (!this.isDoubleThree(i-1, j-1)))
                        {
                            this.setStone(x, y, ForbiddenFinder.EMPTYSTONE);
                            return true;
                        }
                        else 
                            break;
                    }
                    else
                        break;
                }
                i = x+2;
                j = y+2;
                while ((i < (this.boardSize+1)) && (j < (this.boardSize+1)))
                {
                    if (this.cBoard[i][j] == c)
                    {
                        i++;
                        j++;
                        continue;
                    }
                    else if (this.cBoard[i][j] == ForbiddenFinder.EMPTYSTONE)
                    {
                        if ((this.isOpenFour(i-1, j-1, nColor, nDir) == 1) && (!this.isDoubleFour(i-1, j-1)) && (!this.isDoubleThree(i-1, j-1)))
                        {
                            this.setStone(x, y, ForbiddenFinder.EMPTYSTONE);
                            return true;
                        }
                        else
                            break;
                    }
                    else
                        break;
                }
                this.setStone(x, y, ForbiddenFinder.EMPTYSTONE);
                return false;
                break;
            case 4:		// diagonal direction - '\'
                i = x;
                j = y+2;
                while ((i > 0) && (j < (this.boardSize+1)))
                {
                    if (this.cBoard[i][j] == c)
                    {
                        i--;
                        j++;
                        continue;
                    }
                    else if (this.cBoard[i][j] == ForbiddenFinder.EMPTYSTONE)
                    {
                        if ((this.isOpenFour(i-1, j-1, nColor, nDir) == 1) && (!this.isDoubleFour(i-1, j-1)) && (!this.isDoubleThree(i-1, j-1)))
                        {
                            this.setStone(x, y, ForbiddenFinder.EMPTYSTONE);
                            return true;
                        }
                        else 
                            break;
                    }
                    else
                        break;
                }
                i = x+2;
                j = y;
                while ((i < (this.boardSize+1)) && (j > 0))
                {
                    if (this.cBoard[i][j] == c)
                    {
                        i++;
                        j--;
                        continue;
                    }
                    else if (this.cBoard[i][j] == ForbiddenFinder.EMPTYSTONE)
                    {
                        if ((this.isOpenFour(i-1, j-1, nColor, nDir) == 1) && (!this.isDoubleFour(i-1, j-1)) && (!this.isDoubleThree(i-1, j-1)))
                        {
                            this.setStone(x, y, ForbiddenFinder.EMPTYSTONE);
                            return true;
                        }
                        else
                            break;
                    }
                    else
                        break;
                }
                this.setStone(x, y, ForbiddenFinder.EMPTYSTONE);
                return false;
                break;
            default:
                this.setStone(x, y, ForbiddenFinder.EMPTYSTONE);
                return false;
                break;
            }
        }
    }
    
    this.isDoubleFour = function (x, y) {
        if (this.cBoard[x+1][y+1] != ForbiddenFinder.EMPTYSTONE)
            return false;

        if (this.isFive(x, y, 0))	// five?
            return false;

        var nFour = 0;
        for (var i=1; i<=4; i++)
        {
            if (this.isOpenFour(x, y, 0, i) == 2)
                nFour += 2;
            else if (this.isFour(x, y, 0, i))
                nFour++;
        }

        if (nFour >= 2)
            return true;
        else
            return false;
    }
    
    this.isDoubleThree = function (x, y) {
        if (this.cBoard[x+1][y+1] != ForbiddenFinder.EMPTYSTONE)
            return false;

        if (this.isFive(x, y, 0))	// five?
            return false;

        var nThree = 0;
        for (var i=1; i<=4; i++)
        {
            if (this.isOpenThree(x, y, 0, i))
                nThree++;
        }

        if (nThree >= 2)
            return true;
        else
            return false;
    }

    this.findForbiddenPoints = function () {
        parentObj.ptForbidden.length = 0;
        for (var i=0; i<this.boardSize; i++)
        {
            for (var j=0; j<this.boardSize; j++)
            {
                if (this.cBoard[i+1][j+1] != ForbiddenFinder.EMPTYSTONE)
                    continue;
                else
                {
                    if (this.isOverline(i, j) || this.isDoubleFour(i, j) || this.isDoubleThree(i, j))
                    {
                        parentObj.ptForbidden.push(new CPoint(i, j));
//                        parentObj.ptForbidden[nForbiddenPoints].x = i;
//                        parentObj.ptForbidden[nForbiddenPoints].y = j;
                    }
                }
            }
        }
    }

}


// ----
// -- public constants and attributes --
// ----
ForbiddenFinder.BLACKSTONE = 'X';
ForbiddenFinder.WHITESTONE = 'O';
ForbiddenFinder.EMPTYSTONE = '.';

ForbiddenFinder.BLACKFIVE = 0;
ForbiddenFinder.WHITEFIVE = 1;
ForbiddenFinder.BLACKFORBIDDEN = 2;


// ----
// public methods
// ----
ForbiddenFinder.prototype.clear = function () {
	this.ptForbidden.length = 0;

	for (var i=0; i<this.boardSize+2; i++)
	{
		this.cBoard[0][i] = '$';
		this.cBoard[(this.boardSize+1)][i] = '$';
		this.cBoard[i][0] = '$';
		this.cBoard[i][(this.boardSize+1)] = '$';
	}

	for (i=1; i<=this.boardSize; i++)
		for (var j=1; j<=this.boardSize; j++)
			this.cBoard[i][j] = ForbiddenFinder.EMPTYSTONE;
}

/*
* parameters: (x, y) position, cStone is var of BLACKSTONE, ForbiddenFinder.WHITESTONE, ForbiddenFinder.EMPTYSTONE
*/
ForbiddenFinder.prototype.addStone = function (x, y, cStone) {
    console.log(' Add stone at (%s, %s) which color is %s.', x, y, cStone);
	var nResult = -1;

	if (cStone == ForbiddenFinder.BLACKSTONE)
	{
		if (this.isFive(x, y, 0))
			nResult = ForbiddenFinder.BLACKFIVE;
		for (var i=0; i<this.ptForbidden.length; i++)
		{
			if (this.ptForbidden[i].value == CPoint(x,y).value)
				nResult = ForbiddenFinder.BLACKFORBIDDEN;
		}
	}
	else if (cStone == ForbiddenFinder.WHITESTONE)
	{
		if (this.isFive(x, y, 1))
			nResult = ForbiddenFinder.WHITEFIVE;
	}
	
	this.cBoard[x+1][y+1] = cStone;
	if (nResult == -1)
		this.findForbiddenPoints();
	else
		this.ptForbidden.length = 0;
	return nResult;
}

/**
* @param moves array each one is {seq:4, ordinate:{x:7, x8}}
*/
ForbiddenFinder.prototype.findAllForbiddenPoints = function (moves) {
    this.clear();
    
    for (var i = 0; i < moves.length; i++) {
        this.setStone(
            moves[i].ordinate.x, 
            moves[i].ordinate.y,
            moves[i].seq % 2 == 1 ? ForbiddenFinder.BLACKSTONE : ForbiddenFinder.WHITESTONE
        );
    }
    
    this.findForbiddenPoints();
    
    return this.ptForbidden;
}

