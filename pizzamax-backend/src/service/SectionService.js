const throwError = require('../utils/throwError');
const sectionServiceName = require('../utils/sectionServiceName');

const { Product } = require('../models');

const Service = require('./Service');

class SectionService extends Service {
    constructor(name, model, juncModel) {
        super(name, model, juncModel);
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

    static async getSection(type, name, product) {
        const sectionService = sectionServiceName(type);

        return await sectionService.find(
            { name },
            {
                include: {
                    model: Product,
                    through: {
                        model: sectionService.juncModel,
                        where: {
                            productId: product.getDataValue('id'),
                        },
                    },
                },
            },
        );
    }

    async addSection(sections, productId) {
        if (this.validSection(sections))
            sections.forEach(async (section) => {
                let selection = await this.find({ name: section.name });

                if (selection) {
                    if (section.price && section.price != selection.dataValues.price) {
                        await this.update({ name: selection.dataValues.name }, { price: section.price });
                    }

                    if (section.signature && selection.dataValues.signature != section.signature) {
                        await this.update(
                            { name: selection.dataValues.name },
                            { signature: section.signature || false },
                        );
                    }
                } else
                    selection = await this.model.create({
                        name: section.name,
                        price: section.price,
                        signature: section?.signature || false,
                    });

                const formSection = {
                    ...productId,
                    sectionId: selection.dataValues.id,
                    section: section.section || `Choose Your ${this.model.name}`,
                };

                await juncModel.create(formSection);
            });
    }

    async updateSection(sections, productId) {
        if (this.validSection(sections)) {
            await this.deleteSection(sections, productId);
            await this.addSection(sections, productId);
        }
    }

    async deleteSectionByName(sectionName, productId) {
        const isExist = await this.find({ section: sectionName, productId });
        if (isExist) await this.delete({ productId, section: sectionName });
    }

    async deleteRelation(filter) {
        await this.juncModel.destroy({ where: filter });
    }

    async deleteSection(sections, productId) {
        let sectionNames = sections.reduce(
            (prev, curr) => (curr.section && !prev.includes(curr.section) && [...prev, curr.section]) || [...prev],
            [],
        );

        sectionNames = sectionNames.length == 0 ? [`Choose Your ${this.model.name}`] : sectionNames;

        sectionNames.forEach(async (name) => {
            await this.deleteRelation({ ...productId, section: name });
        });
    }
}

module.exports = SectionService;
