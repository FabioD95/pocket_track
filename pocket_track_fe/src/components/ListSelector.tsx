import { useState, useEffect, useRef, useMemo, memo, FC } from 'react';
import { Item } from '../types/apiSchemas';

interface ListSelectorProps {
  fetchItems: () => Promise<Item[]>;
  createItem: (name: string) => Promise<Item>;
  onItemsChange: (selectedItems: Item[]) => void;
  allowMultiple?: boolean;
  legend?: string;
  placeholder?: string;
}

const ListSelector: FC<ListSelectorProps> = memo(
  ({
    fetchItems,
    createItem,
    onItemsChange,
    allowMultiple = true,
    legend,
    placeholder = 'Aggiungi un elemento...',
  }) => {
    const [availableItems, setAvailableItems] = useState<Item[]>([]);
    const [selectedItems, setSelectedItems] = useState<Item[]>([]);
    const [inputValue, setInputValue] = useState<string>('');
    const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);

    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLUListElement>(null);

    // Fetch degli elementi disponibili
    useEffect(() => {
      const fetchData = async () => {
        const items = await fetchItems();
        setAvailableItems(items);
      };

      fetchData();
    }, [fetchItems]);

    // Chiusura dropdown quando si clicca fuori
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node) &&
          inputRef.current &&
          !inputRef.current.contains(event.target as Node)
        ) {
          setIsDropdownVisible(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    // Aggiunta di un elemento
    const addItem = (item: Item) => {
      if (!allowMultiple && selectedItems.length > 0) {
        setSelectedItems([item]);
        onItemsChange([item]);
      } else if (!selectedItems.some((i) => i._id === item._id)) {
        const updatedItems = [...selectedItems, item];
        setSelectedItems(updatedItems);
        onItemsChange(updatedItems);
      }
      setInputValue('');
      setIsDropdownVisible(false);
    };

    // Rimozione di un elemento
    const removeItem = (item: Item) => {
      const updatedItems = selectedItems.filter((i) => i._id !== item._id);
      setSelectedItems(updatedItems);
      onItemsChange(updatedItems);
    };

    // Creazione di un nuovo elemento
    const handleCreateNewItem = async () => {
      if (inputValue.trim() !== '') {
        try {
          const newItem = await createItem(inputValue.trim());
          setAvailableItems((prev) => [...prev, newItem]);
          addItem(newItem); // Seleziona l'elemento appena creato
          setInputValue('');
        } catch (error) {
          console.error('Errore nella creazione del nuovo elemento:', error);
        } finally {
          setIsDropdownVisible(false);
        }
      }
    };

    // Cambiamento del valore dell'input
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
      setIsDropdownVisible(true);
    };

    // Gestione della pressione del tasto "Enter"
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && inputValue.trim() !== '') {
        e.preventDefault();
        handleCreateNewItem();
      }
    };

    // Filtraggio degli elementi
    const filteredItems = useMemo(() => {
      return availableItems.filter(
        (item) =>
          item.name.toLowerCase().includes(inputValue.toLowerCase()) &&
          !selectedItems.some((i) => i._id === item._id)
      );
    }, [availableItems, inputValue, selectedItems]);

    return (
      <fieldset
        style={{
          // border: '1px solid #ccc',
          padding: '10px',
        }}
      >
        {legend && <legend>{legend}</legend>}
        <div
          style={{
            position: 'relative',
            width: '300px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '5px',
              // border: '1px solid #ccc',
              // padding: '5px',
              // borderRadius: '5px',
            }}
          >
            {selectedItems.map((item) => (
              <div
                key={item._id}
                className="list_selected_item"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  // backgroundColor: '#e0e0e0',
                  padding: '5px',
                  // borderRadius: '5px',
                  cursor: 'default',
                }}
              >
                {item.name}
                <span
                  onClick={() => removeItem(item)}
                  style={{
                    marginLeft: '5px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                  }}
                >
                  &times;
                </span>
              </div>
            ))}
            <input
              ref={inputRef}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsDropdownVisible(true)}
              style={{
                border: 'none',
                outline: 'none',
                flex: '1',
              }}
              placeholder={placeholder}
            />
            {inputValue && (
              <button
                type="button"
                onClick={handleCreateNewItem}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'blue',
                  cursor: 'pointer',
                  padding: '0 5px',
                }}
              >
                Aggiungi "{inputValue}"
              </button>
            )}
          </div>
          {isDropdownVisible && filteredItems.length > 0 && (
            <ul
              ref={dropdownRef}
              className="list_dropdown"
              style={{
                position: 'absolute',
                top: '100%',
                left: '0',
                right: '0',
                maxHeight: '150px',
                overflowY: 'auto',
                // border: '1px solid #ccc',
                // backgroundColor: 'white',
                listStyle: 'none',
                margin: '0',
                padding: '0',
                zIndex: 1000,
              }}
            >
              {filteredItems.map((item) => (
                <li
                  key={item._id}
                  onClick={() => addItem(item)}
                  style={{
                    // padding: '8px',
                    cursor: 'pointer',
                    // borderBottom: '1px solid #f0f0f0',
                  }}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  {item.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </fieldset>
    );
  }
);

export default ListSelector;
