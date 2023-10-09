import { validInput } from '~/utils';

const valid = (checkedData) => validInput(!checkedData.match(/^\d*$/), 'Must be number');

export default { valid };
