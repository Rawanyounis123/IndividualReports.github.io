from io import BytesIO
from flask import Flask

@app.route('/generate', methods=['GET'])
def generate():
    answer_key_file = request.files['answer_key_file']
    student_answers_file = request.files['student_answers_file']
    report_file = BytesIO()
    

    # Generate the report using the mcq_analyzer module
    report = mcq_analyzer.generate_report(answer_key_file, student_answers_file, report_file)

   
    # Return the report file to the user for download
    report_file.seek(0)
    return send_file(report_file, as_attachment=True, attachment_filename=report_file)
