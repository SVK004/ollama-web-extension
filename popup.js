// Load saved input & response on popup open
document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(['savedInput', 'savedResponse'], (data) => {
    if (data.savedInput) document.getElementById('input').value = data.savedInput;
    if (data.savedResponse) document.getElementById('response').textContent = data.savedResponse;
  });
});

document.getElementById('send').addEventListener('click', async () => {
  const input = document.getElementById('input').value;
  const responseBox = document.getElementById('response');
  responseBox.textContent = "Sending...";

  // Save input right away
  chrome.storage.local.set({ savedInput: input });

  try {
    const res = await fetch('http://localhost:3000/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: "llama3",
        prompt: "I only need the correct option of the question rather than a para please: " + input,
        stream: false
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`HTTP ${res.status}: ${errText}`);
    }

    const data = await res.json(); // ✅ NOW it's valid
    const ans = data.response;

    responseBox.textContent = ans;

    chrome.storage.local.set({ savedResponse: ans }); // Save result
  } catch (err) {
    console.error(err);
    responseBox.textContent = "❌ Error: " + err.message;
  }
});
