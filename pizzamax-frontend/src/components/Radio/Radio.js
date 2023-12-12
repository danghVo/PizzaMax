import classNames from 'classnames/bind';

import styles from './Radio.module.scss';

const cs = classNames.bind(styles);

function Radio({ className, name, title, selections, selected, handleSelected }) {
    return (
        <div className={[cs('wrapper'), className].join(' ')}>
            <div className={cs('title')}>{title}? </div>
            {selections.map((selection, index) => (
                <div key={index} className={cs('selection-wrapper')}>
                    <label htmlFor={`${name}-${selection.label}`} className={cs('selection-label')}>
                        {selection.label}
                    </label>
                    <input
                        type="radio"
                        className={cs('selection-value')}
                        onChange={(e) => handleSelected(parseInt(e.target.value))}
                        id={`${name}-${selection.label}`}
                        name={name}
                        value={selection.value}
                        checked={selected === !!parseInt(selection.value)}
                    />
                </div>
            ))}
        </div>
    );
}

export default Radio;
