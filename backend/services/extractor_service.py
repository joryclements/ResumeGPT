from tempfile import NamedTemporaryFile

import PyPDF2
import aiofiles
from werkzeug.datastructures import FileStorage


class Extractor:

    def __init__(self):
        pass
    def pypdf2_extract_text_from_pdf(self, pdf_path):
        with open(pdf_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            text = ''
            for page_num in range(len(reader.pages)):
                page = reader.pages[page_num]
                text += page.extract_text()
        return text

    def extract_filepath(self, pdf_path):
        return self.pypdf2_extract_text_from_pdf(pdf_path)

    async def extract_filecontent(self, file):
        # Use aiofiles and tempfiles to save the file to disk
        # Then use extract_filepath to extract the text
        with NamedTemporaryFile(delete=False) as temp_file:
            async with aiofiles.open(temp_file.name, 'wb') as f:
                await f.write(file.read())
                return self.extract_filepath(temp_file.name)
