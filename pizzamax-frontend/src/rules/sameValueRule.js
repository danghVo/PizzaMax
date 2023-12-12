import { validInput } from '~/utils';

const valid = (sameValue, message) => (checkedData) => validInput(checkedData !== sameValue, message);

export default (...passValue) => ({ valid: valid(...passValue) });
