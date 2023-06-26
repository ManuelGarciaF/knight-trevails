type Position = [number, number]

// Receives a start position and an end position and returns a list of all moves
// needed to reach it.
function knightMoves(start: Position, end: Position): Position[] {
    const root = new TreeNode(start);

    // Breadth first search
    let queue = [root];

    while (queue.length > 0) {
        const curr = queue.shift();

        // Populate children in order to search them.
        curr.populateChildren()

        // Stop search when one of the children has the target position.
        if (curr.pos[0] === end[0] && curr.pos[1] === end[1]) {
            return curr.pathFromRoot();
        }

        queue = queue.concat(curr.children);
    }
}

class TreeNode {
    pos: Position;
    predecesor: TreeNode | null;
    children: TreeNode[] = [];

    constructor(pos: Position, predecesor: TreeNode | null = null) {
        this.pos = pos;
        this.predecesor = predecesor;
    }

    populateChildren() {
        this.children = possibleMoves(this.pos).map(pos => new TreeNode(pos, this));
    }

    pathFromRoot(): Position[] {
        const reversePath: Position[] = [this.pos];

        let curr: TreeNode | null = this.predecesor;
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
        [x + 1, y - 2]
    ].filter(([x, y]) => x >= 0 && y >= 0 && x < 8 && y < 8) as Position[]; // Remove moves outside the board
}

const root = new TreeNode([1, 1]);
root.populateChildren();

console.log(knightMoves([1, 1], [7, 7]))
// console.log(root.children.some(node => node.pos[0] === 0 && node.pos[1] === 3))
