/**
 * Follows the semantics of standard sorting function predicates.
 * If A is of a higher priority than B, return -1
 * If B is of a higher priority than A, reutrn +1
 * If they are equal, return 0;
 */
export class Heap<T> {

    public readonly storage: T[] = [];

    constructor(
        private readonly comparator: (a: T, b: T) => number,
        private readonly maxSize=Infinity
    ){}

    // MARK: Public interface
    /**
     * Add an item to the heap.
     * If the heap is at its maximum capacity the highest priority item (as determined
     * by the comparator function passed in) will be popped and returned to you.
     * @param val The item you wish to push
     */
    public push(val: T): T | null {
        this.storage.push(val);
        this.percolateUp(this.storage.length-1);
        if(this.storage.length > this.maxSize) return this.pop();
        return null;
    }

    public pop(): T | null {
        if(this.storage.length === 0) return null;
        if(this.storage.length === 1) return this.storage.pop()!;

        const tmp = this.storage[0]; // save the min item
        this.storage[0] = this.storage.pop()!; // overwrite that space with the end item
        this.percolateDown(0); // percolate the end-item from the beginning to the correct place
        return tmp; // return the original min item
    }

    /**
     * Returns a reference to the highest priority item.
     * If you mutate this, no rebalancing will occur.
     */
    public peak(): T | null {
        if(!this.storage.length) return null;
        return this.storage[0];
    }

    public size(): number {
        return this.storage.length;
    }

    // MARK: private
    private inOrder(parentIndex: number, childIndex: number): Boolean {
        return this.comparator(this.storage[parentIndex], this.storage[childIndex]) <= 0;
    }

    private percolateUp(i: number): void {
        let parentIndex = this.parentIndex(i);
        while(parentIndex >= 0 && parentIndex < i && !this.inOrder(parentIndex, i)){
            const tmp = this.storage[parentIndex];
            this.storage[parentIndex] = this.storage[i];
            this.storage[i] = tmp;
            i = parentIndex;
            parentIndex = this.parentIndex(i);
        }
    }

    private percolateDown(i: number): void {
        let childIndex = this.highestPriorityChildIndex(i);
        while(childIndex !== null  && !this.inOrder(i, childIndex)){
            [this.storage[i], this.storage[childIndex]] = [this.storage[childIndex], this.storage[i]];
            i = childIndex;
            childIndex = this.highestPriorityChildIndex(i);
        }
    }

    private highestPriorityChildIndex(parentIndex: number): null | number {
        const leftChildIndex = this.leftChildIndex(parentIndex);
        const rightChildIndex = this.rightChildIndex(parentIndex);
        if(leftChildIndex >= this.storage.length) return null; // no children
        if(rightChildIndex >= this.storage.length) return leftChildIndex; // no right child

        const leftChild = this.storage[leftChildIndex];
        const rightChild = this.storage[rightChildIndex];
        const comparison = this.comparator(leftChild, rightChild);
        return (comparison <= 0) ? leftChildIndex : rightChildIndex;
    }

    private parentIndex(childIndex: number){
        return Math.floor((childIndex-1)/2);
    }

    private leftChildIndex(parentIndex: number){
        return parentIndex * 2 + 1;
    }

    private rightChildIndex(parentIndex: number){
        return parentIndex * 2 + 2;
    }
}
