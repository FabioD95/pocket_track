import { useCallback, useState } from 'react';
import useFetch from '../hooks/useFetch';
import {
  Categories,
  CategoriesSchema,
  GetCategory,
  GetCategorySchema,
  GetTag,
  GetTagSchema,
  GetTransaction,
  GetTransactionSchema,
  GetUsers,
  GetUsersSchema,
  Item,
  PostTransaction,
  Tags,
  TagsSchema,
  User,
} from '../types/apiSchemas';
import './NewTransaction.css';
import RadioSelector from '../components/RadioSelector';
import ListSelector from '../components/ListSelector';
import fetchData from '../utils/fetchData';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const transactionTypes = [
  { _id: 'expense', name: 'expense' },
  { _id: 'income', name: 'income' },
  { _id: 'transfer', name: 'transfer' },
];

export default function NewTransaction() {
  const navigate = useNavigate();

  const { user, defaultFamilyId }: { user: User; defaultFamilyId: string } =
    useSelector((state: RootState) => state.user);

  if (!defaultFamilyId) navigate('/');

  const { loading, error, fetchFn } = useFetch<GetTransaction>();

  const [isTransfer, setIsTransfer] = useState(false);
  const [isExpense, setIsExpense] = useState(true);
  const [selectedTags, setSelectedTags] = useState<Item[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Item>();
  const [date, setDate] = useState<string>(
    () => new Date().toISOString().split('T')[0]
  );

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);

    const formattedDate: string = new Date(
      formData.get('date') as string
    ).toISOString();

    const body: PostTransaction = {
      amount: Number(formData.get('amount')),
      date: formattedDate,
      isExpense,
      user: formData.get('user') as string,
      transferBeneficiary: formData.get('transferBeneficiary') as string,
      category: selectedCategories?._id as string,
      tags: selectedTags.map((tag) => tag._id),
      description: formData.get('description') as string,
      isNecessary: formData.get('isNecessary') === 'on',
      isTransfer,
    };

    fetchFn({
      method: 'post',
      route: `transactions`,
      schema: GetTransactionSchema,
      body: { transaction: body, familyId: defaultFamilyId },
    });

    (event.target as HTMLFormElement).reset();
    setSelectedCategories(undefined);
    setSelectedTags([]);
  }

  function handleTypeChange({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) {
    if (value === 'transfer') {
      setIsTransfer(true);
      setIsExpense(true);
    }
    if (value === 'expense') {
      setIsTransfer(false);
      setIsExpense(true);
    }
    if (value === 'income') {
      setIsTransfer(false);
      setIsExpense(false);
    }
  }

  const fetchUsers = useCallback(() => {
    return fetchData<GetUsers>({
      method: 'get',
      route: 'families/users',
      params: { familyId: defaultFamilyId },
      schema: GetUsersSchema,
    });
  }, [defaultFamilyId]);

  const fetchCategories = useCallback(() => {
    return fetchData<Categories>({
      method: 'get',
      route: 'categories',
      params: { familyId: defaultFamilyId },
      schema: CategoriesSchema,
    });
  }, [defaultFamilyId]);

  const createCategories = useCallback(
    async (name: string) => {
      const response = await fetchData<GetCategory>({
        method: 'post',
        route: 'categories',
        schema: GetCategorySchema,
        body: { name, familyId: defaultFamilyId },
      });
      return response.category;
    },
    [defaultFamilyId]
  );

  const fetchTags = useCallback(() => {
    return fetchData<Tags>({
      method: 'get',
      route: 'tags',
      params: { familyId: defaultFamilyId },
      schema: TagsSchema,
    });
  }, [defaultFamilyId]);

  const createTags = useCallback(
    async (name: string) => {
      const response = await fetchData<GetTag>({
        method: 'post',
        route: 'tags',
        schema: GetTagSchema,
        body: { name, familyId: defaultFamilyId },
      });
      return response.tag;
    },
    [defaultFamilyId]
  );

  return (
    <div className="new_transaction-container">
      <h1>New Transaction</h1>

      <form className="new_transaction-form" onSubmit={handleSubmit}>
        <input name="amount" type="number" placeholder="Amount" required />
        <input
          type="date"
          name="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <RadioSelector
          name="type"
          legend="Type"
          onChange={handleTypeChange}
          defaultValue={'expense'}
          items={transactionTypes}
        />

        <RadioSelector
          name="user"
          legend="User"
          fetchItems={fetchUsers}
          defaultValue={user._id}
        />

        {!isTransfer ? (
          <>
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

            <fieldset>
              <input name="isNecessary" id="isNecessary" type="checkbox" />
              <label htmlFor="isNecessary">isNecessary</label>
            </fieldset>
          </>
        ) : (
          <RadioSelector
            name="transferBeneficiary"
            legend="transferBeneficiary"
            fetchItems={fetchUsers}
          />
        )}

        <input name="description" type="text" placeholder="description" />

        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>

      <Link to="/">home</Link>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
    </div>
  );
}
