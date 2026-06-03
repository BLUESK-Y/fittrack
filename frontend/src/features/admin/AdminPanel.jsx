import React, { useEffect, useState } from "react";
import AppNavbar from "../../components/navbar/navbar";
import api from "../../services/api";
import "./AdminPanel.css";

const EMPTY_FORM = {
  title: "",
  description: "",
  category: "",
  level: "Beginner",
  duration: "",
  points: 100,
  equipment: "",
  image: "",
  heroImage: "",
  isActive: true,
  tags: "",
  "overview.short": "",
  "overview.long": "",
  "coach.name": "",
  "coach.avatar": "",
};

const CATEGORIES = ["Cardio", "Strength", "Flexibility", "Endurance", "Yoga", "HIIT", "Other"];
const LEVELS = ["Beginner", "Intermediate", "Advanced"];

const buildPayload = (form) => ({
  title: form.title,
  description: form.description,
  category: form.category,
  level: form.level,
  duration: Number(form.duration),
  points: Number(form.points),
  equipment: form.equipment,
  image: form.image,
  heroImage: form.heroImage,
  isActive: form.isActive,
  tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
  overview: { short: form["overview.short"], long: form["overview.long"] },
  coach: { name: form["coach.name"], avatar: form["coach.avatar"] },
});

const flattenChallenge = (c) => ({
  title: c.title || "",
  description: c.description || "",
  category: c.category || "",
  level: c.level || "Beginner",
  duration: c.duration || "",
  points: c.points ?? 100,
  equipment: c.equipment || "",
  image: c.image || "",
  heroImage: c.heroImage || "",
  isActive: c.isActive ?? true,
  tags: (c.tags || []).join(", "),
  "overview.short": c.overview?.short || "",
  "overview.long": c.overview?.long || "",
  "coach.name": c.coach?.name || "",
  "coach.avatar": c.coach?.avatar || "",
});

export default function AdminPanel() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchChallenges = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/challenges");
      setChallenges(res.data);
    } catch {
      setError("Failed to load challenges.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchChallenges(); }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setShowForm(true);
  };

  const openEdit = (challenge) => {
    setEditingId(challenge._id);
    setForm(flattenChallenge(challenge));
    setFormError("");
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setFormError("");
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.category || !form.duration) {
      setFormError("Title, description, category, and duration are required.");
      return;
    }
    setSaving(true);
    setFormError("");
    try {
      const payload = buildPayload(form);
      if (editingId) {
        await api.put(`/challenges/${editingId}`, payload);
      } else {
        await api.post("/challenges", payload);
      }
      setShowForm(false);
      fetchChallenges();
    } catch (err) {
      setFormError(err?.response?.data?.message || "Failed to save challenge.");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (id) => setDeleteId(id);
  const cancelDelete = () => setDeleteId(null);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/challenges/${deleteId}`);
      setDeleteId(null);
      fetchChallenges();
    } catch {
      setDeleteId(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="admin-page">
      <AppNavbar />
      <div className="admin-container">
        <div className="admin-header">
          <div>
            <h1 className="admin-title">Admin Panel</h1>
            <p className="admin-subtitle">{challenges.length} active challenges</p>
          </div>
          <button className="btn-create" onClick={openCreate}>+ New Challenge</button>
        </div>

        {error && <div className="admin-error">{error}</div>}

        {loading ? (
          <div className="admin-loading">Loading...</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Level</th>
                  <th>Duration</th>
                  <th>Points</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {challenges.map((c) => (
                  <tr key={c._id}>
                    <td className="td-title">{c.title}</td>
                    <td><span className="tag">{c.category}</span></td>
                    <td>{c.level}</td>
                    <td>{c.duration}d</td>
                    <td>{c.points}</td>
                    <td>
                      <span className={`status-badge ${c.isActive ? "active" : "inactive"}`}>
                        {c.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="td-actions">
                      <button className="btn-edit" onClick={() => openEdit(c)}>Edit</button>
                      <button className="btn-delete" onClick={() => confirmDelete(c._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={closeForm}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingId ? "Edit Challenge" : "New Challenge"}</h2>
              <button className="modal-close" onClick={closeForm}>×</button>
            </div>

            <form className="challenge-form" onSubmit={handleSubmit}>
              {formError && <div className="form-error">{formError}</div>}

              <div className="form-section-title">Basic Info</div>
              <div className="form-row">
                <label>Title *
                  <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. 30-Day Cardio Blast" />
                </label>
                <label>Category *
                  <select name="category" value={form.category} onChange={handleChange}>
                    <option value="">Select category</option>
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </label>
              </div>

              <div className="form-row">
                <label>Level
                  <select name="level" value={form.level} onChange={handleChange}>
                    {LEVELS.map((l) => <option key={l}>{l}</option>)}
                  </select>
                </label>
                <label>Duration (days) *
                  <input name="duration" type="number" min="1" value={form.duration} onChange={handleChange} placeholder="30" />
                </label>
                <label>Points
                  <input name="points" type="number" min="0" value={form.points} onChange={handleChange} placeholder="100" />
                </label>
              </div>

              <label className="label-full">Description *
                <textarea name="description" rows={3} value={form.description} onChange={handleChange} placeholder="Short description of the challenge" />
              </label>

              <div className="form-section-title">Overview</div>
              <label className="label-full">Short overview
                <input name="overview.short" value={form["overview.short"]} onChange={handleChange} placeholder="One-line summary" />
              </label>
              <label className="label-full">Long overview
                <textarea name="overview.long" rows={3} value={form["overview.long"]} onChange={handleChange} placeholder="Full description shown on challenge page" />
              </label>

              <div className="form-section-title">Media & Meta</div>
              <div className="form-row">
                <label>Card Image URL
                  <input name="image" value={form.image} onChange={handleChange} placeholder="https://..." />
                </label>
                <label>Hero Image URL
                  <input name="heroImage" value={form.heroImage} onChange={handleChange} placeholder="https://..." />
                </label>
              </div>

              <div className="form-row">
                <label>Equipment
                  <input name="equipment" value={form.equipment} onChange={handleChange} placeholder="e.g. No Equipment" />
                </label>
                <label>Tags (comma-separated)
                  <input name="tags" value={form.tags} onChange={handleChange} placeholder="fat-loss, beginner, home" />
                </label>
              </div>

              <div className="form-section-title">Coach</div>
              <div className="form-row">
                <label>Coach Name
                  <input name="coach.name" value={form["coach.name"]} onChange={handleChange} placeholder="Sarah Mitchell" />
                </label>
                <label>Coach Avatar URL
                  <input name="coach.avatar" value={form["coach.avatar"]} onChange={handleChange} placeholder="https://..." />
                </label>
              </div>

              <div className="form-check-row">
                <label className="check-label">
                  <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} />
                  Active (visible to users)
                </label>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={closeForm}>Cancel</button>
                <button type="submit" className="btn-save" disabled={saving}>
                  {saving ? "Saving..." : editingId ? "Save Changes" : "Create Challenge"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="modal-overlay" onClick={cancelDelete}>
          <div className="confirm-box" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Challenge?</h3>
            <p>This action cannot be undone. The challenge will be permanently removed.</p>
            <div className="confirm-actions">
              <button className="btn-cancel" onClick={cancelDelete}>Cancel</button>
              <button className="btn-delete-confirm" onClick={handleDelete} disabled={deleting}>
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
