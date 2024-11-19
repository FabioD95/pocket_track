import React, { ChangeEventHandler, useEffect, useState } from 'react';
import { Item } from '../types/apiSchemas';

interface BaseRadioSelectorProps {
  name: string;
  legend: string;
  handleChange?: ChangeEventHandler<HTMLInputElement>;
}

interface ItemsProps extends BaseRadioSelectorProps {
  items: Item[];
  defaultValue?: string;
  fetchItems?: never; // Non consentito
}

interface FetchItemsProps extends BaseRadioSelectorProps {
  fetchItems: () => Promise<Item[]>;
  items?: never; // Non consentito
  defaultValue?: never; // Non consentito
}

type RadioSelectorProps = ItemsProps | FetchItemsProps;

const RadioSelector: React.FC<RadioSelectorProps> = ({
  name,
  legend,
  handleChange,
  defaultValue,
  items,
  fetchItems,
}) => {
  const [availableItems, setAvailableItems] = useState<Item[]>([]);

  useEffect(() => {
    if (items) {
      setAvailableItems(items);
      return;
    }
    const fetchData = async () => {
      const items = await fetchItems();
      setAvailableItems(items);
    };

    fetchData();
  }, [fetchItems, items]);

  return (
    <fieldset>
      <legend>{legend}</legend>
      {availableItems.map((item) => (
        <React.Fragment key={item._id}>
          <input
            name={name}
            type="radio"
            id={item._id}
            value={item._id}
            onChange={handleChange}
            defaultChecked={item._id === defaultValue}
          />
          <label htmlFor={item._id}>{item.name}</label>
        </React.Fragment>
      ))}
    </fieldset>
  );
};

export default React.memo(RadioSelector);
