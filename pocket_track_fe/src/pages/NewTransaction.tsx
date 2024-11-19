import { useCallback, useState } from 'react';
import useFetch from '../hooks/useFetch';
import {
  Categories,
  CategoriesSchema,
  GetCategory,
  GetCategorySchema,
  GetTag,
  GetTagSchema,
  PostTransaction,
  Tags,
  TagsSchema,
} from '../types/apiSchemas';
import './NewTransaction.css';
import RadioSelector from '../components/RadioSelector';
import ListSelector, { Item } from '../components/ListSelector';
import fetchData from '../utils/fetchData';

export default function NewTransaction() {
  const { loading: submitLoading, error: submitError } =
    useFetch<PostTransaction>();

  const [transfer, setTransfer] = useState(false);
  const [isValidate, setIsValidate] = useState(false);
  const [selectedTags, setSelectedTags] = useState<Item[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Item>();
  const [date, setDate] = useState<string>(
    () => new Date().toISOString().split('T')[0]
  );

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);

    if (!isValidate) {
      console.log('invalid amount');
      return;
    }

    const formattedDate: string = new Date(
      formData.get('date') as string
    ).toISOString();

    const body: PostTransaction = {
      amount: Number(formData.get('amount')),
      date: formattedDate,
      type: formData.get('type') as 'expense' | 'income' | 'transfer',
      executedBy: formData.get('executedBy') as string,
      beneficiary: formData.get('beneficiary') as string,
      category: selectedCategories?._id as string,
      tags: selectedTags.map((tag) => tag._id),
      description: formData.get('description') as string,
      isNecessary: formData.get('isNecessary') === 'on',
    };
    //  ?? (undefined as string | undefined)
    alert(JSON.stringify(body, null, 2));

    // fetchFn({
    //   method: 'post',
    //   route: `transactions`,
    //   schema: TransactionSchema,
    //   body: body,
    // });

    // (event.target as HTMLFormElement).reset();
  }

  function handleTypeChange({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) {
    if (value === 'transfer') {
      setTransfer(true);
    } else {
      setTransfer(false);
    }
  }

  function handleAmountBlur({
    target: { value },
  }: React.FocusEvent<HTMLInputElement>) {
    const numericValue = parseFloat(value);
    if (numericValue > 0) {
      setIsValidate(true);
    } else {
      setIsValidate(false);
    }
  }

  const fetchCategories = useCallback(() => {
    return fetchData<Categories>({
      method: 'get',
      route: 'categories',
      schema: CategoriesSchema,
    });
  }, []);

  const createCategories = useCallback(async (name: string) => {
    const response = await fetchData<GetCategory>({
      method: 'post',
      route: 'categories',
      schema: GetCategorySchema,
      body: { name },
    });
    return response.category;
  }, []);

  const fetchTags = useCallback(() => {
    return fetchData<Tags>({
      method: 'get',
      route: 'tags',
      schema: TagsSchema,
    });
  }, []);

  const createTags = useCallback(async (name: string) => {
    const response = await fetchData<GetTag>({
      method: 'post',
      route: 'tags',
      schema: GetTagSchema,
      body: { name },
    });
    return response.tag;
  }, []);

  return (
    <div className="new-transaction-container">
      <h1>New Transaction</h1>

      <form className="new-transaction-form" onSubmit={handleSubmit}>
        <input
          name="amount"
          type="number"
          placeholder="Amount"
          required
          onBlur={handleAmountBlur}
        />
        <input
          type="date"
          name="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <RadioSelector
          name="type"
          legend="Type"
          handleChange={handleTypeChange}
          defaultValue={'expense'}
          items={['expense', 'income', 'transfer']}
        />

        {!transfer ? (
          <>
            <RadioSelector
              name="executedBy"
              legend="Executed By"
              items={['Fabio', 'Cloe']}
            />

            <ListSelector
              fetchItems={fetchCategories}
              createItem={createCategories}
              onItemsChange={(categories) =>
                setSelectedCategories(categories[0])
              }
              allowMultiple={false}
              legend="Category"
              placeholder="Select a category..."
            />

            <ListSelector
              fetchItems={fetchTags}
              createItem={createTags}
              onItemsChange={(tags) => setSelectedTags(tags)}
              legend="Tags"
              placeholder="Select a tag..."
            />

            <input name="description" type="text" placeholder="description" />

            <div>
              <input name="isNecessary" id="isNecessary" type="checkbox" />
              <label htmlFor="isNecessary">isNecessary</label>
            </div>
          </>
        ) : (
          <>
            <label>beneficiary</label>
            <input type="radio" name="beneficiary" checked />
            <label>Fabio</label>
            <input type="radio" name="beneficiary" />
            <label>Cloe</label>
          </>
        )}

        <button type="submit" disabled={submitLoading}>
          {submitLoading ? 'Submitting...' : 'Submit'}
        </button>
      </form>

      {submitLoading && <p>Loading...</p>}
      {submitError && <p>{submitError}</p>}
    </div>
  );
}
