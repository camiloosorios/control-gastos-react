import { useMemo } from "react";
import { useBudget } from "../hooks/useBudget"
import ExpenseDetail from "./ExpenseDetail";

export default function ExpenseList() {

    const { state } = useBudget();
    const isEmpty = useMemo(() => state.expenses.length === 0, [state.expenses]);
    const filteredExpenses = state.currentCategory ? state.expenses.filter(expense => expense.category === state.currentCategory) : state.expenses;

  return (
    <div className="mt-10 shadow-lg rounded-lg bg-white p-10">
        { isEmpty ? <p className="text-gray-600 text-2xl font-bold">No hay Gastos</p> : (
            <>
                <p className="text-2xl font-bold text-gray-600 my-5">Listado de gastos</p>
                {filteredExpenses.map(expense => (
                    <ExpenseDetail
                        key={expense.id}
                        expense={expense}
                    />
                ))}
            </>
        )}
    </div>
  )
}
