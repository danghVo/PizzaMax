import { validInput } from '~/utils';

const valid = (length) => (checkedData) =>
    validInput(checkedData.length < length, `Must have at least ${length} character`);

export default (length) => ({ valid: valid(length) });
