import { validInput } from '~/utils';

const valid = (value) => (checkedData) => validInput(checkedData > value, `Không được lớn hơn ${value}`);

export default (value) => ({ valid: valid(value) });
