import { useEffect, useRef, useState } from 'react';

function useValid(checkedData, rules) {
    const [valid, setValid] = useState(false);
    const [message, setMessage] = useState('');
    const firstRender = useRef(true);

    useEffect(() => {
        if (!firstRender.current) {
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
        } else firstRender.current = false;
    }, [checkedData]);

    return { valid, message };
}

export default useValid;
