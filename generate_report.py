from flask import Flask, render_template, request, send_file
import mcq_analyzer

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate_report', methods=['POST'])
def generate_report():
    answer_key_file = request.files['answer_key_file']
    student_answers_file = request.files['student_answers_file']
    # report_file = request.files['report_file']
    # num_rows = int(request.form['num_rows'])

    # Generate the report using the mcq_analyzer module
    report = mcq_analyzer.generate_report(answer_key_file, student_answers_file, num_rows)

    # Save the report to the specified report file
    report.save(report_file)

    # Return the report file to the user for download
    return send_file(report_file, as_attachment=True, attachment_filename='test_report.docx')

if __name__ == '__main__':
    app.run(debug=True)
