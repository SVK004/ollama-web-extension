chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.type === "generateLLM") {
    const input = message.input;

    try {
      const res = await fetch("http://localhost:3000/api/generate", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: "llama3",
          prompt: "I only need the correct option of the question rather than a para please: " + input,
          stream: false
        })
      });

      if (!res.ok) {
        const errText = (await res.text()).slice(-1000);
        throw new Error(`HTTP ${res.status}: ${errText}`);
      }

      const data = await res.json();
      const ans = data.response;

      // Save in chrome.storage
      chrome.storage.local.set({
        savedInput: input,
        savedResponse: ans
      });

      sendResponse({ success: true, answer: ans });
    } catch (err) {
      console.error("LLM error", err);
      sendResponse({ success: false, error: err.message });
    }

    // Required for async sendResponse
    return true;
  }
});
