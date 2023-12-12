import { validInput } from '~/utils';

const valid = (checkedData) => validInput(checkedData === '', 'Không được để trống');

export default { valid };
