from io import BytesIO
from flask import Flask, request, send_file
import mcq_analyzer 

import tempfile
app = Flask(__name__)
@app.route('/generate', methods=['POST'])
def generate():
    answer_key_file = request.files['answer_key_file']
    student_answers_file = request.files['student_answers_file']
    
    # Generate the report using the mcq_analyzer module
    report_file = tempfile.NamedTemporaryFile(delete=False)
    mcq_analyzer.generate_report(answer_key_file, student_answers_file, report_file)
    report_file.close()

    # Return the report file to the user for download
    return send_file(as_attachment=True, attachment_filename='test_report.pdf', mimetype='application/pdf')

if __name__ == "__main__":
    app.run(debug=False, host = '0.0.0.0')