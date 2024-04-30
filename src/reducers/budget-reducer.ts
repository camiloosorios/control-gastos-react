import { v4 as uuidv4 } from 'uuid';
import { Category, DraftExpense, Expense } from "../types"

export type BudgetActions =
    { type : 'add-budget', payload : { budget : number } } |
    { type : 'show-modal' } |
    { type : 'close-modal' } |
    { type : 'add-expense', payload : { expense : DraftExpense } } |
    { type : 'remove-expense', payload : { id : Expense['id'] } } |
    { type : 'get-expense-by-id', payload : { id : Expense['id'] } } |
    { type : 'update-expense', payload : { expense : Expense } } |
    { type : 'reset-app' } |
    { type : 'add-filter-category', payload : { id : Category['id'] } }

export type BudgetState = {
    budget : number
    modal : boolean
    expenses : Expense[]
    editingId : Expense['id']
    currentCategory : Category['id']
}

const budgetInitialState = localStorage.getItem('budget') || 0;
const expensesInitialState = () => {
    const localstorageExpenses = localStorage.getItem('expenses');
    return localstorageExpenses ? JSON.parse(localstorageExpenses) : [];
};

export const initialState : BudgetState = {
    budget : +budgetInitialState,
    modal : false,
    expenses : expensesInitialState(),
    editingId : '',
    currentCategory : ''
}

const createExpense = (draftExpense : DraftExpense) : Expense => {
    return {
        ...draftExpense,
        id : uuidv4()
    }

}

export const budgetState = (state : BudgetState = initialState, action : BudgetActions) => {
    if (action.type === 'add-budget') {
        return {
            ...state,
            budget : action.payload.budget
        }
    }

    if (action.type === 'show-modal') {
        return {
           ...state,
            modal : true
        }
    }

    if (action.type === 'close-modal') {
        return {
           ...state,
            modal : false,
            editingId : ''
        }
    }

    if (action.type === 'add-expense') {
        const expense : Expense = createExpense(action.payload.expense);
        return {
           ...state,
            expenses : [...state.expenses, expense],
            modal : false
        }
    }

    if (action.type === 'remove-expense') {
        return {
            ...state,
            expenses : state.expenses.filter(expense => expense.id!== action.payload.id)
        }
    }

    if (action.type === 'get-expense-by-id') {
        return {
           ...state,
            editingId : action.payload.id,
            modal : true
        }
    } if (action.type === 'update-expense') {
        const updatedExpenses = state.expenses.map( expense => {
            if (expense.id === action.payload.expense.id) {
                return action.payload.expense;
            }
            return expense;
        })
        return {
            ...state,
            expenses: updatedExpenses,
            modal : false,
            editingId : ''
        }
    }
    if (action.type === 'reset-app'){
        localStorage.clear();
        return initialState
    }

    if (action.type === 'add-filter-category') {
        return {
           ...state,
            currentCategory : action.payload.id
        }
    }

    return state;
}