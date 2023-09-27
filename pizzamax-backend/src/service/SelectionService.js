const { Detail, Selection } = require('../models');
const Service = require('./Service');

class SelectionService extends Service {
    constructor() {
        super('SelectionService', Selection);
    }

    async checkSelectionExist(detail, selectionName) {
        const selections = await detail.getSelections();
        let count = selectionName.length;
        selections.forEach((selection) => {
            if (selectionName.includes(selection.getDataValue('name'))) {
                count--;
            }
        });

        return count === 0 ? true : false;
    }
}

module.exports = new SelectionService();
