import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useTitle from '../../hooks/useTitle';
import CurrencyElement from '../../components/CurrencyElement';

const Welcome = () => {
  useTitle('shopper: Welcome');

  const { username, isManager, isAdmin } = useAuth();

  const date = new Date();
  const today = new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'long' }).format(
    date,
  );

  const content = (
    <section className="welcome public">
      <p>{today}</p>

      <h1 style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Link to="/home" replace>Welcome {username}!</Link>
        <span style={{ height: 5, position: 'relative', top: 12 }} ><CurrencyElement background='#fff' /></span>
      </h1>

      <p>
        <Link to="/dash/currencies">View Currencies</Link>
      </p>
      <p>
        <Link to="/dash/currencies/new">Add New Currency</Link>
      </p>
      <p>
        <Link to="/dash/orders">View Orders</Link>
      </p>
      <p>
        <Link to="/dash/orders/new">Add New Order</Link>
      </p>

      <p>
        <Link to="/dash/categories">View Categories</Link>
      </p>
      <p>
        <Link to="/dash/categories/new">Add New Category</Link>
      </p>

      <p>
        <Link to="/dash/products">View Products</Link>
      </p>

      <p>
        <Link to="/dash/products/new">Add New Product</Link>
      </p>

      {(isManager || isAdmin) && (
        <p>
          <Link to="/dash/users">View Users</Link>
        </p>
      )}

      {(isManager || isAdmin) && (
        <p>
          <Link to="/dash/users/new">Add New User</Link>
        </p>
      )}
    </section>
  );

  return content;
};
export default Welcome;
