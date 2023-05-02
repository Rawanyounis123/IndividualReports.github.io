from io import BytesIO
from flask import Flask, request, send_file
import mcq_analyzer 
app = Flask(__name__)

@app.route('/generate', methods=['GET'])
def generate():
    answer_key_file = request.files['answer_key_file']
    student_answers_file = request.files['student_answers_file']
    report_file = BytesIO()
    
    # Generate the report using the mcq_analyzer module
    report = mcq_analyzer.generate_report(answer_key_file, student_answers_file, report_file)

    # Return the report file to the user for download
    report.seek(0)
    return send_file(report, as_attachment=True, attachment_filename='test_report.pdf', mimetype='application/pdf')

if __name__ == "__main__":
    app.run(debug=False, host = '0.0.0.0')