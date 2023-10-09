import { validInput } from '~/utils';

const valid = (length) => (checkedData) => validInput(checkedData.length > length, `Max ${length} character`);

export default (length) => ({ valid: valid(length) });
