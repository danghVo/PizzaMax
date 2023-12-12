import classNames from 'classnames/bind';

import styles from './DiscOption.module.scss';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import SubOption from './SubOption';

const cs = classNames.bind(styles);

function DiscOption({ handleSetPrice, discOptions }, ref) {
    const [selection, setSelection] = useState(null);
    const [warning, setWarnings] = useState(null);
    const [open, setOpen] = useState(null);

    useImperativeHandle(
        ref,
        () => ({
            getSelection: () => {
                if (checkSelection(warning, selection).length === 0) {
                    return selection;
                }
                return {};
            },
        }),
        [selection, warning],
    );

    useEffect(() => {
        if (discOptions) {
            setOpen(discOptions.map((item, index) => ({ isOpen: index === 0 })));
            setSelection(
                discOptions.reduce(
                    (accu, item) => ({
                        ...accu,
                        [item.name]: {
                            name: '',
                            type: item.type,
                            price: 0,
                            indexSelection: -1,
                        },
                    }),
                    {},
                ),
            );
            setWarnings(discOptions.map((item) => ({ isWarning: false, section: item.name })));
        }
    }, [discOptions]);

    useEffect(() => {
        if (selection) {
            handleSetPrice(
                Object.keys(selection).reduce((accu, section) => accu + parseInt(selection[section].price), 0),
            );
        }
    }, [selection]);

    const handleSelectOption = (section, index, name, indexSelection, price) => {
        setSelection((prev) => {
            prev[section].name = name;
            prev[section].indexSelection = indexSelection;
            prev[section].price = price;

            return { ...prev };
        });

        setOpen((prev) => {
            prev[index].isOpen = false;
            if (index !== open.length - 1) {
                prev[index + 1].isOpen = true;
            }

            return [...prev];
        });
    };

    const handleOpen = (index) => {
        setOpen((prev) => {
            prev[index].isOpen = !prev[index].isOpen;

            return [...prev];
        });
    };

    const checkSelection = (warning, selection) => {
        return warning.filter((item, index) => {
            if (selection[item.section].indexSelection === -1) {
                setWarnings((prev) => {
                    prev[index].isWarning = true;
                    return [...prev];
                });
                return true;
            } else return false;
        });
    };

    return (
        <div>
            {discOptions &&
                discOptions.map((item, index) => (
                    <SubOption
                        key={index}
                        data={item}
                        open={open && open[index].isOpen}
                        selection={selection && selection[item.name]}
                        isWarning={warning && warning[index].isWarning}
                        handleOpen={() => handleOpen(index)}
                        handleSelectOption={(...agru) => handleSelectOption(item.name, index, ...agru)}
                    />
                ))}
        </div>
    );
}

export default forwardRef(DiscOption);
