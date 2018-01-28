const service = require('./haversine-service');
const assert = require('assert');
const chai = require('chai');
const spies = require('chai-spies');
chai.use(spies);
const expect = chai.expect;

describe('haversineService', () => {
    describe('calculateDistance', () => {
        it('should handle zeroes', () => {
            // arrange
            // act
            let distance = service.calculateDistance(0,0,0,0);
            // assert
            assert.equal(distance, 0);
        });
        it('should return 100 for a location 100.5 km away', () => {
            // arrange
            // act
            let distance = service.calculateDistance(53.339428,53.365680,-6.257664,-7.7720203);
            // assert
            assert.equal(distance, 100);
        })
    });

    
})