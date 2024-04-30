import { Dispatch, ReactNode, createContext, useMemo, useReducer } from "react"
import { BudgetActions, BudgetState, budgetState, initialState } from "../reducers/budget-reducer";

type BudgetContextProps = {
    state : BudgetState,
    totalExpenses : number,
    remainingBudget : number,
    dispatch : Dispatch<BudgetActions>
}

type BudgetProviderProps = {
    children : ReactNode
}

export const BudgetContext = createContext<BudgetContextProps>(null!);

export const BudgetProvider = ({ children } : BudgetProviderProps) => {

    const [state, dispatch] = useReducer(budgetState, initialState);
    const totalExpenses = useMemo(() => state.expenses.reduce((total, expense) => total + expense.amount, 0), [state.expenses, state.budget])
    const remainingBudget = useMemo( () => state.budget - totalExpenses, [state.expenses, state.budget]);

    return (
        <BudgetContext.Provider
            value={{
                state,
                totalExpenses,
                remainingBudget,
                dispatch
            }}
        >
            {children}
        </BudgetContext.Provider>
    )
}