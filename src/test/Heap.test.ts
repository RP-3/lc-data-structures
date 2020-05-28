import { Heap } from '../Heap';
import * as chai from 'chai';
import 'mocha';

const expect = chai.expect;

describe('Heap', function(){

    type TestObject = {key: string, val: number};

    function assertHeapOrdering<T>(heap: Heap<T>){
        for(let i=0; i<heap.storage.length; i++){
            const parent = heap.storage[i];
            const leftChildIndex = i*2+1;
            const rightChildIndex = i*2+2;
            if(leftChildIndex < heap.storage.length){
                expect(heap.comparator(parent, heap.storage[leftChildIndex])).to.be.lessThan(1);
            }
            if(rightChildIndex < heap.storage.length){
                expect(heap.comparator(parent, heap.storage[rightChildIndex])).to.be.lessThan(1);
            }
        }
    }

    describe('empty state inspection', function(){

        const comparator = (a: TestObject, b: TestObject) => a.val - b.val; // lowest-value items at head
        const heapSize = Infinity;
        let subject: Heap<TestObject>;
        this.beforeEach(function(){
            subject = new Heap(comparator, heapSize);
        });

        describe('peak', function(){
            it('returns null', function(){
                expect(subject.peak()).to.eq(null);
            });
        });

        describe('size', function(){
            it('returns 0', function(){
                expect(subject.size()).to.eq(0);
            });
        });
    });

    context('when no size is specified', function(){

        const heapSize = undefined;

        describe('push', function(){

            const comparator = (a: TestObject, b: TestObject) => a.val - b.val; // lowest-value items at head
            let subject: Heap<TestObject>;
            this.beforeEach(function(){
                subject = new Heap(comparator, heapSize);
            });

            context('When the heap is empty', function(){

                this.beforeEach(function(){
                    expect(subject.size()).to.eq(0);
                    subject.push({key: 'k', val: 100});
                });

                it('increases in size', function(){
                    expect(subject.size()).to.eq(1);
                });

                it('places the new item at the head', function(){
                    expect(subject.peak()?.key).to.eq('k');
                    expect(subject.peak()?.val).to.eq(100);
                });
            });

            context('When the heap has a lower-priority item at the head', function(){

                this.beforeEach(function(){
                    expect(subject.size()).to.eq(0);
                    subject.push({key: 'lowKey', val: 100});
                    subject.push({key: 'highKey', val: 1});
                });

                it('increases in size', function(){
                    expect(subject.size()).to.eq(2);
                });

                it('places does not replace the head item', function(){
                    expect(subject.peak()?.key).to.eq('highKey');
                    expect(subject.peak()?.val).to.eq(1);
                });
            });

            context('When the heap has a higher-priority item at the head', function(){

                this.beforeEach(function(){
                    expect(subject.size()).to.eq(0);
                    subject.push({key: 'highKey', val: 1});
                    subject.push({key: 'lowKey', val: 100});
                });

                it('increases in size', function(){
                    expect(subject.size()).to.eq(2);
                });

                it('places replaces the head item', function(){
                    expect(subject.peak()?.key).to.eq('highKey');
                    expect(subject.peak()?.val).to.eq(1);
                });

                it('should not violate the heap ordering property', function(){
                    assertHeapOrdering(subject);
                });
            });

            context('When the newest item requires just one swap', function(){
                this.beforeEach(function(){
                    expect(subject.size()).to.eq(0);
                    subject.push({key: 'a', val: 4});
                    subject.push({key: 'b', val: 5});
                    subject.push({key: 'c', val: 8});
                    subject.push({key: 'd', val: 6});
                    subject.push({key: 'e', val: 9});
                    subject.push({key: 'f', val: 9});
                    subject.push({key: 'g', val: 7});
                });

                it('should not violate the heap ordering property', function(){
                    assertHeapOrdering(subject);
                });
            });
        });

        describe('pop', function(){

            const comparator = (a: TestObject, b: TestObject) => b.val - a.val; // highest-value items at head... just for a change
            let subject: Heap<TestObject>;
            this.beforeEach(function(){
                subject = new Heap(comparator, heapSize);
            });

            context('when the heap is empty', function(){

                it('returns null', function(){
                    expect(subject.pop()).to.eq(null);
                });
            });

            context('when the heap has a single item', function(){

                this.beforeEach(function(){
                    subject.push({key: 'k', val: 1});
                });

                it('returns null', function(){
                    expect(subject.pop()).to.deep.eq({key: 'k', val: 1});
                });
            });

            context('When the heap contains both higher and lower priority items', function(){

                this.beforeEach(function(){
                    expect(subject.size()).to.eq(0);
                    [
                        {key: 'a', val: 1},
                        {key: 'b', val: 5},
                        {key: 'c', val: 2},
                        {key: 'd', val: 4},
                        {key: 'e', val: 3}
                    ].forEach((item) => subject.push(item));
                    expect(subject.size()).to.eq(5);
                    subject.push({key: 'f', val: 2.5}); // should sift to the middle
                });

                it('increases in size', function(){
                    expect(subject.size()).to.eq(6);
                });

                it('sorts items by predicate order', function(){
                    let lastValue = Infinity;
                    while(subject.size()){
                        assertHeapOrdering(subject);
                        const top = subject.pop()!;
                        expect(top.val).to.be.lessThan(lastValue);
                        lastValue = top?.val;
                    }
                });
            });
        });
    });

    context('when a size is specified', function(){

        const heapSize = 5;

        describe('push', function(){

            const comparator = (a: TestObject, b: TestObject) => a.val - b.val; // lowest-value items at head
            let subject: Heap<TestObject>;
            this.beforeEach(function(){
                subject = new Heap(comparator, heapSize);
            });

            context('when <= size items are inserted', function(){

                this.beforeEach(function(){
                    expect(subject.size()).to.eq(0);
                    [
                        {key: 'a', val: 1},
                        {key: 'b', val: 5},
                        {key: 'c', val: 2},
                        {key: 'd', val: 4},
                        {key: 'e', val: 3}
                    ].forEach((item) => subject.push(item));
                });

                it('allows all items to exist inside', function(){
                    expect(subject.size()).to.eq(5);
                });
            });

            context('when an additional item is inserted', function(){

                this.beforeEach(function(){
                    expect(subject.size()).to.eq(0);
                    [
                        {key: 'a', val: 1},
                        {key: 'b', val: 5},
                        {key: 'c', val: 2},
                        {key: 'd', val: 4},
                        {key: 'e', val: 3}
                    ].forEach((item) => subject.push(item));
                    subject.push({key: 'f', val: 2.5});
                });

                it('does not exceed the maximum size', function(){
                    expect(subject.size()).to.eq(5);
                });

                it('ejects the highest priority item', function(){
                    const sortedContents = [];
                    while(subject.size()){
                        assertHeapOrdering(subject);
                        sortedContents.push(subject.pop()!);
                    }
                    expect(sortedContents).to.deep.eq([
                        {key: 'c', val: 2},
                        {key: 'f', val: 2.5},
                        {key: 'e', val: 3},
                        {key: 'd', val: 4},
                        {key: 'b', val: 5}
                    ]);
                });
            });
        });
    });

    describe('robustness', function(){

        const comparator = (a: number, b: number) => b - a; // max-value items at head
        const heapSize = Infinity;
        const testSize = 200;
        const popPercent = 0.25;

        let subject: Heap<number>;
        this.beforeEach(function(){
            subject = new Heap(comparator, heapSize);
        });

        describe('heap ordering', function(){

            it('never violates the heap ordering property', function(){

                for(let i=0; i<testSize; i++){
                    const add = Math.random() > popPercent;
                    if(add){
                        const val = Math.floor(Math.random()*1000);
                        subject.push(val);
                    }else{
                        subject.pop();
                    }
                    assertHeapOrdering(subject);
                }
            });
        });
    });

    describe('heapify', function(){

        const comparator = (a: number, b: number) => b - a; // max-value items at head
        let subject: Heap<number>;

        context('when the provided array is empty', function(){

            this.beforeEach(function(){
                const nums: number[] = [];
                subject = Heap.heapify(nums, comparator);
            });

            it('generates a valid (albeit empty) heap out of the given array', function(){
                assertHeapOrdering(subject);
                expect(subject.storage.length).to.eq(0);
            });
        });

        context('when the provided array has items in it', function(){

            this.beforeEach(function(){
                const nums = [1, 9, 2, 8, 3, 7, 4, 6, 5, 4, 6, 3, 7, 2, 8, 1, 9];
                subject = Heap.heapify(nums, comparator);
            });

            it('generates a valid heap out of the given array', function(){
                assertHeapOrdering(subject);
            });

            it('pops its contents in sorted order', function(){
                let lastItem = Infinity;
                while(subject.size()){
                    const next = subject.pop()!;
                    expect(lastItem).to.be.greaterThan(next-1);
                    lastItem = next;
                }
            });
        });
    });
});
