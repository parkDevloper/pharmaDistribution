import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/income', label: 'Income' },
    { path: '/expense', label: 'Expense' },
    { path: '/incomesList', label: 'Income Lists' },
    { path: '/expensesList', label: 'Expense Lists' },
    // { path: '/add-partial-payment', label: 'partial payment entries'},
    { path: '/cheque-payments', label: 'ChequePayments' },
  ];

  return (
    <aside className="w-64 bg-white border-r p-4">
      <h2 className="text-xl font-bold text-blue-600 mb-6">Pharma Finance</h2>
      <nav className="space-y-2">
        {navItems.map(({ path, label }) => (
          <Link
            key={path}
            to={path}
            className={`block px-3 py-2 rounded-lg hover:bg-blue-100 ${
              location.pathname === path ? 'bg-blue-200 font-semibold' : ''
            }`}
          >
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
