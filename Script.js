// Get references to the form inputs
const answerKeyInput = document.querySelector('#answer-key');
const studentAnswerInput = document.querySelector('#student-answer');

// Set up an event listener for the form submission
document.querySelector('#report-form').addEventListener('submit', (event) => {
  // Prevent the form from submitting and refreshing the page
  event.preventDefault();

  // Get the files from the form inputs
  const answerKeyFile = answerKeyInput.files[0];
  const studentAnswerFile = studentAnswerInput.files[0];

  // Read the files using the FileReader API
  const reader = new FileReader();
  reader.readAsText(answerKeyFile, 'UTF-8');
  reader.onload = function(answerKeyEvent) {
    const answerKeyText = answerKeyEvent.target.result;
    const answerKey = parseAnswerKey(answerKeyText);

    reader.readAsText(studentAnswerFile, 'UTF-8');
    reader.onload = function(studentAnswerEvent) {
      const studentAnswerText = studentAnswerEvent.target.result;
      const studentAnswer = parseStudentAnswer(studentAnswerText);

      // Generate the report document using the answer key and student answer
      const doc = generateReport(answerKey, studentAnswer);

      // Save the report document as a file and offer it for download
      const blob = new Blob([doc], {type: 'application/msword'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'report.doc';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }
});

// Parses the answer key from a Word file
function parseAnswerKey(text) {
    // Create a new Word document from the text using the Office JavaScript API
    const doc = new Word.Document(text);
  
    // Create an empty object to hold the answer key
    const answerKey = {};
  
    // Loop through each paragraph in the document
    for (let i = 0; i < doc.sections.count; i++) {
      const section = doc.sections.getByIndex(i);
  
      for (let j = 0; j < section.blocks.count; j++) {
        const block = section.blocks.getByIndex(j);
  
        for (let k = 0; k < block.paragraphs.count; k++) {
          const paragraph = block.paragraphs.getByIndex(k);
  
          // Check if the paragraph contains a topic number
          const topicMatch = paragraph.text.match(/^Topic (\d+)/);
          if (topicMatch) {
            const topic = topicMatch[1];
  
            // Loop through the lines in the paragraph
            const lines = paragraph.text.split('\n');
            for (let l = 1; l < lines.length; l++) {
              const line = lines[l].trim();
  
              // Check if the line contains an answer letter
              const answerMatch = line.match(/^(\w)\./);
              if (answerMatch) {
                const answer = answerMatch[1];
  
                // Add the answer letter to the answer key object
                answerKey[topic] = answer;
              }
            }
          }
        }
      }
    }
  
    return answerKey;
  }
  
  // Parses the student answer from a Word file
  function parseStudentAnswer(text) {
    // Create a new Word document from the text using the Office JavaScript API
    const doc = new Word.Document(text);
  
    // Create an empty object to hold the student answer
    const studentAnswer = {};
  
    // Loop through each paragraph in the document
    for (let i = 0; i < doc.sections.count; i++) {
      const section = doc.sections.getByIndex(i);
  
      for (let j = 0; j < section.blocks.count; j++) {
        const block = section.blocks.getByIndex(j);
  
        // Check if the block contains a section name
        const sectionMatch = block.text.match(/^(Reading|Writing)/i);
        if (sectionMatch) {
          const sectionName = sectionMatch[1];
  
          // Loop through each paragraph in the block
          for (let k = 0; k < block.paragraphs.count; k++) {
            const paragraph = block.paragraphs.getByIndex(k);
  
            // Check if the paragraph contains a topic number
            const topicMatch = paragraph.text.match(/^Topic (\d+)/);
            if (topicMatch) {
              const topic = topicMatch[1];
  
              // Loop through the lines in the paragraph
              const lines = paragraph.text.split('\n');
              for (let l = 1; l < lines.length; l++) {
                const line = lines[l].trim();
  
                // Check if the line contains an answer letter
                const answerMatch = line.match(/^(\w)\./);
                if (answerMatch) {
                  const answer = answerMatch[1];
  
                  // Add the answer letter to the student answer object
                  if (!studentAnswer[topic]) {
                    studentAnswer[topic] = {};
                  }
                  studentAnswer[topic][sectionName] = answer;
                }
              }
            }
          }
        }
      }
    }
  
    return studentAnswer;
  }

  function generateReport(answerKey, studentAnswer) {
    // Create a new Word document
    const doc = new Word.Document();
  
    // Add a header to the document
    const header = doc.sections.getFirst().getHeader('default');
    const paragraph = header.insertParagraph('Report', Word.InsertLocation.start);
    paragraph.style = 'Heading1';
  
    // Create a table for the reading section
    const readingTable = doc.createTable();
    readingTable.addRow(['Reading']);
    readingTable.addRow(['Topic', 'Correct', 'Incorrect']);
  
    // Create a table for the writing section
    const writingTable = doc.createTable();
    writingTable.addRow(['Writing']);
    writingTable.addRow(['Topic', 'Correct', 'Incorrect']);
  
    // Loop through each topic in the answer key
    for (let topic in answerKey) {
      // Initialize the correct and incorrect counters for the topic
      let readingCorrect = 0;
      let readingIncorrect = 0;
      let writingCorrect = 0;
      let writingIncorrect = 0;
  
      // Loop through each question in the topic
      for (let i = 0; i < answerKey[topic].length; i++) {
        // Get the correct answer for the question
        const correctAnswer = answerKey[topic][i];
  
        // Get the student's answer for the question
        const studentAnswerObj = studentAnswer[topic][i];
  
        // Determine if the answer is correct or incorrect
        const isCorrect = (correctAnswer === studentAnswerObj.answer);
  
        // Update the correct/incorrect counters for the reading or writing section
        if (studentAnswerObj.section === 'Reading') {
          if (isCorrect) {
            readingCorrect++;
          } else {
            readingIncorrect++;
          }
        } else if (studentAnswerObj.section === 'Writing') {
          if (isCorrect) {
            writingCorrect++;
          } else {
            writingIncorrect++;
          }
        }
      }
  
      // Add a row to the reading section table for the topic
      readingTable.addRow([topic, readingCorrect, readingIncorrect]);
  
      // Add a row to the writing section table for the topic
      writingTable.addRow([topic, writingCorrect, writingIncorrect]);
    }
  
    // Return the document
    return doc;
  }
  
