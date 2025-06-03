import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import ChequePayments from './components/ChequePayments';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Expense from './pages/Expense';
import ExpenseList from './pages/ExpenseList';
import Income from './pages/Income';
import IncomeList from './pages/IncomeList';
import PartialPaymentForm from './pages/partial/PartialPaymentForm';
import Reports from './pages/Reports';

function App() {
  return (
    <Router>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-grow p-4 bg-gray-50">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/income" element={<Income />} />
            <Route path="/expense" element={<Expense />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/add-partial-payment" element={<PartialPaymentForm />} />
            <Route path="/expensesList" element={<ExpenseList />} />
            <Route path="/incomesList" element={<IncomeList />} />
            <Route path="/cheque-payments" element={<ChequePayments />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
