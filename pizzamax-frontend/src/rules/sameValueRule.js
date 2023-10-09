import { validInput } from '~/utils';

const valid = (sameValue) => (checkedData) => validInput(checkedData !== sameValue, `Must the same value`);

export default (sameValue) => ({ valid: valid(sameValue) });
