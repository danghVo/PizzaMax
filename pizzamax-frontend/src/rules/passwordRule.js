import { validInput } from '~/utils';

const valid = (checkedData) =>
    validInput(
        !checkedData.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/),
        'Must have at least one capital letter and one number',
    );

export default { valid };
