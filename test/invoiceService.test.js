// Using a memory array does not allow to mock repository to do proper testing

const getInvoices = () => {
    return [
        {
            id: 1,
            invoiceDate: new Date(Date.now()),
            invoiceNumber: 1,
            invoiceNet: 100,
            invoiceTaxPercentage: 0,
            invoiceTotal: 100
        }
    ]};

const getInvoice = () => 
    {
        return {
            id: 1,
            invoiceDate: new Date(Date.now()),
            invoiceNumber: 1,
            invoiceNet: 100,
            invoiceTaxPercentage: 0,
            invoiceTotal: 100
        };
    };

test('get known invoice', async () => {
    
    const service = require('../services/invoiceService');

    const result = await service.get(1);
    return expect(result).not.toBeNull() &&
            expect(result.invoiceNumber).toEquals(1) &&
            expect(result.invoiceNet).toEquals(100) &&
            expect(result.invoiceTotal).toEquals(100);
});

test('get no invoice', async () => {
    
    const service = require('../services/invoiceService');

    const result = await service.get(2);
    return expect(result).toBeNull();
});

test('get known invoice list', async () => {
    
    const service = require('../services/invoiceService');

    const result = await service.getAll(1);
    return expect(result).not.toBeNull() &&
            expect(result.length).toEquals(1) ;
});

test('get known invoice list search - only invoice num', async () => {
    
    const service = require('../services/invoiceService');

    const result = await service.search(1, null, null);
    return expect(result).not.toBeNull() &&
            expect(result.length).toEquals(1) ;
});

test('get known invoice list search - all params - return list', async () => {
    
    const service = require('../services/invoiceService');

    const result = await service.search(1, '2019-12-01', '2019-12-31');
    return expect(result).not.toBeNull() &&
            expect(result.length).toEquals(1) ;
});

test('get known invoice list search - all params - return empty', async () => {
    
    const service = require('../services/invoiceService');

    const result = await service.search(2, '2019-11-01', '2019-11-30');
    return expect(result).not.toBeNull() &&
            expect(result.length).toEquals(0) ;
});

test('add invoice', async () => {
    
    const service = require('../services/invoiceService');

    const invoice = getInvoice();
    invoice.invoiceNumber = 3;

    const result = await service.add(invoice);
    return expect(result).not.toBeNull() &&
            expect(result.id).not().toEquals(invoice.id) &&
            expect(result.invoiceNumber).not().toEquals(invoice.invoiceNumber) &&
            expect(result.invoiceNet).toEquals(invoice.invoiceNet) &&
            expect(result.invoiceTotal).toEquals(invoice.invoiceTotal);
});

test('delete invoice', async () => {
    
    const service = require('../services/invoiceService');

    const invoice = getInvoice();
    invoice.invoiceNumber = 500;

    var res = await service.add(invoice);

    const result = await service.delete(res.id);
    return expect(result).not.toBeNull() &&
            expect(result).toEquals(res.id);
});