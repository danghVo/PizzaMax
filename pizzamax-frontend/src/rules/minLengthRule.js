import { validInput } from '~/utils';

const valid = (length) => (checkedData) => validInput(checkedData.length < length, `Phải có ít nhất ${length} kí tự`);

export default (length) => ({ valid: valid(length) });
