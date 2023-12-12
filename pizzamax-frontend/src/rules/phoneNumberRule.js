import { validInput } from '~/utils';

const valid = (checkedData) => validInput(!checkedData.match(/^(9||8||3||5||7)\d{8,9}$/), 'Số điện thoại không hợp lệ');

export default { valid };
