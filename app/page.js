"use client";
import React, { useEffect, useState } from "react";

const page = () => {
  const [user, setUser] = useState({});
  const [list, setList] = useState([]);
  const [editId, setEditId] = useState(null);
  const [hobby, setHobby] = useState([]);
  const [error, setError] = useState({});
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const FirstIndex = (page - 1) * limit;
  const LastIndex = FirstIndex + limit;
  // const data = list.slice(FirstIndex, LastIndex);
  const TotalPage = Math.ceil(list.length / limit);

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

  const handleChange = (event) => {
    let { name, value, checked } = event.target;

    if (name == "hobby") {
      let newHobby = [...hobby];

      if (checked) {
        newHobby.push(value);
      } else {
        newHobby = newHobby.filter((val) => val != value);
      }

      value = newHobby;
      setHobby(newHobby);
    }

    setUser({ ...user, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validation()) return;

    let newList = [...list];

    if (editId == null) {
      newList = [...list, { ...user, id: Date.now() }];
    } else {
      newList = newList.map((val) => (val.id == editId ? user : val));
      setEditId(null);
    }

    setList(newList);
    setFilteredData(newList);
    localStorage.setItem("users", JSON.stringify(newList));
    setUser({});
    setHobby([]);
  };

  const handleDelete = (id) => {
    const newList = list.filter((val) => val.id != id);
    setList(newList);
    setFilteredData(newList);
    localStorage.setItem("users", JSON.stringify(newList));
  };

  const handleEdit = (id) => {
    let data = list.find((val) => val.id == id);
    setUser(data);
    setEditId(id);
    setHobby(data.hobby);
  };

  const validation = () => {
    let error = {};

    if (!user.username) error.username = "Username is required.";
    if (!user.email) error.email = "Email is required.";
    if (!user.password) error.password = "Password is required.";
    if (!user.phone) error.phone = "Phone number is required.";
    if (!user.gender) error.gender = "Gender is required.";
    if (!user.city) error.city = "City is required.";
    if (!user.hobby || user.hobby.length == 0)
      error.hobby = "Hobby is required.";

    setError(error);
    return Object.keys(error).length == 0;
  };

  const handleFilter = () => {
    let newList = list.filter((val) => {
      if (val.username.toLowerCase().includes(search.toLowerCase())) {
        return val;
      }
    });
    setFilteredData(newList.length > 0 || search.length > 0 ? newList : list);
  };

  const handleSorting = (sort) => {
    let newList = [...list];
    if (sort == "ascending") {
      newList = list.sort((a, b) => a.username.localeCompare(b.username));
    } else {
      newList = list.sort((a, b) => b.username.localeCompare(a.username));
    }
    console.log(newList);
    setFilteredData([...newList]);
  };

  useEffect(() => {
    handleFilter();
  }, [search]);

  useEffect(() => {
    let oldData = JSON.parse(localStorage.getItem("users")) || [];
    setList(oldData);
    setFilteredData(oldData);
  }, []);

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-md-4">
          <form method="post" onSubmit={handleSubmit}>
            <h2>Add Data</h2>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                type="text"
                name="username"
                onChange={handleChange}
                value={user.username || ""}
                className="form-control"
                id="username"
              />
              <span className="text-danger">{error.username || ""}</span>
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <input
                type="email"
                name="email"
                onChange={handleChange}
                value={user.email || ""}
                className="form-control"
                id="email"
                aria-describedby="emailHelp"
              />
              <span className="text-danger">{error.email || ""}</span>
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                name="password"
                onChange={handleChange}
                value={user.password || ""}
                className="form-control"
                id="password"
              />
              <span className="text-danger">{error.password || ""}</span>
            </div>
            <div className="mb-3">
              <label htmlFor="phone" className="form-label">
                Phone
              </label>
              <input
                type="text"
                name="phone"
                onChange={handleChange}
                value={user.phone || ""}
                className="form-control"
                id="phone"
              />
              <span className="text-danger">{error.phone || ""}</span>
            </div>
            <div className="mb-3">
              <label htmlFor="gender" className="form-label me-2">
                Gender
              </label>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="gender"
                  value="male"
                  id="inlineRadio1"
                  onChange={handleChange}
                  checked={user.gender == "male"}
                />
                <label className="form-check-label" htmlFor="inlineRadio1">
                  Male
                </label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="gender"
                  value="female"
                  onChange={handleChange}
                  checked={user.gender == "female"}
                  id="inlineRadio2"
                />
                <label className="form-check-label" htmlFor="inlineRadio2">
                  Female
                </label>
              </div>
              <div>
                <span className="text-danger">{error.gender || ""}</span>
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="city" className="form-label">
                City
              </label>
              <select
                onChange={handleChange}
                className="form-select"
                name="city"
                id="city"
                aria-label="Default select example"
              >
                <option disabled={user.city}>Select City</option>
                {cities.map((city, index) => {
                  return (
                    <option
                      key={index}
                      value={city}
                      selected={user.city == city}
                    >
                      {city}
                    </option>
                  );
                })}
              </select>
              <span className="text-danger">{error.city || ""}</span>
            </div>
            <div className="mb-3">
              <label className="form-label me-3">Hobby</label>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  name="hobby"
                  value={"dance"}
                  onChange={handleChange}
                  checked={hobby.includes("dance")}
                  type="checkbox"
                  id="inlineCheckbox1"
                />
                <label className="form-check-label" htmlFor="inlineCheckbox1">
                  Dance
                </label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  name="hobby"
                  value={"music"}
                  onChange={handleChange}
                  checked={hobby.includes("music")}
                  type="checkbox"
                  id="inlineCheckbox2"
                />
                <label className="form-check-label" htmlFor="inlineCheckbox2">
                  Music
                </label>
              </div>
              <div>
                <span className="text-danger">{error.hobby || ""}</span>
              </div>
            </div>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </form>
        </div>
      </div>

      <div className="row mt-5">
        <div className="col-md-4">
          <input
            type="search"
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            value={search || ""}
            className="form-control"
            placeholder="Search by Username"
          ></input>
        </div>
        <div className="col-md-2">
          <select
            className="form-select"
            aria-label="Default select example"
            onChange={(e) => handleSorting(e.target.value)}
          >
            <option disabled>Sort Values</option>
            <option value="ascending">Ascending</option>
            <option value="descending">Descending</option>
          </select>
        </div>
      </div>

      <div className="row justify-content-center mt-5">
        <div className="col-md-10">
          <table className="table table-bordered table-striped caption-top">
            <caption>
              <h2>Data Table</h2>
            </caption>
            <thead>
              <tr>
                <td>Sr. No</td>
                <td>UserName</td>
                <td>Email</td>
                <td>Phone</td>
                <td>Gender</td>
                <td>City</td>
                <td>Hobby</td>
                <td>Action</td>
              </tr>
            </thead>
            <tbody>
              {filteredData.slice(FirstIndex, LastIndex).map((value, index) => {
                return (
                  <tr key={value.id}>
                    <td>{index + 1}</td>
                    <td>{value.username}</td>
                    <td>{value.email}</td>
                    <td>{value.phone}</td>
                    <td>{value.gender}</td>
                    <td>{value.city}</td>
                    <td>{value.hobby?.join(",")}</td>
                    <td>
                      <button
                        type="button"
                        onClick={() => handleDelete(value.id)}
                        className="btn btn-outline-danger me-2"
                      >
                        Delete
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEdit(value.id)}
                        className="btn btn-outline-warning"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="d-flex justify-content-end">
        <nav aria-label="Page navigation example">
          <ul className="pagination">
            <li className="page-item">
              <button
                className={`page-link ${page < TotalPage ? "" : "disabled"}`}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </button>
            </li>
            {[...Array(TotalPage)].map((_, index) => {
              return (
                <li key={index} className="page-item">
                  <button
                    className={`page-link ${index + 1 == page && "active"}`}
                    onClick={() => setPage(index + 1)}
                  >
                    {index + 1}
                  </button>
                </li>
              );
            })}
            <li className="page-item">
              <button
                className={`page-link  ${page < TotalPage ? "" : "disabled"}`}
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default page;
