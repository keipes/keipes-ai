/**
 * Simple test to verify chat service integration
 */

// This can be run in the browser console to test the chat service
function testChatService() {
  if (window.electronAPI) {
    console.log("Testing chat service...");

    // Test sending a message
    window.electronAPI
      .chatSendMessage("Hello, this is a test message!")
      .then((response) => {
        console.log("Chat response:", response);

        // Test getting history
        return window.electronAPI.chatGetHistory();
      })
      .then((history) => {
        console.log("Chat history:", history);

        // Test clearing history
        return window.electronAPI.chatClearHistory();
      })
      .then(() => {
        console.log("History cleared");

        // Verify history is empty
        return window.electronAPI.chatGetHistory();
      })
      .then((history) => {
        console.log("History after clear:", history);
      })
      .catch((error) => {
        console.error("Test failed:", error);
      });
  } else {
    console.error("electronAPI not available");
  }
}

// Run test after page loads
document.addEventListener("DOMContentLoaded", () => {
  console.log("Page loaded, electronAPI available:", !!window.electronAPI);
});
