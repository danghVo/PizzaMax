import { useEffect, useRef, useState } from 'react';

function useValid(checkedData, rules) {
    const [valid, setValid] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        let violate = false;

        rules.forEach((rule) => {
            const checkResult = rule.valid(checkedData);
            if (!checkResult.isValid && !violate) {
                setMessage(checkResult.message);
                setValid(false);
                violate = true;
            }
        });

        if (!violate) {
            setMessage('');
            setValid(true);
        }
    }, [checkedData]);

    return { valid, message };
}

export default useValid;
