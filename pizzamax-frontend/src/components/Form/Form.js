import { useEffect, useRef, useState } from 'react';

const emptyFunc = () => {};

function Form({ children, handlesubmit, handleError = emptyFunc, name, ...props }) {
    const formRef = useRef();

    useEffect(() => {
        const inputElements = formRef.current.querySelectorAll('input');

        Array.from(inputElements).forEach((inputElement) => {
            inputElement.nextSibling && inputElement.nextSibling.remove();
        });
    }, [name]);

    useEffect(() => {
        const submitElement = formRef.current.querySelector('[do="submit"]');

        const handlePressEnterToSubmit = (e) => e.key === 'Enter' && handleCheckForSubmit();

        const inputElements = formRef.current.querySelectorAll('input');
        Array.from(inputElements).forEach((inputElement) => {
            inputElement.addEventListener('keypress', handlePressEnterToSubmit);
        });

        const handleCheckForSubmit = () => {
            let valid = true;

            Array.from(inputElements).forEach((inputElement) => {
                if (
                    (inputElement.value === '' && inputElement.getAttribute('rule')) ||
                    inputElement.nextSibling ||
                    inputElement.value === '+84'
                ) {
                    valid = false;
                }
            });

            if (valid) {
                handlesubmit();
            } else {
                handleError();
            }
        };

        submitElement.addEventListener('click', handleCheckForSubmit);

        return () => {
            submitElement.removeEventListener('click', handleCheckForSubmit);

            Array.from(inputElements).forEach((inputElement) => {
                inputElement.removeEventListener('keypress', handlePressEnterToSubmit);
            });
        };
    });

    return (
        <div ref={formRef} {...props}>
            {children}
        </div>
    );
}

export default Form;
