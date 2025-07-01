/**
 * Navigation and view management
 */
export default class ViewManager {
  private views: NodeListOf<Element>;
  private navItems: NodeListOf<Element>;

  constructor() {
    this.views = document.querySelectorAll(".view");
    this.navItems = document.querySelectorAll(".nav-item");
    this.init();
  }

  private init(): void {
    this.setupNavigation();
    this.loadActiveView();
  }

  private setupNavigation(): void {
    this.navItems.forEach((item) => {
      item.addEventListener("click", () => {
        const element = item as HTMLElement;
        const viewName = element.dataset.view;
        if (viewName) {
          this.switchView(viewName);
        }
      });
    });
  }

  public switchView(viewName: string): void {
    // Update navigation
    this.navItems.forEach((item) => {
      const element = item as HTMLElement;
      element.classList.toggle("active", element.dataset.view === viewName);
    });

    // Update views
    this.views.forEach((view) => {
      view.classList.toggle("active", view.id === `${viewName}View`);
    });

    localStorage.setItem("activeView", viewName);
    this.updateStatus(`Switched to ${viewName}`);
  }

  private loadActiveView(): void {
    const activeView = localStorage.getItem("activeView") || "chat";
    this.switchView(activeView);
  }

  private updateStatus(message: string): void {
    const statusText = document.getElementById("statusText");
    if (statusText) {
      statusText.textContent = message;
    }
  }
}
