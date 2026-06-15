import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { booksAPI, commentsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { getDetailCover } from '../utils/covers';

const BookDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [commentRating, setCommentRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [addedMsg, setAddedMsg] = useState('');

  useEffect(() => {
    setLoading(true);
    Promise.all([
      booksAPI.getOne(id),
      commentsAPI.getByBook(id),
    ])
      .then(([bookRes, commentRes]) => {
        setBook(bookRes.data.book);
        setComments(commentRes.data.comments);
      })
      .catch(() => navigate('/books'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleAddToCart = (type) => {
    if (!book?.available) return;
    addItem(book, type);
    setAddedMsg(type === 'rent' ? 'Added to cart for rent!' : 'Added to cart!');
    setTimeout(() => setAddedMsg(''), 2500);
  };

  const handleComment = async (e) => {
    e.preventDefault();
    try {
      const { data } = await commentsAPI.add(id, { text: commentText, rating: commentRating });
      setComments([data.comment, ...comments]);
      setCommentText('');
      setCommentRating(0);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await commentsAPI.delete(commentId);
      setComments(comments.filter((c) => c._id !== commentId));
    } catch (err) {
      alert('Failed to delete comment');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!book) return <div className="loading">Book not found</div>;

  return (
    <div className="book-detail-page">
      <div className="book-detail-main">
        <div className="book-detail-cover">
          <img src={getDetailCover(book.title)} alt={book.title} />
        </div>
        <div className="book-detail-info">
          <h1>{book.title}</h1>
          <p className="book-author">by {book.author}</p>
          <p className="book-genre-badge">{book.genre}</p>
          {book.rating > 0 && <p className="book-rating">&starf; {book.rating}/5</p>}
          <p className="book-isbn">ISBN: {book.isbn}</p>
          {book.publishedYear && <p>Published: {book.publishedYear}</p>}
          {book.pages && <p>Pages: {book.pages}</p>}
          <p className="book-description">{book.description}</p>
          <div className="book-pricing">
            <p>Purchase: <strong>${book.price.toFixed(2)}</strong></p>
            {book.rentalPrice > 0 && <p>Rent (14 days): <strong>${book.rentalPrice.toFixed(2)}</strong></p>}
          </div>
          <p className={`book-stock ${book.available ? 'in-stock' : 'out-of-stock'}`}>
            {book.available ? `In Stock (${book.quantity} available)` : 'Out of Stock'}
          </p>
          {user ? (
            <div className="book-actions">
              <button onClick={() => handleAddToCart('purchase')} className="btn-primary" disabled={!book.available}>
                Add to Cart - ${book.price.toFixed(2)}
              </button>
              {book.rentalPrice > 0 && (
                <button onClick={() => handleAddToCart('rent')} className="btn-secondary" disabled={!book.available}>
                  Rent - ${book.rentalPrice.toFixed(2)}
                </button>
              )}
            </div>
          ) : (
            <div className="book-actions">
              <Link to="/login" className="btn-primary">Login to Purchase</Link>
            </div>
          )}
          {addedMsg && <p className="added-msg">{addedMsg}</p>}
          {user && <p className="cart-hint"><Link to="/cart">Go to Cart</Link> to checkout</p>}
        </div>
      </div>

      <div className="comments-section">
        <h2>Comments & Discussion</h2>
        {user ? (
          <form onSubmit={handleComment} className="comment-form">
            <div className="rating-input">
              <span>Rating: </span>
              {[1, 2, 3, 4, 5].map((r) => (
                <button type="button" key={r} onClick={() => setCommentRating(r)} className={`star ${r <= commentRating ? 'active' : ''}`}>
                  {r <= commentRating ? '\u2605' : '\u2606'}
                </button>
              ))}
            </div>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Share your thoughts about this book..."
              required
              rows={3}
            />
            <button type="submit" className="btn-primary">Post Comment</button>
          </form>
        ) : (
          <p className="text-muted"><Link to="/login">Login</Link> to leave a comment</p>
        )}

        <div className="comments-list">
          {comments.length === 0 ? (
            <p className="text-muted">No comments yet. Be the first to discuss!</p>
          ) : (
            comments.map((comment) => (
              <div key={comment._id} className="comment-item">
                <div className="comment-header">
                  <strong>{comment.user?.name || 'Anonymous'}</strong>
                  {comment.rating > 0 && (
                    <span className="comment-rating">{'\u2605'.repeat(comment.rating)}{'\u2606'.repeat(5 - comment.rating)}</span>
                  )}
                  <span className="comment-date">{new Date(comment.createdAt).toLocaleDateString()}</span>
                </div>
                <p>{comment.text}</p>
                {(user?._id === comment.user?._id || user?.role === 'admin') && (
                  <button onClick={() => handleDeleteComment(comment._id)} className="btn-delete">Delete</button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
