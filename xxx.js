    function clear() {
        nForbiddenPoints = 0;

        for (var i=0; i<boardSize+2; i++)
        {
            cBoard[0][i] = '$';
            cBoard[(boardSize+1)][i] = '$';
            cBoard[i][0] = '$';
            cBoard[i][(boardSize+1)] = '$';
        }

        for (i=1; i<=boardSize; i++)
            for (var j=1; j<=boardSize; j++)
                cBoard[i][j] = EMPTYSTONE;
    }

    function addStone(x, y, cStone) {
        var nResult = -1;

        if (cStone == BLACKSTONE)
        {
            if (isFive(x, y, 0))
                nResult = BLACKFIVE;
            for (var i=0; i<nForbiddenPoints; i++)
            {
                if (ptForbidden[i] == CPoint(x,y))
                    nResult = BLACKFORBIDDEN;
            }
        }
        else if (cStone == WHITESTONE)
        {
            if (isFive(x, y, 1))
                nResult = WHITEFIVE;
        }

        cBoard[x+1][y+1] = cStone;
        if (nResult == -1)
            findForbiddenPoints();
        else
            nForbiddenPoints = 0;
        return nResult;
    }

    function setStone(x, y, cStone) {
        cBoard[x+1][y+1] = cStone;
    }

    function isFive(x, y, nColor) {
        if (cBoard[x+1][y+1] != EMPTYSTONE)
            return false;

        if (nColor == 0)	// black
        {
            setStone(x, y, BLACKSTONE);

            // detect black five
            var i, j;

            // 1 - horizontal direction
            var nLine = 1;
            i = x;
            while (i > 0)
            {
                if (cBoard[i--][y+1] == BLACKSTONE)
                    nLine++;
                else
                    break;
            }
            i = x+2;
            while (i < (boardSize+1))
            {
                if (cBoard[i++][y+1] == BLACKSTONE)
                    nLine++;
                else
                    break;
            }
            if (nLine == 5)
            {
                setStone(x, y, EMPTYSTONE);
                return true;
            }

            // 2 - vertical direction
            nLine = 1;
            i = y;
            while (i > 0)
            {
                if (cBoard[x+1][i--] == BLACKSTONE)
                    nLine++;
                else
                    break;
            }
            i = y+2;
            while (i < (boardSize+1))
            {
                if (cBoard[x+1][i++] == BLACKSTONE)
                    nLine++;
                else
                    break;
            }
            if (nLine == 5)
            {
                setStone(x, y, EMPTYSTONE);
                return true;
            }

            // 3 - diagonal direction (lower-left to upper-right: '/')
            nLine = 1;
            i = x;
            j = y;
            while ((i > 0) && (j > 0))
            {
                if (cBoard[i--][j--] == BLACKSTONE)
                    nLine++;
                else
                    break;
            }
            i = x+2;
            j = y+2;
            while ((i < (boardSize+1)) && (j < (boardSize+1)))
            {
                if (cBoard[i++][j++] == BLACKSTONE)
                    nLine++;
                else
                    break;
            }
            if (nLine == 5)
            {
                setStone(x, y, EMPTYSTONE);
                return true;
            }

            // 4 - diagonal direction (upper-left to lower-right: '\')
            nLine = 1;
            i = x;
            j = y+2;
            while ((i > 0) && (j < (boardSize+1)))
            {
                if (cBoard[i--][j++] == BLACKSTONE)
                    nLine++;
                else
                    break;
            }
            i = x+2;
            j = y;
            while ((i < (boardSize+1)) && (j > 0))
            {
                if (cBoard[i++][j--] == BLACKSTONE)
                    nLine++;
                else
                    break;
            }
            if (nLine == 5)
            {
                setStone(x, y, EMPTYSTONE);
                return true;
            }

            setStone(x, y, EMPTYSTONE);
            return false;
        }
        else if (nColor == 1)	// white
        {
            setStone(x, y, WHITESTONE);

            // detect white five or more
            var i, j;

            // 1 - horizontal direction
            var nLine = 1;
            i = x;
            while (i > 0)
            {
                if (cBoard[i--][y+1] == WHITESTONE)
                    nLine++;
                else
                    break;
            }
            i = x+2;
            while (i < (boardSize+1))
            {
                if (cBoard[i++][y+1] == WHITESTONE)
                    nLine++;
                else
                    break;
            }
            if (nLine >= 5)
            {
                setStone(x, y, EMPTYSTONE);
                return true;
            }

            // 2 - vertical direction
            nLine = 1;
            i = y;
            while (i > 0)
            {
                if (cBoard[x+1][i--] == WHITESTONE)
                    nLine++;
                else
                    break;
            }
            i = y+2;
            while (i < (boardSize+1))
            {
                if (cBoard[x+1][i++] == WHITESTONE)
                    nLine++;
                else
                    break;
            }
            if (nLine >= 5)
            {
                setStone(x, y, EMPTYSTONE);
                return true;
            }

            // 3 - diagonal direction (lower-left to upper-right: '/')
            nLine = 1;
            i = x;
            j = y;
            while ((i > 0) && (j > 0))
            {
                if (cBoard[i--][j--] == WHITESTONE)
                    nLine++;
                else
                    break;
            }
            i = x+2;
            j = y+2;
            while ((i < (boardSize+1)) && (j < (boardSize+1)))
            {
                if (cBoard[i++][j++] == WHITESTONE)
                    nLine++;
                else
                    break;
            }
            if (nLine >= 5)
            {
                setStone(x, y, EMPTYSTONE);
                return true;
            }

            // 4 - diagonal direction (upper-left to lower-right: '\')
            nLine = 1;
            i = x;
            j = y+2;
            while ((i > 0) && (j < (boardSize+1)))
            {
                if (cBoard[i--][j++] == WHITESTONE)
                    nLine++;
                else
                    break;
            }
            i = x+2;
            j = y;
            while ((i < (boardSize+1)) && (j > 0))
            {
                if (cBoard[i++][j--] == WHITESTONE)
                    nLine++;
                else
                    break;
            }
            if (nLine >= 5)
            {
                setStone(x, y, EMPTYSTONE);
                return true;
            }

            setStone(x, y, EMPTYSTONE);
            return false;
        }
        else 
            return false;
    }

    function isOverline(x, y) {
        if (cBoard[x+1][y+1] != EMPTYSTONE)
            return false;

        setStone(x, y, BLACKSTONE);

        // detect black overline
        var i, j;
        BOOL bOverline = false;

        // 1 - horizontal direction
        var nLine = 1;
        i = x;
        while (i > 0)
        {
            if (cBoard[i--][y+1] == BLACKSTONE)
                nLine++;
            else
                break;
        }
        i = x+2;
        while (i < (boardSize+1))
        {
            if (cBoard[i++][y+1] == BLACKSTONE)
                nLine++;
            else
                break;
        }
        if (nLine == 5)
        {
            setStone(x, y, EMPTYSTONE);
            return false;
        }
        else
            bOverline |= (nLine >= 6);

        // 2 - vertical direction
        nLine = 1;
        i = y;
        while (i > 0)
        {
            if (cBoard[x+1][i--] == BLACKSTONE)
                nLine++;
            else
                break;
        }
        i = y+2;
        while (i < (boardSize+1))
        {
            if (cBoard[x+1][i++] == BLACKSTONE)
                nLine++;
            else
                break;
        }
        if (nLine == 5)
        {
            setStone(x, y, EMPTYSTONE);
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
            if (cBoard[i--][j--] == BLACKSTONE)
                nLine++;
            else
                break;
        }
        i = x+2;
        j = y+2;
        while ((i < (boardSize+1)) && (j < (boardSize+1)))
        {
            if (cBoard[i++][j++] == BLACKSTONE)
                nLine++;
            else
                break;
        }
        if (nLine == 5)
        {
            setStone(x, y, EMPTYSTONE);
            return false;
        }
        else
            bOverline |= (nLine >= 6);

        // 4 - diagonal direction (upper-left to lower-right: '\')
        nLine = 1;
        i = x;
        j = y+2;
        while ((i > 0) && (j < (boardSize+1)))
        {
            if (cBoard[i--][j++] == BLACKSTONE)
                nLine++;
            else
                break;
        }
        i = x+2;
        j = y;
        while ((i < (boardSize+1)) && (j > 0))
        {
            if (cBoard[i++][j--] == BLACKSTONE)
                nLine++;
            else
                break;
        }
        if (nLine == 5)
        {
            setStone(x, y, EMPTYSTONE);
            return false;
        }
        else
            bOverline |= (nLine >= 6);

        setStone(x, y, EMPTYSTONE);
        return bOverline;
    }

    function isFive(x, y, nColor, nDir) {
        if (cBoard[x+1][y+1] != EMPTYSTONE)
            return false;

        char c;
        if (nColor == 0)	// black
            c = BLACKSTONE;
        else if (nColor == 1)	// white
            c = WHITESTONE;
        else
            return false;

        setStone(x, y, c);

        var i, j;
        var nLine;

        switch (nDir)
        {
        case 1:		// horizontal direction
            nLine = 1;
            i = x;
            while (i > 0)
            {
                if (cBoard[i--][y+1] == c)
                    nLine++;
                else
                    break;
            }
            i = x+2;
            while (i < (boardSize+1))
            {
                if (cBoard[i++][y+1] == c)
                    nLine++;
                else
                    break;
            }
            if (nLine == 5)
            {
                setStone(x, y, EMPTYSTONE);
                return true;
            }
            else
            {
                setStone(x, y, EMPTYSTONE);
                return false;
            }
            break;
        case 2:		// vertial direction
            nLine = 1;
            i = y;
            while (i > 0)
            {
                if (cBoard[x+1][i--] == c)
                    nLine++;
                else
                    break;
            }
            i = y+2;
            while (i < (boardSize+1))
            {
                if (cBoard[x+1][i++] == c)
                    nLine++;
                else
                    break;
            }
            if (nLine == 5)
            {
                setStone(x, y, EMPTYSTONE);
                return true;
            }
            else
            {
                setStone(x, y, EMPTYSTONE);
                return false;
            }
            break;
        case 3:		// diagonal direction - '/'
            nLine = 1;
            i = x;
            j = y;
            while ((i > 0) && (j > 0))
            {
                if (cBoard[i--][j--] == c)
                    nLine++;
                else
                    break;
            }
            i = x+2;
            j = y+2;
            while ((i < (boardSize+1)) && (j < (boardSize+1)))
            {
                if (cBoard[i++][j++] == c)
                    nLine++;
                else
                    break;
            }
            if (nLine == 5)
            {
                setStone(x, y, EMPTYSTONE);
                return true;
            }
            else
            {
                setStone(x, y, EMPTYSTONE);
                return false;
            }
            break;
        case 4:		// diagonal direction - '\'
            nLine = 1;
            i = x;
            j = y+2;
            while ((i > 0) && (j < (boardSize+1)))
            {
                if (cBoard[i--][j++] == c)
                    nLine++;
                else
                    break;
            }
            i = x+2;
            j = y;
            while ((i < (boardSize+1)) && (j > 0))
            {
                if (cBoard[i++][j--] == c)
                    nLine++;
                else
                    break;
            }
            if (nLine == 5)
            {
                setStone(x, y, EMPTYSTONE);
                return true;
            }
            else
            {
                setStone(x, y, EMPTYSTONE);
                return false;
            }
            break;
        default:
            setStone(x, y, EMPTYSTONE);
            return false;
            break;
        }
    }

    function isFour(x, y, nColor, nDir) {
        if (cBoard[x+1][y+1] != EMPTYSTONE)
            return false;

        if (isFive(x, y, nColor))	// five?
            return false;
        else if ((nColor == 0) && (isOverline(x, y)))	// black overline?
            return false;
        else
        {
            char c;
            if (nColor == 0)	// black
                c = BLACKSTONE;
            else if (nColor == 1)	// white
                c = WHITESTONE;
            else
                return false;

            setStone(x, y, c);

            var i, j;

            switch (nDir)
            {
            case 1:		// horizontal direction
                i = x;
                while (i > 0)
                {
                    if (cBoard[i][y+1] == c)
                    {
                        i--;
                        continue;
                    }
                    else if (cBoard[i][y+1] == EMPTYSTONE)
                    {
                        if (isFive(i-1, y, 0, nDir))
                        {
                            setStone(x, y, EMPTYSTONE);
                            return true;
                        }
                        else 
                            break;
                    }
                    else
                        break;
                }
                i = x+2;
                while (i < (boardSize+1))
                {
                    if (cBoard[i][y+1] == c)
                    {
                        i++;
                        continue;
                    }
                    else if (cBoard[i][y+1] == EMPTYSTONE)
                    {
                        if (isFive(i-1, y, 0, nDir))
                        {
                            setStone(x, y, EMPTYSTONE);
                            return true;
                        }
                        else
                            break;
                    }
                    else
                        break;
                }
                setStone(x, y, EMPTYSTONE);
                return false;
                break;
            case 2:		// vertial direction
                i = y;
                while (i > 0)
                {
                    if (cBoard[x+1][i] == c)
                    {
                        i--;
                        continue;
                    }
                    else if (cBoard[x+1][i] == EMPTYSTONE)
                    {
                        if (isFive(x, i-1, 0, nDir))
                        {
                            setStone(x, y, EMPTYSTONE);
                            return true;
                        }
                        else 
                            break;
                    }
                    else
                        break;
                }
                i = y+2;
                while (i < (boardSize+1))
                {
                    if (cBoard[x+1][i] == c)
                    {
                        i++;
                        continue;
                    }
                    else if (cBoard[x+1][i] == EMPTYSTONE)
                    {
                        if (isFive(x, i-1, 0, nDir))
                        {
                            setStone(x, y, EMPTYSTONE);
                            return true;
                        }
                        else
                            break;
                    }
                    else
                        break;
                }
                setStone(x, y, EMPTYSTONE);
                return false;
                break;
            case 3:		// diagonal direction - '/'
                i = x;
                j = y;
                while ((i > 0) && (j > 0))
                {
                    if (cBoard[i][j] == c)
                    {
                        i--;
                        j--;
                        continue;
                    }
                    else if (cBoard[i][j] == EMPTYSTONE)
                    {
                        if (isFive(i-1, j-1, 0, nDir))
                        {
                            setStone(x, y, EMPTYSTONE);
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
                while ((i < (boardSize+1)) && (j < (boardSize+1)))
                {
                    if (cBoard[i][j] == c)
                    {
                        i++;
                        j++;
                        continue;
                    }
                    else if (cBoard[i][j] == EMPTYSTONE)
                    {
                        if (isFive(i-1, j-1, 0, nDir))
                        {
                            setStone(x, y, EMPTYSTONE);
                            return true;
                        }
                        else
                            break;
                    }
                    else
                        break;
                }
                setStone(x, y, EMPTYSTONE);
                return false;
                break;
            case 4:		// diagonal direction - '\'
                i = x;
                j = y+2;
                while ((i > 0) && (j < (boardSize+1)))
                {
                    if (cBoard[i][j] == c)
                    {
                        i--;
                        j++;
                        continue;
                    }
                    else if (cBoard[i][j] == EMPTYSTONE)
                    {
                        if (isFive(i-1, j-1, 0, nDir))
                        {
                            setStone(x, y, EMPTYSTONE);
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
                while ((i < (boardSize+1)) && (j > 0))
                {
                    if (cBoard[i][j] == c)
                    {
                        i++;
                        j--;
                        continue;
                    }
                    else if (cBoard[i][j] == EMPTYSTONE)
                    {
                        if (isFive(i-1, j-1, 0, nDir))
                        {
                            setStone(x, y, EMPTYSTONE);
                            return true;
                        }
                        else
                            break;
                    }
                    else
                        break;
                }
                setStone(x, y, EMPTYSTONE);
                return false;
                break;
            default:
                setStone(x, y, EMPTYSTONE);
                return false;
                break;
            }
        }
}

    function isOpenFour(x, y, nColor, nDir) {
        if (cBoard[x+1][y+1] != EMPTYSTONE)
            return 0;

        if (isFive(x, y, nColor))	// five?
            return 0;
        else if ((nColor == 0) && (isOverline(x, y)))	// black overline?
            return 0;
        else
        {
            char c;
            if (nColor == 0)	// black
                c = BLACKSTONE;
            else if (nColor == 1)	// white
                c = WHITESTONE;
            else
                return 0;

            setStone(x, y, c);

            var i, j;
            var nLine;

            switch (nDir)
            {
            case 1:		// horizontal direction
                nLine = 1;
                i = x;
                while (i >= 0)
                {
                    if (cBoard[i][y+1] == c)
                    {
                        i--;
                        nLine++;
                        continue;
                    }
                    else if (cBoard[i][y+1] == EMPTYSTONE)
                    {
                        if (!isFive(i-1, y, 0, nDir))
                        {
                            setStone(x, y, EMPTYSTONE);
                            return 0;
                        }
                        else 
                            break;
                    }
                    else
                    {
                        setStone(x, y, EMPTYSTONE);
                        return 0;
                    }
                }
                i = x+2;
                while (i < (boardSize+1))
                {
                    if (cBoard[i][y+1] == c)
                    {
                        i++;
                        nLine++;
                        continue;
                    }
                    else if (cBoard[i][y+1] == EMPTYSTONE)
                    {
                        if (isFive(i-1, y, 0, nDir))
                        {
                            setStone(x, y, EMPTYSTONE);
                            return (nLine==4 ? 1 : 2);
                        }
                        else
                            break;
                    }
                    else
                        break;
                }
                setStone(x, y, EMPTYSTONE);
                return 0;
                break;
            case 2:		// vertial direction
                nLine = 1;
                i = y;
                while (i >= 0)
                {
                    if (cBoard[x+1][i] == c)
                    {
                        i--;
                        nLine++;
                        continue;
                    }
                    else if (cBoard[x+1][i] == EMPTYSTONE)
                    {
                        if (!isFive(x, i-1, 0, nDir))
                        {
                            setStone(x, y, EMPTYSTONE);
                            return 0;
                        }
                        else 
                            break;
                    }
                    else
                    {
                        setStone(x, y, EMPTYSTONE);
                        return 0;
                    }
                }
                i = y+2;
                while (i < (boardSize+1))
                {
                    if (cBoard[x+1][i] == c)
                    {
                        i++;
                        nLine++;
                        continue;
                    }
                    else if (cBoard[x+1][i] == EMPTYSTONE)
                    {
                        if (isFive(x, i-1, 0, nDir))
                        {
                            setStone(x, y, EMPTYSTONE);
                            return (nLine==4 ? 1 : 2);
                        }
                        else
                            break;
                    }
                    else
                        break;
                }
                setStone(x, y, EMPTYSTONE);
                return 0;
                break;
            case 3:		// diagonal direction - '/'
                nLine = 1;
                i = x;
                j = y;
                while ((i >= 0) && (j >= 0))
                {
                    if (cBoard[i][j] == c)
                    {
                        i--;
                        j--;
                        nLine++;
                        continue;
                    }
                    else if (cBoard[i][j] == EMPTYSTONE)
                    {
                        if (!isFive(i-1, j-1, 0, nDir))
                        {
                            setStone(x, y, EMPTYSTONE);
                            return 0;
                        }
                        else 
                            break;
                    }
                    else
                    {
                        setStone(x, y, EMPTYSTONE);
                        return 0;
                    }
                }
                i = x+2;
                j = y+2;
                while ((i < (boardSize+1)) && (j < (boardSize+1)))
                {
                    if (cBoard[i][j] == c)
                    {
                        i++;
                        j++;
                        nLine++;
                        continue;
                    }
                    else if (cBoard[i][j] == EMPTYSTONE)
                    {
                        if (isFive(i-1, j-1, 0, nDir))
                        {
                            setStone(x, y, EMPTYSTONE);
                            return (nLine==4 ? 1 : 2);
                        }
                        else
                            break;
                    }
                    else
                        break;
                }
                setStone(x, y, EMPTYSTONE);
                return 0;
                break;
            case 4:		// diagonal direction - '\'
                nLine = 1;
                i = x;
                j = y+2;
                while ((i >= 0) && (j <= (boardSize+1)))
                {
                    if (cBoard[i][j] == c)
                    {
                        i--;
                        j++;
                        nLine++;
                        continue;
                    }
                    else if (cBoard[i][j] == EMPTYSTONE)
                    {
                        if (!isFive(i-1, j-1, 0, nDir))
                        {
                            setStone(x, y, EMPTYSTONE);
                            return 0;
                        }
                        else 
                            break;
                    }
                    else
                    {
                        setStone(x, y, EMPTYSTONE);
                        return 0;
                    }
                }
                i = x+2;
                j = y;
                while ((i < (boardSize+1)) && (j > 0))
                {
                    if (cBoard[i][j] == c)
                    {
                        i++;
                        j--;
                        nLine++;
                        continue;
                    }
                    else if (cBoard[i][j] == EMPTYSTONE)
                    {
                        if (isFive(i-1, j-1, 0, nDir))
                        {
                            setStone(x, y, EMPTYSTONE);
                            return (nLine==4 ? 1 : 2);
                        }
                        else
                            break;
                    }
                    else
                        break;
                }
                setStone(x, y, EMPTYSTONE);
                return 0;
                break;
            default:
                setStone(x, y, EMPTYSTONE);
                return 0;
                break;
            }
        }
    }

    function isDoubleFour(x, y) {
        if (cBoard[x+1][y+1] != EMPTYSTONE)
            return false;

        if (isFive(x, y, 0))	// five?
            return false;

        var nFour = 0;
        for (var i=1; i<=4; i++)
        {
            if (isOpenFour(x, y, 0, i) == 2)
                nFour += 2;
            else if (isFour(x, y, 0, i))
                nFour++;
        }

        if (nFour >= 2)
            return true;
        else
            return false;
    }

    function isOpenThree(x, y, nColor, nDir) {
        if (isFive(x, y, nColor))	// five?
            return false;
        else if ((nColor == 0) && (isOverline(x, y)))	// black overline?
            return false;
        else
        {
            char c;
            if (nColor == 0)	// black
                c = BLACKSTONE;
            else if (nColor == 1)	// white
                c = WHITESTONE;
            else
                return false;

            setStone(x, y, c);

            var i, j;

            switch (nDir)
            {
            case 1:		// horizontal direction
                i = x;
                while (i > 0)
                {
                    if (cBoard[i][y+1] == c)
                    {
                        i--;
                        continue;
                    }
                    else if (cBoard[i][y+1] == EMPTYSTONE)
                    {
                        if ((isOpenFour(i-1, y, nColor, nDir) == 1) && (!isDoubleFour(i-1, y)) && (!isDoubleThree(i-1, y)))
                        {
                            setStone(x, y, EMPTYSTONE);
                            return true;
                        }
                        else 
                            break;
                    }
                    else
                        break;
                }
                i = x+2;
                while (i < (boardSize+1))
                {
                    if (cBoard[i][y+1] == c)
                    {
                        i++;
                        continue;
                    }
                    else if (cBoard[i][y+1] == EMPTYSTONE)
                    {
                        if ((isOpenFour(i-1, y, nColor, nDir) == 1) && (!isDoubleFour(i-1, y)) && (!isDoubleThree(i-1, y)))
                        {
                            setStone(x, y, EMPTYSTONE);
                            return true;
                        }
                        else
                            break;
                    }
                    else
                        break;
                }
                setStone(x, y, EMPTYSTONE);
                return false;
                break;
            case 2:		// vertial direction
                i = y;
                while (i > 0)
                {
                    if (cBoard[x+1][i] == c)
                    {
                        i--;
                        continue;
                    }
                    else if (cBoard[x+1][i] == EMPTYSTONE)
                    {
                        if ((isOpenFour(x, i-1, nColor, nDir) == 1) && (!isDoubleFour(x, i-1)) && (!isDoubleThree(x, i-1)))
                        {
                            setStone(x, y, EMPTYSTONE);
                            return true;
                        }
                        else 
                            break;
                    }
                    else
                        break;
                }
                i = y+2;
                while (i < (boardSize+1))
                {
                    if (cBoard[x+1][i] == c)
                    {
                        i++;
                        continue;
                    }
                    else if (cBoard[x+1][i] == EMPTYSTONE)
                    {
                        if ((isOpenFour(x, i-1, nColor, nDir) == 1) && (!isDoubleFour(x, i-1)) && (!isDoubleThree(x, i-1)))
                        {
                            setStone(x, y, EMPTYSTONE);
                            return true;
                        }
                        else
                            break;
                    }
                    else
                        break;
                }
                setStone(x, y, EMPTYSTONE);
                return false;
                break;
            case 3:		// diagonal direction - '/'
                i = x;
                j = y;
                while ((i > 0) && (j > 0))
                {
                    if (cBoard[i][j] == c)
                    {
                        i--;
                        j--;
                        continue;
                    }
                    else if (cBoard[i][j] == EMPTYSTONE)
                    {
                        if ((isOpenFour(i-1, j-1, nColor, nDir) == 1) && (!isDoubleFour(i-1, j-1)) && (!isDoubleThree(i-1, j-1)))
                        {
                            setStone(x, y, EMPTYSTONE);
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
                while ((i < (boardSize+1)) && (j < (boardSize+1)))
                {
                    if (cBoard[i][j] == c)
                    {
                        i++;
                        j++;
                        continue;
                    }
                    else if (cBoard[i][j] == EMPTYSTONE)
                    {
                        if ((isOpenFour(i-1, j-1, nColor, nDir) == 1) && (!isDoubleFour(i-1, j-1)) && (!isDoubleThree(i-1, j-1)))
                        {
                            setStone(x, y, EMPTYSTONE);
                            return true;
                        }
                        else
                            break;
                    }
                    else
                        break;
                }
                setStone(x, y, EMPTYSTONE);
                return false;
                break;
            case 4:		// diagonal direction - '\'
                i = x;
                j = y+2;
                while ((i > 0) && (j < (boardSize+1)))
                {
                    if (cBoard[i][j] == c)
                    {
                        i--;
                        j++;
                        continue;
                    }
                    else if (cBoard[i][j] == EMPTYSTONE)
                    {
                        if ((isOpenFour(i-1, j-1, nColor, nDir) == 1) && (!isDoubleFour(i-1, j-1)) && (!isDoubleThree(i-1, j-1)))
                        {
                            setStone(x, y, EMPTYSTONE);
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
                while ((i < (boardSize+1)) && (j > 0))
                {
                    if (cBoard[i][j] == c)
                    {
                        i++;
                        j--;
                        continue;
                    }
                    else if (cBoard[i][j] == EMPTYSTONE)
                    {
                        if ((isOpenFour(i-1, j-1, nColor, nDir) == 1) && (!isDoubleFour(i-1, j-1)) && (!isDoubleThree(i-1, j-1)))
                        {
                            setStone(x, y, EMPTYSTONE);
                            return true;
                        }
                        else
                            break;
                    }
                    else
                        break;
                }
                setStone(x, y, EMPTYSTONE);
                return false;
                break;
            default:
                setStone(x, y, EMPTYSTONE);
                return false;
                break;
            }
        }
    }

    function isDoubleThree(x, y) {
        if (cBoard[x+1][y+1] != EMPTYSTONE)
            return false;

        if (isFive(x, y, 0))	// five?
            return false;

        var nThree = 0;
        for (var i=1; i<=4; i++)
        {
            if (isOpenThree(x, y, 0, i))
                nThree++;
        }

        if (nThree >= 2)
            return true;
        else
            return false;
    }

    function findForbiddenPoints() {
        nForbiddenPoints = 0;
        for (var i=0; i<boardSize; i++)
        {
            for (var j=0; j<boardSize; j++)
            {
                if (cBoard[i+1][j+1] != EMPTYSTONE)
                    continue;
                else
                {
                    if (isOverline(i, j) || isDoubleFour(i, j) || isDoubleThree(i, j))
                    {
                        ptForbidden[nForbiddenPoints].x = i;
                        ptForbidden[nForbiddenPoints].y = j;
                        nForbiddenPoints++;
                    }
                }
            }
        }
    }