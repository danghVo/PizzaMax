import { validInput } from '~/utils';

const dayName = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const valid = (fromDay) => (checkedData) =>
    validInput(dayName.indexOf(checkedData) < dayName.indexOf(fromDay), `Ngày kết thúc bán phải lớn hơn ngày bắt đầu`);

export default (fromDay) => ({ valid: valid(fromDay) });
