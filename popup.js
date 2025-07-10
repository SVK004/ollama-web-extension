document.getElementById('send').addEventListener('click', async () => {
  const input = document.getElementById('input').value;
  const responseBox = document.getElementById('response');
  responseBox.textContent = "Sending...";

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
      const errText = (await res.text()).substring(res.text.length-1000);
      throw new Error(`HTTP ${res.status}: ${errText}`);
    }

    const data = await res.json();
    let ans = data.response
    // if(ans.length > 200){
    //   ans = ans.substring(0, 100);
    // }
    responseBox.textContent = ans;
  } catch (err) {
    console.error(err);
    responseBox.textContent = "❌ Error: " + err.message;
  }
});
