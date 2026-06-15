import React, { useState, useEffect } from 'react';
import { booksAPI } from '../services/api';

const emptyBook = { title: '', author: '', isbn: '', description: '', genre: '', price: '', rentalPrice: '', quantity: 1, coverImage: '', publishedYear: '', pages: '' };

const AdminBooks = () => {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState(emptyBook);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');

  const fetchBooks = () => {
    booksAPI.getAll({ search, limit: 100 }).then(({ data }) => setBooks(data.books)).catch(() => {});
  };

  useEffect(() => { fetchBooks(); }, [search]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, price: Number(form.price), rentalPrice: Number(form.rentalPrice), quantity: Number(form.quantity), publishedYear: form.publishedYear ? Number(form.publishedYear) : undefined, pages: form.pages ? Number(form.pages) : undefined };

      if (editingId) {
        await booksAPI.update(editingId, payload);
      } else {
        await booksAPI.create(payload);
      }
      setForm(emptyBook);
      setEditingId(null);
      setShowForm(false);
      fetchBooks();
    } catch (err) {
      alert(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (book) => {
    setForm({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      description: book.description,
      genre: book.genre,
      price: book.price.toString(),
      rentalPrice: book.rentalPrice.toString(),
      quantity: book.quantity.toString(),
      coverImage: book.coverImage,
      publishedYear: book.publishedYear?.toString() || '',
      pages: book.pages?.toString() || '',
    });
    setEditingId(book._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this book?')) return;
    try {
      await booksAPI.delete(id);
      fetchBooks();
    } catch (err) {
      alert('Delete failed');
    }
  };

  return (
    <div className="admin-books-page">
      <div className="admin-header">
        <h1>Manage Books</h1>
        <button onClick={() => { setShowForm(!showForm); setEditingId(null); setForm(emptyBook); }} className="btn-primary">
          {showForm ? 'Cancel' : 'Add Book'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="admin-form">
          <h2>{editingId ? 'Edit Book' : 'Add New Book'}</h2>
          <div className="form-grid">
            <div className="form-group"><label>Title*</label><input name="title" value={form.title} onChange={handleChange} required /></div>
            <div className="form-group"><label>Author*</label><input name="author" value={form.author} onChange={handleChange} required /></div>
            <div className="form-group"><label>ISBN*</label><input name="isbn" value={form.isbn} onChange={handleChange} required /></div>
            <div className="form-group"><label>Genre*</label><input name="genre" value={form.genre} onChange={handleChange} required /></div>
            <div className="form-group"><label>Price*</label><input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} required /></div>
            <div className="form-group"><label>Rental Price</label><input name="rentalPrice" type="number" step="0.01" value={form.rentalPrice} onChange={handleChange} /></div>
            <div className="form-group"><label>Quantity</label><input name="quantity" type="number" value={form.quantity} onChange={handleChange} /></div>
            <div className="form-group"><label>Published Year</label><input name="publishedYear" type="number" value={form.publishedYear} onChange={handleChange} /></div>
            <div className="form-group"><label>Pages</label><input name="pages" type="number" value={form.pages} onChange={handleChange} /></div>
            <div className="form-group"><label>Cover Image URL</label><input name="coverImage" value={form.coverImage} onChange={handleChange} /></div>
          </div>
          <div className="form-group"><label>Description</label><textarea name="description" value={form.description} onChange={handleChange} rows={3} /></div>
          <button type="submit" className="btn-primary">{editingId ? 'Update' : 'Create'} Book</button>
        </form>
      )}

      <div className="search-bar">
        <input type="text" placeholder="Search books..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Genre</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book._id}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.genre}</td>
              <td>${book.price.toFixed(2)}</td>
              <td>{book.quantity}</td>
              <td className="actions-cell">
                <button onClick={() => handleEdit(book)} className="btn-edit">Edit</button>
                <button onClick={() => handleDelete(book._id)} className="btn-delete">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminBooks;
