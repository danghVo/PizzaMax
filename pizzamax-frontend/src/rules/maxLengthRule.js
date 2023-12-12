import { validInput } from '~/utils';

const valid = (length) => (checkedData) => validInput(checkedData.length > length, `Tối đa ${length} ký tự`);

export default (length) => ({ valid: valid(length) });
