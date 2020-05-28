import { Heap } from '../Heap';
import * as chai from 'chai';
import 'mocha';

const expect = chai.expect;

describe('Heap', function(){

    describe('empty state inspection', function(){

        const comparator = (a: number, b: number) => a - b; // lowest-value items at head
        const heapSize = Infinity;
        let subject: Heap;
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

            const comparator = (a: number, b: number) => a - b; // lowest-value items at head
            let subject: Heap;
            this.beforeEach(function(){
                subject = new Heap(comparator, heapSize);
            });

            context('When the heap is empty', function(){

                this.beforeEach(function(){
                    expect(subject.size()).to.eq(0);
                    subject.push('k', 100);
                });

                it('increases in size', function(){
                    expect(subject.size()).to.eq(1);
                });

                it('places the new item at the head', function(){
                    expect(subject.peak()?.key).to.eq('k');
                    expect(subject.peak()?.value).to.eq(100);
                });
            });

            context('When the heap has a lower-priority item at the head', function(){

                this.beforeEach(function(){
                    expect(subject.size()).to.eq(0);
                    subject.push('lowKey', 100);
                    subject.push('highKey', 1);
                });

                it('increases in size', function(){
                    expect(subject.size()).to.eq(2);
                });

                it('places does not replace the head item', function(){
                    expect(subject.peak()?.key).to.eq('highKey');
                    expect(subject.peak()?.value).to.eq(1);
                });
            });

            context('When the heap has a higher-priority item at the head', function(){

                this.beforeEach(function(){
                    expect(subject.size()).to.eq(0);
                    subject.push('highKey', 1);
                    subject.push('lowKey', 100);
                });

                it('increases in size', function(){
                    expect(subject.size()).to.eq(2);
                });

                it('places replaces the head item', function(){
                    expect(subject.peak()?.key).to.eq('highKey');
                    expect(subject.peak()?.value).to.eq(1);
                });
            });
        });

        describe('pop', function(){

            const comparator = (a: number, b: number) => b - a; // highest-value items at head... just for a change
            let subject: Heap;
            this.beforeEach(function(){
                subject = new Heap(comparator, heapSize);
            });

            context('when the heap is empty', function(){

                it('returns null', function(){
                    expect(subject.pop()).to.eq(null);
                });
            });

            context('When the heap contains both higher and lower priority items', function(){

                this.beforeEach(function(){
                    expect(subject.size()).to.eq(0);
                    [
                        {key: 'a', value: 1},
                        {key: 'b', value: 5},
                        {key: 'c', value: 2},
                        {key: 'd', value: 4},
                        {key: 'e', value: 3}
                    ].forEach((item) => subject.push(item.key, item.value));
                    expect(subject.size()).to.eq(5);
                    subject.push('f', 2.5); // should sift to the middle
                });

                it('increases in size', function(){
                    expect(subject.size()).to.eq(6);
                });

                it('sorts items by predicate order', function(){
                    let lastValue = Infinity;
                    while(subject.size()){
                        const top = subject.pop()!;
                        expect(top.value).to.be.lessThan(lastValue);
                        lastValue = top?.value;
                    }
                });
            });
        });
    });

    context('when a size is specified', function(){

        const heapSize = 5;

        describe('push', function(){

            const comparator = (a: number, b: number) => a - b; // lowest-value items at head
            let subject: Heap;
            this.beforeEach(function(){
                subject = new Heap(comparator, heapSize);
            });

            context('when <= size items are inserted', function(){

                this.beforeEach(function(){
                    expect(subject.size()).to.eq(0);
                    [
                        {key: 'a', value: 1},
                        {key: 'b', value: 5},
                        {key: 'c', value: 2},
                        {key: 'd', value: 4},
                        {key: 'e', value: 3}
                    ].forEach((item) => subject.push(item.key, item.value));
                });

                it('allows all items to exist inside', function(){
                    expect(subject.size()).to.eq(5);
                });
            });

            context('when an additional item is inserted', function(){

                this.beforeEach(function(){
                    expect(subject.size()).to.eq(0);
                    [
                        {key: 'a', value: 1},
                        {key: 'b', value: 5},
                        {key: 'c', value: 2},
                        {key: 'd', value: 4},
                        {key: 'e', value: 3}
                    ].forEach((item) => subject.push(item.key, item.value));
                    subject.push('f', 2.5);
                });

                it('does not exceed the maximum size', function(){
                    expect(subject.size()).to.eq(5);
                });

                it('ejects the highest priority item', function(){
                    const sortedContents = [];
                    while(subject.size()) sortedContents.push(subject.pop()!);
                    expect(sortedContents).to.deep.eq([
                        {key: 'c', value: 2},
                        {key: 'f', value: 2.5},
                        {key: 'e', value: 3},
                        {key: 'd', value: 4},
                        {key: 'b', value: 5}
                    ]);
                });
            });
        });
    });
});