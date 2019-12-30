var invoiceService = require('../services/invoiceService');
const { validationResult } = require('express-validator');

jest.mock('../services/invoiceService');
jest.mock('express-validator');

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

const mockValidationErrors = () => {
    const errors = {};
    errors.isEmpty = jest.fn().mockReturnValue(true);
    errors.array = jest.fn().mockReturnValue([]);
    return errors;
};

const mockValidationErrorsWithErrors = () => {
    const errors = {};
    errors.isEmpty = jest.fn().mockReturnValue(false);
    errors.array = jest.fn().mockReturnValue(['some error']);
    return errors;
};

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

test('get invoice list', async () => {
    const invoices = getInvoices();

    invoiceService.getAll.mockResolvedValue(invoices);

    const controller = require('../controllers/invoiceController');
    const req = {};
    const res = mockResponse();

    await controller.invoice_list(req, res);

    return expect(res.json).toHaveBeenCalledWith(invoices);
});

test('get invoice list - not found', async () => {
    
    invoiceService.getAll.mockResolvedValue(null);

    const controller = require('../controllers/invoiceController');
    const req = {};
    const res = mockResponse();

    await controller.invoice_list(req, res);

    return expect(res.status).toHaveBeenCalledWith(404);
});

test('get single invoice', async () => {
    const mockRequest = (id) => {
        return {
            params: {
                id
            }
        };
    };

    const invoice = getInvoice();

    invoiceService.get.mockResolvedValue(invoice);

    const controller = require('../controllers/invoiceController');
    const req = mockRequest(1);
    const res = mockResponse();

    await controller.invoice_get(req, res);

    return expect(res.json).toHaveBeenCalledWith(invoice);
});

test('get single invoice - nor found', async () => {
    const mockRequest = (id) => {
        return {
            params: {
                id
            }
        };
    };

    invoiceService.get.mockResolvedValue(null);

    const controller = require('../controllers/invoiceController');
    const req = mockRequest(1);
    const res = mockResponse();

    await controller.invoice_get(req, res);

    return expect(res.status).toHaveBeenCalledWith(404);
});

test('add invoice', async () => {
    const mockRequest = (body) => {
        return {
            body: body
        };
    };

    const invoice = getInvoice();

    const resultInvoice = getInvoice();
    resultInvoice.id = 1;
    
    validationResult.mockImplementation(() => mockValidationErrors());
    invoiceService.add.mockResolvedValue(resultInvoice);

    const controller = require('../controllers/invoiceController');
    const req = mockRequest(invoice);
    const res = mockResponse();

    await controller.invoice_add(req, res);

    return expect(res.json).toHaveBeenCalledWith(resultInvoice);
});

test('add invoice - validation error', async () => {
    const mockRequest = (body) => {
        return {
            body: body
        };
    };

    const invoice = getInvoice();

    validationResult.mockImplementation(() => mockValidationErrorsWithErrors());

    const controller = require('../controllers/invoiceController');
    const req = mockRequest(invoice);
    const res = mockResponse();

    await controller.invoice_add(req, res);

    return expect(res.status).toHaveBeenCalledWith(422);
});

test('delete invoice', async () => {
    const mockRequest = (id) => {
        return {
            params: {
                id
            }
        };
    };

    invoiceService.delete.mockResolvedValue(1);

    const controller = require('../controllers/invoiceController');
    const req = mockRequest(1);
    const res = mockResponse();

    await controller.invoice_delete(req, res);

    return expect(res.json).toHaveBeenCalledTimes(1);
});

test('delete invoice invoice - not found', async () => {
    const mockRequest = (id) => {
        return {
            params: {
                id
            }
        };
    };

    invoiceService.delete.mockResolvedValue(null);

    const controller = require('../controllers/invoiceController');
    const req = mockRequest(1);
    const res = mockResponse();

    await controller.invoice_delete(req, res);

    return expect(res.status).toHaveBeenCalledWith(404);
});

test('invoice search - with params, return collection', async () => {
    const mockRequest = (body) => {
        return {
            body: body
        };
    };

    const search = {
        invoiceNumber: 1
    };

    const invoices = getInvoices();

    validationResult.mockImplementation(() => mockValidationErrors());
    invoiceService.search.mockResolvedValue(invoices);

    const controller = require('../controllers/invoiceController');
    const req = mockRequest(search);
    const res = mockResponse();

    await controller.invoice_search(req, res);

    return expect(res.json).toHaveBeenCalledWith(invoices);
});

test('invoice search - no params, return []', async () => {
    const mockRequest = (body) => {
        return {
            body: body
        };
    };

    const search = {
    };

    validationResult.mockImplementation(() => mockValidationErrors());

    const controller = require('../controllers/invoiceController');
    const req = mockRequest(search);
    const res = mockResponse();

    await controller.invoice_search(req, res);

    return expect(res.json).toHaveBeenCalledWith([]);
});

test('invoice search - validation error', async () => {
    const mockRequest = (body) => {
        return {
            body: body
        };
    };

    const search = {
    };

    validationResult.mockImplementation(() => mockValidationErrorsWithErrors());

    const controller = require('../controllers/invoiceController');
    const req = mockRequest(search);
    const res = mockResponse();

    await controller.invoice_search(req, res);

    return expect(res.status).toHaveBeenCalledWith(422);
});