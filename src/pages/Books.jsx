import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { booksAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { getCoverUrl } from '../utils/covers';

const Books = () => {
  const { user } = useAuth();
  const { addItem } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [genre, setGenre] = useState(searchParams.get('genre') || '');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [addedId, setAddedId] = useState(null);

  useEffect(() => {
    booksAPI.getGenres().then(({ data }) => setGenres(data.genres)).catch(() => {});
  }, []);

  useEffect(() => {
    const params = { page, limit: 12 };
    if (search) params.search = search;
    if (genre) params.genre = genre;
    booksAPI.getAll(params).then(({ data }) => {
      setBooks(data.books);
      setTotalPages(data.pages);
    }).catch(() => {});
  }, [page, search, genre]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    const params = {};
    if (search) params.search = search;
    if (genre) params.genre = genre;
    setSearchParams(params);
  };

  const handleAddToCart = (e, book, type) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user || !book.available) return;
    addItem(book, type);
    setAddedId(`${book._id}-${type}`);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <div className="books-page">
      <div className="books-header">
        <h1>Books</h1>
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search by title, author, or ISBN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={genre} onChange={(e) => { setGenre(e.target.value); setPage(1); }}>
            <option value="">All Genres</option>
            {genres.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
          <button type="submit" className="btn-primary">Search</button>
        </form>
      </div>

      <div className="book-grid">
        {books.map((book) => (
          <div key={book._id} className="book-card-wrapper">
            <Link to={`/books/${book._id}`} className="book-card">
              <div className="book-card-cover">
                <img src={getCoverUrl(book.title)} alt={book.title} loading="lazy" />
              </div>
              <div className="book-card-info">
                <h3>{book.title}</h3>
                <p>{book.author}</p>
                <p className="book-genre">{book.genre}</p>
                <div className="book-card-prices">
                  <span className="price-tag">Buy: ${book.price.toFixed(2)}</span>
                  {book.rentalPrice > 0 && <span className="price-tag rent">Rent: ${book.rentalPrice.toFixed(2)}</span>}
                </div>
                <div className="book-card-footer">
                  {!book.available && <span className="out-of-stock">Out of stock</span>}
                </div>
              </div>
            </Link>
            {user && book.available && (
              <div className="book-card-actions">
                <button onClick={(e) => handleAddToCart(e, book, 'purchase')} className={`btn-cart ${addedId === `${book._id}-purchase` ? 'added' : ''}`}>
                  {addedId === `${book._id}-purchase` ? 'Added!' : 'Add to Cart'}
                </button>
                {book.rentalPrice > 0 && (
                  <button onClick={(e) => handleAddToCart(e, book, 'rent')} className={`btn-cart rent ${addedId === `${book._id}-rent` ? 'added' : ''}`}>
                    {addedId === `${book._id}-rent` ? 'Added!' : 'Rent'}
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {books.length === 0 && <p className="text-muted text-center">No books found</p>}

      {totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={p === page ? 'active' : ''}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Books;
