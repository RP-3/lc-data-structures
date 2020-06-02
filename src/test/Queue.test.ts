import { Queue } from '../Queue';
import * as chai from 'chai';
import 'mocha';

const expect = chai.expect;

describe('Queue', function(){

    let subject: Queue<number>;
    this.beforeEach(function(){
        subject = new Queue();
    });

    describe('empty state inspection', function(){

        describe('size', function(){
            it('returns 0', function(){
                expect(subject.size()).to.eq(0);
            });
        });

        describe('peakLeft', function(){
            it('returns null', function(){
                expect(subject.peakLeft()).to.eq(null);
            });
        });

        describe('peakRight', function(){
            it('returns null', function(){
                expect(subject.peakRight()).to.eq(null);
            });
        });

        describe('popLeft', function(){
            it('returns null', function(){
                expect(subject.popLeft()).to.eq(null);
            });
        });
    });

    describe('pushing & popping', function(){

        it('maintains FIFO order when peaking', function(){
            for(let i=0; i<5; i++){
                subject.pushRight(i);
                expect(subject.peakLeft()).to.eq(0);
                expect(subject.peakRight()).to.eq(i);
                expect(subject.size()).to.eq(i+1);
            }
        });

        it('maintains FIFO order when popping', function(){
            for(let i=0; i<5; i++) subject.pushRight(i);
            for(let i=0; i<5; i++){
                expect(subject.popLeft()).to.eq(i);
            }
        });

        it('handles emptiness gracefully', function(){
            for(let i=0; i<5; i++) subject.pushRight(i);
            const result = [];
            for(let i=0; i<10; i++) result.push(subject.popLeft());
            expect(result).to.deep.eq([0,1,2,3,4,null,null,null,null,null]);
        });
    });

    describe('wraparound', function(){

        context('when the indices are wrapped around the middle of the storage', function(){

            let i=0;
            let last = -1;

            this.beforeEach(function(){
                i=0;
                last = -1;
                // force end index to a lower position than start index
                while(subject.size() < 6) subject.pushRight(i++); // push six items
                while(subject.size() > 1){ // pop five
                    const popped = subject.popLeft()!;
                    expect(popped).to.be.greaterThan(last);
                    last = popped;
                } // [x,x,x,x,s,e,x,x,x,x]
                while(subject.size() < 8) subject.pushRight(i++); // push 7
                // [x,x,e,x,s,x,x,x,x,x]
            });

            it('wraps indexes transparently maintaining FIFO ordering', function(){
                while(subject.size() > 0){
                    const popped = subject.popLeft()!;
                    expect(popped).to.be.greaterThan(last);
                    last = popped;
                }
            });

            it('fills space between the start and end indices before resizing', function(){
                while(subject.size() < 20) subject.pushRight(i++);
                while(subject.size() > 0){
                    const popped = subject.popLeft()!;
                    expect(popped).to.be.greaterThan(last);
                    last = popped;
                }
            });
        });

        it('wraps from beginning of the array if both the start and end are at the last index', function(){
            let i=0;
            let last = -1;
            while(subject.size() < 10) subject.pushRight(i++);
            while(subject.size() > 1){
                const popped = subject.popLeft()!;
                expect(popped).to.be.greaterThan(last);
                last = popped;
            }
            subject.pushRight(i++);
            const popped = subject.popLeft()!;
            expect(popped).to.be.greaterThan(last);
            last = popped;
        });

    });

    describe('scaling', function(){

        const sampleSize = 10_000;

        it('increases and decreases in size transparently', function(){
            let i=0;
            let min = 0;
            let max = 10;
            let last = -1;
            while(i < sampleSize){
                // grow queue to max
                while(subject.size() < max) subject.pushRight(i++);

                // shrink queue to min
                while(subject.size() > min){
                    let popped = subject.popLeft()!;
                    expect(popped).to.be.greaterThan(last);
                    last = popped;
                }

                // increase min and max
                min*=10;
                max*=10;
            }

        });
    });
});
