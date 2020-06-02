/*
Standard FIFO queue.
Doubles in capacity when size reaches capacity.
Halves in capacity when size < 1/4 available capacity.
*/
export class Queue<T> {

    private storage: (T|null)[] = new Array(10).fill(null);
    private start = -1;
    private end = -1;

    /**
     * Returns the number of enqueued items
     */
    public size(){
        if(this.start === -1) return 0;
        if(this.start < this.end) return this.end - this.start + 1;
        if(this.start === this.end) return 1;
        return (this.storage.length - this.start) + this.end + 1;
    }

    /**
     * Returns the next item to be dequeued without
     * dequeing it.
     */
    public peakLeft(): T|null {
        return this.size() === 0 ? null : this.storage[this.start];
    }

    /**
     * Returns the last item to be dequeued (the most recently enqueued item)
     * without changing its order.
     */
    public peakRight(): T|null {
        return this.size() === 0 ? null : this.storage[this.end];
    }

    /**
     * Dequeue the least-recently enqueued item.
     * Returns null if no items are equeued.
     */
    public popLeft(): T|null {
        if(this.size() === 0) return null;

        let tmp; // return val
        // one element left
        if(this.start === this.end){
            tmp = this.storage[this.start];
            this.start = -1;
            this.end = -1;
        }
        // start is at final index
        else if(this.start ===(this.storage.length -1)){
            tmp = this.storage[this.start];
            this.start = 0;
        }
        // start and end are different
        else {
            tmp = this.storage[this.start];
            this.start++;
        }

        if((this.storage.length > 10) && this.storage.length > (this.size() * 4)){
            this.resize(false);
        }
        return tmp;
    }

    /**
     * Enqueue an item
     * @param val The item to enqueue
     *
     * Returns the number of enqueued items
     */
    public pushRight(val: T): number{
        // empty storage
        if(this.start === -1) {
            this.storage[0] = val;
            this.start = 0;
            this.end = 0;
            return this.size();
        }

        // start ---- end
        if(this.end > this.start){
            // if we've run out of space
            if((this.end + 1) === this.storage.length){
                // but have room to wrap around
                if(this.start > 0){
                    // wrap around
                    this.storage[0] = val;
                    this.end = 0;
                    return this.size();
                }else{
                    // no room to wrap around. Resize
                    this.resize(true);
                    this.pushRight(val);
                    return this.size();
                }
            } else {
                // not run out of space
                this.storage[++this.end] = val;
                return this.size();
            }
        }
        // end --- start
        else if(this.end < this.start){
            // there's space between the pointers
            if((this.start - this.end) > 1){
                this.storage[++this.end] = val;
                return this.size();
            }else{
                this.resize(true);
                this.pushRight(val);
                return this.size();
            }
        }
        // end === start
        else {
            // there's space after end
            if((this.end + 1) < this.storage.length){
                this.storage[++this.end] = val;
                return this.size();
            }
            // there's space before start
            else if(this.start > 0){
                this.storage[--this.start] = val;
                return this.size();
            }
            throw new Error('Invariant violation: End and start cannot be equal and have no space on either side');
        }
    }

    private resize(upsize=true){
        const newSize = upsize ? (this.storage.length * 2) : Math.max(10, Math.floor(this.storage.length / 2));
        const newStorage = new Array(newSize);
        let lastElementAt = -1;
        if(this.start < this.end){
            for(let i=this.start; i<=this.end; i++){
                newStorage[++lastElementAt] = this.storage[i];
            }
        } else {
            for(let i=this.start; i<this.storage.length; i++){
                newStorage[++lastElementAt] = this.storage[i];
            }
            for(let i=0; i<=this.end; i++){
                newStorage[++lastElementAt] = this.storage[i];
            }
        }
        this.storage = newStorage;
        this.start = 0;
        this.end = lastElementAt;
        return this.size();
    }
}
