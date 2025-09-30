async function checkCode() {
  const code = document.getElementById("promoInput").value.trim();
  const res = await fetch("/check-code", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({code})
  });
  const data = await res.json();
  if(data.success){
    document.getElementById("modalText").innerText = data.text;
    document.getElementById("downloadBtn").href = data.file;
    document.getElementById("modal").style.display = "flex";
  } else alert("Неверный код!");
}
function closeModal(){ document.getElementById("modal").style.display="none"; }
