/**
 * Navigation and view management
 */
class ViewManager {
  constructor() {
    this.views = document.querySelectorAll(".view");
    this.navItems = document.querySelectorAll(".nav-item");
    this.init();
  }

  init() {
    this.setupNavigation();
    this.loadActiveView();
  }

  setupNavigation() {
    this.navItems.forEach((item) => {
      item.addEventListener("click", () => {
        const viewName = item.dataset.view;
        this.switchView(viewName);
      });
    });
  }

  switchView(viewName) {
    // Update navigation
    this.navItems.forEach((item) => {
      item.classList.toggle("active", item.dataset.view === viewName);
    });

    // Update views
    this.views.forEach((view) => {
      view.classList.toggle("active", view.id === `${viewName}View`);
    });

    localStorage.setItem("activeView", viewName);
    this.updateStatus(`Switched to ${viewName}`);
  }

  loadActiveView() {
    const activeView = localStorage.getItem("activeView") || "chat";
    this.switchView(activeView);
  }

  updateStatus(message) {
    const statusText = document.getElementById("statusText");
    if (statusText) {
      statusText.textContent = message;
    }
  }
}

export default ViewManager;
