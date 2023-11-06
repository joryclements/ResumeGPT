import os
import time

from quart import Quart, request, render_template_string, jsonify
from quart_cors import cors
import aiofiles

from services.openai_service import OpenAIExecutor
from services.system_prompts import get_cleaning_prompt, get_resume_prompt, get_industries
from services.extractor_service import Extractor
from dotenv import load_dotenv
load_dotenv()

app = Quart(__name__)
app = cors(app, allow_origin="*")
extractor = Extractor()
openai_executor = OpenAIExecutor(api_key=os.environ["OPENAI_API_KEY"], temperature=0, model="gpt-4-32k")

@app.route('/upload', methods=['GET', 'POST'])
async def upload_file():
    if request.method == 'POST':
        files = await request.files
        file = files['file']

        # Start a counter for how long the next bit of execution will take
        start = time.time()

        # Get the "industry" parameter from the multipart form request
        form = await request.form
        industry = form['industry']

        if industry not in get_industries():
            return jsonify(error="Invalid industry provided.")

        if file:
            # Extract the resume text
            try:
                resume_text = await extractor.extract_filecontent(file)
            except Exception as e:
                return str(e)

            # Ask GPT-4-32k to clean up the extracted resume text
            cleaning_prompt = get_cleaning_prompt()
            cleaned_resume_text = await openai_executor.chat_complete(prompt=resume_text, system_prompt=cleaning_prompt, model_override="gpt-3.5-turbo")
            print("Cleaned resume text")
            print(cleaned_resume_text)


            resume_improvement_text = await openai_executor.chat_complete(prompt=cleaned_resume_text, system_prompt=list(get_resume_prompt(industry=industry))[0])
            print("Improved resume")
            print(resume_improvement_text)

            end = time.time()
            elapsed_seconds = end - start

            return jsonify(response_text=resume_improvement_text, elapsed_seconds=elapsed_seconds)

    return jsonify(error="No file provided.")

if __name__ == '__main__':
    app.run()