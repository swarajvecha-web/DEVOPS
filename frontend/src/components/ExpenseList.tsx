import { useState } from 'react';
import { format } from 'date-fns';
import { Edit, Trash2, CheckSquare, Square, Tag, Calendar, DollarSign } from 'lucide-react';
import { expenseAPI } from '../services/api';
import { useExpenseStore } from '../store/expenseStore';
import { useCurrencyStore } from '../store/currencyStore';
import type { Expense } from '../types';
import toast from 'react-hot-toast';

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (id: number) => void;
}

const ExpenseList = ({ expenses, onEdit }: ExpenseListProps) => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const { removeExpense, removeMultipleExpenses } = useExpenseStore();
  const { formatAmount } = useCurrencyStore();

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this expense?')) return;

    try {
      await expenseAPI.deleteExpense(id);
      removeExpense(id);
      toast.success('Expense deleted successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to delete expense');
    }
  };

  const handleDeleteMultiple = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} expense(s)?`)) return;

    try {
      await expenseAPI.deleteMultipleExpenses(selectedIds);
      removeMultipleExpenses(selectedIds);
      setSelectedIds([]);
      toast.success('Expenses deleted successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to delete expenses');
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === expenses.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(expenses.map((e) => e.id));
    }
  };

  if (expenses.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 rounded-2xl mb-4">
          <Tag className="w-10 h-10 text-indigo-500 dark:text-indigo-400" />
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
          No expenses yet. Add your first expense to get started!
        </p>
        <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
          Click "Add Expense" to begin tracking
        </p>
      </div>
    );
  }

  return (
    <div>
      {selectedIds.length > 0 && (
        <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl border-2 border-red-200 dark:border-red-800 flex items-center justify-between shadow-lg">
          <span className="text-red-700 dark:text-red-300 font-bold flex items-center gap-2">
            <CheckSquare className="w-5 h-5" />
            {selectedIds.length} expense(s) selected
          </span>
          <button
            onClick={handleDeleteMultiple}
            className="px-5 py-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-semibold"
          >
            Delete Selected
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
              <th className="text-left py-4 px-4">
                <button
                  onClick={toggleSelectAll}
                  className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                >
                  {selectedIds.length === expenses.length ? (
                    <CheckSquare className="w-6 h-6" />
                  ) : (
                    <Square className="w-6 h-6" />
                  )}
                </button>
              </th>
              <th className="text-left py-4 px-4 text-sm font-bold text-gray-700 dark:text-gray-300">
                Category
              </th>
              <th className="text-left py-4 px-4 text-sm font-bold text-gray-700 dark:text-gray-300">
                Amount
              </th>
              <th className="text-left py-4 px-4 text-sm font-bold text-gray-700 dark:text-gray-300">
                Type
              </th>
              <th className="text-left py-4 px-4 text-sm font-bold text-gray-700 dark:text-gray-300">
                Date
              </th>
              <th className="text-right py-4 px-4 text-sm font-bold text-gray-700 dark:text-gray-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense, index) => (
              <tr
                key={expense.id}
                className={`border-b border-gray-100 dark:border-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-900/20 dark:hover:to-purple-900/20 transition-all duration-200 ${
                  index % 2 === 0 ? 'bg-white/50 dark:bg-gray-800/50' : 'bg-gray-50/50 dark:bg-gray-800/30'
                }`}
              >
                <td className="py-4 px-4">
                  <button
                    onClick={() => toggleSelect(expense.id)}
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                  >
                    {selectedIds.includes(expense.id) ? (
                      <CheckSquare className="w-5 h-5" />
                    ) : (
                      <Square className="w-5 h-5" />
                    )}
                  </button>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-lg flex items-center justify-center">
                      <Tag className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {expense.category}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className={`w-5 h-5 ${expense.amount_type === 'credit' ? 'text-green-500' : 'text-red-500'}`} />
                    <span className={`font-bold text-lg ${expense.amount_type === 'credit' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {formatAmount(expense.amount)}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                      expense.amount_type === 'credit'
                        ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg'
                        : 'bg-gradient-to-r from-red-400 to-pink-500 text-white shadow-lg'
                    }`}
                  >
                    {expense.amount_type === 'credit' ? 'Income' : 'Expense'}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span className="font-medium">
                      {expense.date ? format(new Date(expense.date), 'MMM dd, yyyy') : 'N/A'}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(expense.id)}
                      className="p-2 text-indigo-600 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 rounded-lg transition-all duration-200 hover:scale-110"
                      title="Edit"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(expense.id)}
                      className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-all duration-200 hover:scale-110"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpenseList;
