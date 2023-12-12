import { validInput } from '~/utils';

const valid = (checkedData) =>
    validInput(!checkedData.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/), 'Ít nhất một kí tự số, in hoa, in thường');

export default { valid };
