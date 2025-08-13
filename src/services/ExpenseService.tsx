import Request from '../config/apiConfig';

const GetAllExpenses = async ({
  id,
  page,
  limit,
  search,
  month,
  year,
}: {
  id: string;
  page: number;
  limit: number;
  search: string;
  month: string;
  year: string;
}) =>
  Request({
    url: `expense/${id}?page=${page}&limit=${limit}&search=${search}&month=${month}&year=${year}`,
    method: 'GET',
    secure: true,
  });
const CreateExpense = async (payload: {
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  date: string;
  description: string;
  expenses: Array<{
    name: string;
    price: string;
    category: string;
  }>;
  totalAmount: number;
  files: Array<File>;
}) =>
  Request({
    url: `expense/submit-expense`,
    method: 'POST',
    secure: true,
    files: true,
    data: payload,
  });

const ExpenseService = {
  GetAllExpenses,
  CreateExpense,
};

export default ExpenseService;
