"use client";

import React, { useEffect, useMemo, useState } from "react";

const cities = [
  "Ahmedabad",
  "Surat",
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Chennai",
  "Kolkata",
  "Jaipur",
  "Pune",
  "Hyderabad",
];

const hobbyOptions = ["dance", "music"];

const emptyUser = {
  username: "",
  email: "",
  password: "",
  phone: "",
  gender: "",
  city: "",
  hobby: [],
};

export default function Page() {
  const [user, setUser] = useState(emptyUser);
  const [list, setList] = useState([]);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState({});
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("ascending");
  const [page, setPage] = useState(1);
  const limit = 5;

  const filteredData = useMemo(() => {
    const query = search.trim().toLowerCase();
    const data = query
      ? list.filter((item) => item.username?.toLowerCase().includes(query))
      : list;

    return [...data].sort((a, b) => {
      const first = a.username || "";
      const second = b.username || "";
      return sortOrder === "ascending"
        ? first.localeCompare(second)
        : second.localeCompare(first);
    });
  }, [list, search, sortOrder]);

  const totalPage = Math.max(1, Math.ceil(filteredData.length / limit));
  const firstIndex = (page - 1) * limit;
  const currentData = filteredData.slice(firstIndex, firstIndex + limit);
  const totalHobbies = new Set(list.flatMap((item) => item.hobby || [])).size;

  const handleChange = (event) => {
    const { name, value, checked } = event.target;

    if (name === "hobby") {
      const nextHobbies = checked
        ? [...user.hobby, value]
        : user.hobby.filter((item) => item !== value);

      setUser({ ...user, hobby: nextHobbies });
      return;
    }

    setUser({ ...user, [name]: value });
  };

  const validation = () => {
    const nextError = {};

    if (!user.username.trim()) nextError.username = "Username is required.";
    if (!user.email.trim()) nextError.email = "Email is required.";
    if (!user.password.trim()) nextError.password = "Password is required.";
    if (!user.phone.trim()) nextError.phone = "Phone number is required.";
    if (!user.gender) nextError.gender = "Gender is required.";
    if (!user.city) nextError.city = "City is required.";
    if (!user.hobby.length) nextError.hobby = "Hobby is required.";

    setError(nextError);
    return Object.keys(nextError).length === 0;
  };

  const resetForm = () => {
    setUser(emptyUser);
    setEditId(null);
    setError({});
  };

  const saveList = (nextList) => {
    setList(nextList);
    localStorage.setItem("users", JSON.stringify(nextList));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validation()) return;

    const nextUser = {
      ...user,
      username: user.username.trim(),
      email: user.email.trim(),
      phone: user.phone.trim(),
      id: editId ?? Date.now(),
    };

    const nextList =
      editId === null
        ? [...list, nextUser]
        : list.map((item) => (item.id === editId ? nextUser : item));

    saveList(nextList);
    resetForm();
    setPage(1);
  };

  const handleDelete = (id) => {
    const nextList = list.filter((item) => item.id !== id);
    saveList(nextList);
    if (editId === id) resetForm();
  };

  const handleEdit = (id) => {
    const data = list.find((item) => item.id === id);
    if (!data) return;

    setUser({ ...emptyUser, ...data, hobby: data.hobby || [] });
    setEditId(id);
    setError({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const oldData = JSON.parse(localStorage.getItem("users")) || [];
    setList(oldData);
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, sortOrder]);

  useEffect(() => {
    if (page > totalPage) setPage(totalPage);
  }, [page, totalPage]);

  return (
    <main className="app-shell">
      <section className="hero-band">
        <div>
          <p className="eyebrow">People Directory</p>
          <h1>Manage users with a cleaner data table.</h1>
          <p className="hero-copy">
            Add profiles, search records, sort names, and keep everything saved
            in your browser.
          </p>
        </div>

        <div className="stats-grid" aria-label="Directory summary">
          <div className="stat-tile">
            <span>Total Users</span>
            <strong>{list.length}</strong>
          </div>
          <div className="stat-tile">
            <span>Cities</span>
            <strong>{new Set(list.map((item) => item.city)).size}</strong>
          </div>
          <div className="stat-tile">
            <span>Hobbies</span>
            <strong>{totalHobbies}</strong>
          </div>
        </div>
      </section>

      <section className="workspace-grid">
        <form className="panel user-form" method="post" onSubmit={handleSubmit}>
          <div className="panel-heading">
            <div>
              <p className="section-kicker">{editId ? "Update" : "Create"}</p>
              <h2>{editId ? "Edit user" : "Add new user"}</h2>
            </div>
            {editId && (
              <button type="button" className="btn btn-light" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>

          <div className="form-grid">
            <div className="field">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                name="username"
                onChange={handleChange}
                value={user.username}
                className="form-control"
                id="username"
                placeholder="Aarav Patel"
              />
              <span className="error-text">{error.username || ""}</span>
            </div>

            <div className="field">
              <label htmlFor="email">Email address</label>
              <input
                type="email"
                name="email"
                onChange={handleChange}
                value={user.email}
                className="form-control"
                id="email"
                placeholder="name@example.com"
              />
              <span className="error-text">{error.email || ""}</span>
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                onChange={handleChange}
                value={user.password}
                className="form-control"
                id="password"
                placeholder="Enter password"
              />
              <span className="error-text">{error.password || ""}</span>
            </div>

            <div className="field">
              <label htmlFor="phone">Phone</label>
              <input
                type="text"
                name="phone"
                onChange={handleChange}
                value={user.phone}
                className="form-control"
                id="phone"
                placeholder="+91 98765 43210"
              />
              <span className="error-text">{error.phone || ""}</span>
            </div>

            <div className="field">
              <label htmlFor="city">City</label>
              <select
                onChange={handleChange}
                className="form-select"
                name="city"
                id="city"
                value={user.city}
              >
                <option value="">Select city</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              <span className="error-text">{error.city || ""}</span>
            </div>
          </div>

          <div className="choice-area">
            <div>
              <span className="choice-label">Gender</span>
              <div className="segmented-control">
                {["male", "female"].map((gender) => (
                  <label key={gender} className="segment">
                    <input
                      type="radio"
                      name="gender"
                      value={gender}
                      onChange={handleChange}
                      checked={user.gender === gender}
                    />
                    <span>{gender}</span>
                  </label>
                ))}
              </div>
              <span className="error-text">{error.gender || ""}</span>
            </div>

            <div>
              <span className="choice-label">Hobby</span>
              <div className="segmented-control">
                {hobbyOptions.map((hobby) => (
                  <label key={hobby} className="segment">
                    <input
                      name="hobby"
                      value={hobby}
                      onChange={handleChange}
                      checked={user.hobby.includes(hobby)}
                      type="checkbox"
                    />
                    <span>{hobby}</span>
                  </label>
                ))}
              </div>
              <span className="error-text">{error.hobby || ""}</span>
            </div>
          </div>

          <button type="submit" className="btn primary-action">
            {editId ? "Save changes" : "Add user"}
          </button>
        </form>

        <section className="panel table-panel">
          <div className="panel-heading table-heading">
            <div>
              <p className="section-kicker">Records</p>
              <h2>User data</h2>
            </div>
            <span className="count-pill">{filteredData.length} shown</span>
          </div>

          <div className="toolbar">
            <input
              type="search"
              onChange={(event) => setSearch(event.target.value)}
              value={search}
              className="form-control"
              placeholder="Search by username"
            />
            <select
              className="form-select"
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value)}
            >
              <option value="ascending">A to Z</option>
              <option value="descending">Z to A</option>
            </select>
          </div>

          <div className="table-responsive data-table-wrap">
            <table className="table align-middle data-table">
              <thead>
                <tr>
                  <th>Sr. No</th>
                  <th>User</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Gender</th>
                  <th>City</th>
                  <th>Hobby</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentData.length ? (
                  currentData.map((value, index) => (
                    <tr key={value.id}>
                      <td>{firstIndex + index + 1}</td>
                      <td>
                        <div className="user-cell">
                          <span>{value.username?.charAt(0)?.toUpperCase()}</span>
                          <strong>{value.username}</strong>
                        </div>
                      </td>
                      <td>{value.email}</td>
                      <td>{value.phone}</td>
                      <td>
                        <span className="soft-badge">{value.gender}</span>
                      </td>
                      <td>{value.city}</td>
                      <td>{value.hobby?.join(", ")}</td>
                      <td>
                        <div className="action-group">
                          <button
                            type="button"
                            onClick={() => handleEdit(value.id)}
                            className="btn btn-sm btn-outline-primary"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(value.id)}
                            className="btn btn-sm btn-outline-danger"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8">
                      <div className="empty-state">
                        <strong>No users found</strong>
                        <span>Add a user or adjust your search.</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="table-footer">
            <span>
              Page {page} of {totalPage}
            </span>
            <nav aria-label="User table pagination">
              <ul className="pagination mb-0">
                <li className="page-item">
                  <button
                    className="page-link"
                    disabled={page === 1}
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                  >
                    Previous
                  </button>
                </li>
                {[...Array(totalPage)].map((_, index) => (
                  <li key={index} className="page-item">
                    <button
                      className={`page-link ${
                        index + 1 === page ? "active" : ""
                      }`}
                      onClick={() => setPage(index + 1)}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
                <li className="page-item">
                  <button
                    className="page-link"
                    disabled={page === totalPage}
                    onClick={() =>
                      setPage((current) => Math.min(totalPage, current + 1))
                    }
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </section>
      </section>
    </main>
  );
}
