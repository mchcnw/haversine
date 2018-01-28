const app = require('./app');
const errorService = require('./error-service');
const assert = require('assert');
const chai = require('chai');
const sinon = require('sinon')
chai.use(require('sinon-chai'));
const expect = chai.expect;

describe('app', () => {
    describe('processFileContents', () => {
        it('should return users within 100km', () => {
            // arrange
            const mockFile =`
            {"latitude": "53.409189", "user_id": 12, "name": "TestUser Kildare", "longitude": "-6.693136"}
            {"latitude": "53.977030", "user_id": 1, "name": "TestUser Mayo", "longitude": "-10.127185"}
            `
            // act
            let customers = app.processFileContents(mockFile);
            // assert
            assert.equal(customers.length, 1);
        });

        it('should handle errors with non json files', () => {
            // arrange 
            const mockFile ='not json'
            const spy = sinon.spy(errorService, 'handleError');
            // act
            let customers = app.processFileContents(mockFile);
            // assert
            expect(spy.called).to.be.true;
        });
     });

    describe('convertToCustomerArray', () => {
        it('should parse floats', () => {
            // arrange
            const mockLine =  ['{"latitude": "543.99998756",  "longitude": "-0.043701"}'];
            // act
            const customer = app.convertToCustomerArray(mockLine);
            // assert
            assert.equal(customer[0].latitude, 543.99998756);
            assert.equal(customer[0].longitude, -0.043701);
        })
    });

    describe('sortByUserId', () => {
        it ('should sort ascending based on user_id', () =>{
            // arrange 
            const mockUserArray = [
                { user_id: 9087},
                { user_id: 5},
                { user_id: 77777},
                { user_id: -1},
            ];
            // act
            let sortedArray = mockUserArray.sort(app.sortByUserId);
            // assert
            assert.equal(sortedArray[0].user_id, -1);
            assert.equal(sortedArray[1].user_id, 5);
            assert.equal(sortedArray[2].user_id, 9087);
            assert.equal(sortedArray[3].user_id, 77777);
        })
    });

    describe('convertFileLinesToArray', () => {
        it('should create an array item for each line', () => {
            // arrange
            const mockFile =`
            testline1
            testline2
            testline3
            testline4
            `
            // act
            const arr = app.convertFileLinesToArray(mockFile);
            // assert
            assert.equal(arr.length, 4);
        })
        it('should return empty array for blank text', () =>{
            // arrange
            const mockFile =`
            
            
            
            `
            // act
            const arr = app.convertFileLinesToArray(mockFile);
            // assert
            assert.equal(arr.length, 0);
        })
    });

    describe('filterCustomersWithinDistanceKm', ()=> {
        it('should return users within distance 1 km', () => {
            // arrange 
           const mockCustomers = [
            {latitude: 53.338522, user_id: 12, name: 'TestUser Close', longitude: -6.257666},
            {latitude: 53.339392, user_id: 13, name: 'TestUser Closeish', longitude: -6.256411},
            {latitude: 53.332323, user_id: 14, name: 'TestUser Just over 1 Km', longitude: -6.269638},
           ];
           const filterCustomers = app.filterCustomersWithinDistanceKm(mockCustomers, 1);
           assert.equal(filterCustomers.length, 2);
           assert.equal(filterCustomers[0].user_id, 12);
           assert.equal(filterCustomers[1].user_id, 13);
        })
    })
})