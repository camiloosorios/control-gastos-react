import { categories } from "../data/categories";
import DatePicker from "react-date-picker";
import "react-calendar/dist/Calendar.css";
import "react-date-picker/dist/DatePicker.css";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { DraftExpense, Value } from "../types";
import { useBudget } from "../hooks/useBudget";
import ErrorMessage from "./ErrorMessage";

export default function ExpenseForm() {

    const [expense, setExpense] = useState<DraftExpense>({
        amount: 0,
        expenseName : '',
        category : '',
        date : new Date()
    });
    const [previousAmount, setPreviousAmount] = useState(0);

    const { state, remainingBudget, dispatch } = useBudget();

    useEffect(() => {
        if (state.editingId) {
            const editingExpensive = state.expenses.filter(exp => exp.id === state.editingId)[0]
            setExpense(editingExpensive);
            setPreviousAmount(editingExpensive.amount);
            
        }
        
    }, [state.editingId]);

    const [error, setError] = useState('');

    const handleSubmit = (event : FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        if (Object.values(expense).includes('')) {
            setError('Todos los campos son obligatorios');
            return;
        }

        if ((expense.amount - previousAmount) > remainingBudget) {
            console.log(expense.amount);
            console.log(previousAmount);
            console.log(remainingBudget);
            
            setError('Ese gasto se sale del presupuesto');
            return;
        }        

        if (state.editingId) {
            dispatch({ type : 'update-expense', payload : { expense : {...expense, id: state.editingId} } });
        } else {            
            dispatch({ type : 'add-expense', payload : { expense } });
        }

        
    }

    const handleChangeDate = (value : Value) => {
        setExpense({
            ...expense, 
            date : value
        })
    }

    const handleChange = (event : ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        const isAmountField = ['amount'].includes(name);
        setExpense({
           ...expense,
            [name] : isAmountField ? +value : value
        });        
    }

  return (
    <form className="space-y-5" onSubmit={handleSubmit }>
        <legend
            className="uppercase text-center text-2xl font-black border-b-4 border-blue-500 py-2"
        >
            {state.editingId === '' ? 'Nuevo gasto' : 'Editar gasto'}
        </legend>
        {error && (<ErrorMessage>{error}</ErrorMessage>)}
        <div className="flex flex-col gap-2">
            <label 
                htmlFor="expenseName"
                className="text-xl"
            >
                Nombre Gasto:
            </label>
            <input 
                type="text" 
                id="expenseName"
                placeholder="Añade el Nombre del gasto"
                className="bg-slate-100 p-2"
                name="expenseName"
                value={expense.expenseName}
                onChange={handleChange}
            />
        </div>
        <div className="flex flex-col gap-2">
            <label 
                htmlFor="amount"
                className="text-xl"
            >
                Cantidad:
            </label>
            <input 
                type="number" 
                id="amount"
                placeholder="Añade la cantidad del gasto ej. 300"
                className="bg-slate-100 p-2"
                name="amount"
                value={expense.amount}
                onChange={handleChange}
            />
        </div>
        <div className="flex flex-col gap-2">
            <label 
                htmlFor="category"
                className="text-xl"
            >
                Categoria:
            </label>
            <select 
                id="category"
                className="bg-slate-100 p-2"
                name="category"
                value={expense.category}
                onChange={handleChange}
            >
                <option value="">-- Seleccione --</option>
                {categories.map(category => (
                    <option 
                        key={category.id}
                        value={category.id}
                    >
                        {category.name}
                    </option>
                ))}
            </select>
        </div>
        <div className="flex flex-col gap-2">
            <label 
                htmlFor="amount"
                className="text-xl"
            >
                Fecha gasto:
            </label>
            <DatePicker
                className="bg-slate-100 p-2 border-0"
                value={expense.date}
                onChange={handleChangeDate}
            />
        </div>
        <input 
            type="submit"
            className="bg-blue-600 cursor-pointer w-full p-2 text-white uppercase font-bold rounded-lg"
            value={state.editingId === '' ? 'Registrar gasto' : 'Modificar gasto'}
        />
    </form>
  )
}
