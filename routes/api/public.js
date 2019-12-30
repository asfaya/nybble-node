const express = require('express');
var router = express.Router();
const { check } = require('express-validator');

var invoice_controller = require('../../controllers/invoiceController');
var weather_controller = require('../../controllers/weatherController');

//GET list of invoices
router.get('/invoices', async (req, res, next) => { Promise.resolve(invoice_controller.invoice_list(req, res, next)) });

//GET one invoice
router.get('/invoices/:id', async (req, res, next) => {  Promise.resolve(invoice_controller.invoice_get(req, res, next)) });

//POST one invoice
router.post('/invoices', [
    check('id').not().equals(0).withMessage('id must be zero on insert'),
    check('invoiceDate').isISO8601().custom(value => { 
        let date = new Date(value);
        let now = new Date(Date.now());
        if (date.toDateString() == now.toDateString()) 
            return true;
        else
            return false;
    }).withMessage('invoice date must be today'),
    check('invoiceNumber').isInt({ min: 1 }).withMessage('invoice number must be greater than zero'),
    check('invoiceNet').isFloat({ min: 0.01, locale: 'en-US' }).withMessage('Net must be a valid greater than zero number'),
    check('invoiceTaxPercentage').isFloat().custom(value => {
        if (value == 0 || value == 10.5 || value == 21 || value == 27)
            return true;
        else
            return false;
    }).withMessage('valid tax percentages are: 0, 10.5, 21, 27'),
    check('invoiceTotal').isFloat({ min: 0.01, locale: 'en-US' }).withMessage('Net must be a valid greater than zero number'),
], async (req, res, next) => { Promise.resolve(invoice_controller.invoice_add(req, res, next)) });

//DELETE one invoice
router.delete('/invoices/:id', async (req, res, next) => {  Promise.resolve(invoice_controller.invoice_delete(req, res, next)) });

//POST search
router.post('/invoices/search', [
    check('invoiceNumber').optional().isInt({ min: 1 }).withMessage('invoice number must be a number'),
    check('beginDate').optional().isISO8601().withMessage('begin date must be empty or date'),
    check('endDate').optional().isISO8601().withMessage('end date must be empty or date'),
], async (req, res, next) => { Promise.resolve(invoice_controller.invoice_search(req, res, next)) });

//GET Weather
router.get('/weather/:lat/:long', async (req, res, next) => { Promise.resolve(weather_controller.weather_get(req, res, next)) });

module.exports = router;