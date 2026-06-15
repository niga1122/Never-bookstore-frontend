import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { booksAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { getCoverUrl } from '../utils/covers';

const Home = () => {
  const { user } = useAuth();
  const { addItem } = useCart();
  const [featured, setFeatured] = useState([]);
  const [genres, setGenres] = useState([]);
  const [addedId, setAddedId] = useState(null);

  useEffect(() => {
    booksAPI.getAll({ limit: 6 }).then(({ data }) => setFeatured(data.books)).catch(() => {});
    booksAPI.getGenres().then(({ data }) => setGenres(data.genres)).catch(() => {});
  }, []);

  const handleQuickAdd = (e, book, type) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user || !book.available) return;
    addItem(book, type);
    setAddedId(`${book._id}-${type}`);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Never Bookstore</h1>
          <p>Discover, rent, and purchase your favorite books</p>
          <div className="hero-actions">
            <Link to="/books" className="btn-primary">Browse Books</Link>
            {user && <Link to="/cart" className="btn-secondary">View Cart</Link>}
          </div>
        </div>
      </section>

      <section className="section featured-section">
        <div className="section-header">
          <h2>Featured Books</h2>
          <Link to="/books" className="section-link">View All &rarr;</Link>
        </div>
        <div className="book-grid">
          {featured.map((book) => (
            <div key={book._id} className="book-card-wrapper">
              <Link to={`/books/${book._id}`} className="book-card">
                <div className="book-card-cover">
                  <img src={getCoverUrl(book.title)} alt={book.title} loading="lazy" />
                </div>
                <div className="book-card-info">
                  <h3>{book.title}</h3>
                  <p>{book.author}</p>
                  <div className="book-card-prices">
                    <span className="price-tag">Buy: ${book.price.toFixed(2)}</span>
                    {book.rentalPrice > 0 && <span className="price-tag rent">Rent: ${book.rentalPrice.toFixed(2)}</span>}
                  </div>
                </div>
              </Link>
              {user && book.available && (
                <div className="book-card-actions">
                  <button onClick={(e) => handleQuickAdd(e, book, 'purchase')} className={`btn-cart ${addedId === `${book._id}-purchase` ? 'added' : ''}`}>
                    {addedId === `${book._id}-purchase` ? 'Added!' : 'Add to Cart'}
                  </button>
                  {book.rentalPrice > 0 && (
                    <button onClick={(e) => handleQuickAdd(e, book, 'rent')} className={`btn-cart rent ${addedId === `${book._id}-rent` ? 'added' : ''}`}>
                      {addedId === `${book._id}-rent` ? 'Added!' : 'Rent'}
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="section genres-section">
        <div className="section-header">
          <h2>Browse by Genre</h2>
        </div>
        <div className="genre-list">
          {genres.map((genre) => (
            <Link to={`/books?genre=${encodeURIComponent(genre)}`} key={genre} className="genre-tag">
              {genre}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
