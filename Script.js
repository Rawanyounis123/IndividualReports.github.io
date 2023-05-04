// Get references to the form inputs
const answerKeyInput = document.querySelector('#answer-key');
const studentAnswerInput = document.querySelector('#student-answer');

// Set up an event listener for the form submission
document.querySelector('#report-form').addEventListener('submit', (event) => {
  // Prevent the form from submitting and refreshing the page
  event.preventDefault();

  // Generate the report document using the answer key and student answer
  const doc = generateReport();
  // Save the report document as a file and offer it for download
  const blob = new Blob([doc], {type: 'application/pdf'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'report.doc';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
    
});



function generateReport() {
      // Create a new PDF document
  const doc = new jsPDF();

  // Add some content to the document
  doc.text('Hello World!', 10, 10);

  // Save the PDF document
  doc.save('output.pdf');
  
  return doc;
}
  
