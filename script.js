const dictionary = {
  "hablar": { synonyms: ["comunicar", "expresar", "manifestar"], rhymes: ["abalar", "acallar", "infalar"] },
  "cantar": { synonyms: ["entonar", "entonizar", "entonación"], rhymes: ["plantar", "andar", "mantar"] }
  // … añade más palabras, sinónimos, rimas como quieras
};

document.getElementById("btnGenerate").addEventListener("click", () => {
  const w = document.getElementById("wordInput").value.trim().toLowerCase();
  const out = document.getElementById("output");
  if (!w) {
    out.innerHTML = "<p>Por favor escribe una palabra.</p>";
    return;
  }
  const data = dictionary[w];
  if (data) {
    out.innerHTML = `
      <p><strong>Sinónimos:</strong> ${data.synonyms.join(", ")}</p>
      <p><strong>Rimas:</strong> ${data.rhymes.join(", ")}</p>
      <p><strong>Ejercicio:</strong> Usa la palabra "<em>${w}</em>" junto con "<em>${data.rhymes[0]}</em>" y "<em>${data.rhymes[1]}</em>" para improvisar un mini discurso.</p>
    `;
  } else {
    out.innerHTML = `<p>No se encontró la palabra en el diccionario. Prueba otra.</p>`;
  }
});
