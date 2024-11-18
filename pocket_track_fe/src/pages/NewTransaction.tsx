import './NewTransaction.css';

export default function NewTransaction() {
  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    // const formData = new FormData(event.target as HTMLFormElement);
    (event.target as HTMLFormElement).reset();
  }

  function handleAmountBlur({
    target: { value },
  }: React.FocusEvent<HTMLInputElement>) {
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue) && numericValue < 0) {
      console.log('is a number');
    }
  }
  return (
    <div className="new-transaction-container">
      <h1>New Transaction</h1>
      <form className="new-transaction-form" onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="Amount"
          required
          onBlur={handleAmountBlur}
        />
        <input type="date" required />

        <input type="radio" name="type" checked />
        <label>Expense</label>
        <input type="radio" name="type" />
        <label>Income</label>
        <input type="radio" name="type" />
        <label>Transfer</label>

        <input type="checkbox" />
        <label>isNecessary</label>

        <select id="cars" name="cars">
          <option value="volvo">Volvo</option>
          <option value="saab">Saab</option>
        </select>
        <label>category</label>

        <label>executedBy</label>
        <input type="radio" name="executedBy" checked />
        <label>Fabio</label>
        <input type="radio" name="executedBy" />
        <label>Cloe</label>

        <label>beneficiary</label>
        <input type="radio" name="beneficiary" checked />
        <label>Fabio</label>
        <input type="radio" name="beneficiary" />
        <label>Cloe</label>

        <input type="text" placeholder="description" />

        <button>submit</button>
      </form>
    </div>
  );
}
