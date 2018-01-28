const fs = require('fs');
const haversineService = require('./haversine-service');
const errorService = require('./error-service');

const fileDefault = './assets/customer-list.json';
const fileType = 'utf-8';

const officeLatitude = 53.339428;
const officeLongitude = -6.257664;
const maxDistanceKm = 100;

const init = () => {
    fileExists = fs.existsSync(fileDefault);
    
    if (fileExists) {
        let filesStream$  = fs.createReadStream(fileDefault, fileType);
        filesStream$.on('error', err => errorService.handleError(err));
        filesStream$.on('data', data => console.log(processFileContents(data)
        .map(user => `Name: ${user.name}, User Id: ${user.user_id}`)
            .join('\n')));
    } else {
        errorService.handleError('File customer-list.json is not in ./assets');
    }
}

const processFileContents = (fileContents) => {
    try {
        if (fileContents) {
            const customers = transformFile(fileContents); 
            const customersWithin100Km = filterCustomersWithinDistanceKm(customers, maxDistanceKm);
            const customerNameIdsWithin100KmSortByUserId =  customersWithin100Km && customersWithin100Km.sort(sortByUserId)
            .map(customer => ({name: customer.name, user_id: customer.user_id}));
            return customerNameIdsWithin100KmSortByUserId;   
        }
        
    } catch (error) {
        errorService.handleError(error);
    }
}

const filterCustomersWithinDistanceKm = (customers, distance) => {
    try {
        return customers && customers.filter(customer => {
            const {latitude, longitude} = customer;
            return haversineService.calculateDistance(officeLatitude, latitude, officeLongitude,longitude) < distance;
        });
    } catch (error) {
        errorService.handleError(error);
    }
    
}

const transformFile = (file) => {
    const lines = convertFileLinesToArray(file);
    return convertToCustomerArray(lines);
}

const convertFileLinesToArray = (file) => {
    // filter boolean emsures a extra item with emptry string is not added to array
    return file.toString().trim().split(/\r?\n/).filter(Boolean);
}

const convertToCustomerArray = (lines) => {
    try {
        return lines.map(line => JSON.parse(line, (key, value) => {
            return key === 'latitude' || key === 'longitude'
             ? parseFloat(value)
             : value;
         }));
    } catch (error) {
        errorService.handleError(`Parse error in File at ${error.message}`);
    }
      
}

const sortByUserId = (prevCustomer, currentCustomer) => {
    return prevCustomer.user_id > currentCustomer.user_id
    ? 1
    : currentCustomer.user_id > prevCustomer.user_id
        ? -1
        : 0;
}

/// run init
// TODO read cmd arguments replace default variables with cmd line args
if(process.argv){
    for (var i=0; i< process.argv.length;i++) {
        switch (process.argv[i]) {
            case 'exec':
            init();
            break;
            default:
            
        }
    }
}




module.exports = {
    init : init,
    // made public to faciliate unit tests
    processFileContents: processFileContents,
    convertToCustomerArray: convertToCustomerArray,
    sortByUserId: sortByUserId,
    convertFileLinesToArray: convertFileLinesToArray,
    filterCustomersWithinDistanceKm: filterCustomersWithinDistanceKm
}