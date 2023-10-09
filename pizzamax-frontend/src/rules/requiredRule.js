import { validInput } from '~/utils';

const valid = (checkedData) => validInput(checkedData === '', 'This information must be provided');

export default { valid };
