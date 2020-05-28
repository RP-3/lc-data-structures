/**
 * Follows the semantics of standard sorting function predicates.
 * If A is of a higher priority than B, return -1
 * If B is of a higher priority than A, reutrn +1
 * If they are equal, return 0;
 */
export type sortPredicate = (a: number, b: number) => number;
export type heapItem = { key: any, value: number };

export class Heap {

    private storage = [{key: null, value: 0}]; // the 0th element is always ignored to make the arithmetic simple

    constructor(
        private readonly comparator: sortPredicate,
        private readonly maxSize=Infinity
    ){}

    // MARK: Public interface

    /**
     * Add an item to the heap.
     * If the heap is at its maximum capacity the highest priority item (as determined
     * by the comparator function passed in) will be popped and returned to you.
     * @param key Any data you want stored at this priority level
     * @param value The numeric value on which this key-value tuple will be sorted
     */
    public push(key: any, value: number): heapItem | null {
        this.storage.push({key, value});
        this.percolateUp(this.size());

        if(this.size() > this.maxSize) return this.pop();
        return null;
    }

    public pop(): heapItem | null {
        if(this.size() === 0) return null;
        const tmp = this.storage[1]; // save the min item
        this.storage[1] = this.storage[this.size()]; // overwrite that space with the end item
        this.storage.pop(); // delete the now-duplicated end item from the end
        this.percolateDown(1); // percolate the end-item from the beginning to the correct place
        return tmp; // return the original min item
    }

    public peak(): heapItem | null {
        if(!this.size()) return null;
        const {key, value} = this.storage[1];
        return {key, value};
    }

    public size(): number {
        return this.storage.length-1;
    }

    // MARK: private
    private inOrder(parentIndex: number, childIndex: number): Boolean {
        return this.comparator(this.storage[parentIndex].value, this.storage[childIndex].value) <= 0;
    }

    private percolateUp(i: number): void {
        let parentIndex = Math.floor(i/2);
        while(!this.inOrder(parentIndex, i) && parentIndex < i && parentIndex > 0){
            const tmp = this.storage[parentIndex];
            this.storage[parentIndex] = this.storage[i];
            this.storage[i] = tmp;
            i = parentIndex;
            parentIndex = Math.floor(i/2);
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
        if(this.size() < (parentIndex*2)) return null;
        const leftChildIndex = parentIndex*2;
        const rightChildIndex = (parentIndex*2) + 1;
        if(this.storage[rightChildIndex] === undefined) return leftChildIndex;

        const leftChild = this.storage[leftChildIndex];
        const rightChild = this.storage[rightChildIndex];
        const comparison = this.comparator(leftChild.value, rightChild.value);
        return (comparison <= 0) ? leftChildIndex : rightChildIndex;
    }
}
