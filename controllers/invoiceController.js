var invoiceService = require('../services/invoiceService');
const LoggerService = require('../services/loggerService');
const { validationResult } = require('express-validator');

const logger = new LoggerService('nybble-node');

exports.invoice_list = async (req, res, next) => {
    try {
        logger.info(`New invoices list request`);
        var invoices = await invoiceService.getAll();

        if (invoices) {
            logger.info(`Invoices found on list request`, invoices); 
            res.json(invoices);
        } else {
            logger.info(`Invoices collection not found`);
            res.status(404).json({ message: `Invoices not found.` });
        }
    } catch (e) {
        logger.error('Exception invoices list request', e);
        res.status(400).json(e.message);
    }
}

exports.invoice_get = async (req, res, next) => {
    try {
        let id = req.params.id;

        logger.info(`New invoice get (Id: ${ id })`); 

        var invoice = await invoiceService.get(id);

        if (invoice) {
            logger.info(`Invoice found on id: ${ id }`, invoice); 
            res.json(invoice);
        } else {
            logger.info(`Invoice id: ${ id } not found`);
            res.status(404).json({ message: `Invoice ${ id } not found.` });
        }
    } catch (e) {
        logger.error(`Exception on invoice get (Id: ${ id })`, e);
        res.status(400).json(e.message);
    }
}

exports.invoice_add = async(req, res, next) => {
    logger.info(`New invoice add`, req.body); 

    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.error('Invalid entity sent to invoice add', errors);
        return res.status(422).json({ errors: errors.array() });
    }

    try {
        var invoice = req.body;

        invoice = await invoiceService.add(invoice);

        return res.json(invoice);
    } catch (e) {
        logger.error('Exception on invoice add', e);
        res.status(400).json(e.message);
    }
}

exports.invoice_delete = async (req, res, next) => {
    try {
        let id = req.params.id;

        logger.info(`New invoice delete (Id: ${ id })`); 

        var invoice = await invoiceService.delete(id);

        if (invoice) {
            logger.info(`Invoice deleted with id: ${ id }`); 
            res.json();
        } else {
            logger.info(`Invoice id: ${ id } not found`);
            res.status(404).json({ message: `Invoice ${ id } not found.` });
        }
    } catch (e) {
        logger.error(`Exception on invoice delete (Id: ${ id }`, e);
        res.status(400).json(e.message);
    }
}

exports.invoice_search = async(req, res, next) => {
    logger.info(`New invoice search`, req.body); 

    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.error('Invalid entity sent to invoice search', errors);
        return res.status(422).json({ errors: errors.array() });
    }

    try {
        var params = req.body;

        if (params.invoiceNumber || params.beginDate || params.endDate) {
            var invoices = await invoiceService.search(params.invoiceNumber, params.beginDate, params.endDate);
            logger.info(`Search results`, invoices); 
            return res.json(invoices);
        } else {
            logger.info(`Search without parameters, returning empty collection`); 
            return res.json([]);
        }
    } catch (e) {
        logger.error('Exception on invoice search', e);
        res.status(400).json(e.message);
    }
}