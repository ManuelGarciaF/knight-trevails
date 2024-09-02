type Position = [number, number];

function posIsEqual(a: Position, b: Position): boolean {
    return a[0] === b[0] && a[1] === b[1];
}

// Receives a start position and an end position and returns a list of all moves
// needed to reach it.
function knightMoves(start: Position, end: Position): Position[] {
    const root = new TreeNode(start);

    // Breadth first search
    let queue = [root];

    while (queue.length > 0) {
        const curr = queue.shift();

        // Populate children in order to search them.
        curr.populateChildren();

        // Stop search when one of the children has the target position.
        if (curr.pos[0] === end[0] && curr.pos[1] === end[1]) {
            return curr.pathFromRoot();
        }

        queue = queue.concat(curr.children);
    }
}

// Receives a start position and returns a traversal for the entire board
function knightTraversal(start: Position) {
    const root = new TreeNode(start);

    // Depth first search
    let stack = [root];

    while (stack.length > 0) {
        const curr = stack.pop();

        // Populate children in order to search them.
        curr.populateChildrenToUnusedSquares();

        // Stop search when we got to the max depth
        if (curr.depth == 63) {
            return curr.pathFromRoot();
        }

        stack = stack.concat(curr.children);
    }
}

class TreeNode {
    pos: Position;
    predecesor: TreeNode | null;
    children: TreeNode[] = [];
    depth: number;

    constructor(pos: Position, predecesor: TreeNode | null = null) {
        this.pos = pos;
        this.predecesor = predecesor;
        this.depth = predecesor === null ? 0 : predecesor.depth + 1;
    }

    populateChildren() {
        this.children = possibleMoves(this.pos).map(
            (pos) => new TreeNode(pos, this),
        );
    }

    populateChildrenToUnusedSquares() {
        this.children = possibleMoves(this.pos)
            .filter((pos) => {
                return !this.pathFromRoot().some((pathPos) =>
                    posIsEqual(pathPos, pos),
                );
            })
            .map((pos) => new TreeNode(pos, this));
    }

    pathFromRoot(): Position[] {
        const reversePath: Position[] = [this.pos];

        let curr: TreeNode | null = this.predecesor;

        if (curr === null) return []; // If we are the root, path is empty.

        // Only the root has predecesor == null
        while (curr.predecesor !== null) {
            reversePath.push(curr.pos);
            curr = curr.predecesor;
        }
        reversePath.push(curr.pos);
        return reversePath.reverse();
    }
}

function possibleMoves([x, y]: Position): Position[] {
    return [
        [x - 1, y + 2],
        [x + 1, y + 2],
        [x - 2, y + 1],
        [x + 2, y + 1],
        [x - 2, y - 1],
        [x + 2, y - 1],
        [x - 1, y - 2],
        [x + 1, y - 2],
    ].filter(([x, y]) => x >= 0 && y >= 0 && x < 8 && y < 8) as Position[]; // Remove moves outside the board
}

const root = new TreeNode([1, 1]);
root.populateChildren();

// console.log(knightMoves([0, 0], [1, 2]));

const moves = knightTraversal([0, 0]);
// Print the board on a grid with numbers for the index in the traversal
const board = Array.from({ length: 8 }, () =>
    Array.from({ length: 8 }, () => ' '),
);
moves.forEach(([x, y], i) => {
    board[x][y] = (i+1).toString().padStart(2, ' ');
});
console.log(board.map((row) => row.join(' | ')).join('\n'));
