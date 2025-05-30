import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="min-h-screen p-6 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-6">Welcome to AutoLux!</h1>
      <p className="text-lg mb-4 text-center max-w-md">
        Browse quality automobile accessories curated just for you.
      </p>
      <Link
        to="/ProductCards"
        className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition"
      >
        Shop Products
      </Link>
    </div>
  );
};

export default HomePage;