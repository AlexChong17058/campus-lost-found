const token = localStorage.getItem("token");

const itemsContainer = document.getElementById("itemsContainer");
const categoryFilter = document.getElementById("categoryFilter");
const statusFilter = document.getElementById("statusFilter");

const allItemsBtn = document.getElementById("allItemsBtn");
const myItemsBtn = document.getElementById("myItemsBtn");

const formModal = document.getElementById("formModal");
const openFormBtn = document.getElementById("openFormBtn");
const closeForm = document.getElementById("closeForm");
const itemForm = document.getElementById("itemForm");

const itemModal = document.getElementById("itemModal");
const closeModal = document.getElementById("closeModal");
const modalBody = document.getElementById("modalBody");

const logoutBtn = document.getElementById("logoutBtn");

let showMine = false;
let editingItemId = null;
let isEditMode = false;

function authHeaders() {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/* =============================
   LOAD CURRENT USER
============================= */

async function loadCurrentUser() {
  try {
    const res = await fetch("/api/auth/me", {
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
    });

    if (!res.ok) return;

    const user = await res.json();
    const greeting = document.getElementById("userGreeting");

    if (greeting) {
      greeting.textContent = `Welcome, ${user.name}!`;
    }
  } catch (err) {
    console.error("Failed to load user info");
  }
}

/* =============================
   LOAD DASHBOARD STATS
============================= */

async function loadStats() {
  try {
    const res = await fetch("/api/items/stats");

    if (!res.ok) return;

    const stats = await res.json();

    const total = document.getElementById("totalCount");
    const active = document.getElementById("activeCount");
    const claimed = document.getElementById("claimedCount");
    const resolved = document.getElementById("resolvedCount");

    if (total) total.textContent = stats.total || 0;
    if (active) active.textContent = stats.Active || 0;
    if (claimed) claimed.textContent = stats.Claimed || 0;
    if (resolved) resolved.textContent = stats.Resolved || 0;
  } catch (err) {
    console.error("Failed to load stats");
  }
}

/* =============================
   CURRENT USER ID FROM TOKEN
============================= */

function getCurrentUserId() {
  try {
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.sub || null;
  } catch {
    return null;
  }
}

const currentUserId = getCurrentUserId();

function isOwner(item) {
  if (!currentUserId || !item.user) return false;

  const itemUserId =
    typeof item.user === "object" ? item.user._id : item.user;

  return itemUserId === currentUserId;
}

/* =============================
   FORM MODE HELPERS
============================= */

function resetFormMode() {
  isEditMode = false;
  editingItemId = null;
  itemForm.reset();

  const title = formModal.querySelector("h2");
  const submitBtn = itemForm.querySelector('button[type="submit"]');

  if (title) title.textContent = "Report Item";
  if (submitBtn) submitBtn.textContent = "Submit";
}

function openCreateForm() {
  resetFormMode();
  formModal.classList.remove("hidden");
}

function openEditForm(item) {
  isEditMode = true;
  editingItemId = item._id;

  const title = formModal.querySelector("h2");
  const submitBtn = itemForm.querySelector('button[type="submit"]');

  if (title) title.textContent = "Edit Report";
  if (submitBtn) submitBtn.textContent = "Save Changes";

  itemForm.title.value = item.title || "";
  itemForm.description.value = item.description || "";
  itemForm.category.value = item.category || "";
  itemForm.location.value = item.location || "";
  itemForm.date.value = item.date ? item.date.slice(0, 10) : "";
  itemForm.contactInfo.value = item.contactInfo || "";

  itemModal.classList.add("hidden");
  formModal.classList.remove("hidden");
}

/* =============================
   RENDER ITEMS
============================= */

function renderItems(items) {
  itemsContainer.innerHTML = "";

  if (!items.length) {
    itemsContainer.innerHTML = "<p>No items found.</p>";
    return;
  }

  items.forEach((item) => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h3>${item.title}</h3>
      <p>${item.description}</p>
      <p><strong>Category:</strong> ${item.category}</p>
      <p><strong>Location:</strong> ${item.location}</p>
      <p><strong>Date:</strong> ${new Date(item.date).toLocaleDateString()}</p>
      <span class="status ${item.status}">${item.status}</span>
    `;

    card.addEventListener("click", () => {
      const owner = isOwner(item);

      modalBody.innerHTML = `
        <h2>${item.title}</h2>
        <p style="margin:12px 0;">${item.description}</p>
        <p><strong>Category:</strong> ${item.category}</p>
        <p><strong>Status:</strong> ${item.status}</p>
        <p><strong>Location:</strong> ${item.location}</p>
        <p><strong>Date:</strong> ${new Date(item.date).toLocaleDateString()}</p>
        <p><strong>Contact:</strong> ${item.contactInfo}</p>

        ${
          owner
            ? `
          <div style="margin-top:16px; display:flex; gap:10px; flex-wrap:wrap;">
            <button id="editBtn" class="secondary-btn">Edit</button>
            <button id="markActiveBtn" class="primary-btn">Mark Active</button>
            <button id="markClaimedBtn" class="primary-btn">Mark Claimed</button>
            <button id="markResolvedBtn" class="primary-btn">Mark Resolved</button>
            <button id="deleteBtn" class="secondary-btn">Delete</button>
          </div>
        `
            : ""
        }
      `;

      itemModal.classList.remove("hidden");

      if (owner) {
        document
          .getElementById("editBtn")
          ?.addEventListener("click", () => openEditForm(item));

        document
          .getElementById("markActiveBtn")
          ?.addEventListener("click", () => updateStatus(item._id, "Active"));

        document
          .getElementById("markClaimedBtn")
          ?.addEventListener("click", () => updateStatus(item._id, "Claimed"));

        document
          .getElementById("markResolvedBtn")
          ?.addEventListener("click", () => updateStatus(item._id, "Resolved"));

        document
          .getElementById("deleteBtn")
          ?.addEventListener("click", () => deleteItem(item._id));
      }
    });

    itemsContainer.appendChild(card);
  });
}

/* =============================
   LOAD ITEMS
============================= */

async function loadItems() {
  try {
    const params = new URLSearchParams();

    if (categoryFilter?.value) params.set("category", categoryFilter.value);
    if (statusFilter?.value) params.set("status", statusFilter.value);
    if (showMine) params.set("mine", "true");

    const url = params.toString()
      ? `/api/items?${params.toString()}`
      : "/api/items";

    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
    });

    if (!res.ok) throw new Error("Failed to load items");

    const items = await res.json();

    renderItems(items);
    loadStats();
  } catch (err) {
    console.error(err);
    itemsContainer.innerHTML = "<p>Failed to load items.</p>";
  }
}

/* =============================
   UPDATE STATUS
============================= */

async function updateStatus(itemId, status) {
  try {
    const res = await fetch(`/api/items/${itemId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify({ status }),
    });

    const out = await res.json().catch(() => ({}));

    if (!res.ok) {
      alert(out.message || "Failed to update status");
      return;
    }

    itemModal.classList.add("hidden");
    loadItems();
  } catch (err) {
    console.error(err);
    alert("Failed to update status");
  }
}

/* =============================
   DELETE ITEM
============================= */

async function deleteItem(itemId) {
  try {
    const confirmed = confirm("Are you sure you want to delete this report?");
    if (!confirmed) return;

    const res = await fetch(`/api/items/${itemId}`, {
      method: "DELETE",
      headers: authHeaders(),
    });

    const out = await res.json().catch(() => ({}));

    if (!res.ok) {
      alert(out.message || "Failed to delete item");
      return;
    }

    itemModal.classList.add("hidden");
    loadItems();
  } catch (err) {
    console.error(err);
    alert("Failed to delete item");
  }
}

/* =============================
   EVENT LISTENERS
============================= */

openFormBtn?.addEventListener("click", openCreateForm);

closeForm?.addEventListener("click", () => {
  formModal.classList.add("hidden");
  resetFormMode();
});

closeModal?.addEventListener("click", () => {
  itemModal.classList.add("hidden");
});

logoutBtn?.addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.replace("/auth/login.html");
});

categoryFilter?.addEventListener("change", loadItems);
statusFilter?.addEventListener("change", loadItems);

allItemsBtn?.addEventListener("click", () => {
  showMine = false;
  loadItems();
});

myItemsBtn?.addEventListener("click", () => {
  showMine = true;
  loadItems();
});

/* =============================
   SUBMIT ITEM / EDIT ITEM
============================= */

itemForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = Object.fromEntries(new FormData(itemForm).entries());

  const url = isEditMode
    ? `/api/items/${editingItemId}`
    : "/api/items";

  const method = isEditMode ? "PUT" : "POST";

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(payload),
  });

  const out = await res.json().catch(() => ({}));

  if (!res.ok) {
    const details = Array.isArray(out.errors)
      ? out.errors.map((e) => `${e.path}: ${e.msg}`).join("\n")
      : "";

    alert(details || out.message || "Failed to save item");
    return;
  }

  formModal.classList.add("hidden");
  resetFormMode();

  loadItems();
  loadStats();
});

/* =============================
   INITIAL PAGE LOAD
============================= */

loadCurrentUser();
loadStats();
loadItems();