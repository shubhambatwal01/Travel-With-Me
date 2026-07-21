import { useEffect, useState } from "react";
import axios from "axios";

function Admin({ onClose }) {
  const [dashboard, setDashboard] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");

  const [token, setToken] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        "http://localhost:1101/auth/login",
        credentials,
      );
      if (res.data?.success && res.data.data?.token) {
        setToken(res.data.data.token);
        setLoggedIn(true);
      } else {
        alert("Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  const fetchDashboard = async () => {
    try {
      const res = await axios.get("http://localhost:1101/admin", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDashboard(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchBookings = async (p = 1) => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:1101/admin/bookings", {
        params: { search: query, page: p, limit: 10 },
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(res.data.data.bookings || []);
      setPage(res.data.data.page || p);
      setTotal(res.data.data.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loggedIn) {
      fetchDashboard();
      fetchBookings();
    }
  }, [loggedIn]);

  const confirmBooking = async (id) => {
    try {
      await axios.post(
        `http://localhost:1101/admin/bookings/${id}/confirm`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      fetchDashboard();
      fetchBookings();
    } catch (err) {
      console.error(err);
    }
  };

  const rejectBooking = async (id) => {
    try {
      await axios.post(
        `http://localhost:1101/admin/bookings/${id}/reject`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      fetchDashboard();
      fetchBookings();
    } catch (err) {
      console.error(err);
    }
  };

  const exportCsv = async () => {
    try {
      const res = await axios.get(
        `http://localhost:1101/admin/bookings/export`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        },
      );
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "bookings.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
      alert("Export failed");
    }
  };

  return (
    <div className="bg-slate-900/40 p-6">
      <div className="mx-auto max-w-5xl rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-slate-200 text-slate-900">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Admin Dashboard</h2>
          <div className="flex gap-3">
            <button
              onClick={exportCsv}
              className="rounded px-3 py-2 bg-emerald-600 text-white"
            >
              Export CSV
            </button>
            <button
              onClick={onClose}
              className="rounded px-3 py-2 bg-slate-300 text-slate-900"
            >
              Close
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="rounded-lg bg-slate-50 p-4">
            <div className="text-sm text-slate-500">Total Bookings</div>
            <div className=" text-black mt-2 text-2xl font-bold">
              {dashboard?.totalBookings ?? "—"}
            </div>
          </div>
          <div className="rounded-lg bg-slate-50 p-4">
            <div className="text-sm text-slate-500">Pending</div>
            <div className="text-black mt-2 text-2xl font-bold">
              {dashboard?.pendingBookings ?? "—"}
            </div>
          </div>
          <div className="rounded-lg bg-slate-50 p-4">
            <div className="text-sm text-slate-500">Confirmed</div>
            <div className="text-black mt-2 text-2xl font-bold">
              {dashboard?.confirmedBookings ?? "—"}
            </div>
          </div>
        </div>

        <div className="mt-6">
          {!loggedIn ? (
            <form
              className="grid gap-2 sm:grid-cols-3"
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }}
            >
              <input
                placeholder="username"
                autoComplete="username"
                value={credentials.username}
                onChange={(e) =>
                  setCredentials((prev) => ({
                    ...prev,
                    username: e.target.value,
                  }))
                }
                className="rounded border px-3 py-2"
              />

              <input
                placeholder="password"
                type="password"
                autoComplete="current-password"
                value={credentials.password}
                onChange={(e) =>
                  setCredentials((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                className="rounded border px-3 py-2"
              />

              <button
                type="submit"
                className="rounded bg-sky-600 px-4 py-2 text-white"
              >
                Login
              </button>
            </form>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search name or phone"
                  className="flex-1 rounded border px-3 py-2"
                />
                <button
                  onClick={fetchBookings}
                  className="rounded bg-sky-600 px-4 py-2 text-white"
                >
                  Search
                </button>
              </div>

              <div className="mt-4">
                {loading ? (
                  <div>Loading bookings…</div>
                ) : (
                  <>
                    <table className="w-full table-auto">
                      <thead>
                        <tr className="text-left text-sm text-slate-500">
                          <th className="p-2">Name</th>
                          <th className="p-2">Phone</th>
                          <th className="p-2">Route</th>
                          <th className="p-2">Date</th>
                          <th className="p-2">Seats</th>
                          <th className="p-2">Status</th>
                          <th className="p-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map((b) => (
                          <tr key={b._id} className="border-t">
                            <td className="p-2">{b.name}</td>
                            <td className="p-2">{b.phone}</td>
                            <td className="p-2">
                              {b.from} → {b.to}
                            </td>
                            <td className="p-2">
                              {b.travelDate
                                ? new Date(b.travelDate).toLocaleDateString()
                                : ""}
                            </td>
                            <td className="p-2">{b.seats}</td>
                            <td className="p-2">{b.status}</td>
                            <td className="p-2">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => confirmBooking(b._id)}
                                  className="rounded bg-emerald-600 px-3 py-1 text-white"
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={() => rejectBooking(b._id)}
                                  className="rounded bg-red-600 px-3 py-1 text-white"
                                >
                                  Reject
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-sm text-slate-500">
                        Total: {total}
                      </div>
                      <div className="flex gap-2">
                        <button
                          disabled={page <= 1}
                          onClick={() => fetchBookings(page - 1)}
                          className="rounded px-3 py-1 bg-slate-200"
                        >
                          Prev
                        </button>
                        <div className="px-3 py-1">Page {page}</div>
                        <button
                          disabled={page * 10 >= total}
                          onClick={() => fetchBookings(page + 1)}
                          className="rounded px-3 py-1 bg-slate-200"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Admin;