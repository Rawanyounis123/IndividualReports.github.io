


document.querySelector('#report-form').addEventListener('submit', (event) => {
  // Prevent the form from submitting and refreshing the page
  event.preventDefault();

  // Generate the report document using the answer key and student answer
  const pdfContent = generateReport();

  // Create a Blob from the PDF content
  const blob = new Blob([pdfContent], {type: 'application/pdf'});

  // Create a temporary URL to the Blob
  const url = URL.createObjectURL(blob);

  // Create a link element to download the PDF
  const a = document.createElement('a');
  a.href = url;
  a.download = 'report.pdf';
  document.body.appendChild(a);

  // Trigger a click on the link element to start the download
  a.click();

  // Remove the link element from the document
  document.body.removeChild(a);

  // Revoke the URL to free up memory
  URL.revokeObjectURL(url);
});


function generateReport() {
  
  // Create a new PDF document
  const doc = new jsPDF();

  // Add some content to the document
  doc.text('Hello World!', 10, 10);

  // Return the content of the PDF document as a string
  return doc.output('datauristring');
}
