const { Product, Type, Crust, Size, Flavor, ProductCrust, ProductFlavor, ProductSize } = require('../models');

const Service = require('./Service');
const throwError = require('../Helper/throwError');

class ServiceService extends Service {
    constructor() {
        super('ServiceService');
    }

    validSection(sections) {
        if (sections) {
            if (sections.length == 0) {
                throwError(400, 'Section is provided but get null array');
            }

            sections.forEach((item) => {
                item.name || throwError(400, 'Wrong section form');
            });

            return true;
        }

        return false;
    }

    async addSection(model, juncModel, sections, productId) {
        if (this.validSection(sections))
            sections.forEach(async (section) => {
                let selection = await this.find(model, { name: section.name });

                if (selection) {
                    if (section.price && section.price != selection.dataValues.price) {
                        await this.update(model, { name: selection.dataValues.name }, { price: section.price });
                    }

                    if (section.signature && selection.dataValues.signature != section.signature) {
                        await this.update(
                            model,
                            { name: selection.dataValues.name },
                            { signature: section.signature || false },
                        );
                    }
                } else
                    selection = await model.create({
                        name: section.name,
                        price: section.price,
                        signature: section?.signature || false,
                    });

                const formSection = {
                    ...productId,
                    sectionId: selection.dataValues.id,
                    section: section.section || `Choose Your ${model.name}`,
                };

                await juncModel.create(formSection);
            });
    }

    async updateSection(model, juncModel, sections, productId) {
        if (this.validSection(sections)) {
            await this.deleteSection(model, juncModel, sections, productId);
            await this.addSection(model, juncModel, sections, productId);
        }
    }

    async deleteSectionByName(sectionName, productId, model) {
        const isExist = await this.find(model, { section: sectionName, productId });
        if (isExist) await this.delete(model, { productId, section: sectionName });
    }

    async deleteSection(model, juncModel, sections, productId) {
        let sectionNames = sections.reduce(
            (prev, curr) => (curr.section && !prev.includes(curr.section) && [...prev, curr.section]) || [...prev],
            [],
        );

        sectionNames = sectionNames.length == 0 ? [`Choose Your ${model.name}`] : sectionNames;

        sectionNames.forEach(async (name) => {
            await this.delete(juncModel, { ...productId, section: name });
        });
    }
}

module.exports = new ServiceService();
