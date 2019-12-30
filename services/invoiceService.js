class invoiceService {

    constructor() {
        this.invoices = [];

        // Sample invoice to have one
        this.invoices.push({
            id: 1,
            invoiceDate: new Date(Date.now()),
            invoiceNumber: 1,
            invoiceNet: 100,
            invoiceTaxPercentage: 0,
            invoiceTotal: 100
        });
    }

    async get(id) {
        return new Promise((resolve, reject) => {
            for (let i = 0; i < this.invoices.length; i++) {
                if (this.invoices[i].id == id) {
                    return resolve(this.invoices[i]);
                }
            }
            return resolve(null);
        });
    }

    async getAll() {
        return new Promise((resolve, reject) => {
            return resolve(this.invoices);
        });
    }

    async add(invoice) {
        return new Promise((resolve, reject) => {
            
            if (this._verify(invoice)) {
                // Get max id to auto-number and insert
                var id = 0;
                if (this.invoices.length > 0) {
                    id = this.invoices[this.invoices.length - 1].id;
                }
                invoice.id = id + 1;
                this.invoices.push(invoice);
                return resolve(invoice);
            }else{
                return reject(new Error(`The invoice already exists!`));
            }
        });
    }

    async delete(id) {
        return new Promise((resolve, reject) => {
            for (let i = 0; i < this.invoices.length; i++) {
                if (this.invoices[i].id == id) {
                    this.invoices.splice(i, 1);
                    return resolve(id);
                }
            }
            return resolve(null);
        });
    }

    async search(invoiceNumber, beginDate, endDate) {
        return new Promise((resolve, reject) => {
            return resolve(this.invoices.filter(i => {
                if (beginDate)
                    var bd = new Date(beginDate);
                if (endDate)
                    var ed = new Date(endDate);
                
                return (!invoiceNumber || (invoiceNumber && i.invoiceNumber.toString().startsWith(invoiceNumber.toString()))) 
                && 
                (
                    (
                        !bd || (new Date(i.invoiceDate) >= bd)
                    ) && 
                    (
                        !ed || (new Date(i.invoiceDate) <= ed)
                    )
                )
                }
            ));
        });
    }

    _verify(invoice) {
        for (let i = 0; i < this.invoices.length; i++) {
            if (this.invoices[i].invoiceNumber == invoice.invoiceNumber) {
                return false;
            }
        }

        return true;
    }
}

module.exports = new invoiceService();