import React, { ChangeEventHandler } from 'react';

interface RadioSelectorProps {
  name: string;
  legend: string;
  handleChange?: ChangeEventHandler<HTMLInputElement>;
  items: string[];
}

const RadioSelector: React.FC<RadioSelectorProps> = ({
  name,
  legend,
  handleChange,
  items,
}) => {
  return (
    <fieldset>
      <legend>{legend}</legend>
      {items.map((type) => (
        <React.Fragment key={type}>
          <input
            name={name}
            type="radio"
            id={type}
            value={type}
            onChange={handleChange}
          />
          <label htmlFor={type}>{type}</label>
        </React.Fragment>
      ))}
    </fieldset>
  );
};

export default React.memo(RadioSelector);
