import React, { useEffect, useState } from "react";
import axios from "axios";

const Blog = ({ user: propUser }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dynamic User State (Prop or LocalStorage)
  const [user, setUser] = useState(propUser || null);

  // Selected post for Full View
  const [selectedBlog, setSelectedBlog] = useState(null);

  // Form & Edit States
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null); // null = creating, Object = editing

  const [blogData, setBlogData] = useState({
    title: "",
    category: "Tech Insights",
    blog_image: "",
    content: "",
  });

  useEffect(() => {
    if (propUser) {
      setUser(propUser);
    } else {
      const loggedUser = JSON.parse(localStorage.getItem("user"));
      setUser(loggedUser);
    }
    fetchBlogs();
  }, [propUser]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get("https://abedhiggs.alwaysdata.net/sseapis/getblogs.php");
      
      if (Array.isArray(response.data)) {
        setBlogs(response.data);
      } else if (response.data && Array.isArray(response.data.blogs)) {
        setBlogs(response.data.blogs);
      } else {
        setBlogs([]);
      }
    } catch (err) {
      console.error("Error fetching blogs:", err);
      setError("Failed to load blog posts. Please check your connection or try again later.");
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBlogData((prev) => ({ ...prev, [name]: value }));
  };

  // Open Form for Creating New Post
  const handleOpenCreateForm = () => {
    setEditingBlog(null);
    setBlogData({ title: "", category: "Tech Insights", blog_image: "", content: "" });
    setShowForm(true);
  };

  // Open Form pre-filled for Editing Existing Post
  const handleStartEdit = (e, blog) => {
    e.stopPropagation(); // Prevents opening full view
    setEditingBlog(blog);
    setBlogData({
      title: blog.title || "",
      category: blog.category || "Tech Insights",
      blog_image: blog.blog_image || "",
      content: blog.content || "",
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Save (Create or Update)
  const handleSubmitPost = async (e) => {
    e.preventDefault();
    if (!blogData.title || !blogData.content) {
      alert("Please fill in both Title and Content.");
      return;
    }

    try {
      setSubmitting(true);
      
      if (editingBlog) {
        // Update Endpoint
        const payload = {
          blog_id: editingBlog.blog_id || editingBlog.id,
          ...blogData,
        };
        await axios.post("https://abedhiggs.alwaysdata.net/sseapis/updateblog.php", payload);
        alert("Blog post updated successfully!");
      } else {
        // Create Endpoint
        const payload = {
          ...blogData,
          author: user?.username || "Admin",
        };
        await axios.post("https://abedhiggs.alwaysdata.net/sseapis/addblog.php", payload);
        alert("Blog post published successfully!");
      }

      setBlogData({ title: "", category: "Tech Insights", blog_image: "", content: "" });
      setShowForm(false);
      setEditingBlog(null);
      
      if (selectedBlog) setSelectedBlog(null); // Return to grid if inside full post view
      fetchBlogs();
    } catch (err) {
      console.error("Error saving blog post:", err);
      alert("Failed to save blog post. Please check server logs.");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Post
  const handleDeleteBlog = async (e, blogId) => {
    e.stopPropagation(); // Prevents opening full view
    
    if (!window.confirm("Are you sure you want to permanently delete this blog post?")) {
      return;
    }

    try {
      await axios.post("https://abedhiggs.alwaysdata.net/sseapis/deleteblog.php", { blog_id: blogId });
      alert("Blog post deleted.");
      if (selectedBlog && (selectedBlog.blog_id === blogId || selectedBlog.id === blogId)) {
        setSelectedBlog(null);
      }
      fetchBlogs();
    } catch (err) {
      console.error("Error deleting blog post:", err);
      alert("Failed to delete blog post.");
    }
  };

  return (
    <div className="container-fluid mt-4 px-0">
      <style>{`
        .hover-lift {
          transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }
        .hover-lift:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 32px rgba(13, 148, 136, 0.15) !important;
        }
        .blog-card-img {
          height: 200px;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        .hover-lift:hover .blog-card-img {
          transform: scale(1.03);
        }
        .admin-panel {
          background: linear-gradient(145deg, #0f172a, #1e293b);
          border: 1px solid rgba(20, 184, 166, 0.3);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }
        .flash-news-badge {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: #fff;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 9999px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .article-content {
          font-size: 1.1rem;
          line-height: 1.8;
          color: #334155;
          white-space: pre-wrap;
        }
      `}</style>

      <div className="container">
        {/* ================= VIEW 1: FULL BLOG POST VIEW ================= */}
        {selectedBlog ? (
          <div className="py-3 max-w-4xl mx-auto" style={{ maxWidth: "850px" }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <button
                className="btn btn-outline-secondary rounded-pill px-4 d-inline-flex align-items-center gap-2 fw-semibold"
                onClick={() => setSelectedBlog(null)}
              >
                <i className="bi bi-arrow-left"></i> Back to All Articles
              </button>

              {/* Admin Actions in Detailed View */}
              {user && user.role === "admin" && (
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-warning btn-sm rounded-pill px-3 fw-bold"
                    onClick={(e) => handleStartEdit(e, selectedBlog)}
                  >
                    <i className="bi bi-pencil me-1"></i> Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm rounded-pill px-3 fw-bold"
                    onClick={(e) => handleDeleteBlog(e, selectedBlog.blog_id || selectedBlog.id)}
                  >
                    <i className="bi bi-trash me-1"></i> Delete
                  </button>
                </div>
              )}
            </div>

            <article className="bg-white p-4 p-md-5 rounded-4 shadow-sm border border-light">
              <div className="mb-4 border-bottom pb-4">
                <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                  <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill fw-semibold">
                    {selectedBlog.category || "Tech Insights"}
                  </span>
                  <span className="text-muted small">
                    <i className="bi bi-calendar3 me-1"></i>
                    {selectedBlog.created_at ? new Date(selectedBlog.created_at).toLocaleDateString() : "Recently Published"}
                  </span>
                </div>

                <h1 className="fw-extrabold text-dark display-6 mb-3 lh-base">
                  {selectedBlog.title}
                </h1>

                <div className="d-flex align-items-center gap-2 text-muted small">
                  <div className="rounded-circle bg-secondary bg-opacity-10 p-2 d-flex align-items-center justify-content-center" style={{ width: "36px", height: "36px" }}>
                    <i className="bi bi-person-fill fs-5 text-secondary"></i>
                  </div>
                  <div>
                    <span className="d-block fw-bold text-dark">{selectedBlog.author || "Admin Team"}</span>
                    <span className="text-muted" style={{ fontSize: "0.75rem" }}>Stanley &amp; Edricks Editorial</span>
                  </div>
                </div>
              </div>

              {selectedBlog.blog_image && (
                <div className="mb-5 rounded-4 overflow-hidden shadow-sm">
                  <img
                    src={selectedBlog.blog_image}
                    alt={selectedBlog.title}
                    className="w-100"
                    style={{ maxHeight: "450px", objectFit: "cover" }}
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1000&q=80";
                    }}
                  />
                </div>
              )}

              <div className="article-content mb-5">
                {selectedBlog.content}
              </div>

              <div className="border-top pt-4 d-flex flex-wrap align-items-center justify-content-between gap-3">
                <div className="text-muted small">
                  <i className="bi bi-shield-check text-success me-1"></i> Verified by S&amp;SE Consultants
                </div>
                <button
                  className="btn btn-primary rounded-pill px-4 d-flex align-items-center gap-2"
                  onClick={() => setSelectedBlog(null)}
                >
                  <i className="bi bi-grid"></i> More Articles
                </button>
              </div>
            </article>
          </div>
        ) : (
          /* ================= VIEW 2: CARDS & FLASH NEWS GRID ================= */
          <>
            <div className="text-center mb-4">
              <span className="badge bg-primary bg-opacity-10 text-primary fw-bold mb-2 px-3 py-2 rounded-pill">
                <i className="bi bi-journal-richtext me-1"></i> S&amp;SE Insights
              </span>
              <h1 className="text-primary fw-bold display-5">Our Latest Blog Posts</h1>
              <p className="text-muted">Stay updated with expert tips, business guides, and tech insights.</p>
            </div>

            {/* Admin Controls Header */}
            {user && user.role === "admin" && (
              <div className="mb-5">
                <div className="d-flex justify-content-center mb-3">
                  <button
                    className="btn btn-lg rounded-pill px-4 fw-bold shadow-sm d-flex align-items-center gap-2"
                    style={{ background: "#0d9488", color: "#fff" }}
                    onClick={() => {
                      if (showForm) {
                        setShowForm(false);
                      } else {
                        handleOpenCreateForm();
                      }
                    }}
                  >
                    <i className={`bi ${showForm ? "bi-x-lg" : "bi-plus-lg"}`}></i>
                    {showForm ? "Close Editor" : "Write New Post"}
                  </button>
                </div>

                {/* Form (Create / Edit Mode) */}
                {showForm && (
                  <div className="card admin-panel text-light p-4 p-md-5 rounded-4 mb-4 max-w-2xl mx-auto">
                    <div className="d-flex align-items-center justify-content-between border-bottom border-secondary border-opacity-50 pb-3 mb-4">
                      <h4 className="fw-bold mb-0 text-info">
                        <i className="bi bi-pencil-square me-2"></i>
                        {editingBlog ? "Edit Article" : "Write New Article"}
                      </h4>
                      <span className="badge bg-warning text-dark">Admin Panel</span>
                    </div>

                    <form onSubmit={handleSubmitPost}>
                      <div className="row g-3">
                        <div className="col-md-8">
                          <label className="form-label small fw-semibold text-light">Post Title *</label>
                          <input
                            type="text"
                            name="title"
                            className="form-control bg-dark text-light border-secondary"
                            placeholder="e.g., The Future of Cyber Security"
                            value={blogData.title}
                            onChange={handleInputChange}
                            required
                          />
                        </div>

                        <div className="col-md-4">
                          <label className="form-label small fw-semibold text-light">Category</label>
                          <select
                            name="category"
                            className="form-select bg-dark text-light border-secondary"
                            value={blogData.category}
                            onChange={handleInputChange}
                          >
                            <option value="Tech Insights">Tech Insights</option>
                            <option value="Business Guide">Business Guide</option>
                            <option value="Cyber Security">Cyber Security</option>
                            <option value="Tutorials">Tutorials</option>
                          </select>
                        </div>

                        <div className="col-12">
                          <label className="form-label small fw-semibold text-light">Image URL (Optional)</label>
                          <input
                            type="url"
                            name="blog_image"
                            className="form-control bg-dark text-light border-secondary"
                            placeholder="https://images.unsplash.com/photo-..."
                            value={blogData.blog_image}
                            onChange={handleInputChange}
                          />
                        </div>

                        <div className="col-12">
                          <label className="form-label small fw-semibold text-light">Content *</label>
                          <textarea
                            name="content"
                            rows="6"
                            className="form-control bg-dark text-light border-secondary"
                            placeholder="Write your article content here..."
                            value={blogData.content}
                            onChange={handleInputChange}
                            required
                          ></textarea>
                        </div>

                        <div className="col-12 d-flex justify-content-end gap-2 mt-4">
                          <button
                            type="button"
                            className="btn btn-outline-light rounded-pill px-4"
                            onClick={() => {
                              setShowForm(false);
                              setEditingBlog(null);
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="btn btn-info rounded-pill px-5 fw-bold"
                            disabled={submitting}
                          >
                            {submitting ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                Saving...
                              </>
                            ) : editingBlog ? (
                              "Update Article"
                            ) : (
                              "Publish Post"
                            )}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="alert alert-danger d-flex align-items-center justify-content-between rounded-4 shadow-sm mb-4" role="alert">
                <div>
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {error}
                </div>
                <button className="btn btn-sm btn-outline-danger" onClick={fetchBlogs}>
                  <i className="bi bi-arrow-clockwise me-1"></i> Retry
                </button>
              </div>
            )}

            {/* Loading */}
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="text-muted mt-3 small">Loading latest articles...</p>
              </div>
            ) : blogs.length === 0 ? (
              <div className="col-12 text-center py-5">
                <div className="p-5 bg-white rounded-4 shadow-sm border border-light max-w-md mx-auto">
                  <i className="bi bi-journal-x display-3 text-muted mb-3 d-block"></i>
                  <h4 className="text-secondary fw-semibold">No blog posts available right now.</h4>
                  <p className="text-muted small mb-0">Check back later for fresh content and updates.</p>
                </div>
              </div>
            ) : (
              /* Cards Grid */
              <div className="row mb-5">
                {blogs.map((blog) => {
                  const bId = blog.blog_id || blog.id;
                  return (
                    <div className="col-md-4 mb-4" key={bId || Math.random()}>
                      <div 
                        className="card shadow-sm h-100 border-0 rounded-4 hover-lift bg-white overflow-hidden d-flex flex-column"
                        onClick={() => setSelectedBlog(blog)}
                      >
                        <div className="overflow-hidden bg-light position-relative">
                          <img 
                            src={blog.blog_image || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=600&q=80"} 
                            alt={blog.title || "Blog Post"} 
                            className="card-img-top blog-card-img w-100" 
                            onError={(e) => {
                              e.target.src = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=600&q=80";
                            }}
                          />
                          <div className="position-absolute top-0 start-0 m-3">
                            <span className="flash-news-badge shadow-sm">
                              <i className="bi bi-lightning-charge-fill"></i> Flash News
                            </span>
                          </div>

                          {/* Admin Edit & Delete Buttons Overlay */}
                          {user && user.role === "admin" && (
                            <div className="position-absolute top-0 end-0 m-3 d-flex gap-1">
                              <button
                                className="btn btn-sm btn-light text-dark shadow-sm rounded-circle p-2 d-flex align-items-center justify-content-center"
                                style={{ width: "32px", height: "32px" }}
                                title="Edit Post"
                                onClick={(e) => handleStartEdit(e, blog)}
                              >
                                <i className="bi bi-pencil-fill text-primary"></i>
                              </button>
                              <button
                                className="btn btn-sm btn-light text-dark shadow-sm rounded-circle p-2 d-flex align-items-center justify-content-center"
                                style={{ width: "32px", height: "32px" }}
                                title="Delete Post"
                                onClick={(e) => handleDeleteBlog(e, bId)}
                              >
                                <i className="bi bi-trash-fill text-danger"></i>
                              </button>
                            </div>
                          )}
                        </div>

                        <div className="card-body p-4 d-flex flex-column flex-grow-1">
                          <div className="mb-2 text-muted small d-flex align-items-center justify-content-between">
                            <span><i className="bi bi-calendar3 me-1"></i> {blog.created_at ? new Date(blog.created_at).toLocaleDateString() : "Recent"}</span>
                            {blog.category && <span className="badge bg-secondary bg-opacity-10 text-secondary">{blog.category}</span>}
                          </div>

                          <h4 className="text-dark fw-bold fs-5 mb-2">
                            {blog.title || "Untitled Post"}
                          </h4>

                          <p className="text-muted small flex-grow-1">
                            {blog.content ? blog.content.replace(/<[^>]*>?/gm, '').substring(0, 110) + "..." : "Click to read full post..."}
                          </p>

                          <div className="mt-3 pt-3 border-top d-flex align-items-center justify-content-between">
                            <span className="text-primary fw-bold small text-decoration-none d-flex align-items-center gap-1">
                              Read Article <i className="bi bi-arrow-right"></i>
                            </span>
                            {blog.author && (
                              <span className="text-muted small">
                                <i className="bi bi-person me-1"></i>{blog.author}
                              </span>
                            )}
                          </div>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Blog;